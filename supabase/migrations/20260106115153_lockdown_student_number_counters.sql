BEGIN;

-- Clients must never mutate student number counters.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.student_number_counters FROM anon, authenticated;

-- Internal functions used for student ID generation should not be callable by clients.
-- We allow service_role to keep future server-side scripts safe.
REVOKE ALL ON FUNCTION public.next_student_number(integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.next_student_number(integer) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.students_set_student_id() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.students_set_student_id() FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.next_student_number(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.students_set_student_id() TO service_role;

COMMIT;
