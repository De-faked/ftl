BEGIN;

-- Prevent client deletion of applications (safety + auditability)
REVOKE DELETE ON TABLE public.applications FROM anon, authenticated;

COMMIT;
