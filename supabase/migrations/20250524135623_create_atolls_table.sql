-- Create the atolls table - PostgreSQL syntax for Supabase
CREATE TABLE public.atolls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL, -- Dhivehi name
  name_en VARCHAR(255) NOT NULL, -- English name
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  island_reference VARCHAR(255) NULL,
  island_reference_dv VARCHAR(255) NULL,
  island_category VARCHAR(255) NULL,
  island_category_en VARCHAR(255) NULL
);

-- Add RLS policies
ALTER TABLE public.atolls ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read atolls
CREATE POLICY "Allow anyone to read atolls" 
  ON public.atolls 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to insert/update atolls
CREATE POLICY "Allow authenticated users to insert atolls"
  ON public.atolls
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update atolls"
  ON public.atolls
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data for the Maldives atolls
INSERT INTO public.atolls (name, name_en, slug, island_reference, island_reference_dv, island_category, island_category_en)
VALUES 
  ('ހއ', 'Ha Alif', 'ha-alif', 'North Thiladhunmathi', 'ތިލަދުންމަތީ އުތުރުބުރި', 'Atoll', 'Atoll'),
  ('ހދ', 'Ha Dhaalu', 'ha-dhaalu', 'South Thiladhunmathi', 'ތިލަދުންމަތީ ދެކުނުބުރި', 'Atoll', 'Atoll'),
  ('ށ', 'Shaviyani', 'shaviyani', 'North Miladhunmadulu', 'މިލަދުންމަޑުލު އުތުރުބުރި', 'Atoll', 'Atoll'),
  ('ނ', 'Noonu', 'noonu', 'South Miladhunmadulu', 'މިލަދުންމަޑުލު ދެކުނުބުރި', 'Atoll', 'Atoll'),
  ('ރ', 'Raa', 'raa', 'North Maalhosmadulu', 'މާޅޮސްމަޑުލު އުތުރުބުރި', 'Atoll', 'Atoll'),
  ('ބ', 'Baa', 'baa', 'South Maalhosmadulu', 'މާޅޮސްމަޑުލު ދެކުނުބުރި', 'Atoll', 'Atoll'),
  ('ޅ', 'Lhaviyani', 'lhaviyani', 'Faadhippolhu', 'ފާދިއްޕޮޅު', 'Atoll', 'Atoll'),
  ('ކ', 'Kaafu', 'kaafu', 'Male Atoll', 'މާލެ އަތޮޅު', 'Atoll', 'Atoll'),
  ('އއ', 'Alif Alif', 'alif-alif', 'North Ari Atoll', 'އަރިއަތޮޅު އުތުރުބުރި', 'Atoll', 'Atoll'),
  ('އދ', 'Alif Dhaal', 'alif-dhaal', 'South Ari Atoll', 'އަރިއަތޮޅު ދެކުނުބުރި', 'Atoll', 'Atoll'),
  ('ވ', 'Vaavu', 'vaavu', 'Felidhu Atoll', 'ފެލިދެއަތޮޅު', 'Atoll', 'Atoll'),
  ('މ', 'Meemu', 'meemu', 'Mulaku Atoll', 'މުލަކަތޮޅު', 'Atoll', 'Atoll'),
  ('ފ', 'Faafu', 'faafu', 'North Nilandhe Atoll', 'ނިލަންދެއަތޮޅު އުތުރުބުރި', 'Atoll', 'Atoll'),
  ('ދ', 'Dhaalu', 'dhaalu', 'South Nilandhe Atoll', 'ނިލަންދެއަތޮޅު ދެކުނުބުރި', 'Atoll', 'Atoll'),
  ('ތ', 'Thaa', 'thaa', 'Kolhumadulu', 'ކޮޅުމަޑުލު', 'Atoll', 'Atoll'),
  ('ލ', 'Laamu', 'laamu', 'Hadhdhunmathi', 'ހައްދުންމަތި', 'Atoll', 'Atoll'),
  ('ގއ', 'Gaafu Alif', 'gaafu-alif', 'North Huvadhu Atoll', 'ހުވަދުއަތޮޅު އުތުރުބުރި', 'Atoll', 'Atoll'),
  ('ގދ', 'Gaafu Dhaalu', 'gaafu-dhaalu', 'South Huvadhu Atoll', 'ހުވަދުއަތޮޅު ދެކުނުބުރި', 'Atoll', 'Atoll'),
  ('ޏ', 'Gnaviyani', 'gnaviyani', 'Fuvahmulah', 'ފުވައްމުލައް', 'Island', 'Island'),
  ('ސ', 'Seenu', 'seenu', 'Addu Atoll', 'އައްޑު އަތޮޅު', 'Atoll', 'Atoll');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON public.atolls TO anon;
GRANT SELECT, INSERT, UPDATE ON public.atolls TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.atolls_id_seq TO authenticated;
