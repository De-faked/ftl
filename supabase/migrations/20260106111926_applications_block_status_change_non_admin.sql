BEGIN;

-- Defense-in-depth: prevent non-admins from changing applications.status.
-- Client can still save draft data, but cannot alter workflow states.
CREATE OR REPLACE FUNCTION public.block_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT (public.is_admin() OR current_user = 'postgres') THEN
      RAISE EXCEPTION 'applications.status change is restricted';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_applications_block_status_change ON public.applications;

CREATE TRIGGER trg_applications_block_status_change
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.block_application_status_change();

REVOKE ALL ON FUNCTION public.block_application_status_change() FROM PUBLIC;

COMMIT;
