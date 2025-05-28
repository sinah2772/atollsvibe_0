// This file checks the Supabase configuration and helps diagnose connection issues

import { supabase } from '../lib/supabase';

const checkSupabaseConfig = async () => {
  console.log('Checking Supabase Configuration...');
  
  // Check if we have the required environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment Variables:');
  console.log('- VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.log('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.log('Please ensure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined.');
    return;
  }

  try {
    // Check if we can connect to Supabase
    console.log('\nTesting Supabase connection...');
    const { data, error } = await supabase.from('atolls').select('count()');
    
    if (error) {
      console.error('❌ Error connecting to Supabase:', error);
      if (error.message.includes('not found') || error.code === 'PGRST116') {
        console.log('\nThe atolls table might not exist. You need to:');
        console.log('1. Create the table using the migration script');
        console.log('2. Or run the setupAtolls.ts utility to create sample data');
      } else {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check that your Supabase project is running');
        console.log('2. Verify your API URL and anon key are correct');
        console.log('3. Ensure you have proper network connectivity to Supabase');
      }    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log(`Found ${data?.[0]?.count || 0} records in the atolls table.`);
      
      if (!data?.[0]?.count || data[0].count === 0) {
        console.log('\nThe atolls table exists but is empty. You should populate it with data.');
      }
    }
    
    // Try to get schema information
    console.log('\nChecking database schema...');
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    
    if (tablesError) {
      console.error('❌ Could not retrieve schema information:', tablesError);
    } else {
      console.log('Tables in the database:');
      if (Array.isArray(tables)) {
        tables.forEach(table => {
          console.log(`- ${table}`);
        });
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error during Supabase check:', err);
  }
};

// Run the check when this module is executed directly
checkSupabaseConfig();

// Export for potential use in other scripts
export { checkSupabaseConfig };
