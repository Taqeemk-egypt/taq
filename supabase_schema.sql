-- ==============================================================================
-- TAQEEMK (تقييمك) - SUPABASE POSTGRESQL DATABASE SCHEMA & SECURITY SETUP
-- Complete, Idempotent, High-Security Schema with RLS, Triggers, Storage & RPCs
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES CREATION (IDEMPOTENT)
-- ==============================================================================

-- ---------------- PROFILES TABLE ----------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT DEFAULT 'مستخدم تقييمك',
    bio TEXT DEFAULT 'مرحباً بكم في صفحتي على تقييمك',
    avatar_url TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    theme_color TEXT DEFAULT '#6366f1',
    theme_style TEXT DEFAULT 'glass',
    theme TEXT DEFAULT 'aurora',
    header_layout TEXT DEFAULT 'cover',
    social_links JSONB DEFAULT '{"instagram": "", "whatsapp": "", "tiktok": "", "telegram": "", "facebook": "", "twitter": "", "youtube": "", "linkedin": "", "snapchat": ""}'::jsonb,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,     -- Requires 100 EGP payment unless admin
    subscription_plan TEXT DEFAULT 'lifetime_100egp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ---------------- SYSTEMS TABLE ("ملفاتك") ----------------
CREATE TABLE IF NOT EXISTS public.systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    theme_color TEXT DEFAULT '#6366f1',
    theme_style TEXT DEFAULT 'glass',
    theme TEXT DEFAULT 'aurora',
    header_layout TEXT DEFAULT 'cover',
    button_style TEXT DEFAULT 'rounded-xl',
    social_links JSONB DEFAULT '{"instagram": "", "whatsapp": "", "tiktok": "", "telegram": "", "facebook": "", "twitter": "", "youtube": "", "linkedin": "", "snapchat": ""}'::jsonb,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Migration for existing databases
ALTER TABLE IF EXISTS public.systems ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'aurora';
ALTER TABLE IF EXISTS public.systems ADD COLUMN IF NOT EXISTS header_layout TEXT DEFAULT 'cover';
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'aurora';
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS header_layout TEXT DEFAULT 'cover';

-- ---------------- CATEGORY LISTS TABLE ----------------
CREATE TABLE IF NOT EXISTS public.lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    system_id UUID REFERENCES public.systems(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT 'folder',
    color TEXT DEFAULT '#6366f1',
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ---------------- LINKS TABLE ----------------
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    system_id UUID REFERENCES public.systems(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.lists(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT DEFAULT 'link',
    is_active BOOLEAN DEFAULT TRUE,
    click_count BIGINT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ---------------- QR CODES TABLE ----------------
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    system_id UUID REFERENCES public.systems(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.lists(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('dynamic', 'static')),
    content_type TEXT DEFAULT 'url' CHECK (content_type IN ('url', 'vcard', 'text', 'wifi', 'whatsapp')),
    target_url TEXT NOT NULL,
    qr_data TEXT,
    short_slug TEXT UNIQUE,
    fg_color TEXT DEFAULT '#0f172a',
    bg_color TEXT DEFAULT '#ffffff',
    corner_style TEXT DEFAULT 'extra-rounded',
    logo_url TEXT DEFAULT '',
    scan_count BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ---------------- QR SCANS ANALYTICS TABLE ----------------
CREATE TABLE IF NOT EXISTS public.qr_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    device_type TEXT DEFAULT 'Unknown',
    browser TEXT DEFAULT 'Unknown',
    ip_hash TEXT DEFAULT '',
    referrer TEXT DEFAULT ''
);

-- ---------------- PAYMENTS TABLE ----------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    amount NUMERIC(10,2) DEFAULT 100.00 NOT NULL,
    currency TEXT DEFAULT 'EGP' NOT NULL,
    target_wallet TEXT DEFAULT '01503773224' NOT NULL,
    sender_number TEXT NOT NULL,
    transaction_ref TEXT DEFAULT '',
    receipt_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT DEFAULT '',
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_systems_user ON public.systems(user_id);
CREATE INDEX IF NOT EXISTS idx_systems_slug ON public.systems(slug);
CREATE INDEX IF NOT EXISTS idx_lists_user ON public.lists(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_system ON public.lists(system_id);
CREATE INDEX IF NOT EXISTS idx_links_user ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_system ON public.links(system_id);
CREATE INDEX IF NOT EXISTS idx_links_list ON public.links(list_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_user ON public.qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_system ON public.qr_codes(system_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_slug ON public.qr_codes(short_slug);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr ON public.qr_scans(qr_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. SECURITY FUNCTIONS & POLICIES (FULLY IDEMPOTENT)
-- ==============================================================================

-- Security Helper Function: Check if current auth user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        (auth.jwt() ->> 'email' = 'elemamyoussef34@gmail.com')
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (is_admin = TRUE OR email = 'elemamyoussef34@gmail.com')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ---------------- PROFILES POLICIES ----------------
DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by anyone" 
ON public.profiles FOR SELECT 
USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile or Admin update any" ON public.profiles;
CREATE POLICY "Users update own profile or Admin update any" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- Protect sensitive columns on profiles (only admin can change is_admin and is_active)
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT public.is_admin() THEN
        NEW.is_admin := OLD.is_admin;
        NEW.is_active := OLD.is_active;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- ---------------- SYSTEMS POLICIES (ملفاتك) ----------------
DROP POLICY IF EXISTS "Public can view active systems" ON public.systems;
CREATE POLICY "Public can view active systems"
ON public.systems FOR SELECT
USING (
    is_active = TRUE
    OR auth.uid() = user_id
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Users can create own systems" ON public.systems;
CREATE POLICY "Users can create own systems"
ON public.systems FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own systems" ON public.systems;
CREATE POLICY "Users can update own systems"
ON public.systems FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own systems" ON public.systems;
CREATE POLICY "Users can delete own systems"
ON public.systems FOR DELETE
USING (auth.uid() = user_id OR public.is_admin());

-- ---------------- LISTS POLICIES ----------------
DROP POLICY IF EXISTS "Public can view lists of active systems" ON public.lists;
CREATE POLICY "Public can view lists of active systems" 
ON public.lists FOR SELECT 
USING (
    (
        is_visible = TRUE AND (
            system_id IS NULL OR EXISTS (
                SELECT 1 FROM public.systems 
                WHERE systems.id = lists.system_id AND systems.is_active = TRUE
            )
        )
    )
    OR auth.uid() = user_id
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Users can create own lists" ON public.lists;
CREATE POLICY "Users can create own lists" 
ON public.lists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lists" ON public.lists;
CREATE POLICY "Users can update own lists" 
ON public.lists FOR UPDATE 
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own lists" ON public.lists;
CREATE POLICY "Users can delete own lists" 
ON public.lists FOR DELETE 
USING (auth.uid() = user_id OR public.is_admin());

-- ---------------- LINKS POLICIES ----------------
DROP POLICY IF EXISTS "Public can view active links" ON public.links;
CREATE POLICY "Public can view active links" 
ON public.links FOR SELECT 
USING (
    (
        is_active = TRUE AND (
            system_id IS NULL OR EXISTS (
                SELECT 1 FROM public.systems 
                WHERE systems.id = links.system_id AND systems.is_active = TRUE
            )
        )
    )
    OR auth.uid() = user_id
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Users can create own links" ON public.links;
CREATE POLICY "Users can create own links" 
ON public.links FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own links" ON public.links;
CREATE POLICY "Users can update own links" 
ON public.links FOR UPDATE 
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own links" ON public.links;
CREATE POLICY "Users can delete own links" 
ON public.links FOR DELETE 
USING (auth.uid() = user_id OR public.is_admin());

-- ---------------- QR CODES POLICIES ----------------
DROP POLICY IF EXISTS "Public can resolve active dynamic QR codes" ON public.qr_codes;
CREATE POLICY "Public can resolve active dynamic QR codes" 
ON public.qr_codes FOR SELECT 
USING (
    (is_active = TRUE) 
    OR auth.uid() = user_id 
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Users can create own QR codes" ON public.qr_codes;
CREATE POLICY "Users can create own QR codes" 
ON public.qr_codes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own QR codes" ON public.qr_codes;
CREATE POLICY "Users can update own QR codes" 
ON public.qr_codes FOR UPDATE 
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own QR codes" ON public.qr_codes;
CREATE POLICY "Users can delete own QR codes" 
ON public.qr_codes FOR DELETE 
USING (auth.uid() = user_id OR public.is_admin());

-- ---------------- QR SCANS POLICIES ----------------
DROP POLICY IF EXISTS "Anyone can log QR scans" ON public.qr_scans;
CREATE POLICY "Anyone can log QR scans" 
ON public.qr_scans FOR INSERT 
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Owners and Admins view scan analytics" ON public.qr_scans;
CREATE POLICY "Owners and Admins view scan analytics" 
ON public.qr_scans FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.qr_codes 
        WHERE qr_codes.id = qr_scans.qr_id AND (qr_codes.user_id = auth.uid() OR public.is_admin())
    )
);

-- Trigger to increment QR code scan_count automatically on scan insert
CREATE OR REPLACE FUNCTION public.handle_qr_scan_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.qr_codes
    SET scan_count = COALESCE(scan_count, 0) + 1
    WHERE id = NEW.qr_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_increment_qr_scan ON public.qr_scans;
CREATE TRIGGER trg_increment_qr_scan
    AFTER INSERT ON public.qr_scans
    FOR EACH ROW EXECUTE FUNCTION public.handle_qr_scan_insert();

-- ---------------- PAYMENTS POLICIES ----------------
DROP POLICY IF EXISTS "Users view own payments or Admin views all" ON public.payments;
CREATE POLICY "Users view own payments or Admin views all" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users insert own payment receipt" ON public.payments;
CREATE POLICY "Users insert own payment receipt" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only Admins can update payments" ON public.payments;
CREATE POLICY "Only Admins can update payments" 
ON public.payments FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- 6. PUBLIC RPC FUNCTIONS (VIEW & CLICK COUNTERS)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.increment_system_view(system_row_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.systems
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = system_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_link_click(link_row_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.links
    SET click_count = COALESCE(click_count, 0) + 1
    WHERE id = link_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==============================================================================
-- 7. USER LIFECYCLE & PAYMENT TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_is_admin BOOLEAN := FALSE;
    user_is_active BOOLEAN := FALSE;
    clean_username TEXT;
    raw_username TEXT;
    raw_name TEXT;
BEGIN
    IF LOWER(NEW.email) = 'elemamyoussef34@gmail.com' THEN
        user_is_admin := TRUE;
        user_is_active := TRUE;
    END IF;

    -- Extract metadata if passed during signUp
    raw_username := NEW.raw_user_meta_data->>'username';
    raw_name := NEW.raw_user_meta_data->>'display_name';

    IF raw_username IS NOT NULL AND TRIM(raw_username) <> '' THEN
        clean_username := LOWER(REGEXP_REPLACE(TRIM(raw_username), '[^a-zA-Z0-9_-]', '', 'g'));
    ELSE
        clean_username := SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(REPLACE(NEW.id::text, '-', ''), 1, 4);
    END IF;

    IF clean_username IS NULL OR clean_username = '' THEN
        clean_username := 'user_' || SUBSTRING(REPLACE(NEW.id::text, '-', ''), 1, 6);
    END IF;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = clean_username) THEN
        clean_username := clean_username || '_' || SUBSTRING(REPLACE(NEW.id::text, '-', ''), 1, 4);
    END IF;

    -- Insert into public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        username,
        display_name,
        is_admin,
        is_active,
        theme_color,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        clean_username,
        COALESCE(NULLIF(raw_name, ''), SPLIT_PART(NEW.email, '@', 1)),
        user_is_admin,
        user_is_active,
        '#6366f1',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        is_admin = CASE WHEN LOWER(NEW.email) = 'elemamyoussef34@gmail.com' THEN TRUE ELSE profiles.is_admin END,
        is_active = CASE WHEN LOWER(NEW.email) = 'elemamyoussef34@gmail.com' THEN TRUE ELSE profiles.is_active END,
        updated_at = NOW();

    -- Create default initial system in public.systems ("ملفاتك")
    INSERT INTO public.systems (
        user_id,
        slug,
        title,
        bio,
        theme_color,
        is_default,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        clean_username,
        COALESCE(NULLIF(raw_name, ''), SPLIT_PART(NEW.email, '@', 1)),
        'مرحباً بكم في صفحتي على تقييمك',
        '#6366f1',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for Auto-Activating User Profile when Payment is Approved
CREATE OR REPLACE FUNCTION public.handle_payment_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        UPDATE public.profiles
        SET is_active = TRUE, updated_at = NOW()
        WHERE id = NEW.user_id;
    ELSIF NEW.status = 'rejected' THEN
        UPDATE public.profiles
        SET is_active = FALSE, updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_payment_status_changed ON public.payments;
CREATE TRIGGER on_payment_status_changed
    AFTER UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_payment_approval();

-- Ensure admin user profile gets activated if already created
UPDATE public.profiles
SET is_admin = TRUE, is_active = TRUE
WHERE LOWER(email) = 'elemamyoussef34@gmail.com';

-- ==============================================================================
-- 8. STORAGE BUCKETS & POLICIES (Receipts, Avatars & Covers)
-- ==============================================================================

-- Create buckets safely
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;
CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Users and admins can view receipts" ON storage.objects;
CREATE POLICY "Users and admins can view receipts"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Public can view avatars and covers" ON storage.objects;
CREATE POLICY "Public can view avatars and covers"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatars', 'covers'));

DROP POLICY IF EXISTS "Authenticated users can upload avatars and covers" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars and covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('avatars', 'covers'));

DROP POLICY IF EXISTS "Authenticated users can update avatars and covers" ON storage.objects;
CREATE POLICY "Authenticated users can update avatars and covers"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('avatars', 'covers'));

DROP POLICY IF EXISTS "Authenticated users can delete avatars and covers" ON storage.objects;
CREATE POLICY "Authenticated users can delete avatars and covers"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('avatars', 'covers'));
-- ==============================================================================
-- 9. SYSTEMS LIMIT (non-admin accounts: 1 system only; admin: unlimited)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.enforce_system_limit()
RETURNS TRIGGER AS $$
DECLARE
    sys_count INT;
    max_allowed INT;
    p_admin BOOLEAN;
BEGIN
    SELECT is_admin INTO p_admin
    FROM public.profiles WHERE id = NEW.user_id;

    -- Admin only: unlimited
    IF COALESCE(p_admin, FALSE) THEN
        RETURN NEW;
    END IF;

    -- Any non-admin account: one system only
    max_allowed := 1;

    SELECT COUNT(*) INTO sys_count
    FROM public.systems WHERE user_id = NEW.user_id;

    IF sys_count >= max_allowed THEN
        RAISE EXCEPTION 'SYSTEM_LIMIT_REACHED: الحد الأقصى للملفات %', max_allowed
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_enforce_system_limit ON public.systems;
CREATE TRIGGER trg_enforce_system_limit
    BEFORE INSERT ON public.systems
    FOR EACH ROW EXECUTE FUNCTION public.enforce_system_limit();

-- ==============================================================================
-- 10. EXPLICIT GRANTS FOR PUBLIC ANON READ (Public Profile / p.html Access)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.systems TO anon, authenticated;
GRANT SELECT ON public.lists TO anon, authenticated;
GRANT SELECT ON public.links TO anon, authenticated;
GRANT SELECT ON public.qr_codes TO anon, authenticated;
GRANT INSERT ON public.qr_scans TO anon, authenticated;

-- ==============================================================================
-- 11. MIGRATION V2: Grace Period, Verification Badge, Subscription Duration
-- SAFE ADDITIVE MIGRATION — NO DROP, NO DELETE, NO DATA LOSS
-- ==============================================================================

-- 1. Grace Period: trial_ends_at (2 days after created_at)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Backfill existing rows
UPDATE public.profiles
SET trial_ends_at = created_at + INTERVAL '2 days'
WHERE trial_ends_at IS NULL;

-- Default for new rows
ALTER TABLE public.profiles
  ALTER COLUMN trial_ends_at SET DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '2 days');

-- 2. Verification Badge: is_verified (admin-only toggle)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 3. Subscription Duration: subscription_ends_at (5 months duration)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- 4. Update payment approval trigger to set subscription_ends_at = NOW() + INTERVAL '5 months'
CREATE OR REPLACE FUNCTION public.handle_payment_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        UPDATE public.profiles
        SET is_active = TRUE,
            subscription_ends_at = NOW() + INTERVAL '5 months',
            updated_at = NOW()
        WHERE id = NEW.user_id;
    ELSIF NEW.status = 'rejected' THEN
        UPDATE public.profiles
        SET is_active = FALSE,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- =============================================================================
-- SECTION 12: REVIEWS TABLE (رأيك يهمنا)
-- Migration: ADD TABLE — does NOT touch any existing tables or data
-- =============================================================================

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating      integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT reviews_user_id_unique UNIQUE (user_id)  -- one review per user (upsert target)
);

-- 2. Index for fast aggregation
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews (rating);

-- 3. Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: anyone can read (public summary on index.html)
DROP POLICY IF EXISTS "reviews_read_public" ON public.reviews;
CREATE POLICY "reviews_read_public"
    ON public.reviews
    FOR SELECT
    USING (true);

-- 5. RLS Policy: only paid (is_active=true) users can insert/update their own review
DROP POLICY IF EXISTS "reviews_write_paid_users" ON public.reviews;
CREATE POLICY "reviews_write_paid_users"
    ON public.reviews
    FOR ALL
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND is_active = true
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND is_active = true
        )
    );
