-- Fix existing user roles: update profiles where auth users have role=Client in metadata
UPDATE public.profiles
SET role = 'Client', updated_at = now()
WHERE id IN (
  SELECT id FROM auth.users
  WHERE raw_user_meta_data->>'role' IN ('Client', 'client')
) AND (role IS NULL OR role != 'Client');

-- Also ensure any profile without a role gets a default
UPDATE public.profiles
SET role = 'Editor'
WHERE role IS NULL;
