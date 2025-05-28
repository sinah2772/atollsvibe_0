// Script to check for all tables in Supabase database
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const dotenvPath = path.resolve(__dirname, '.env');
try {
  const envContent = fs.readFileSync(dotenvPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
    }
    return acc;
  }, {});
  
  Object.keys(envVars).forEach(key => {
    process.env[key] = envVars[key];
  });
  
  console.log("Loaded environment variables from .env file");
} catch (error) {
  console.warn("Could not load .env file:", error.message);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Checking for all tables in Supabase...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// List of potential table names to check
const tablesToCheck = [
  'articles', 
  'news_articles', 
  'news', 
  'posts',
  'blog_posts',
  'blog_articles',
  'content',
  'stories',
  'atolls',
  'categories',
  'subcategories',
  'islands',
  'users',
  'comments'
];

async function checkTables() {
  console.log('Checking for possible article tables...');
  
  const results = {};
  
  // Check each table possibility
  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (!error) {
        results[tableName] = {
          exists: true,
          hasData: data?.length > 0,
          sample: data?.length > 0 ? data[0] : null
        };
        console.log(`✅ Found table: ${tableName}`);
      } else {
        results[tableName] = {
          exists: false,
          error: error.message
        };
      }
    } catch (err) {
      results[tableName] = {
        exists: false,
        error: err.message
      };
    }
  }
  
  console.log('\nDetailed Results:');
  console.log('=================\n');
  
  // Display detailed results for tables that exist
  for (const [tableName, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`Table: ${tableName}`);
      console.log(`Has data: ${result.hasData ? 'Yes' : 'No'}`);        if (result.hasData && result.sample) {
        console.log('Sample record structure:');
        // Print column names only to avoid large output
        console.log(Object.keys(result.sample));
        
        // For articles table specifically, show more details
        if (tableName === 'articles' || tableName === 'news_articles' || tableName === 'posts') {
          console.log('\nDetailed sample:');
          console.log(JSON.stringify(result.sample, null, 2));
          
          // Check for specific fields we're interested in
          console.log('\nChecking for special fields:');
          const checkFields = ['is_breaking', 'is_featured', 'is_developing', 'is_exclusive', 'is_sponsored'];
          checkFields.forEach(field => {
            const exists = field in result.sample;
            console.log(`- ${field}: ${exists ? 'Present' : 'Missing'}`);
          });
        }
      }
      
      console.log('\n---\n');
    }
  }
  
  // Check if we found any article-like tables
  const articleTables = Object.entries(results)
    .filter(([name, result]) => result.exists && 
           (name.includes('article') || name.includes('post') || name === 'content' || name === 'stories'))
    .map(([name]) => name);
  
  if (articleTables.length > 0) {
    console.log(`\nPotential article tables found: ${articleTables.join(', ')}`);
  } else {
    console.log('\nNo article tables found. You may need to create one.');
  }
}

checkTables();
