-- ============================================================
-- Fix handle_new_user trigger to handle ALL edge cases
-- ============================================================

-- Drop old versions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate with bulletproof error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
  _role user_role;
  _full_name TEXT;
BEGIN
  -- Safely extract role from metadata (default: 'Editor')
  BEGIN
    _role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'Editor'::user_role
    );
  EXCEPTION WHEN OTHERS THEN
    _role := 'Editor'::user_role;
  END;

  -- Safely extract full_name from metadata
  _full_name := NULLIF(NEW.raw_user_meta_data->>'full_name', '');

  INSERT INTO public.profiles (id, email, role, full_name, is_active)
  VALUES (NEW.id, NEW.email, _role, _full_name, true)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't prevent user creation
  RAISE WARNING 'handle_new_user error for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure 'Client' role exists in enum (safe to run multiple times)
DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'Client';
EXCEPTION
  WHEN duplicate_object THEN null;
  WHEN OTHERS THEN null;
END $$;
