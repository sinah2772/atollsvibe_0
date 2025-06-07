-- Add island_categories_id column to islands table as a foreign key reference to island_categories table
ALTER TABLE islands 
ADD island_categories_id INTEGER;

-- Create a foreign key constraint linking islands.island_categories_id to island_categories.id
ALTER TABLE islands
ADD CONSTRAINT fk_island_categories
FOREIGN KEY (island_categories_id) 
REFERENCES island_categories(id);

-- Create an index for improved query performance
CREATE INDEX idx_islands_island_categories_id ON islands(island_categories_id);

-- Create a function to migrate existing island_category data to the new relationship
-- This assumes that island_categories table exists and has appropriate data matching the island_category values
-- You will need to populate the island_categories table first if it is empty
CREATE OR REPLACE FUNCTION migrate_island_categories() 
RETURNS void AS $$
DECLARE
    total_islands INTEGER;
    updated_islands INTEGER := 0;
    island_record RECORD;
    category_id INTEGER;
BEGIN
    -- Count total islands
    SELECT COUNT(*) INTO total_islands FROM islands;
    
    -- First attempt a bulk update for exact matches
    UPDATE islands i
    SET island_categories_id = ic.id
    FROM island_categories ic
    WHERE i.island_category = ic.name OR i.island_category_en = ic.name_en;
    
    GET DIAGNOSTICS updated_islands = ROW_COUNT;
    RAISE NOTICE 'Updated % islands with exact category matches', updated_islands;
    
    -- Process remaining islands that couldn't be matched directly
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
        END IF;
    END LOOP;
    
    -- Log migration results
    RAISE NOTICE 'Total islands: %', total_islands;
    RAISE NOTICE 'Islands updated with category reference: %', updated_islands;
    RAISE NOTICE 'Islands without matching categories: %', 
        (SELECT COUNT(*) FROM islands WHERE island_categories_id IS NULL 
         AND (island_category IS NOT NULL OR island_category_en IS NOT NULL));
    RAISE NOTICE 'Islands with no category information: %',
        (SELECT COUNT(*) FROM islands WHERE island_category IS NULL AND island_category_en IS NULL);
END;
$$ LANGUAGE plpgsql;

-- Execute the migration function
SELECT migrate_island_categories();

-- IMPORTANT: After confirming the data migration was successful, you can optionally:
-- 1. Make island_categories_id NOT NULL if all islands should have a category
-- 2. Remove the now redundant island_category and island_category_en columns

-- Example of making the field required after all data is migrated:
-- ALTER TABLE islands ALTER COLUMN island_categories_id SET NOT NULL;

-- Example of removing the old columns (only after confirming data migration success):
-- ALTER TABLE islands DROP COLUMN island_category;
-- ALTER TABLE islands DROP COLUMN island_category_en;
