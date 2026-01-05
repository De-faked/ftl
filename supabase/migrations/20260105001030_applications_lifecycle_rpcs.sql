BEGIN;

-- Applicant submission: safe with current RLS.
-- - Runs as INVOKER (RLS still applies).
-- - If no row exists, creates a DRAFT first (insert policy requires draft).
-- - Then updates the same row to SUBMITTED (update policy allows draft -> submitted).
-- - Idempotent: if already submitted/under_review/approved/rejected, returns current status.
CREATE OR REPLACE FUNCTION public.submit_application(p_data jsonb)
RETURNS TABLE (
  application_id uuid,
  application_status text
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  v_app_id uuid;
  v_status text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Lock latest application row for this user (defensive even if uniqueness ever breaks)
  SELECT a.id, a.status
    INTO v_app_id, v_status
  FROM public.applications a
  WHERE a.user_id = auth.uid()
  ORDER BY a.created_at DESC
  LIMIT 1
  FOR UPDATE;

  -- If missing, create a draft row (RLS insert requires status='draft')
  IF v_app_id IS NULL THEN
    BEGIN
      INSERT INTO public.applications (user_id, status, data)
      VALUES (auth.uid(), 'draft', COALESCE(p_data, '{}'::jsonb));
    EXCEPTION
      WHEN unique_violation THEN
        -- Another insert won the race; continue.
        NULL;
    END;

    SELECT a.id, a.status
      INTO v_app_id, v_status
    FROM public.applications a
    WHERE a.user_id = auth.uid()
    ORDER BY a.created_at DESC
    LIMIT 1
    FOR UPDATE;
  END IF;

  IF v_app_id IS NULL THEN
    RAISE EXCEPTION 'application create/load failed';
  END IF;

  -- If already beyond draft, treat as idempotent.
  IF v_status IS NOT NULL AND v_status <> 'draft' THEN
    RETURN QUERY SELECT v_app_id, v_status;
    RETURN;
  END IF;

  UPDATE public.applications
  SET status = 'submitted',
      data = COALESCE(p_data, '{}'::jsonb),
      updated_at = now()
  WHERE id = v_app_id;

  RETURN QUERY SELECT v_app_id, 'submitted'::text;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO authenticated;

-- Admin approval: enforce lifecycle and prevent approving drafts.
-- - Admin-only
-- - Row lock to avoid races
-- - Only allow SUBMITTED or UNDER_REVIEW -> APPROVED
-- - Idempotent for already approved
-- - Prevent self-approval
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

  SELECT a.user_id, a.status
    INTO v_user_id, v_status
  FROM public.applications a
  WHERE a.id = p_application_id
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'application not found';
  END IF;

  IF v_user_id = auth.uid() THEN
    RAISE EXCEPTION 'cannot approve own application';
  END IF;

  IF v_status = 'approved' THEN
    SELECT s.student_id INTO v_student_id
    FROM public.students s
    WHERE s.user_id = v_user_id;

    RETURN QUERY SELECT p_application_id, v_user_id, 'approved'::text, v_student_id;
    RETURN;
  END IF;

  IF v_status IS DISTINCT FROM 'submitted' AND v_status IS DISTINCT FROM 'under_review' THEN
    RAISE EXCEPTION 'invalid application status for approval: %', v_status;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.students s WHERE s.user_id = v_user_id) THEN
    INSERT INTO public.students (user_id) VALUES (v_user_id);
  END IF;

  UPDATE public.applications
  SET status = 'approved',
      updated_at = now()
  WHERE id = p_application_id;

  SELECT s.student_id INTO v_student_id
  FROM public.students s
  WHERE s.user_id = v_user_id;

  RETURN QUERY SELECT p_application_id, v_user_id, 'approved'::text, v_student_id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_application(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_application(uuid) TO authenticated;

COMMIT;
