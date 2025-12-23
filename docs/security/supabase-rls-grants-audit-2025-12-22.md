# Supabase RLS & GRANTs Security Audit — 2025-12-22

## Goal
Lock down `public` schema exposure and enforce least-privilege access for client roles.

## Key outcomes (confirmed)
- ✅ No `public` tables left with RLS disabled.
- ✅ No remaining GRANTs for role `anon` on any `public` table.
- ✅ App sanity tests: login/profile load + admin students list + create student + update status all PASS.

## Changes applied

### 1) student_number_counters (critical fix)
- Enabled RLS on `public.student_number_counters`.
- Revoked ALL privileges from `anon` and `authenticated` on `student_number_counters`.
- Updated `public.next_student_number(integer)` to run as `SECURITY DEFINER` with safe search_path so student inserts can still generate numbers.

### 2) Removed public (anon) access everywhere
- Revoked ALL privileges from `anon` on:
  - `public.profiles`
  - `public.students`
  - `public.admin_users`

### 3) Removed dangerous extra privileges for browser roles
- Revoked TRUNCATE/TRIGGER/REFERENCES on app tables from `anon` and `authenticated` (browser roles).

### 4) admin_users least privilege
- Revoked INSERT/UPDATE/DELETE on `public.admin_users` from `authenticated`.
- Kept SELECT (needed for RLS checks in students policies).

### 5) profiles least privilege + anti-privilege-escalation
- Removed table-level UPDATE from `authenticated`.
- Granted column-level UPDATE only on:
  - `email`
  - `full_name`
- (Prevents users from updating `role` and self-promoting to admin.)

### 6) students least privilege + cleanup
- Revoked DELETE on `public.students` from `authenticated` (frontend does not delete).
- Dropped duplicate RLS policies on `students`:
  - "Admins can insert students"
  - "Students can read own row"
- Left intended policies:
  - Admin CRUD (authenticated + admin_use_

## Frontend performance note (2025-12-23)
- Implemented route lazy-loading and Rollup manualChunks.
- Main entry bundle reduced from ~567KB to ~160KB.
- New chunks: vendor (~205KB), supabase (~165KB), forms (~23KB), plus lazy-loaded route chunks.
