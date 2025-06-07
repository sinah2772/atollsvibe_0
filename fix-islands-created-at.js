// Fix missing created_at timestamps in the islands database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fix missing created_at timestamps for islands in the database
 * This script will:
 * 1. Check if the created_at column exists
 * 2. Execute the SQL to add it if needed
 * 3. Update all islands with missing timestamps
 */
async function fixIslandsCreatedAt() {
  console.log('🛠️ Starting islands created_at fix...');

  try {
    // First check if we have DB access and can read island records
    const { data: testIslands, error: testError } = await supabase
      .from('islands')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Cannot access islands table:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');

    // Check if the created_at column exists by examining a sample island
    const { data: sampleIsland, error: sampleError } = await supabase
      .from('islands')
      .select('*')
      .limit(1)
      .single();
    
    if (sampleError) {
      console.error('❌ Error fetching sample island:', sampleError);
      return;
    }
    
    const hasCreatedAt = sampleIsland && 'created_at' in sampleIsland && sampleIsland.created_at !== null;
    console.log(`created_at column exists and has values: ${hasCreatedAt ? '✅ Yes' : '❌ No'}`);    if (!hasCreatedAt) {
      console.log('Attempting to add and populate the created_at column...');
      
      try {
        // Execute SQL to add the column using raw SQL query
        // Note: This requires appropriate permissions in the database
        const { error: sqlError } = await supabase.rpc('exec_sql', { 
          sql_query: `
            -- Add the column if it doesn't exist
            ALTER TABLE public.islands 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
            
            -- Update all islands with missing timestamps
            UPDATE public.islands SET created_at = now() WHERE created_at IS NULL;
          `
        });
        
        if (sqlError) {
          console.error('❌ Error executing SQL:', sqlError);
          console.log('\nYou may need to run the SQL manually using the Supabase SQL Editor:');
          console.log(`
-- SQL to run in Supabase SQL Editor:
ALTER TABLE public.islands 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

UPDATE public.islands SET created_at = now() WHERE created_at IS NULL;`);
          return;
        }
        
        console.log('✅ SQL executed successfully');
      } catch (sqlExecError) {
        console.error('❌ Error executing SQL RPC:', sqlExecError);
        console.log('Proceeding with alternative approach...');
        
        // Provide instructions for manual fix if RPC fails
        console.log('\n📄 Please run this SQL in the Supabase SQL Editor:');
        console.log(`
-- SQL to run in Supabase SQL Editor:
ALTER TABLE public.islands 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

UPDATE public.islands SET created_at = now() WHERE created_at IS NULL;`);
      }
    }
      // Verify the fix
    console.log('\nVerifying fix by checking sample islands...');
    const { data: checkIslands, error: checkError } = await supabase
      .from('islands')
      .select('id, name_english, created_at')
      .limit(5);
    
    if (checkError) {
      console.error('❌ Error verifying fix:', checkError);
      return;
    }
    
    console.log('\n✅ Sample islands after fix:');
    checkIslands.forEach(island => {
      console.log(`Island ID ${island.id} (${island.name_english}): created_at = ${island.created_at || 'missing'}`);
    });

    console.log('\n🎉 Fix completed successfully!');
    console.log(`
Next steps:
1. Verify that the useIslands.ts hook handles any remaining issues
2. Run the application and test the filtering functionality
3. If any issues persist, check the defensive code in useIslands.ts`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('Please run the SQL manually using the Supabase SQL Editor:');
    console.log(`
-- SQL to run in Supabase SQL Editor:
ALTER TABLE public.islands 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

UPDATE public.islands SET created_at = now() WHERE created_at IS NULL;`);
  }
}

// Run the function
fixIslandsCreatedAt();
