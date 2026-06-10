-- Create tables first (won't fail if they already exist)
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

-- Add columns that might be missing if tables already existed
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='portfolio_projects') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='visible') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='sort_order') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='services') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='visible') THEN
      ALTER TABLE public.services ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='sort_order') THEN
      ALTER TABLE public.services ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
    END IF;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating
DROP POLICY IF EXISTS "Anyone can read visible portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Anyone can read visible services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON public.portfolio_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);

-- Seed default services
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) VALUES
  ('Marketing Campaigns', 'حملات تسويقية', 'Data-driven strategies that amplify your brand reach and ROI', 'استراتيجيات مدعومة بالبيانات لتضخيم وصول علامتك التجارية', 'trending_up', 1, true),
  ('Printing Materials', 'المطبوعات', 'High-quality printing for all your business needs', 'طباعة عالية الجودة لجميع احتياجات عملك', 'print', 2, true),
  ('Flyers & Brochures', 'البروشورات والفلائر', 'Eye-catching designs that communicate your message', 'تصاميم جذابة تنقل رسالتك', 'description', 3, true),
  ('Digital Marketing', 'التسويق الإلكتروني', 'Full-service digital marketing across all platforms', 'تسويق إلكتروني متكامل عبر جميع المنصات', 'devices', 4, true),
  ('Brand Identity', 'الهوية البصرية', 'Complete brand identity design and strategy', 'تصميم هوية بصرية كاملة واستراتيجية', 'palette', 5, true),
  ('Social Media Management', 'إدارة السوشيال ميديا', 'Professional social media management and content creation', 'إدارة احترافية للسوشيال ميديا وإنشاء المحتوى', 'share', 6, true)
ON CONFLICT DO NOTHING;
