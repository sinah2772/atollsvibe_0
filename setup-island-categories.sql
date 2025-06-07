-- Create functions to handle island_categories table setup

-- Function to create the island_categories table if it doesn't exist
CREATE OR REPLACE FUNCTION create_island_categories_table() 
RETURNS void AS $$
BEGIN
    -- Create the island_categories table
    CREATE TABLE IF NOT EXISTS island_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Create index for improved lookup performance
    CREATE INDEX IF NOT EXISTS idx_island_categories_name ON island_categories(name);
    CREATE INDEX IF NOT EXISTS idx_island_categories_name_en ON island_categories(name_en);
END;
$$ LANGUAGE plpgsql;

-- Function to populate the island_categories table from existing island categories
CREATE OR REPLACE FUNCTION populate_island_categories() 
RETURNS void AS $$
DECLARE
    category_count INTEGER;
BEGIN
    -- Check if island_categories table already has data
    SELECT COUNT(*) INTO category_count FROM island_categories;
    
    IF category_count = 0 THEN
        -- Insert unique categories from the islands table
        INSERT INTO island_categories (name, name_en, slug)
        SELECT DISTINCT 
            island_category, 
            island_category_en,
            LOWER(REPLACE(REPLACE(TRIM(island_category_en), ' ', '-'), '''', ''))
        FROM islands
        WHERE island_category IS NOT NULL 
          AND island_category_en IS NOT NULL
        ORDER BY island_category;
        
        RAISE NOTICE 'Inserted % unique island categories', 
            (SELECT COUNT(*) FROM island_categories);
    ELSE
        RAISE NOTICE 'island_categories table already has % records, skipping population', 
            category_count;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to find island category ID by name or English name
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
