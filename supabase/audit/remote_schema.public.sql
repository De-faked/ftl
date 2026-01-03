--
-- PostgreSQL database dump
--

\restrict bvAYw2sWULjoC2Em3tEfIF67xaCGaANtjkBIVXbauXUdioy7KgARrzaV6pdYQGI

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.profiles (id, role, email)
  values (new.id, 'student', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;


--
-- Name: next_student_number(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_student_number(p_year integer) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
declare n int;
begin
  -- ensure row exists
  insert into public.student_number_counters (cohort_year, last_number)
  values (p_year, 0)
  on conflict (cohort_year) do nothing;

  -- atomic increment
  update public.student_number_counters
  set last_number = last_number + 1
  where cohort_year = p_year
  returning last_number into n;

  return n;
end;
$$;


--
-- Name: random_suffix(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.random_suffix(p_len integer DEFAULT 5) RETURNS text
    LANGUAGE plpgsql
    AS $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  b bytea;
  out text := '';
  i int;
  idx int;
begin
  b := gen_random_bytes(p_len); -- strong randomness :contentReference[oaicite:4]{index=4}
  for i in 0..p_len-1 loop
    idx := (get_byte(b, i) % length(chars)) + 1;
    out := out || substr(chars, idx, 1);
  end loop;
  return out;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    role text DEFAULT 'student'::text NOT NULL,
    email text,
    full_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['student'::text, 'admin'::text])))
);


--
-- Name: set_profile_role(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_profile_role(target_user_id uuid, new_role text) RETURNS public.profiles
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  updated_row public.profiles;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.profiles
  set role = new_role
  where id = target_user_id
  returning * into updated_row;

  return updated_row;
end;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: students_set_student_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.students_set_student_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  candidate text;
begin
  if NEW.cohort_year is null then
    NEW.cohort_year := 2026;
  end if;

  if NEW.student_number is null or NEW.student_number = 0 then
    NEW.student_number := public.next_student_number(NEW.cohort_year);
  end if;

  if NEW.student_id is null or NEW.student_id = '' then
    loop
      -- NO extra hyphen before suffix (matches your requirement)
      candidate :=
        format('FTL-%s-%s%s',
          NEW.cohort_year,
          lpad(NEW.student_number::text, 4, '0'), -- left pad zeros :contentReference[oaicite:5]{index=5}
          public.random_suffix(5)
        );

      exit when not exists (select 1 from public.students where student_id = candidate);
    end loop;

    NEW.student_id := candidate;
  end if;

  return NEW;
end;
$$;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kind text NOT NULL,
    storage_key text,
    public_url text,
    thumb_url text,
    content_type text,
    size_bytes bigint,
    width integer,
    height integer,
    duration_seconds numeric,
    caption_ar text,
    caption_en text,
    caption_id text,
    alt_ar text,
    alt_en text,
    alt_id text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT gallery_items_file_or_url_chk CHECK ((((kind = ANY (ARRAY['photo'::text, 'video'::text])) AND (storage_key IS NOT NULL)) OR ((kind = 'external_video'::text) AND (public_url IS NOT NULL)))),
    CONSTRAINT gallery_items_kind_check CHECK ((kind = ANY (ARRAY['photo'::text, 'video'::text, 'external_video'::text])))
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_id uuid,
    cart_id text NOT NULL,
    tran_ref text,
    amount numeric NOT NULL,
    currency text NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    redirect_url text,
    paypage_ttl integer,
    callback_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: student_number_counters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_number_counters (
    cohort_year integer NOT NULL,
    last_number integer DEFAULT 0 NOT NULL
);


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    user_id uuid NOT NULL,
    student_id text NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'enrolled'::text NOT NULL,
    notes text,
    CONSTRAINT students_status_check CHECK ((status = ANY (ARRAY['enrolled'::text, 'inactive'::text, 'graduated'::text])))
);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (user_id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: applications applications_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_user_id_key UNIQUE (user_id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: payments payments_cart_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_cart_id_key UNIQUE (cart_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: student_number_counters student_number_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_number_counters
    ADD CONSTRAINT student_number_counters_pkey PRIMARY KEY (cohort_year);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (user_id);


--
-- Name: students students_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_student_id_key UNIQUE (student_id);


--
-- Name: gallery_items_public_list_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gallery_items_public_list_idx ON public.gallery_items USING btree (is_published, sort_order, created_at DESC);


--
-- Name: applications set_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: gallery_items set_gallery_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: payments set_payments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: profiles set_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: students trg_students_set_student_id; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_students_set_student_id BEFORE INSERT ON public.students FOR EACH ROW EXECUTE FUNCTION public.students_set_student_id();


--
-- Name: admin_users admin_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admin_users Admin users can read their own row; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin users can read their own row" ON public.admin_users FOR SELECT TO authenticated USING (((auth.uid() IS NOT NULL) AND (auth.uid() = user_id)));


--
-- Name: students Admins can create students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create students" ON public.students FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE (au.user_id = auth.uid()))));


--
-- Name: students Admins can delete students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete students" ON public.students FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE (au.user_id = auth.uid()))));


--
-- Name: students Admins can read all students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can read all students" ON public.students FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE (au.user_id = auth.uid()))));


--
-- Name: students Admins can update students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update students" ON public.students FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE (au.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE (au.user_id = auth.uid()))));


--
-- Name: payments Payments select admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Payments select admin" ON public.payments FOR SELECT USING (public.is_admin());


--
-- Name: payments Payments select own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Payments select own" ON public.payments FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: gallery_items Public read published gallery items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read published gallery items" ON public.gallery_items FOR SELECT TO authenticated, anon USING ((is_published = true));


--
-- Name: students Students can read their own row; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can read their own row" ON public.students FOR SELECT TO authenticated USING (((auth.uid() IS NOT NULL) AND (auth.uid() = user_id)));


--
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

--
-- Name: applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

--
-- Name: applications applications_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY applications_insert_own ON public.applications FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: applications applications_select_own_or_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY applications_select_own_or_admin ON public.applications FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR public.is_admin()));


--
-- Name: applications applications_update_own_or_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY applications_update_own_or_admin ON public.applications FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR public.is_admin())) WITH CHECK (((user_id = auth.uid()) OR public.is_admin()));


--
-- Name: gallery_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_select_own_or_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_select_own_or_admin ON public.profiles FOR SELECT TO authenticated USING (((( SELECT auth.uid() AS uid) = id) OR ( SELECT public.is_admin() AS is_admin)));


--
-- Name: profiles profiles_update_own_or_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_update_own_or_admin ON public.profiles FOR UPDATE TO authenticated USING (((( SELECT auth.uid() AS uid) = id) OR ( SELECT public.is_admin() AS is_admin))) WITH CHECK (((( SELECT auth.uid() AS uid) = id) OR ( SELECT public.is_admin() AS is_admin)));


--
-- Name: student_number_counters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_number_counters ENABLE ROW LEVEL SECURITY;

--
-- Name: students; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict bvAYw2sWULjoC2Em3tEfIF67xaCGaANtjkBIVXbauXUdioy7KgARrzaV6pdYQGI

