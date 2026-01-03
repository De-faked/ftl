BEGIN;

-- Blocks changing profiles.role unless the caller is an admin (or running as postgres for maintenance).
CREATE OR REPLACE FUNCTION public.block_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (public.is_admin() OR current_user = 'postgres') THEN
      RAISE EXCEPTION 'profiles.role change is restricted';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_block_role_change ON public.profiles;

CREATE TRIGGER trg_profiles_block_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.block_profile_role_change();

COMMIT;
