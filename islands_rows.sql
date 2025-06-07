-- Update islands table to use island_categories_id instead of text fields

-- 1. First, make sure the island_categories table exists
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

-- 2. Insert unique island categories from islands table if they don't exist
-- First try with direct column names
DO $$
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
            )
        ORDER BY island_category;
        
        RAISE NOTICE 'Inserted categories using island_category column';
    EXCEPTION
        WHEN undefined_column THEN
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
                )
            ORDER BY island_category_dv;
            
            RAISE NOTICE 'Inserted categories using island_category_dv column';
    END;
END $$;

-- 3. Create function to find island category ID by name or English name
CREATE OR REPLACE FUNCTION find_island_category_id(category_name text, category_name_en text)
RETURNS integer AS $$
DECLARE
    category_id integer;
BEGIN
    -- Try to find by exact match on name
    SELECT id INTO category_id
    FROM island_categories
    WHERE name = category_name
    LIMIT 1;
    
    -- If not found, try by English name
    IF category_id IS NULL AND category_name_en IS NOT NULL THEN
        SELECT id INTO category_id
        FROM island_categories
        WHERE name_en = category_name_en
        LIMIT 1;
    END IF;
    
    -- If still not found, try case-insensitive match
    IF category_id IS NULL THEN
        SELECT id INTO category_id
        FROM island_categories
        WHERE LOWER(name) = LOWER(category_name)
        LIMIT 1;
    END IF;
    
    -- If still not found and English name is provided, try case-insensitive match on English name
    IF category_id IS NULL AND category_name_en IS NOT NULL THEN
        SELECT id INTO category_id
        FROM island_categories
        WHERE LOWER(name_en) = LOWER(category_name_en)
        LIMIT 1;
    END IF;
    
    RETURN category_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Set island_categories_id in islands table based on island_category and island_category_en
DO $$
DECLARE
    total_islands INTEGER;
    updated_islands INTEGER := 0;
    island_record RECORD;
    category_id INTEGER;
    has_island_category BOOLEAN;
    has_island_category_dv BOOLEAN;
BEGIN
    -- Count total islands
    SELECT COUNT(*) INTO total_islands FROM islands;
    
    -- Check which column naming scheme is used
    BEGIN
        SELECT true INTO has_island_category 
        FROM information_schema.columns 
        WHERE table_name = 'islands' AND column_name = 'island_category';
    EXCEPTION
        WHEN others THEN
            has_island_category := false;
    END;
    
    BEGIN
        SELECT true INTO has_island_category_dv 
        FROM information_schema.columns 
        WHERE table_name = 'islands' AND column_name = 'island_category_dv';
    EXCEPTION
        WHEN others THEN
            has_island_category_dv := false;
    END;
    
    RAISE NOTICE 'Column presence check: island_category=%, island_category_dv=%', has_island_category, has_island_category_dv;
    
    -- First attempt a bulk update for exact matches based on available columns
    IF has_island_category THEN
        UPDATE islands i
        SET island_categories_id = ic.id
        FROM island_categories ic
        WHERE 
            (i.island_category = ic.name OR i.island_category_en = ic.name_en)
            AND i.island_categories_id IS NULL;
    ELSIF has_island_category_dv THEN
        UPDATE islands i
        SET island_categories_id = ic.id
        FROM island_categories ic
        WHERE 
            (i.island_category_dv = ic.name OR i.island_category_en = ic.name_en)
            AND i.island_categories_id IS NULL;
    ELSE
        RAISE NOTICE 'Could not determine island category column name scheme';
    END IF;
    
    GET DIAGNOSTICS updated_islands = ROW_COUNT;
    RAISE NOTICE 'Updated % islands with exact category matches', updated_islands;
      -- Process remaining islands that couldn't be matched directly
    IF has_island_category THEN
        FOR island_record IN 
            SELECT id, island_category, island_category_en 
            FROM islands 
            WHERE island_categories_id IS NULL
            AND (island_category IS NOT NULL OR island_category_en IS NOT NULL)
    LOOP
        -- Try to find a match using our helper function
        category_id := find_island_category_id(island_record.island_category, island_record.island_category_en);
        
        IF category_id IS NOT NULL THEN
            -- Update this island with the found category
            UPDATE islands SET island_categories_id = category_id WHERE id = island_record.id;
            updated_islands := updated_islands + 1;
        END IF;    END LOOP;
    ELSIF has_island_category_dv THEN
        FOR island_record IN 
            SELECT id, island_category_dv as island_category, island_category_en 
            FROM islands 
            WHERE island_categories_id IS NULL
            AND (island_category_dv IS NOT NULL OR island_category_en IS NOT NULL)
        LOOP
            -- Try to find a match using our helper function
            category_id := find_island_category_id(island_record.island_category, island_record.island_category_en);
            
            IF category_id IS NOT NULL THEN
                -- Update this island with the found category
                UPDATE islands SET island_categories_id = category_id WHERE id = island_record.id;
                updated_islands := updated_islands + 1;
            END IF;
        END LOOP;
    END IF;
    
    -- Log migration results
    RAISE NOTICE 'Total islands: %', total_islands;
    RAISE NOTICE 'Islands updated with category reference: %', updated_islands;
    
    IF has_island_category THEN
        RAISE NOTICE 'Islands without matching categories: %', 
            (SELECT COUNT(*) FROM islands WHERE island_categories_id IS NULL 
             AND (island_category IS NOT NULL OR island_category_en IS NOT NULL));
        RAISE NOTICE 'Islands with no category information: %',
            (SELECT COUNT(*) FROM islands WHERE island_category IS NULL AND island_category_en IS NULL);
    ELSIF has_island_category_dv THEN
        RAISE NOTICE 'Islands without matching categories: %', 
            (SELECT COUNT(*) FROM islands WHERE island_categories_id IS NULL 
             AND (island_category_dv IS NOT NULL OR island_category_en IS NOT NULL));
        RAISE NOTICE 'Islands with no category information: %',
            (SELECT COUNT(*) FROM islands WHERE island_category_dv IS NULL AND island_category_en IS NULL);
    END IF;
END $$;

-- 5. List categories and how many islands are assigned to each
SELECT 
    ic.id, 
    ic.name, 
    ic.name_en, 
    COUNT(i.id) AS island_count
FROM 
    island_categories ic
LEFT JOIN 
    islands i ON ic.id = i.island_categories_id
GROUP BY 
    ic.id, ic.name, ic.name_en
ORDER BY 
    island_count DESC;
