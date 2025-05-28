// filepath: e:\Atolls_mv\atolslvibe\New\atollsvibe-main\atollsvibe-main\project\apply-government-migration.js
// Script to apply the government migration directly via REST API and SQL queries
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyGovernmentMigration() {
  console.log('Applying government table migration to Supabase...');
  try {
    // 1. Check if table exists
    console.log('Checking if government table already exists...');
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'government')
      .eq('table_schema', 'public');
      
    if (tablesError) {
      console.error('❌ Error checking for government table:', tablesError);
      // Continue anyway - might not have permissions on information_schema
    } else {
      if (tablesData?.length > 0) {
        console.log('Table already exists. Skipping creation.');
        return;
      }
    }
    
    // 2. Create the government table with basic structure
    console.log('Creating government table...');
    
    // We'll break down the SQL into smaller parts that can be executed individually
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.government (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        name_en text,
        slug text UNIQUE NOT NULL,
        collection_id text,
        item_id text,
        archived boolean DEFAULT false,
        draft boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        published_at timestamptz
      );
    `;
    
    // We need to use raw queries directly against the database or a specific API endpoint
    // Since we don't have a direct way to run arbitrary SQL, we'll use the REST API storage method
    // to create a SQL file that we can then execute from the Supabase dashboard

    console.log('\nTable creation SQL script ready. Please follow these steps:');
    console.log('1. Go to your Supabase Dashboard: https://app.supabase.com/project/_/sql');
    console.log('2. Create a new SQL query and paste this content:');
    console.log('\n=========== SQL TO CREATE GOVERNMENT TABLE ==========');
    console.log(fs.readFileSync(path.join(__dirname, 'supabase/migrations/20250525135000_government_table.sql'), 'utf8'));
    console.log('==================================================');
    console.log('\nAfter running the SQL, run the test script to verify:');
    console.log('node test-government.js');
    
  } catch (err) {
    console.error('❌ Error applying government table migration:', err);
  }
}

applyGovernmentMigration();
