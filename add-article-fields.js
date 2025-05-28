// Script to add missing fields to the articles table
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
  process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addMissingFields() {
  console.log('Adding missing fields to the articles table...');
  
  // Fields we want to add
  const fieldsToAdd = [
    { name: 'is_breaking', type: 'boolean', default: false },
    { name: 'is_featured', type: 'boolean', default: false },
    { name: 'is_developing', type: 'boolean', default: false },
    { name: 'is_exclusive', type: 'boolean', default: false },
    { name: 'is_sponsored', type: 'boolean', default: false },
    { name: 'sponsored_by', type: 'text', default: null },
    { name: 'sponsored_url', type: 'text', default: null }
  ];
  
  try {
    // First, let's verify which fields already exist
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .limit(1);
      
    if (articleError) {
      throw articleError;
    }
    
    const existingFields = articleData && articleData.length > 0 
      ? Object.keys(articleData[0]) 
      : [];
      
    console.log('Existing fields:', existingFields);
    
    // Filter out fields that already exist
    const fieldsToActuallyAdd = fieldsToAdd.filter(field => 
      !existingFields.includes(field.name)
    );
    
    if (fieldsToActuallyAdd.length === 0) {
      console.log('All fields already exist. No changes needed.');
      return;
    }
    
    console.log('Fields to add:', fieldsToActuallyAdd.map(f => f.name).join(', '));
    
    // In Supabase, we need to use raw SQL to alter tables
    // This requires admin privileges - let's try with RLS disabled first
    
    for (const field of fieldsToActuallyAdd) {
      const defaultValue = field.default === null 
        ? 'NULL' 
        : typeof field.default === 'boolean'
          ? field.default.toString()
          : `'${field.default}'`;
          
      const sqlQuery = `
        ALTER TABLE public.articles
        ADD COLUMN IF NOT EXISTS ${field.name} ${field.type} DEFAULT ${defaultValue};
      `;
      
      try {
        console.log(`Adding ${field.name} (${field.type}) to articles table...`);
        
        // Using a different approach with Supabase functions if available
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'run_sql_query', 
          { query: sqlQuery }
        );
        
        if (rpcError) {
          console.error(`❌ Error adding ${field.name} using RPC:`, rpcError);
          console.log('This likely means your account doesn\'t have admin privileges.');
          console.log('Please add these columns manually in the Supabase dashboard SQL editor:');
          console.log(sqlQuery);
        } else {
          console.log(`✅ Successfully added ${field.name} field!`);
        }
      } catch (fieldError) {
        console.error(`❌ Error adding ${field.name}:`, fieldError);
      }
    }
    
    // Try to verify the changes
    console.log('\nVerifying changes...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('articles')
      .select('*')
      .limit(1);
      
    if (verifyError) {
      console.error('❌ Error verifying changes:', verifyError);
    } else {
      const updatedFields = verifyData && verifyData.length > 0 
        ? Object.keys(verifyData[0]) 
        : [];
        
      console.log('Fields after modification:');
      console.log(updatedFields);
      
      // Check which fields were successfully added
      const successfullyAdded = fieldsToActuallyAdd.filter(field => 
        updatedFields.includes(field.name)
      ).map(f => f.name);
      
      if (successfullyAdded.length > 0) {
        console.log('\n✅ Successfully added fields:', successfullyAdded.join(', '));
      } else {
        console.log('\n❌ No fields were added. Please add them manually.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating database schema:', error);
    console.log('\nPlease use the Supabase dashboard SQL editor to add these fields:');
    
    fieldsToAdd.forEach(field => {
      const defaultValue = field.default === null 
        ? 'NULL' 
        : typeof field.default === 'boolean'
          ? field.default.toString()
          : `'${field.default}'`;
          
      console.log(`ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ${field.name} ${field.type} DEFAULT ${defaultValue};`);
    });
  }
}

// Generate migration SQL for manual execution
function generateMigrationSQL() {
  console.log('\n====== SQL Migration Script ======');
  console.log('-- Add missing fields to articles table');
  
  const fieldsToAdd = [
    { name: 'is_breaking', type: 'boolean', default: false },
    { name: 'is_featured', type: 'boolean', default: false },
    { name: 'is_developing', type: 'boolean', default: false },
    { name: 'is_exclusive', type: 'boolean', default: false },
    { name: 'is_sponsored', type: 'boolean', default: false },
    { name: 'sponsored_by', type: 'text', default: null },
    { name: 'sponsored_url', type: 'text', default: null }
  ];
  
  fieldsToAdd.forEach(field => {
    const defaultValue = field.default === null 
      ? 'NULL' 
      : typeof field.default === 'boolean'
        ? field.default.toString()
        : `'${field.default}'`;
        
    console.log(`ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ${field.name} ${field.type} DEFAULT ${defaultValue};`);
  });
  
  console.log('\n-- Example update queries to set values for existing articles');
  console.log("UPDATE public.articles SET is_breaking = true WHERE id = 'your-article-id';");
  console.log("UPDATE public.articles SET is_featured = true WHERE id = 'your-article-id';");
  
  console.log('\n=================================');
}

// Run our function and generate the SQL
(async () => {
  await addMissingFields();
  generateMigrationSQL();
})();
