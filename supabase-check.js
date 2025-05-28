// Script to check Supabase connection and atolls table

import { checkSupabaseConfig } from './src/utils/checkSupabase.ts';
import { populateAtolls } from './src/utils/setupAtolls.ts';

// Parse command line arguments
const args = process.argv.slice(2);
const shouldPopulate = args.includes('--populate') || args.includes('-p');

// First check the configuration
(async () => {
  console.log('==========================================');
  console.log('Atollsvibe Supabase Connection Diagnostic');
  console.log('==========================================');
  
  await checkSupabaseConfig();
  
  if (shouldPopulate) {
    console.log('\n==========================================');
    console.log('Populating Atolls Table with Sample Data');
    console.log('==========================================');
    
    await populateAtolls();
  }
  
  console.log('\nDone! If you had connection issues, please check:');
  console.log('1. .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.log('2. Your Supabase project is online and accessible');
  console.log('3. The atolls table exists in your database');
  console.log('\nTo populate the atolls table with sample data, run:');
  console.log('node supabase-check.js --populate');
})();
