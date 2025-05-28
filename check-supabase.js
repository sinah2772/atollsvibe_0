// Simple script to check Supabase connection
// This uses ES modules which Node.js supports natively

// Import required libraries
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env file manually
const dotenvPath = path.resolve(__dirname, '.env');
try {
  const envContent = fs.readFileSync(dotenvPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
    }
    return acc;
  }, {});
  
  // Set environment variables
  Object.keys(envVars).forEach(key => {
    process.env[key] = envVars[key];
  });
  
  console.log("Loaded environment variables from .env file");
} catch (error) {
  console.warn("Could not load .env file:", error.message);
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('==========================================');
console.log('Atollsvibe Supabase Connection Diagnostic');
console.log('==========================================');

console.log('Environment Variables:');
console.log('- VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Please ensure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check database connection
async function checkConnection() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Try to fetch data from atolls table without using aggregate functions
    const { data: atollsData, error: atollsError } = await supabase
      .from('atolls')
      .select('id')
      .limit(1);
    
    if (atollsError) {
      console.error('❌ Error connecting to atolls table:', atollsError);
      
      if (atollsError.message.includes('not found') || atollsError.code === 'PGRST116') {
        console.log('\nThe atolls table might not exist. You need to:');
        console.log('1. Create the table using the migration script');
        console.log('2. Or run a setup utility to create sample data');
      } else {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check that your Supabase project is running');
        console.log('2. Verify your API URL and anon key are correct');
        console.log('3. Ensure you have proper network connectivity to Supabase');
      }
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log(`The atolls table exists ${Array.isArray(atollsData) && atollsData.length > 0 ? 'and has data' : 'but might be empty'}.`);
    }
    
    // List available tables by attempting to access known tables
    console.log('\nChecking for known tables...');
    
    const tables = ['atolls', 'islands', 'government', 'articles', 'categories', 'subcategories'];
    const tableResults = {};
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      tableResults[table] = !error;
    }
    
    console.log('Tables found:');
    for (const [table, exists] of Object.entries(tableResults)) {
      console.log(`- ${table}: ${exists ? '✓ exists' : '✗ not found or not accessible'}`);
    }
    
    // Check articles table
    console.log('\nChecking articles table...');
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('id')
      .limit(5);
      
    if (articlesError) {
      console.error('❌ Error accessing articles table:', articlesError);
    } else {
      console.log('✅ Successfully connected to articles table!');
      console.log(`The table exists ${Array.isArray(articlesData) && articlesData.length > 0 ? 'and contains data' : 'but might be empty'}.`);
      if (Array.isArray(articlesData) && articlesData.length > 0) {
        console.log(`Found at least ${articlesData.length} article(s).`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during check:', error);
  }
}

// Run the check
checkConnection();
