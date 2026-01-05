# Supabase Security Snapshot

- Generated (UTC): 2026-01-05 00:13:40
- Project ref: yakujiwzshkkuvoqikbh
- Host: aws-1-ap-south-1.pooler.supabase.com

## RLS enabled tables (public)

- admin_users
- applications
- gallery_items
- payments
- profiles
- student_number_counters
- students

## Policies (public)

| Table | Policy | Permissive | Roles | Cmd | Using | With check |
|---|---|---|---|---|---|---|
| public.admin_users | Admin users can read their own row | PERMISSIVE | authenticated | SELECT | ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id)) |  |
| public.applications | applications_insert_own | PERMISSIVE | authenticated | INSERT |  | ((auth.uid() = user_id) AND (status = 'draft'::text)) |
| public.applications | applications_select_own_or_admin | PERMISSIVE | authenticated | SELECT | ((auth.uid() = user_id) OR is_admin()) |  |
| public.applications | applications_update_admin | PERMISSIVE | authenticated | UPDATE | is_admin() | is_admin() |
| public.applications | applications_update_draft_own | PERMISSIVE | authenticated | UPDATE | ((auth.uid() = user_id) AND (status = 'draft'::text)) | ((auth.uid() = user_id) AND (status = ANY (ARRAY['draft'::text, 'submitted'::text]))) |
| public.gallery_items | Public read published gallery items | PERMISSIVE | anon,authenticated | SELECT | (is_published = true) |  |
| public.payments | Payments select admin | PERMISSIVE | public | SELECT | is_admin() |  |
| public.payments | Payments select own | PERMISSIVE | public | SELECT | (auth.uid() = user_id) |  |
| public.profiles | profiles_select_own_or_admin | PERMISSIVE | authenticated | SELECT | ((( SELECT auth.uid() AS uid) = id) OR ( SELECT is_admin() AS is_admin)) |  |
| public.profiles | profiles_update_own_or_admin | PERMISSIVE | authenticated | UPDATE | ((( SELECT auth.uid() AS uid) = id) OR ( SELECT is_admin() AS is_admin)) | ((( SELECT auth.uid() AS uid) = id) OR ( SELECT is_admin() AS is_admin)) |
| public.students | Admins can create students | PERMISSIVE | authenticated | INSERT |  | (EXISTS ( SELECT 1 |
|    FROM admin_users au |  |  |  |  |  |  |
|   WHERE (au.user_id = auth.uid()))) |  |  |  |  |  |  |
| public.students | Admins can delete students | PERMISSIVE | authenticated | DELETE | (EXISTS ( SELECT 1 |  |
|    FROM admin_users au |  |  |  |  |  |  |
|   WHERE (au.user_id = auth.uid()))) |  |  |  |  |  |  |
| public.students | Admins can read all students | PERMISSIVE | authenticated | SELECT | (EXISTS ( SELECT 1 |  |
|    FROM admin_users au |  |  |  |  |  |  |
|   WHERE (au.user_id = auth.uid()))) |  |  |  |  |  |  |
| public.students | Admins can update students | PERMISSIVE | authenticated | UPDATE | (EXISTS ( SELECT 1 |  |
|    FROM admin_users au |  |  |  |  |  |  |
|   WHERE (au.user_id = auth.uid()))) | (EXISTS ( SELECT 1 |  |  |  |  |  |
|    FROM admin_users au |  |  |  |  |  |  |
|   WHERE (au.user_id = auth.uid()))) |  |  |  |  |  |  |
| public.students | Students can read their own row | PERMISSIVE | authenticated | SELECT | ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id)) |  |

## SECURITY DEFINER functions (public)

- apply_paytabs_result(p_cart_id text, p_tran_ref text, p_status text, p_payload jsonb)
- approve_application(p_application_id uuid)
- handle_new_user()
- is_admin()
- next_student_number(p_year integer)
- set_profile_role(target_user_id uuid, new_role text)

## Key constraints / indexes (payments, applications, students, profiles)

### public.payments

**Constraints**
- payments_cart_id_key :: UNIQUE (cart_id)
- payments_pkey :: PRIMARY KEY (id)
- payments_status_allowed :: CHECK ((status = ANY (ARRAY['created'::text, 'redirected'::text, 'authorised'::text, 'failed'::text, 'cancelled'::text, 'expired'::text])))

**Indexes**
- payments_cart_id_key :: CREATE UNIQUE INDEX payments_cart_id_key ON public.payments USING btree (cart_id)
- payments_pkey :: CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id)
- payments_tran_ref_unique :: CREATE UNIQUE INDEX payments_tran_ref_unique ON public.payments USING btree (tran_ref) WHERE ((tran_ref IS NOT NULL) AND (tran_ref <> ''::text))

### public.applications

**Constraints**
- applications_pkey :: PRIMARY KEY (id)
- applications_status_allowed :: CHECK ((status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text])))
- applications_user_id_key :: UNIQUE (user_id)

**Indexes**
- applications_pkey :: CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id)
- applications_user_id_key :: CREATE UNIQUE INDEX applications_user_id_key ON public.applications USING btree (user_id)

### public.students

**Constraints**
- students_pkey :: PRIMARY KEY (user_id)
- students_status_check :: CHECK ((status = ANY (ARRAY['enrolled'::text, 'inactive'::text, 'graduated'::text])))
- students_student_id_key :: UNIQUE (student_id)
- students_user_id_fkey :: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

**Indexes**
- students_cohort_year_student_number_key :: CREATE UNIQUE INDEX students_cohort_year_student_number_key ON public.students USING btree (cohort_year, student_number)
- students_pkey :: CREATE UNIQUE INDEX students_pkey ON public.students USING btree (user_id)
- students_student_id_key :: CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id)

### public.profiles

**Constraints**
- profiles_id_fkey :: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
- profiles_pkey :: PRIMARY KEY (id)
- profiles_role_check :: CHECK ((role = ANY (ARRAY['student'::text, 'admin'::text])))

**Indexes**
- profiles_pkey :: CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)

### public.admin_users

**Constraints**
- admin_users_pkey :: PRIMARY KEY (user_id)
- admin_users_user_id_fkey :: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

**Indexes**
- admin_users_pkey :: CREATE UNIQUE INDEX admin_users_pkey ON public.admin_users USING btree (user_id)

## Notes

- This snapshot is intended to be committed and reviewed in PR diffs.
- Do not include secrets. This report contains schema metadata only.
