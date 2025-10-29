CREATE TABLE IF NOT EXISTS hotel_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE hotel_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hotel menu"
  ON hotel_menus FOR SELECT
  USING (auth.uid() = user_id OR is_active = true);

CREATE POLICY "Users can insert their own hotel menu"
  ON hotel_menus FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hotel menu"
  ON hotel_menus FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hotel menu"
  ON hotel_menus FOR DELETE
  USING (auth.uid() = user_id);
