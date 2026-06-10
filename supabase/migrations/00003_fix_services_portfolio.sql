-- Fix existing tables by adding missing columns
DO $$ BEGIN
  -- Services table fixes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='services') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='name_en') THEN
      ALTER TABLE public.services ADD COLUMN name_en TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='name_ar') THEN
      ALTER TABLE public.services ADD COLUMN name_ar TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='description_en') THEN
      ALTER TABLE public.services ADD COLUMN description_en TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='description_ar') THEN
      ALTER TABLE public.services ADD COLUMN description_ar TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='icon') THEN
      ALTER TABLE public.services ADD COLUMN icon TEXT NOT NULL DEFAULT 'star';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='price') THEN
      ALTER TABLE public.services ADD COLUMN price TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='image_url') THEN
      ALTER TABLE public.services ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='sort_order') THEN
      ALTER TABLE public.services ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='visible') THEN
      ALTER TABLE public.services ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- Portfolio table fixes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='portfolio_projects') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='title_en') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN title_en TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='title_ar') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN title_ar TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='category') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN category TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='description_en') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN description_en TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='description_ar') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN description_ar TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='image_url') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='sort_order') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_projects' AND column_name='visible') THEN
      ALTER TABLE public.portfolio_projects ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;
    END IF;
  END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
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

-- Seed default services (skip if already exist)
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) SELECT 'Marketing Campaigns', 'حملات تسويقية', 'Data-driven strategies that amplify your brand reach and ROI', 'استراتيجيات مدعومة بالبيانات لتضخيم وصول علامتك التجارية', 'trending_up', 1, true WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Marketing Campaigns');
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) SELECT 'Printing Materials', 'المطبوعات', 'High-quality printing for all your business needs', 'طباعة عالية الجودة لجميع احتياجات عملك', 'print', 2, true WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Printing Materials');
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) SELECT 'Flyers & Brochures', 'البروشورات والفلائر', 'Eye-catching designs that communicate your message', 'تصاميم جذابة تنقل رسالتك', 'description', 3, true WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Flyers & Brochures');
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) SELECT 'Digital Marketing', 'التسويق الإلكتروني', 'Full-service digital marketing across all platforms', 'تسويق إلكتروني متكامل عبر جميع المنصات', 'devices', 4, true WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Digital Marketing');
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) SELECT 'Brand Identity', 'الهوية البصرية', 'Complete brand identity design and strategy', 'تصميم هوية بصرية كاملة واستراتيجية', 'palette', 5, true WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Brand Identity');
INSERT INTO public.services (name_en, name_ar, description_en, description_ar, icon, sort_order, visible) SELECT 'Social Media Management', 'إدارة السوشيال ميديا', 'Professional social media management and content creation', 'إدارة احترافية للسوشيال ميديا وإنشاء المحتوى', 'share', 6, true WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name_en = 'Social Media Management');
