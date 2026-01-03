BEGIN;

ALTER TABLE public.applications
  VALIDATE CONSTRAINT applications_status_allowed;

COMMIT;
