-- Create profile_views table for detailed analytics
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_views
CREATE POLICY "Users can view their own profile views"
  ON public.profile_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert profile views"
  ON public.profile_views FOR INSERT
  WITH CHECK (TRUE);

-- Create indexes
CREATE INDEX idx_profile_views_user_id ON public.profile_views(user_id);
CREATE INDEX idx_profile_views_viewed_at ON public.profile_views(viewed_at);
