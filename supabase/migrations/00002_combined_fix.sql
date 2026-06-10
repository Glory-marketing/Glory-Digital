-- ====== 1. Create tables if they don't exist ======
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

-- ====== 2. Add any missing columns (safe, uses IF NOT EXISTS) ======
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

-- ====== 3. Enable RLS ======
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ====== 4. Drop old policies (safe) ======
DROP POLICY IF EXISTS "Anyone can read visible portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Anyone can read visible services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

-- ====== 5. Create new policies ======
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

-- ====== 6. Indexes ======
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON public.portfolio_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);

-- ====== 7. Seed default services (skip duplicates) ======
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
