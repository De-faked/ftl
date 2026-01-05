BEGIN;

-- Hardening rules:
-- 1) Approval must only happen from submitted/under_review (or be idempotent if already approved).
-- 2) Admin status updates (under_review/rejected) must be atomic and server-validated.
-- 3) SECURITY DEFINER with safe search_path.

CREATE OR REPLACE FUNCTION public.approve_application(p_application_id uuid)
RETURNS TABLE (
  application_id uuid,
  application_user_id uuid,
  application_status text,
  student_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid;
  v_status text;
  v_student_id text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- Lock row to prevent races
  SELECT a.user_id, a.status
    INTO v_user_id, v_status
  FROM public.applications a
  WHERE a.id = p_application_id
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'application not found';
  END IF;

  -- Idempotent: if already approved, just ensure student exists and return
  IF v_status = 'approved' THEN
    IF NOT EXISTS (SELECT 1 FROM public.students s WHERE s.user_id = v_user_id) THEN
      INSERT INTO public.students (user_id) VALUES (v_user_id);
    END IF;

    SELECT s.student_id INTO v_student_id
    FROM public.students s
    WHERE s.user_id = v_user_id;

    RETURN QUERY
    SELECT p_application_id, v_user_id, 'approved'::text, v_student_id;
    RETURN;
  END IF;

  -- Only allow approval from submitted/under_review
  IF v_status IS NULL OR v_status NOT IN ('submitted', 'under_review') THEN
    RAISE EXCEPTION 'cannot approve application from status: %', COALESCE(v_status, 'NULL');
  END IF;

  -- Create student if missing (trigger assigns student_id)
  IF NOT EXISTS (SELECT 1 FROM public.students s WHERE s.user_id = v_user_id) THEN
    INSERT INTO public.students (user_id) VALUES (v_user_id);
  END IF;

  -- Mark approved
  UPDATE public.applications
  SET status = 'approved'
  WHERE id = p_application_id;

  SELECT s.student_id INTO v_student_id
  FROM public.students s
  WHERE s.user_id = v_user_id;

  RETURN QUERY
  SELECT p_application_id, v_user_id, 'approved'::text, v_student_id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_application(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_application(uuid) TO authenticated;


CREATE OR REPLACE FUNCTION public.admin_update_application_status(
  p_application_id uuid,
  p_status text
)
RETURNS TABLE (
  application_id uuid,
  application_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_current text;
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

  -- Protect approved applications from being altered via this RPC
  IF v_current = 'approved' THEN
    RAISE EXCEPTION 'cannot change status of an approved application';
  END IF;

  -- Enforce reasonable transitions:
  -- - under_review only from submitted
  -- - rejected only from submitted/under_review
  IF p_status = 'under_review' AND v_current <> 'submitted' THEN
    RAISE EXCEPTION 'cannot set under_review from status: %', v_current;
  END IF;

  IF p_status = 'rejected' AND v_current NOT IN ('submitted', 'under_review') THEN
    RAISE EXCEPTION 'cannot reject from status: %', v_current;
  END IF;

  UPDATE public.applications
  SET status = p_status
  WHERE id = p_application_id;

  RETURN QUERY
  SELECT p_application_id, p_status;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_application_status(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_application_status(uuid, text) TO authenticated;

COMMIT;
