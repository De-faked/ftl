BEGIN;

-- Allow applicant to change status ONLY from 'draft' -> 'submitted' for their own row.
-- Admins and postgres can change status freely.

CREATE OR REPLACE FUNCTION public.block_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_uid uuid;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Allow postgres maintenance
    IF current_user = 'postgres' THEN
      RETURN NEW;
    END IF;

    -- Allow admins to manage workflow states
    IF public.is_admin() THEN
      RETURN NEW;
    END IF;

    -- Allow the applicant to submit only: draft -> submitted for own row
    v_uid := auth.uid();
    IF v_uid IS NOT NULL
       AND OLD.user_id = v_uid
       AND NEW.user_id = v_uid
       AND OLD.status = 'draft'
       AND NEW.status = 'submitted'
    THEN
      RETURN NEW;
    END IF;

    RAISE EXCEPTION 'applications.status change is restricted';
  END IF;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.block_application_status_change() FROM PUBLIC;

COMMIT;
