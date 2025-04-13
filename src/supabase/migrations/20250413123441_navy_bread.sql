/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `company_name` (text, required)
      - `vat_number` (text, required)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `clients` table
    - Add policies for authenticated users to:
      - Read their own clients
      - Create new clients
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name text NOT NULL,
  vat_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_name)
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own clients
CREATE POLICY "Users can read own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own clients
CREATE POLICY "Users can create clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);