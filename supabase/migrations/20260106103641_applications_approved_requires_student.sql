BEGIN;

-- Invariant: if an application becomes 'approved', ensure a student row exists.
-- This prevents inconsistent states even if approval happens outside approve_application().

CREATE OR REPLACE FUNCTION public.ensure_student_exists_on_application_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Only act when status is 'approved'
  IF NEW.status = 'approved' THEN
    -- Defense-in-depth: non-admins should never be able to set approved.
    -- (RLS should already block this; this is an extra guarantee.)
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'not authorized to approve application';
    END IF;

    -- Create student if missing (idempotent)
    IF NOT EXISTS (
      SELECT 1 FROM public.students s WHERE s.user_id = NEW.user_id
    ) THEN
      INSERT INTO public.students (user_id) VALUES (NEW.user_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger fires for INSERT and when status changes; WHEN clause ensures it only runs for approved.
DROP TRIGGER IF EXISTS trg_applications_ensure_student_on_approved ON public.applications;

CREATE TRIGGER trg_applications_ensure_student_on_approved
BEFORE INSERT OR UPDATE OF status ON public.applications
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION public.ensure_student_exists_on_application_approved();

-- Lock down function surface
REVOKE ALL ON FUNCTION public.ensure_student_exists_on_application_approved() FROM PUBLIC;

COMMIT;
