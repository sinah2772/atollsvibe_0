// Script to add remaining ministries to the government table
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addRemainingMinistries() {
  try {
    console.log('Adding remaining ministries to the government table...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-remaining-ministries.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      if (error.message.includes('PGRST202')) {
        console.log('\nThe exec_sql RPC function is not available on this Supabase instance.');
        console.log('Please run the SQL manually in the Supabase SQL Editor:');
        console.log('1. Go to your Supabase Dashboard: https://app.supabase.com/project/_/sql');
        console.log('2. Create a new query and paste the content from add-remaining-ministries.sql');
        console.log('3. Run the query');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Successfully added remaining ministries to the government table!');
    }
    
    // Verify the data
    console.log('Verifying data...');
    const { data, error: countError } = await supabase
      .from('government')
      .select('count', { count: 'exact' });
      
    if (countError) {
      console.error('❌ Error counting ministries:', countError);
    } else {
      console.log(`\nTotal ministries in database: ${data[0].count}`);
    }
    
  } catch (err) {
    console.error('❌ Error adding ministries:', err);
    console.log('\nPlease add the ministries manually using the SQL file:');
    console.log('1. Go to your Supabase Dashboard: https://app.supabase.com/project/_/sql');
    console.log('2. Create a new query and paste the content from add-remaining-ministries.sql');
    console.log('3. Run the query');
  }
}

addRemainingMinistries();
