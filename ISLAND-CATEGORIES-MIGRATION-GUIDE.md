# Island Categories Migration Guide

This guide outlines the steps to migrate the island categories from text fields to proper foreign key relationships in the Supabase database.

## Migration Steps

### Step 1: Create Helper Functions (Optional)

If you want to use the `check-migration-status.js` script to verify the migration status, first create the helper function:

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Navigate to the "SQL Editor" section
4. Create a new query
5. Copy and paste the contents of `check-column-function.sql` into the editor
6. Run the query

### Step 2: Run the SQL Migration

The most reliable way to execute the migration is through the Supabase SQL Editor:

1. Log in to your Supabase dashboard (if not already logged in)
2. Navigate to the "SQL Editor" section
3. Create a new query
4. Copy and paste the contents of `island-categories-migration.sql` into the editor
5. Run the query

This will:
- Create the `island_categories` table if it doesn't exist
- Populate it with unique categories from the islands table
- Add the `island_categories_id` column to the islands table
- Update islands with appropriate foreign key references
- Display a results summary

### Alternative: Using the JavaScript Client

If you prefer to run the migration from your local environment:

1. Make sure your `.env` file contains the correct Supabase credentials:

   ```plain
   VITE_SUPABASE_URL=https://vtkxjgsnnslwjzfyvdqu.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. First run the SQL utility function in the Supabase SQL Editor:

   ```sql
   CREATE OR REPLACE FUNCTION run_sql(sql text)
   RETURNS void AS $$
   BEGIN
     EXECUTE sql;
   END;
   $$ LANGUAGE plpgsql
   SECURITY DEFINER;
   ```

3. Then run the migration script:

   ```bash
   node update-island-categories-mapping.js
   ```

## Verifying the Migration

### Using the Check Script

The easiest way to check the migration status is to use the provided script:

```bash
npm run check-migration-status
```

This will display a detailed report about:
- Whether the island_categories table exists
- Whether the foreign key column exists in the islands table
- If categories have been populated
- How many islands have been mapped to categories

### Manual Verification

You can also manually verify the migration with these SQL queries:

```sql
-- Check categories
SELECT * FROM island_categories;

-- Check islands with categories
SELECT COUNT(*) FROM islands WHERE island_categories_id IS NOT NULL;

-- Check islands missing categories
SELECT COUNT(*) FROM islands 
WHERE island_categories_id IS NULL 
AND (island_category IS NOT NULL OR island_category_dv IS NOT NULL);
```

## Cleaning Up

Once the migration is successful and you've updated your application code to use the new relationships:

```sql
-- Optional: Remove the redundant text columns
ALTER TABLE islands DROP COLUMN IF EXISTS island_category;
ALTER TABLE islands DROP COLUMN IF EXISTS island_category_en;
ALTER TABLE islands DROP COLUMN IF EXISTS island_category_dv;
```

## Troubleshooting

If you encounter issues:

1. **Column naming issues**: The migration handles both `island_category` and `island_category_dv` column variations
2. **SQL function errors**: Make sure you've created the `run_sql` function in your database
3. **Connection errors**: Verify your Supabase credentials and network connectivity
4. **Permission errors**: Ensure you have the necessary permissions to alter tables
