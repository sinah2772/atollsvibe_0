-- Create a junction table to establish many-to-many relationship between islands and island_categories

-- First ensure the islands and island_categories tables have proper primary keys
ALTER TABLE IF EXISTS islands 
    ADD CONSTRAINT islands_pkey PRIMARY KEY (id) 
    NOT VALID;

ALTER TABLE IF EXISTS island_categories 
    ADD CONSTRAINT island_categories_pkey PRIMARY KEY (id) 
    NOT VALID;

-- Create the island_category_links junction table
CREATE TABLE IF NOT EXISTS public.island_category_links (
    id SERIAL PRIMARY KEY,
    island_id INTEGER NOT NULL,
    island_category_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT island_category_links_island_id_fkey FOREIGN KEY (island_id)
        REFERENCES public.islands (id) ON DELETE CASCADE,
    CONSTRAINT island_category_links_category_id_fkey FOREIGN KEY (island_category_id)
        REFERENCES public.island_categories (id) ON DELETE CASCADE,
    CONSTRAINT island_category_links_unique UNIQUE (island_id, island_category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_island_category_links_island_id ON island_category_links(island_id);
CREATE INDEX IF NOT EXISTS idx_island_category_links_category_id ON island_category_links(island_category_id);

-- Populate the junction table with existing relationships
-- This will pull data from the current islands table where island_categories_id is set
INSERT INTO island_category_links (island_id, island_category_id)
SELECT id, island_categories_id FROM islands 
WHERE island_categories_id IS NOT NULL
ON CONFLICT (island_id, island_category_id) DO NOTHING;

-- Comment on table and columns
COMMENT ON TABLE island_category_links IS 'Junction table linking islands to their categories in a many-to-many relationship';
COMMENT ON COLUMN island_category_links.island_id IS 'Reference to the islands table';
COMMENT ON COLUMN island_category_links.island_category_id IS 'Reference to the island_categories table';
