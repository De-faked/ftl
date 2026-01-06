BEGIN;

-- Prevent client deletion of profiles
REVOKE DELETE ON TABLE public.profiles FROM anon, authenticated;

COMMIT;
