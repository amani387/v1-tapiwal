-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_companies_admin_user ON companies(admin_user_id);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Company admin can view their company
CREATE POLICY "Company admin can view their company"
  ON companies FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid());

-- Company admin can update their company
CREATE POLICY "Company admin can update their company"
  ON companies FOR UPDATE
  TO authenticated
  USING (admin_user_id = auth.uid());

-- Admins can see all companies
CREATE POLICY "Admins can view all companies"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
