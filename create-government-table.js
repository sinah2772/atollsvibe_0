// Script to create the Government table through Supabase client
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
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

async function createGovernmentTable() {
  console.log('Creating Government table in Supabase...');
  
  // Create the government table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS government (
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

    -- Enable RLS
    ALTER TABLE government ENABLE ROW LEVEL SECURITY;
  `;

  try {
    console.log('Executing SQL to create government table...');
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Error creating government table:', error);
      
      // Check if rpc function doesn't exist
      if (error.message.includes('PGRST202')) {
        console.log('\nAlternative method: Using raw SQL via REST API is not available.');
        console.log('Please create the table manually using the SQL file:');
        console.log('- Navigate to your Supabase dashboard > SQL Editor');
        console.log('- Load and run the file: supabase/migrations/20250525135000_government_table.sql');
        return;
      }
      throw error;
    }
    
    console.log('✅ Successfully created government table! Adding data...');
    
    // Insert data from the CSV
    const insertDataSQL = `
      INSERT INTO government (name, name_en, slug, collection_id, item_id, archived, draft, created_at, updated_at, published_at)
      VALUES
        ('މިނިސްޓްރީ އޮފް ފޮރިން އެފެއާޒް', 'Ministry of Foreign Affairs', 'ministree-of-forin-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0426b', false, false, '2022-10-10 19:14:51 UTC', '2022-10-10 19:14:51 UTC', '2024-08-25 10:55:54 UTC'),
        ('މިނިސްޓްރީ އޮފް ޑިފެންސް', 'Ministry of Defence', 'ministree-of-difens', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423d', false, false, '2022-10-10 19:15:29 UTC', '2022-10-10 19:16:44 UTC', '2024-08-25 10:55:54 UTC'),
        ('މިނިސްޓްރީ އޮފް އެޑިޔުކޭޝަން', 'Ministry of Education', 'ministree-of-ediyukeyshan', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b0423c', false, false, '2022-10-10 19:20:08 UTC', '2022-10-10 19:20:08 UTC', '2024-08-25 10:55:54 UTC'),
        ('މިނިސްޓްރީ އޮފް ހޯމް އެފެއާޒް', 'Ministry of Home Affairs', 'ministree-of-hoam-efe-aaz', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04265', false, false, '2022-10-10 19:21:47 UTC', '2022-10-10 19:21:47 UTC', '2024-08-25 10:55:54 UTC'),
        ('މިނިސްޓްރީ އޮފް ފިނޭންސް', 'Ministry of Finance', 'ministree-of-fineyns', '657ec63a7aaf05e4e6b040ec', '657ec63a7aaf05e4e6b04268', false, false, '2022-10-10 19:22:08 UTC', '2022-10-10 19:22:08 UTC', '2024-08-25 10:55:54 UTC')
      ON CONFLICT (slug) DO NOTHING;
    `;
    
    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertDataSQL });
    
    if (insertError) {
      console.error('❌ Error inserting government data:', insertError);
      throw insertError;
    }
    
    console.log('✅ Successfully inserted government data.');
    
    // Verify the data was inserted
    console.log('Verifying data...');
    const { data, error: selectError } = await supabase
      .from('government')
      .select('*')
      .limit(2);
    
    if (selectError) {
      console.error('❌ Error verifying government data:', selectError);
      throw selectError;
    }
    
    console.log('✅ Government table created and data inserted successfully!');
    console.log(`Found ${data?.length || 0} ministries.`);
    
    if (data?.length > 0) {
      console.log('\nSample data:');
      console.log(JSON.stringify(data[0], null, 2));
    }
    
  } catch (err) {
    console.error('❌ Error during process:', err);
    console.log('\nPlease create the table manually using the SQL file:');
    console.log('- Navigate to your Supabase dashboard > SQL Editor');
    console.log('- Load and run the file: supabase/migrations/20250525135000_government_table.sql');
  }
}

createGovernmentTable();
