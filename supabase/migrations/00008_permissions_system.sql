-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Role-Permission mapping
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission_key TEXT NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, permission_key)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS: only admins can read/write permissions
CREATE POLICY "Admins can view permissions"
  ON public.permissions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin')));

CREATE POLICY "Super_Admin can manage permissions"
  ON public.permissions FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

CREATE POLICY "Admins can view role_permissions"
  ON public.role_permissions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin')));

CREATE POLICY "Super_Admin can manage role_permissions"
  ON public.role_permissions FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

-- Seed permissions
INSERT INTO public.permissions (key, label_en, label_ar, module) VALUES
  ('users.view', 'View Users', 'عرض المستخدمين', 'Users'),
  ('users.invite', 'Invite Users', 'دعوة مستخدمين', 'Users'),
  ('users.manage_roles', 'Manage User Roles', 'إدارة صلاحيات المستخدمين', 'Users'),
  ('users.manage_permissions', 'Manage Role Permissions', 'إدارة صلاحيات الأدوار', 'Users'),
  ('projects.view_all', 'View All Projects', 'عرض كل المشاريع', 'Projects'),
  ('projects.manage', 'Manage Projects', 'إدارة المشاريع', 'Projects'),
  ('projects.assign', 'Assign Projects', 'تخصيص المشاريع', 'Projects'),
  ('content.page_builder', 'Page Builder', 'بناء الصفحات', 'Content'),
  ('content.portfolio', 'Manage Portfolio', 'إدارة الأعمال', 'Content'),
  ('content.services', 'Manage Services', 'إدارة الخدمات', 'Content'),
  ('content.pricing', 'Manage Pricing', 'إدارة الأسعار', 'Content'),
  ('leads.view', 'View Leads', 'عرض العملاء المحتملين', 'Leads'),
  ('leads.manage', 'Manage Leads', 'إدارة العملاء المحتملين', 'Leads'),
  ('analytics.view', 'View Analytics', 'عرض التحليلات', 'Analytics'),
  ('vault.access', 'Access Vault', 'الوصول للخزنة', 'Vault'),
  ('discount_codes.manage', 'Manage Discount Codes', 'إدارة أكواد الخصم', 'Discounts'),
  ('settings.view', 'View Settings', 'عرض الإعدادات', 'Settings'),
  ('settings.manage', 'Manage Settings', 'إدارة الإعدادات', 'Settings'),
  ('printing.manage', 'Manage Printing Materials', 'إدارة مواد الطباعة', 'Printing')
ON CONFLICT (key) DO NOTHING;

-- Super_Admin gets all permissions
INSERT INTO public.role_permissions (role, permission_key)
SELECT 'Super_Admin'::user_role, key FROM public.permissions
ON CONFLICT DO NOTHING;

-- Admin permissions
INSERT INTO public.role_permissions (role, permission_key)
SELECT 'Admin'::user_role, key FROM public.permissions
WHERE key NOT IN ('users.manage_permissions', 'settings.manage')
ON CONFLICT DO NOTHING;

-- Editor permissions
INSERT INTO public.role_permissions (role, permission_key)
SELECT 'Editor'::user_role, key FROM public.permissions
WHERE key IN ('content.page_builder', 'content.portfolio', 'content.services', 'content.pricing', 'projects.view_all', 'printing.manage')
ON CONFLICT DO NOTHING;

-- Client permissions (used for portal)
INSERT INTO public.role_permissions (role, permission_key)
SELECT 'Client'::user_role, key FROM public.permissions
WHERE key IN ('projects.view_all')
ON CONFLICT DO NOTHING;
