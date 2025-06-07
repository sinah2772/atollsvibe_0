-- Update islands table to use island_categories_id instead of text fields
-- This version is specifically formatted for RPC execution

-- 1. Create the island_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS island_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for improved lookup performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_island_categories_name ON island_categories(name);

CREATE INDEX IF NOT EXISTS idx_island_categories_name_en ON island_categories(name_en);

-- 2. Try inserting with direct column names
DO $$ 
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
    EXCEPTION WHEN undefined_column THEN
        -- Try with alternate column names (island_category_dv)
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
END $$;

-- 3. Make sure the islands table has the island_categories_id column
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
    END IF;
END $$;

-- 4. Update islands table to set island_categories_id based on matching category
-- First try with direct column names
DO $$
BEGIN
    UPDATE islands
    SET island_categories_id = ic.id
    FROM island_categories ic
    WHERE 
        (islands.island_category = ic.name OR islands.island_category_en = ic.name_en)
        AND islands.island_categories_id IS NULL;
    EXCEPTION WHEN undefined_column THEN
        -- Try with alternate column names
        UPDATE islands
        SET island_categories_id = ic.id
        FROM island_categories ic
        WHERE 
            (islands.island_category_dv = ic.name OR islands.island_category_en = ic.name_en)
            AND islands.island_categories_id IS NULL;
END $$;

-- 5. Report results
SELECT 
    (SELECT COUNT(*) FROM island_categories) AS categories_count,
    (SELECT COUNT(*) FROM islands WHERE island_categories_id IS NOT NULL) AS islands_with_categories,
    (SELECT COUNT(*) FROM islands 
     WHERE island_categories_id IS NULL AND 
     (island_category IS NOT NULL OR island_category_dv IS NOT NULL)) AS islands_missing_categories;
