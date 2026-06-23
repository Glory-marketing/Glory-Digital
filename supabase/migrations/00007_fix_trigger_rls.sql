-- Ensure handle_new_user trigger function is robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      (NEW.raw_app_meta_data->>'role')::user_role,
      'Editor'
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_app_meta_data->>'full_name')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = COALESCE(
      (EXCLUDED.role::text != 'Editor')::boolean AND EXCLUDED.role IS NOT NULL,
      false
    )::boolean IS true AND EXCLUDED.role OR false,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also handle user updates (e.g. email confirmation, metadata changes)
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_new_user();

-- Fix RLS: allow profiles select for authenticated users with projects
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin'))
    OR EXISTS (SELECT 1 FROM public.client_projects WHERE client_email = auth.email() OR client_id = auth.uid())
  );

-- Fix RLS: allow profiles update for own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix client_projects RLS for better access
DROP POLICY IF EXISTS "Clients can view own projects" ON public.client_projects;
CREATE POLICY "Clients can view own projects"
  ON public.client_projects FOR SELECT
  USING (
    auth.uid() = client_id
    OR client_email = auth.email()
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin'))
  );

-- Enable insert from client portal
DROP POLICY IF EXISTS "Clients can insert own projects" ON public.client_projects;
CREATE POLICY "Clients can insert own projects"
  ON public.client_projects FOR INSERT
  WITH CHECK (
    auth.uid() = client_id
    OR auth.email() = client_email
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin'))
  );
