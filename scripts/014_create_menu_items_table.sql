CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view available items"
  ON menu_items FOR SELECT
  USING (is_available = true OR auth.uid() IN (
    SELECT user_id FROM hotel_menus 
    WHERE id = (SELECT menu_id FROM menu_categories WHERE id = category_id)
  ));

CREATE POLICY "Users can manage their menu items"
  ON menu_items FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM hotel_menus 
    WHERE id = (SELECT menu_id FROM menu_categories WHERE id = category_id)
  ));
