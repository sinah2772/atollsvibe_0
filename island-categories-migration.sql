-- Complete SQL script for island categories migration
-- Run this script in the Supabase SQL Editor to migrate island categories

-- 1. Create the SQL utility function for JavaScript client (if needed later)
CREATE OR REPLACE FUNCTION run_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- 2. Create the island_categories table if it doesn't exist
DO $$
BEGIN
    -- Create the island_categories table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'island_categories') THEN
        CREATE TABLE island_categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            name_en VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Create indexes for improved lookup performance
        CREATE INDEX idx_island_categories_name ON island_categories(name);
        CREATE INDEX idx_island_categories_name_en ON island_categories(name_en);
    END IF;
END $$;

-- 3. Insert unique island categories from islands table if they don't exist
-- First try with island_category and island_category_en columns
DO $$
DECLARE
    category_count INTEGER := 0;
BEGIN
    BEGIN
        INSERT INTO island_categories (name, name_en, slug)
        SELECT DISTINCT 
            island_category, 
            island_category_en,
            LOWER(REPLACE(REPLACE(TRIM(island_category_en), ' ', '-'), '''', ''))
        FROM islands
        WHERE 
            island_category IS NOT NULL 
            AND island_category_en IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM island_categories 
                WHERE 
                    name = islands.island_category 
                    OR name_en = islands.island_category_en
            );
            
        GET DIAGNOSTICS category_count = ROW_COUNT;
        RAISE NOTICE 'Inserted % categories using island_category/island_category_en columns', category_count;
        
    EXCEPTION WHEN undefined_column THEN
        -- Try with alternate column names (island_category_dv)
        RAISE NOTICE 'Column error, trying with island_category_dv instead';
        
        INSERT INTO island_categories (name, name_en, slug)
        SELECT DISTINCT 
            island_category_dv, 
            island_category_en,
            LOWER(REPLACE(REPLACE(TRIM(island_category_en), ' ', '-'), '''', ''))
        FROM islands
        WHERE 
            island_category_dv IS NOT NULL 
            AND island_category_en IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM island_categories 
                WHERE 
                    name = islands.island_category_dv 
                    OR name_en = islands.island_category_en
            );
            
        GET DIAGNOSTICS category_count = ROW_COUNT;
        RAISE NOTICE 'Inserted % categories using island_category_dv/island_category_en columns', category_count;
    END;
END $$;

-- 4. Add the island_categories_id column to islands table if it doesn't exist
DO $$
BEGIN
    -- Add island_categories_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'islands' 
        AND column_name = 'island_categories_id'
    ) THEN
        ALTER TABLE islands ADD COLUMN island_categories_id INTEGER REFERENCES island_categories(id);
        RAISE NOTICE 'Added island_categories_id column to islands table';
    ELSE
        RAISE NOTICE 'island_categories_id column already exists';
    END IF;
END $$;

-- 5. Update islands table to set island_categories_id based on matching category
-- First try with island_category
DO $$
DECLARE
    update_count INTEGER := 0;
BEGIN
    BEGIN
        UPDATE islands
        SET island_categories_id = ic.id
        FROM island_categories ic
        WHERE 
            (islands.island_category = ic.name OR islands.island_category_en = ic.name_en)
            AND islands.island_categories_id IS NULL;
            
        GET DIAGNOSTICS update_count = ROW_COUNT;
        RAISE NOTICE 'Updated % islands using island_category/island_category_en match', update_count;
        
    EXCEPTION WHEN undefined_column THEN
        -- Try with alternate column names
        RAISE NOTICE 'Column error, trying with island_category_dv instead';
        
        UPDATE islands
        SET island_categories_id = ic.id
        FROM island_categories ic
        WHERE 
            (islands.island_category_dv = ic.name OR islands.island_category_en = ic.name_en)
            AND islands.island_categories_id IS NULL;
            
        GET DIAGNOSTICS update_count = ROW_COUNT;
        RAISE NOTICE 'Updated % islands using island_category_dv/island_category_en match', update_count;
    END;
END $$;

-- 6. Report the results of the migration
SELECT 
    'Island Categories Migration Results' AS description,
    (SELECT COUNT(*) FROM island_categories) AS total_categories,
    (SELECT COUNT(*) FROM islands WHERE island_categories_id IS NOT NULL) AS islands_with_categories,
    (SELECT COUNT(*) FROM islands WHERE island_categories_id IS NULL AND 
        (island_category IS NOT NULL OR 
         EXISTS(SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'islands' AND column_name = 'island_category_dv' AND 
                      EXISTS(SELECT 1 FROM islands WHERE island_category_dv IS NOT NULL)
               )
        )
    ) AS islands_missing_categories;
