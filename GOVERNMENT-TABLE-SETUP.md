# Setting up the Government Table in Supabase

This guide will walk you through creating the `government` table in your Supabase database. The table will store information about government ministries.

## Option 1: Using the Supabase Dashboard (Recommended)

1. **Log in to your Supabase Dashboard**
   - Go to [https://app.supabase.com/](https://app.supabase.com/) and log in
   - Navigate to your project (vtkxjgsnnslwjzfyvdqu)

2. **Open the SQL Editor**
   - Click on the "SQL Editor" tab in the left sidebar
   - Click on "New Query" to create a new SQL query

3. **Create the Table**
   - Copy and paste the contents from `create_government_simple.sql` file
   - Click "Run" to execute the script
   - This will create the table and add the first 5 ministries

4. **Add Remaining Ministries**
   - Create another new query
   - Copy and paste the contents from `add-remaining-ministries.sql` file
   - Click "Run" to execute the script
   - This will add the remaining 13 ministries to the table

5. **Verify the Table Creation**
   - Run the test script using Node.js:
     ```
     node test-government.js
     ```
   - This should return information about all the ministries in your database
   - You should see "Total ministries in database: 18" in the output

## Option 2: Using Supabase Migrations (For Development)

If you have the Supabase CLI set up and linked to your project:

1. **Apply the migration**

   ```bash
   npx supabase db push
   ```

2. **Verify the migration**

   ```bash
   node test-government.js
   ```

## Table Structure

The `government` table contains the following fields:

| Field         | Type        | Description                           |
|---------------|-------------|---------------------------------------|
| id            | uuid        | Primary key, auto-generated           |
| name          | text        | Ministry name in Dhivehi              |
| name_en       | text        | Ministry name in English              |
| slug          | text        | URL-friendly unique identifier        |
| collection_id | text        | External collection reference         |
| item_id       | text        | External item reference               |
| archived      | boolean     | Whether the ministry is archived      |
| draft         | boolean     | Whether the ministry is in draft mode |
| created_at    | timestamptz | Creation timestamp                    |
| updated_at    | timestamptz | Last update timestamp                 |
| published_at  | timestamptz | When the ministry was published       |

## Row-Level Security (RLS)

The table has Row-Level Security enabled with the following policies:

1. **Public read access**: Anyone can read ministries that are:
   - Not archived
   - Published
   - Have a published date in the past

2. **Admin write access**: Admin users can perform all operations on the table.

## Using the Table in Your Application

```javascript
// Example: Fetch all published ministries
const { data, error } = await supabase
  .from('government')
  .select('*')
  .eq('archived', false)
  .not('published_at', 'is', null)
  .lte('published_at', new Date().toISOString());

// Example: Get a ministry by slug
const { data, error } = await supabase
  .from('government')
  .select('*')
  .eq('slug', 'ministree-of-helth')
  .single();
```
