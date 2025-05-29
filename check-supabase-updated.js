// Updated script to check Supabase connection without aggregates
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use dotenv package to load environment variables
import dotenv from 'dotenv';
const dotenvPath = path.resolve(__dirname, '.env');
try {
  console.log('Loading environment variables from:', dotenvPath);
  const result = dotenv.config({ path: dotenvPath });
  
  if (result.error) {
    throw result.error;
  }
  
  console.log("Successfully loaded environment variables");
  console.log("Found keys:", Object.keys(result.parsed || {}));
} catch (error) {
  console.error("Could not load .env file:", error);
}

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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Try to fetch data from atolls table with a limit instead of count
    const { data: atollsData, error: atollsError } = await supabase
      .from('atolls')
      .select('*')
      .limit(5);
    
    if (atollsError) {
      console.error('❌ Error connecting to atolls table:', atollsError);
      
      if (atollsError.message.includes('not found') || atollsError.code === 'PGRST116') {
        console.log('\nThe atolls table might not exist. You need to create it.');
      } else {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check that your Supabase project is running');
        console.log('2. Verify your API URL and anon key are correct');
        console.log('3. Ensure you have proper network connectivity to Supabase');
      }
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log(`Found ${atollsData?.length || 0} records in the atolls table (limited to 5).`);
      
      if (atollsData?.length > 0) {
        console.log('\nSample atoll data:');
        console.log(JSON.stringify(atollsData[0], null, 2));
      } else {
        console.log('\nThe atolls table exists but is empty. You should populate it with data.');
      }
    }
    
    // Check news_articles table without using aggregates
    console.log('\nChecking news_articles table...');
    const { data: articlesData, error: articlesError } = await supabase
      .from('news_articles')
      .select('*')
      .limit(5);
      
    if (articlesError) {
      console.error('❌ Error accessing news_articles table:', articlesError);
    } else {
      console.log('✅ Successfully connected to news_articles table!');
      console.log(`Found ${articlesData?.length || 0} articles in the table (limited to 5).`);
      
      if (articlesData?.length > 0) {
        console.log('\nSample article data (limited fields):');
        if (articlesData[0]) {
          const { content, ...rest } = articlesData[0];
          console.log(JSON.stringify({
            ...rest,
            content: content ? '(content object present)' : null
          }, null, 2));
        }
      }
    }
    
    // Try to list tables in the public schema using a different approach
    console.log('\nTrying to list tables in the database...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename, schemaname')
      .eq('schemaname', 'public');

    if (schemaError) {
      console.error('❌ Could not access database schema information:', schemaError);
      console.log('Note: This might be due to restricted RLS (Row Level Security) policies.');
    } else if (schemaData) {
      console.log('Tables found:');
      schemaData.forEach(table => {
        console.log(`- ${table.tablename}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during check:', error);
  }
}

checkConnection();
