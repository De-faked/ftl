BEGIN;

-- Atomic admin approval:
-- - admin-only (is_admin())
-- - locks the application row (prevents races)
-- - creates student if missing (trigger generates student_id)
-- - marks application approved
-- - returns identifiers for UI refresh
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
  v_student_id text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- Lock the application row to make this idempotent and race-safe
  SELECT a.user_id
    INTO v_user_id
  FROM public.applications a
  WHERE a.id = p_application_id
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'application not found';
  END IF;

  -- Create student only if missing (trigger will assign student_id)
  IF NOT EXISTS (SELECT 1 FROM public.students s WHERE s.user_id = v_user_id) THEN
    INSERT INTO public.students (user_id) VALUES (v_user_id);
  END IF;

  -- Mark approved (idempotent)
  UPDATE public.applications
  SET status = 'approved'
  WHERE id = p_application_id;

  SELECT s.student_id
    INTO v_student_id
  FROM public.students s
  WHERE s.user_id = v_user_id;

  RETURN QUERY
  SELECT p_application_id, v_user_id, 'approved'::text, v_student_id;
END;
$$;

-- Do not allow PUBLIC to call it
REVOKE ALL ON FUNCTION public.approve_application(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_application(uuid) TO authenticated;

COMMIT;
