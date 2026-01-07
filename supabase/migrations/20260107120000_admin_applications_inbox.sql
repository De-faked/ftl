BEGIN;

-- 1) Extend applications table with admin-facing columns.
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS public_id text,
  ADD COLUMN IF NOT EXISTS payment_link text,
  ADD COLUMN IF NOT EXISTS payment_link_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- 2) Counter table for friendly application IDs.
CREATE TABLE IF NOT EXISTS public.application_public_id_counters (
  year integer PRIMARY KEY,
  last_value bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON TABLE public.application_public_id_counters FROM PUBLIC;
GRANT ALL ON TABLE public.application_public_id_counters TO postgres;

-- Helper to fetch the next counter per year.
CREATE OR REPLACE FUNCTION public.next_application_public_id(p_year integer, p_prefix text DEFAULT 'FTL-APP')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year integer := COALESCE(p_year, date_part('year', now())::integer);
  v_next bigint;
BEGIN
  LOOP
    UPDATE public.application_public_id_counters
    SET last_value = last_value + 1,
        updated_at = now()
    WHERE year = v_year
    RETURNING last_value INTO v_next;

    EXIT WHEN FOUND;

    BEGIN
      INSERT INTO public.application_public_id_counters (year, last_value)
      VALUES (v_year, 0)
      ON CONFLICT DO NOTHING;
    EXCEPTION
      WHEN unique_violation THEN
        -- Someone else initialized this year; retry.
        NULL;
    END;
  END LOOP;

  RETURN format('%s-%s-%s', p_prefix, v_year, lpad(v_next::text, 6, '0'));
END;
$$;

-- Trigger function to ensure public_id is set.
CREATE OR REPLACE FUNCTION public.assign_application_public_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year integer;
BEGIN
  IF NEW.public_id IS NOT NULL AND length(trim(NEW.public_id)) > 0 THEN
    RETURN NEW;
  END IF;

  v_year := COALESCE(date_part('year', COALESCE(NEW.created_at, now())), date_part('year', now()))::integer;
  NEW.public_id := public.next_application_public_id(v_year);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_applications_public_id ON public.applications;
CREATE TRIGGER trg_applications_public_id
BEFORE INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.assign_application_public_id();

-- 3) Backfill legacy rows that are missing a public_id.
DO $$
DECLARE
  rec record;
  v_year integer;
BEGIN
  FOR rec IN
    SELECT id, created_at
    FROM public.applications
    WHERE public_id IS NULL OR length(trim(public_id)) = 0
    ORDER BY created_at
  LOOP
    v_year := COALESCE(date_part('year', rec.created_at), date_part('year', now()))::integer;
    UPDATE public.applications
    SET public_id = public.next_application_public_id(v_year)
    WHERE id = rec.id;
  END LOOP;
END
$$;

-- 4) Enforce uniqueness and non-null constraint.
ALTER TABLE public.applications
  ALTER COLUMN public_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'applications_public_id_key'
  ) THEN
    ALTER TABLE public.applications
      ADD CONSTRAINT applications_public_id_key UNIQUE (public_id);
  END IF;
END
$$;

-- 5) Tighten applicant write policy to keep admin columns restricted.
ALTER POLICY applications_insert_own ON public.applications
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'draft'
    AND payment_link IS NULL
    AND payment_link_sent_at IS NULL
    AND payment_paid_at IS NULL
    AND rejection_reason IS NULL
  );

ALTER POLICY applications_update_draft_own ON public.applications
  USING (auth.uid() = user_id AND status = 'draft')
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('draft','submitted')
    AND payment_link IS NULL
    AND payment_link_sent_at IS NULL
    AND payment_paid_at IS NULL
    AND rejection_reason IS NULL
  );

-- 6) Allow admins to store payment metadata via RPCs.
CREATE OR REPLACE FUNCTION public.admin_set_payment_link(
  p_application_id uuid,
  p_payment_link text
)
RETURNS TABLE (
  application_id uuid,
  payment_link text,
  payment_link_sent_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_clean_link text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  v_clean_link := trim(both from COALESCE(p_payment_link, ''));
  IF v_clean_link = '' THEN
    RAISE EXCEPTION 'payment link is required';
  END IF;
  IF position('https://' IN lower(v_clean_link)) <> 1 THEN
    RAISE EXCEPTION 'payment link must start with https://';
  END IF;

  RETURN QUERY
  UPDATE public.applications
  SET payment_link = v_clean_link,
      payment_link_sent_at = now(),
      updated_at = now()
  WHERE id = p_application_id
  RETURNING id, payment_link, payment_link_sent_at;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_payment_link(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_payment_link(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_mark_payment_paid(p_application_id uuid)
RETURNS TABLE (
  application_id uuid,
  payment_paid_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  UPDATE public.applications
  SET payment_paid_at = now(),
      updated_at = now()
  WHERE id = p_application_id
  RETURNING id, payment_paid_at;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_mark_payment_paid(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_mark_payment_paid(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_application_plan_days(
  p_application_id uuid,
  p_plan_days text
)
RETURNS TABLE (
  application_id uuid,
  data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_plan text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  v_plan := trim(both from COALESCE(p_plan_days, ''));
  IF v_plan NOT IN ('30','60') THEN
    RAISE EXCEPTION 'invalid plan_days: %', v_plan;
  END IF;

  RETURN QUERY
  UPDATE public.applications
  SET data = jsonb_set(COALESCE(data, '{}'::jsonb), '{planDays}', to_jsonb(v_plan::text), true),
      updated_at = now()
  WHERE id = p_application_id
  RETURNING id, data;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_application_plan_days(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_application_plan_days(uuid, text) TO authenticated;

DROP FUNCTION IF EXISTS public.admin_update_application_status(uuid, text);

CREATE OR REPLACE FUNCTION public.admin_update_application_status(
  p_application_id uuid,
  p_status text,
  p_rejection_reason text DEFAULT NULL
)
RETURNS TABLE (
  application_id uuid,
  application_status text,
  rejection_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_current text;
  v_reason text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF p_status NOT IN ('under_review', 'rejected') THEN
    RAISE EXCEPTION 'invalid status: %', p_status;
  END IF;

  SELECT a.status INTO v_current
  FROM public.applications a
  WHERE a.id = p_application_id
  FOR UPDATE;

  IF v_current IS NULL THEN
    RAISE EXCEPTION 'application not found';
  END IF;

  IF v_current = 'approved' THEN
    RAISE EXCEPTION 'cannot change status of an approved application';
  END IF;

  IF p_status = 'under_review' AND v_current <> 'submitted' THEN
    RAISE EXCEPTION 'cannot set under_review from status: %', v_current;
  END IF;

  IF p_status = 'rejected' AND v_current NOT IN ('submitted', 'under_review') THEN
    RAISE EXCEPTION 'cannot reject from status: %', v_current;
  END IF;

  v_reason := NULLIF(trim(both from COALESCE(p_rejection_reason, '')), '');

  UPDATE public.applications
  SET status = p_status,
      rejection_reason = CASE WHEN p_status = 'rejected' THEN v_reason ELSE NULL END,
      updated_at = now()
  WHERE id = p_application_id;

  RETURN QUERY
  SELECT p_application_id, p_status, CASE WHEN p_status = 'rejected' THEN v_reason ELSE NULL END;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_application_status(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_application_status(uuid, text, text) TO authenticated;

COMMIT;
