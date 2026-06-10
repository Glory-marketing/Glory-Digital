-- ============================================================
-- GLORY DIGITAL - Complete Database Setup
-- Run this in Supabase SQL Editor (all at once)
-- ============================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('Super_Admin', 'Admin', 'Editor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. Main Tables (skip if exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'Editor',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role user_role NOT NULL,
  invited_by UUID REFERENCES public.profiles(id) NOT NULL,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ar')),
  content JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id),
  UNIQUE(section, locale)
);

CREATE TABLE IF NOT EXISTS public.content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ar')),
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id),
  UNIQUE(section, key, locale)
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  budget TEXT,
  brief TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.api_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  encrypted_value TEXT NOT NULL,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Portfolio & Services Tables
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL DEFAULT '',
  name_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'star',
  price TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Fix missing columns (safe)
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT 'star';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price TEXT NOT NULL DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT true;

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_content_translations_locale ON public.content_translations(locale, section);
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON public.portfolio_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);

-- 7. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 8. Drop old policies (safe)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage invitations" ON public.invitations;
DROP POLICY IF EXISTS "Anyone can read valid invitation" ON public.invitations;
DROP POLICY IF EXISTS "Anyone can read visible page content" ON public.page_content;
DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;
DROP POLICY IF EXISTS "Anyone can read content translations" ON public.content_translations;
DROP POLICY IF EXISTS "Admins can manage translations" ON public.content_translations;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Super admins can manage credentials" ON public.api_credentials;
DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents;
DROP POLICY IF EXISTS "Super admins can view audit log" ON public.audit_log;
DROP POLICY IF EXISTS "Anyone can read visible portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Anyone can read visible services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

-- 9. Create new policies
CREATE POLICY "Anyone can read visible portfolio"
  ON public.portfolio_projects FOR SELECT
  USING (visible = true OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Admins can manage portfolio"
  ON public.portfolio_projects FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Anyone can read visible services"
  ON public.services FOR SELECT
  USING (visible = true OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin')));

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin')));

CREATE POLICY "Super admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

CREATE POLICY "Admins can manage invitations"
  ON public.invitations FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin')));

CREATE POLICY "Anyone can read valid invitation"
  ON public.invitations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read visible page content"
  ON public.page_content FOR SELECT
  USING (is_visible = true OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Admins can manage page content"
  ON public.page_content FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Anyone can read content translations"
  ON public.content_translations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage translations"
  ON public.content_translations FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Super admins can manage credentials"
  ON public.api_credentials FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

CREATE POLICY "Admins can manage documents"
  ON public.documents FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Super admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

-- 10. Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'Editor')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_timestamp ON public.profiles;
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS update_page_content_timestamp ON public.page_content;
CREATE TRIGGER update_page_content_timestamp
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS update_content_translations_timestamp ON public.content_translations;
CREATE TRIGGER update_content_translations_timestamp
  BEFORE UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- 11. Seed data
INSERT INTO public.page_content (section, locale, content, is_visible) VALUES
  ('hero', 'en', '{"headline": "We Build Digital Glory", "subheadline": "Premium marketing, design & development for brands that demand excellence", "cta": "Start Your Journey"}', true),
  ('hero', 'ar', '{"headline": "نبني المجد الرقمي", "subheadline": "تسويق، تصميم وتطوير مميز للعلامات التجارية التي تطمح للتميز", "cta": "ابدأ رحلتك"}', true),
  ('about', 'en', '{"content": "We are a team of passionate creators, strategists, and engineers dedicated to building digital experiences that leave a lasting impression."}', true),
  ('about', 'ar', '{"content": "نحن فريق من المبدعين، الاستراتيجيين، والمهندسين المتحمسين لبناء تجارب رقمية تترك انطباعاً دائماً."}', true)
ON CONFLICT (section, locale) DO NOTHING;

INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible)
SELECT 'Marketing Campaigns', 'حملات تسويقية', 'Data-driven strategies that amplify your brand reach and ROI', 'استراتيجيات مدعومة بالبيانات لتضخيم وصول علامتك التجارية', 'trending_up', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Marketing Campaigns');

INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible)
SELECT 'Printing Materials', 'المطبوعات', 'High-quality printing for all your business needs', 'طباعة عالية الجودة لجميع احتياجات عملك', 'print', 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Printing Materials');

INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible)
SELECT 'Flyers & Brochures', 'البروشورات والفلائر', 'Eye-catching designs that communicate your message', 'تصاميم جذابة تنقل رسالتك', 'description', 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Flyers & Brochures');

INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible)
SELECT 'Digital Marketing', 'التسويق الإلكتروني', 'Full-service digital marketing across all platforms', 'تسويق إلكتروني متكامل عبر جميع المنصات', 'devices', 4, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Digital Marketing');

INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible)
SELECT 'Brand Identity', 'الهوية البصرية', 'Complete brand identity design and strategy', 'تصميم هوية بصرية كاملة واستراتيجية', 'palette', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Brand Identity');

INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible)
SELECT 'Social Media Management', 'إدارة السوشيال ميديا', 'Professional social media management and content creation', 'إدارة احترافية للسوشيال ميديا وإنشاء المحتوى', 'share', 6, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Social Media Management');

INSERT INTO public.site_settings (key, value) VALUES
  ('primary_gold', '#BF953F'),
  ('accent_color', '#FCF6BA'),
  ('secondary_gold', '#B38728')
ON CONFLICT (key) DO NOTHING;
