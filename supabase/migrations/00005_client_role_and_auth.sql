-- Add "Client" role to user_role enum
DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'Client';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add client_id column to client_projects for proper linking
ALTER TABLE public.client_projects ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.profiles(id);

-- Update client_projects RLS: clients can see their own projects
DROP POLICY IF EXISTS "Clients can view own projects" ON public.client_projects;
CREATE POLICY "Clients can view own projects"
  ON public.client_projects FOR SELECT
  USING (
    auth.uid() = client_id
    OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin'))
  );

-- Update client_projects RLS: clients can insert their own projects
DROP POLICY IF EXISTS "Clients can insert own projects" ON public.client_projects;
CREATE POLICY "Clients can insert own projects"
  ON public.client_projects FOR INSERT
  WITH CHECK (
    auth.uid() = client_id
    OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin'))
  );

-- Profiles RLS: allow clients to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin'))
  );

-- Update handle_new_user trigger: read role + full_name from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'Editor'),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
