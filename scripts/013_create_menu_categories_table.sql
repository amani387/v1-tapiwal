CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES hotel_menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active categories"
  ON menu_categories FOR SELECT
  USING (is_active = true OR auth.uid() IN (
    SELECT user_id FROM hotel_menus WHERE id = menu_id
  ));

CREATE POLICY "Users can manage their menu categories"
  ON menu_categories FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM hotel_menus WHERE id = menu_id
  ));
