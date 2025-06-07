# Island Categories Relationship Migration

This set of scripts is designed to establish a proper foreign key relationship between the `islands` table and the `island_categories` table in the Supabase database.

## Background

Currently, the `islands` table has string fields for island categories (`island_category` and `island_category_en`). This migration will:

1. Ensure the `island_categories` table exists with proper structure
2. Extract unique categories from the `islands` table to populate the `island_categories` table
3. Add an `island_categories_id` column to the `islands` table as a foreign key
4. Map existing island categories to their corresponding IDs in the `island_categories` table

## Files

- `setup-island-categories.sql`: Functions to create and populate the `island_categories` table
- `add-island-categories-relationship.sql`: Script to add and configure the foreign key relationship
- `add-island-categories-relationship.js`: JavaScript script to execute the migration
- `sql-util-function.sql`: Utility function for executing SQL code through the Supabase client

## Migration Process

### Step 1: Set up SQL utility function

First, run the SQL utility function that will allow executing arbitrary SQL through the JavaScript client:

```bash
# Navigate to the SQL Editor in your Supabase dashboard and run the content of:
sql-util-function.sql
```

### Step 2: Set up island_categories table functions

Next, set up the functions to create and populate the island_categories table:

```bash
# Navigate to the SQL Editor in your Supabase dashboard and run the content of:
setup-island-categories.sql
```

### Step 3: Run the migration script

Execute the JavaScript script to perform the full migration:

```bash
node add-island-categories-relationship.js
```

The script will:
- Check if the `island_categories` table exists
- Create it if necessary
- Populate it with unique categories from the `islands` table
- Add the `island_categories_id` column to the `islands` table
- Set up the foreign key constraint
- Update existing records to set the correct relationships

### Step 4: Verify and clean up

After successfully running the migration:

1. Check that all islands have been properly linked to their categories
2. Update any application code to use the new `island_categories_id` field
3. Once you confirm everything works correctly, you can remove the redundant fields:
   ```sql
   ALTER TABLE islands DROP COLUMN island_category;
   ALTER TABLE islands DROP COLUMN island_category_en;
   ```

## Troubleshooting

If you encounter any issues:

1. Check the console output for specific error messages
2. Verify that the SQL functions were created successfully
3. Check that the `island_categories` table was populated correctly
4. Ensure you have the necessary permissions to alter tables in your Supabase database
