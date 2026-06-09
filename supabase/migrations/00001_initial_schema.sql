-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create user_role enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('Super_Admin', 'Admin', 'Editor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'Editor',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invitations table
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

-- Page content (per section, per locale)
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

-- Content translations (relational key-value)
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

-- Site settings (key-value for global styles)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Leads table
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

-- API Credentials Vault (encrypted)
CREATE TABLE IF NOT EXISTS public.api_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  encrypted_value TEXT NOT NULL,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents for AI knowledge base
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============== INDEXES ==============
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_content_translations_locale ON public.content_translations(locale, section);
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============== ROW LEVEL SECURITY ==============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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

-- Invitations policies
CREATE POLICY "Admins can manage invitations"
  ON public.invitations FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin')));

CREATE POLICY "Anyone can read valid invitation"
  ON public.invitations FOR SELECT
  USING (true);

-- Page content policies
CREATE POLICY "Anyone can read visible page content"
  ON public.page_content FOR SELECT
  USING (is_visible = true OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Admins can manage page content"
  ON public.page_content FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

-- Content translations policies
CREATE POLICY "Anyone can read content translations"
  ON public.content_translations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage translations"
  ON public.content_translations FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

-- Site settings policies
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

-- Leads policies
CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

-- API credentials policies (Super Admin only)
CREATE POLICY "Super admins can manage credentials"
  ON public.api_credentials FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

-- Documents policies
CREATE POLICY "Admins can manage documents"
  ON public.documents FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('Super_Admin', 'Admin', 'Editor')));

-- Audit log policies
CREATE POLICY "Super admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Super_Admin'));

-- ============== TRIGGERS ==============

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'Editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp on profile change
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_page_content_timestamp
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_content_translations_timestamp
  BEFORE UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Audit log trigger for critical tables
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, operation, new_data, changed_by)
    VALUES (TG_TABLE_NAME, 'INSERT', row_to_json(NEW)::jsonb, COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, changed_by)
    VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD)::jsonb, COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to critical tables
CREATE TRIGGER audit_page_content
  AFTER INSERT OR UPDATE OR DELETE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_site_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_api_credentials
  AFTER INSERT OR UPDATE OR DELETE ON public.api_credentials
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- ============== SEED DATA ==============
INSERT INTO public.page_content (section, locale, content, is_visible) VALUES
  ('hero', 'en', '{"headline": "We Build Digital Glory", "subheadline": "Premium marketing, design & development for brands that demand excellence", "cta": "Start Your Journey"}', true),
  ('hero', 'ar', '{"headline": "نبني المجد الرقمي", "subheadline": "تسويق، تصميم وتطوير مميز للعلامات التجارية التي تطمح للتميز", "cta": "ابدأ رحلتك"}', true),
  ('about', 'en', '{"content": "We are a team of passionate creators, strategists, and engineers dedicated to building digital experiences that leave a lasting impression."}', true),
  ('about', 'ar', '{"content": "نحن فريق من المبدعين، الاستراتيجيين، والمهندسين المتحمسين لبناء تجارب رقمية تترك انطباعاً دائماً."}', true)
ON CONFLICT (section, locale) DO NOTHING;

INSERT INTO public.content_translations (section, key, locale, value) VALUES
  ('hero', 'headline', 'en', 'We Build Digital Glory'),
  ('hero', 'headline', 'ar', 'نبني المجد الرقمي'),
  ('hero', 'subheadline', 'en', 'Premium marketing, design & development for brands that demand excellence'),
  ('hero', 'subheadline', 'ar', 'تسويق، تصميم وتطوير مميز للعلامات التجارية التي تطمح للتميز'),
  ('hero', 'cta', 'en', 'Start Your Journey'),
  ('hero', 'cta', 'ar', 'ابدأ رحلتك')
ON CONFLICT (section, key, locale) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
  ('primary_gold', '#BF953F'),
  ('accent_color', '#FCF6BA'),
  ('secondary_gold', '#B38728')
ON CONFLICT (key) DO NOTHING;
