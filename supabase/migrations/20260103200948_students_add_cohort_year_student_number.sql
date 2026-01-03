-- Fix mismatch: trigger students_set_student_id() expects cohort_year + student_number
-- Add the missing columns and backfill existing rows safely.

BEGIN;

-- 1) Add missing columns (nullable first)
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS cohort_year integer,
  ADD COLUMN IF NOT EXISTS student_number integer;

-- 2) Best-effort backfill from existing student_id (FTL-YYYY-NNNNxxxxx)
UPDATE public.students
SET
  cohort_year = COALESCE(cohort_year, (regexp_match(student_id, '^FTL-(\d{4})-'))[1]::int),
  student_number = COALESCE(student_number, (regexp_match(student_id, '^FTL-\d{4}-(\d{4})'))[1]::int)
WHERE student_id ~ '^FTL-\d{4}-\d{4}';

-- 3) Any remaining cohort_year defaults to 2026 (matches current trigger default)
UPDATE public.students
SET cohort_year = 2026
WHERE cohort_year IS NULL;

-- 4) Allocate missing student_number values using the existing counter function
WITH to_fill AS (
  SELECT user_id
  FROM public.students
  WHERE student_number IS NULL OR student_number = 0
)
UPDATE public.students s
SET student_number = public.next_student_number(s.cohort_year)
FROM to_fill f
WHERE s.user_id = f.user_id;

-- 5) Set defaults + NOT NULL so new inserts are safe even when omitted
ALTER TABLE public.students
  ALTER COLUMN cohort_year SET DEFAULT 2026,
  ALTER COLUMN cohort_year SET NOT NULL,
  ALTER COLUMN student_number SET DEFAULT 0,
  ALTER COLUMN student_number SET NOT NULL;

-- 6) Add uniqueness guardrails (idempotent via indexes)
CREATE UNIQUE INDEX IF NOT EXISTS students_student_id_key
  ON public.students (student_id);

CREATE UNIQUE INDEX IF NOT EXISTS students_cohort_year_student_number_key
  ON public.students (cohort_year, student_number);

COMMIT;
