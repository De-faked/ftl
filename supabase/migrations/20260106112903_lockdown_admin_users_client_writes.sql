BEGIN;

-- Prevent any client-side writes to admin_users
REVOKE INSERT, UPDATE, DELETE ON TABLE public.admin_users FROM anon, authenticated;

COMMIT;
