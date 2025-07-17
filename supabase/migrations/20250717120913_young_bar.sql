/*
  # Add condition column to products table

  1. Changes
    - Add `condition` column to `products` table with enum constraint
    - Set default value to 'new'
    - Add check constraint for valid values

  2. Security
    - No RLS changes needed as existing policies will cover the new column
*/

-- Add condition column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'condition'
  ) THEN
    ALTER TABLE products ADD COLUMN condition text DEFAULT 'new';
    
    -- Add check constraint for valid condition values
    ALTER TABLE products ADD CONSTRAINT products_condition_check 
    CHECK (condition = ANY (ARRAY['new'::text, 'used'::text, 'excellent'::text]));
  END IF;
END $$;