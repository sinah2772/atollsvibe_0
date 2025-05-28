// Script to verify and test the Government table

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your_supabase_url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

if (!supabaseUrl || supabaseUrl === 'your_supabase_url' || 
    !supabaseKey || supabaseKey === 'your_supabase_anon_key') {
  console.error('❌ Missing or invalid Supabase credentials in environment variables');
  console.error('Please ensure your .env file contains valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGovernmentTable() {
  console.log('Testing connection to government table...');
  
  try {
    // Test fetching government data
    const { data, error } = await supabase
      .from('government')
      .select('*')
      .limit(5);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully fetched government data:');
    console.log(`Found ${data?.length || 0} ministries`);
    
    if (data?.length) {
      // Show sample ministry data
      console.log('\nSample ministry data:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Count total ministries
      const { data: countData, error: countError } = await supabase
        .from('government')
        .select('count', { count: 'exact' });
        
      if (countError) {
        console.error('❌ Error counting ministries:', countError);
      } else {
        console.log(`\nTotal ministries in database: ${countData[0].count}`);
      }
      
      // Test filtering
      console.log('\nTesting filtering by name...');
      const searchTerm = 'Health';
      const { data: filterData, error: filterError } = await supabase
        .from('government')
        .select('*')
        .ilike('name_en', `%${searchTerm}%`);
        
      if (filterError) {
        console.error(`❌ Error filtering ministries by "${searchTerm}":`, filterError);
      } else {
        console.log(`Found ${filterData.length} ministries matching "${searchTerm}"`);
        filterData.forEach(ministry => {
          console.log(`- ${ministry.name_en} (${ministry.name})`);
        });
      }
    }  } catch (err) {
    console.error('❌ Error testing government table:', err);
    
    // If the table doesn't exist, show migration instructions
    if (err.message?.includes('relation "government" does not exist') || 
        err.message?.includes('relation "public.government" does not exist')) {
      console.log('\n🔧 The government table does not exist yet. To create it:');
      console.log('\n📝 Option 1: Using the Supabase Dashboard (Recommended)');
      console.log('1. Log in to your Supabase Dashboard at https://app.supabase.com/');
      console.log('2. Open the SQL Editor');
      console.log('3. Run the create_government_simple.sql script:');
      
      try {
        const sqlPath = path.join(__dirname, 'create_government_simple.sql');
        if (fs.existsSync(sqlPath)) {
          console.log('\n--- SQL Script Preview (First few lines) ---');
          const sqlContent = fs.readFileSync(sqlPath, 'utf8');
          const previewLines = sqlContent.split('\n').slice(0, 8);
          console.log(previewLines.join('\n') + '\n...\n');
          console.log('Full script available in: create_government_simple.sql');
        }
      } catch (e) {
        // Ignore errors reading the SQL file
      }
      
      console.log('\n📝 Option 2: Using Supabase CLI');
      console.log('1. Apply the migration file: npx supabase db push');
      
      console.log('\n📚 For detailed instructions, see: GOVERNMENT-TABLE-SETUP.md');
    }
  }
}

testGovernmentTable();
