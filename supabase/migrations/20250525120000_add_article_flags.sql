-- Add missing article flag fields
-- Run this in your Supabase SQL editor to add the missing fields

-- Add is_breaking field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_breaking boolean DEFAULT false;

-- Add is_featured field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add is_developing field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_developing boolean DEFAULT false;

-- Add is_exclusive field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_exclusive boolean DEFAULT false;

-- Add is_sponsored field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_sponsored boolean DEFAULT false;

-- Add sponsored_by field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS sponsored_by text DEFAULT NULL;

-- Add sponsored_url field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS sponsored_url text DEFAULT NULL;

-- Notify that the migration is complete
DO $$
BEGIN
    RAISE NOTICE 'Article flag fields have been added successfully';
END $$;
