BEGIN;

-- 1) Enforce allowed payment statuses (callback/query must never write arbitrary strings)
ALTER TABLE public.payments
  ADD CONSTRAINT payments_status_allowed
  CHECK (status IN ('created','redirected','authorised','failed','cancelled','expired'))
  NOT VALID;

ALTER TABLE public.payments
  VALIDATE CONSTRAINT payments_status_allowed;

-- 2) Protect against updating multiple rows by tran_ref
--    (PayTabs should not reuse tran_ref; enforce uniqueness when present)
CREATE UNIQUE INDEX IF NOT EXISTS payments_tran_ref_unique
  ON public.payments (tran_ref)
  WHERE tran_ref IS NOT NULL AND tran_ref <> '';

-- 3) Single source of truth for applying PayTabs results (idempotent)
CREATE OR REPLACE FUNCTION public.apply_paytabs_result(
  p_cart_id text,
  p_tran_ref text,
  p_status text,
  p_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_payment public.payments%ROWTYPE;
BEGIN
  IF (p_cart_id IS NULL OR p_cart_id = '') AND (p_tran_ref IS NULL OR p_tran_ref = '') THEN
    RAISE EXCEPTION 'cart_id or tran_ref required';
  END IF;

  -- Only statuses produced by callback/query are allowed here.
  IF p_status IS NULL OR p_status NOT IN ('authorised','failed','cancelled','expired') THEN
    RAISE EXCEPTION 'invalid status %', p_status;
  END IF;

  -- Prefer cart_id (unique). Fallback to tran_ref.
  IF p_cart_id IS NOT NULL AND p_cart_id <> '' THEN
    SELECT * INTO v_payment
    FROM public.payments
    WHERE cart_id = p_cart_id
    FOR UPDATE;
  END IF;

  IF v_payment.id IS NULL AND p_tran_ref IS NOT NULL AND p_tran_ref <> '' THEN
    SELECT * INTO v_payment
    FROM public.payments
    WHERE tran_ref = p_tran_ref
    FOR UPDATE;
  END IF;

  -- If nothing matches, do nothing (callback for unknown cart/tran)
  IF v_payment.id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Attach tran_ref if missing; reject mismatch.
  IF p_tran_ref IS NOT NULL AND p_tran_ref <> '' THEN
    IF v_payment.tran_ref IS NULL OR v_payment.tran_ref = '' THEN
      UPDATE public.payments
      SET tran_ref = p_tran_ref
      WHERE id = v_payment.id;
      v_payment.tran_ref := p_tran_ref;
    ELSIF v_payment.tran_ref <> p_tran_ref THEN
      RAISE EXCEPTION 'tran_ref mismatch for payment %', v_payment.id;
    END IF;
  END IF;

  -- Idempotency: never downgrade an authorised payment.
  IF v_payment.status = 'authorised' THEN
    UPDATE public.payments
    SET callback_payload = COALESCE(p_payload, '{}'::jsonb)
    WHERE id = v_payment.id;
    RETURN v_payment.id;
  END IF;

  -- Apply status (allows upgrading to authorised from any non-authorised state).
  UPDATE public.payments
  SET status = p_status,
      callback_payload = COALESCE(p_payload, '{}'::jsonb)
  WHERE id = v_payment.id;

  RETURN v_payment.id;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_paytabs_result(text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_paytabs_result(text,text,text,jsonb) TO service_role;

COMMIT;
