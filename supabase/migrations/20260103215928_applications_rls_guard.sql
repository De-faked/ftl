BEGIN;

-- Ensure consistent defaults
ALTER TABLE public.applications
  ALTER COLUMN status SET DEFAULT 'draft';

-- Eliminate NULL statuses (prevents weird portal logic like null !== 'draft')
UPDATE public.applications
SET status = 'draft'
WHERE status IS NULL;

-- Make status required going forward
ALTER TABLE public.applications
  ALTER COLUMN status SET NOT NULL;

-- Add status constraint (NOT VALID so we don't fail on any legacy/unknown rows yet)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'applications_status_allowed'
  ) THEN
    ALTER TABLE public.applications
      ADD CONSTRAINT applications_status_allowed
      CHECK (status IN ('draft','submitted','under_review','approved','rejected'))
      NOT VALID;
  END IF;
END
$$;

-- RLS hardening: applicant can only edit while row is still draft
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Recreate policies explicitly to avoid legacy over-permissive UPDATE
DROP POLICY IF EXISTS applications_select_own_or_admin ON public.applications;
DROP POLICY IF EXISTS applications_insert_own ON public.applications;
DROP POLICY IF EXISTS applications_update_own_or_admin ON public.applications;
DROP POLICY IF EXISTS applications_update_draft_own ON public.applications;
DROP POLICY IF EXISTS applications_update_admin ON public.applications;

-- SELECT: own row or admin
CREATE POLICY applications_select_own_or_admin
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- INSERT: only create your own application, must start as draft
CREATE POLICY applications_insert_own
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'draft');

-- UPDATE (applicant): only when existing row is draft; new status may be draft or submitted
CREATE POLICY applications_update_draft_own
ON public.applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'draft')
WITH CHECK (auth.uid() = user_id AND status IN ('draft','submitted'));

-- UPDATE (admin): unrestricted (still authenticated role, but guarded by is_admin())
CREATE POLICY applications_update_admin
ON public.applications
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

COMMIT;
