-- Simplified SQL to create government table in Supabase
-- Apply this in the Supabase SQL Editor

-- Create government table
CREATE TABLE IF NOT EXISTS public.government (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                  -- Dhivehi name
  name_en text,                        -- English name
  slug text UNIQUE NOT NULL,
  collection_id text,
  item_id text,
  archived boolean DEFAULT false,
  draft boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Enable RLS
ALTER TABLE public.government ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS government_slug_idx ON public.government(slug);
CREATE INDEX IF NOT EXISTS government_created_at_idx ON public.government(created_at);
CREATE INDEX IF NOT EXISTS government_published_at_idx ON public.government(published_at);

-- Add RLS policies
CREATE POLICY "Public can read government data"
  ON public.government
  FOR SELECT
  TO public
  USING (
    archived = false
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- Insert initial data (first 5 ministries)
INSERT INTO public.government (name, name_en, slug, collection_id, item_id, archived, draft, created_at, updated_at, published_at)
VALUES
  ('މިނިސްޓްރީ އޮފް ފޮރިން އެފެއާޒް', 'Ministry of Foreign Affairs', 'ministree-of-forin-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0426b', false, false, '2022-10-10 19:14:51 UTC', '2022-10-10 19:14:51 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ޑިފެންސް', 'Ministry of Defence', 'ministree-of-difens', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423d', false, false, '2022-10-10 19:15:29 UTC', '2022-10-10 19:16:44 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް އެޑިޔުކޭޝަން', 'Ministry of Education', 'ministree-of-ediyukeyshan', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423c', false, false, '2022-10-10 19:20:08 UTC', '2022-10-10 19:20:08 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ހޯމް އެފެއާޒް', 'Ministry of Home Affairs', 'ministree-of-hoam-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04265', false, false, '2022-10-10 19:21:47 UTC', '2022-10-10 19:21:47 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ފިނޭންސް', 'Ministry of Finance', 'ministree-of-fineyns', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04268', false, false, '2022-10-10 19:22:08 UTC', '2022-10-10 19:22:08 UTC', '2024-08-25 10:55:54 UTC')
ON CONFLICT (slug) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.government IS 'Stores information about government ministries';
