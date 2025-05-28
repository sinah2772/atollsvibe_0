# Atolls Database Setup Guide

This guide helps you set up and troubleshoot the atolls database tables needed for the Atollsvibe application.

## Understanding the Issue

If you're seeing "No items found Atolls" or related errors, it's likely because:

1. The `atolls` table doesn't exist in your Supabase database
2. The table exists but contains no data
3. There's a connection issue to the Supabase database

## Quick Fix Options

### Option 1: Use the Migration Script (Recommended)

1. Make sure your Supabase project is running
2. Apply the migration:

```bash
cd project
npx supabase db push
```

This will create the atolls table and populate it with data.

### Option 2: Use the Setup Utility

If you can't run the migration directly, you can run the setup utility:

```bash
cd project
node supabase-check.js --populate
```

This will check your connection and try to populate the atolls table with sample data.

### Option 3: Ensure the Fallback Works

The application includes a fallback mechanism that provides basic atoll data when the database isn't available. You should see an amber warning when this is happening.

## Diagnosing Connection Issues

Run the diagnostic tool:

```bash
cd project
node supabase-check.js
```

This will:

1. Check if your environment variables are set
2. Test the connection to Supabase
3. Verify if the atolls table exists
4. Report any errors encountered

## Setting Up Environment Variables

Create a `.env` file in the `/project` directory with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase URL and anonymous key from your Supabase project dashboard.

## Manual Table Creation

If you need to create the atolls table manually, use this SQL in the Supabase SQL editor:

```sql
-- Create the atolls table
CREATE TABLE IF NOT EXISTS public.atolls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL, -- Dhivehi name
  name_en VARCHAR(255) NOT NULL, -- English name
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  island_reference VARCHAR(255) NULL,
  island_reference_dv VARCHAR(255) NULL,
  island_category VARCHAR(255) NULL,
  island_category_en VARCHAR(255) NULL
);

-- Example insertion for one atoll
INSERT INTO public.atolls (name, name_en, slug)
VALUES ('ހއ', 'Ha Alif', 'ha-alif');
```

## Need More Help?

Check the error message displayed in the UI or browser console for specific details about what's going wrong with the atolls data.
