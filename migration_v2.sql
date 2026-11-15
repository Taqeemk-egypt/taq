-- ==============================================================================
-- TAQEEMK MIGRATION V2: Grace Period, Verification Badge, Subscription Duration
-- SAFE ADDITIVE MIGRATION — NO DROP, NO DELETE, NO DATA LOSS
-- ==============================================================================

-- 1. Grace Period: trial_ends_at (auto-calculated 2 days after account creation)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Backfill existing rows: set trial_ends_at = created_at + 2 days
UPDATE public.profiles
SET trial_ends_at = created_at + INTERVAL '2 days'
WHERE trial_ends_at IS NULL;

-- Set default for new rows
ALTER TABLE public.profiles
  ALTER COLUMN trial_ends_at SET DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '2 days');

-- 2. Verification Badge: is_verified (admin-only toggle)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 3. Subscription Duration: subscription_ends_at (set by admin on activation)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- 4. Update the payment approval trigger to also set subscription_ends_at
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
        SET is_active = FALSE, updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger already exists; the CREATE OR REPLACE above updates the function body.
-- No need to recreate the trigger since it references the function by name.

-- ==============================================================================
-- 5. REVIEWS TABLE (رأيك يهمنا)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating      integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT reviews_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews (rating);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_read_public" ON public.reviews;
CREATE POLICY "reviews_read_public"
    ON public.reviews
    FOR SELECT
    USING (true);

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
