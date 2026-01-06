BEGIN;

-- ============================================================
-- Lock down client-side writes for critical tables
-- - Payments: must never be writable from browser
-- - Students: must never be writable from browser
-- Service role / postgres remain unaffected (bypass RLS).
-- ============================================================

-- Payments: prevent client tampering (status/tran_ref/amount/etc.)
REVOKE INSERT, UPDATE, DELETE ON TABLE public.payments FROM anon, authenticated;

-- Students: student records must be created via admin approval/RPC/trigger only
REVOKE INSERT, UPDATE, DELETE ON TABLE public.students FROM anon, authenticated;

-- Counters: internal only (defense-in-depth)
REVOKE ALL ON TABLE public.student_number_counters FROM anon, authenticated;

COMMIT;
