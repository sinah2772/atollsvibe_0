-- Migration: 20250525135000_government_table.sql
-- Description: Creates government table for storing ministry information
-- This file is for PostgreSQL as used by Supabase

/*
  # Add Government Table

  1. New Table
    - `government` table for managing ministry information
    - Includes fields for ministry names in Dhivehi and English, plus metadata
    
  2. Security
    - Enable RLS
    - Add policies for public access and admin management
*/

BEGIN;

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
DO $$
BEGIN
  -- Only create the policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'government' AND policyname = 'Public can read government data'
  ) THEN
    CREATE POLICY "Public can read government data"
      ON public.government
      FOR SELECT
      TO public
      USING (
        archived = false
        AND published_at IS NOT NULL
        AND published_at <= now()
      );
  END IF;
  
  -- Only create the policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'government' AND policyname = 'Admin users can manage all government data'
  ) THEN
    CREATE POLICY "Admin users can manage all government data"
      ON public.government
      FOR ALL
      TO authenticated
      USING (
        (SELECT is_admin FROM public.users WHERE id = auth.uid())
      )
      WITH CHECK (
        (SELECT is_admin FROM public.users WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_government_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_government_updated_at ON public.government;
CREATE TRIGGER update_government_updated_at
  BEFORE UPDATE ON public.government
  FOR EACH ROW
  EXECUTE FUNCTION public.update_government_updated_at();

-- Insert initial data from CSV file
INSERT INTO public.government (name, name_en, slug, collection_id, item_id, archived, draft, created_at, updated_at, published_at)
VALUES
  ('މިނިސްޓްރީ އޮފް ފޮރިން އެފެއާޒް', 'Ministry of Foreign Affairs', 'ministree-of-forin-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0426b', false, false, '2022-10-10 19:14:51 UTC', '2022-10-10 19:14:51 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ޑިފެންސް', 'Ministry of Defence', 'ministree-of-difens', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423d', false, false, '2022-10-10 19:15:29 UTC', '2022-10-10 19:16:44 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް އެޑިޔުކޭޝަން', 'Ministry of Education', 'ministree-of-ediyukeyshan', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423c', false, false, '2022-10-10 19:20:08 UTC', '2022-10-10 19:20:08 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ހޯމް އެފެއާޒް', 'Ministry of Home Affairs', 'ministree-of-hoam-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04265', false, false, '2022-10-10 19:21:47 UTC', '2022-10-10 19:21:47 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ފިނޭންސް', 'Ministry of Finance', 'ministree-of-fineyns', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04268', false, false, '2022-10-10 19:22:08 UTC', '2022-10-10 19:22:08 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ނޭޝަނަލް ޕްލޭނިންގ، ހައުސިންގ އެންޑް އިންފްރާސްޓްރަކްޗަރ', 'Ministry of National Planning, Housing and Infrastructure', 'ministree-of-neyshanal-pleyning-ha-using-end-infraastrakchar', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0426c', false, false, '2022-10-10 19:23:11 UTC', '2022-10-10 19:23:11 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ހަޔަރ އެޑިޔުކޭޝަން', 'Ministry of Higher Education', 'ministree-of-hayar-ediyukeyshan', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b041c3', false, false, '2022-10-10 19:23:28 UTC', '2022-10-10 19:23:28 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް އެޑިޔުކޭޝަން', 'Ministry of Education', 'ministree-of-ediyukeyshan-2', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423e', false, false, '2022-10-10 19:24:43 UTC', '2022-10-10 19:24:43 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ  އޮފް ޓްރާންސްޕޯޓް އެންޑް ސިވިލްއޭވިއޭޝަން', 'Ministry of Transport and Civil Aviation', 'ministree-of-traanspoat-end-sivil-eyvi-eyshan', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04206', false, false, '2022-10-10 19:25:05 UTC', '2022-10-10 19:25:05 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް އާޓްސް، ކަލްޗަރ އެންޑް ހެރިޓޭޖް', 'Ministry of Arts, Culture and Heritage', 'ministree-of-aats-kalchar-end-heriteyj', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0426a', false, false, '2022-10-10 19:25:27 UTC', '2022-10-10 19:25:27 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް އިކޮނޮމިކް ޑިވެލޮޕްމަންޓް', 'Ministry of Economic Development', 'ministree-of-ikonomik-divelopmant', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b041db', false, false, '2022-10-10 19:27:11 UTC', '2022-10-10 19:27:11 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ  އޮފް އިސްލާމިކް އެފެއާޒް', 'Ministry of Islamic Affairs', 'ministree-of-islaamik-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b041f2', false, false, '2022-10-10 19:27:29 UTC', '2022-10-10 19:27:29 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ  އޮފް ޔޫތު، ސްޕޯޓްސް އެންޑް ކޮމިއުނިޓީ އެމްޕަވަރމަންޓް', 'Ministry of Youth, Sports and Community Empowerment', 'ministree-of-yoothu-spoats-end-komi-unitee-empavarmant', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423b', false, false, '2022-10-10 19:28:02 UTC', '2022-10-10 19:28:02 UTC', '2024-08-25 10:55:54 UTC'),
  ('ނިސްޓްރީ  އޮފް ޖެންޑަރ، ފެމިލީ އެންޑް ސޯޝަލް ސަރވިސަސް', 'Ministry of Gender, Family and Social Services', 'nistree-of-jendar-femilee-end-soashal-sarvisas', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04267', false, false, '2022-10-10 19:28:49 UTC', '2022-10-10 19:28:49 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ  އޮފް ޓޫރިޒަމް', 'Ministry of Tourism', 'ministree-of-toorizam', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0421a', false, false, '2022-10-10 19:29:35 UTC', '2022-10-10 19:29:35 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ އޮފް ހެލްތް', 'Ministry of Health', 'ministree-of-helth', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04269', false, false, '2022-10-10 19:30:02 UTC', '2022-10-10 19:30:02 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ  އޮފް ފިޝަރީޒް، މެރިން ރިސޯސަސް އެންޑް އެގްރިކަލްޗަރ', 'Ministry of Fisheries, Marine Resources and Agriculture', 'ministree-of-fishareez-merin-risoasas-end-egrikalchar', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04266', false, false, '2022-10-10 19:30:29 UTC', '2022-10-10 19:30:29 UTC', '2024-08-25 10:55:54 UTC'),
  ('މިނިސްޓްރީ  އޮފް އެންވަޔަރަންމަންޓް، ކްލައިމެޓް ޗޭންޖް އެންޑް ޓެކްނޯލޮޖީ', 'Ministry of Environment, Climate Change and Technology', 'ministree-of-envayaranmant-kla-imet-cheynj-end-teknoalojee', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04264', false, false, '2022-10-10 19:31:04 UTC', '2022-10-10 19:31:04 UTC', '2024-08-25 10:55:54 UTC')
ON CONFLICT (slug) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.government IS 'Stores information about government ministries';

COMMIT;
