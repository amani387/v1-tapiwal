-- Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_platform CHECK (platform IN (
    'linkedin', 'instagram', 'twitter', 'facebook', 'github', 
    'tiktok', 'youtube', 'website', 'whatsapp', 'telegram', 'other'
  ))
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_links
CREATE POLICY "Anyone can view active social links"
  ON public.social_links FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Users can manage their own social links"
  ON public.social_links FOR ALL
  USING (auth.uid() = user_id);

-- Create index for user_id lookups
CREATE INDEX idx_social_links_user_id ON public.social_links(user_id);
