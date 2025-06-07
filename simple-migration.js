// A simplified script to run the migration SQL directly on the database

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createSqlExecFunction() {
  console.log('Creating SQL execution function...');
  
  try {
    // Check if function exists
    const { error } = await supabase.rpc('exec', { 
      query_string: 'SELECT 1' 
    }).single();
    
    if (!error) {
      console.log('SQL execution function already exists');
      return true;
    }
    
    if (error && !error.message.includes('does not exist')) {
      console.error('Error checking exec function:', error);
      return false;
    }
    
    // Create the function using SQL query
    const { data, error: sqlError } = await supabase
      .from('islands')  // Just using any table to run SQL
      .select('*')
      .limit(1)
      .then(async () => {
        // We're using a separate fetch because Supabase JS client doesn't support raw SQL directly
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query_string: `
              CREATE OR REPLACE FUNCTION exec(query_string text)
              RETURNS VOID AS
              $$
              BEGIN
                EXECUTE query_string;
              END;
              $$
              LANGUAGE plpgsql SECURITY DEFINER;
            `
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          return { error: errorData };
        }
        
        return { data: true };
      });
      
    if (sqlError) {
      console.error('Failed to create exec function:', sqlError);
      return false;
    }
    
    console.log('SQL execution function created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating SQL exec function:', error);
    return false;
  }
}

async function executeSQL(sql) {
  console.log('Processing SQL...');
  
  // Split SQL on semicolons, but respect DO blocks and other complex SQL structures
  // This is a more sophisticated approach to handle DO blocks and other complex SQL statements
  const statements = [];
  let currentStatement = '';
  let inBlock = false;
  let blockDepth = 0;
  
  // Split by lines for easier processing
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comments
    if (trimmedLine.startsWith('--')) {
      continue;
    }
    
    // Track block statements
    if (trimmedLine.includes('$$') || trimmedLine.includes('BEGIN') || trimmedLine.includes('END')) {
      if (trimmedLine.includes('$$')) {
        inBlock = !inBlock;
      }
      
      if (trimmedLine.toUpperCase().includes('BEGIN')) {
        blockDepth++;
      }
      
      if (trimmedLine.toUpperCase().includes('END')) {
        blockDepth--;
      }
    }
    
    // Add line to current statement
    currentStatement += line + '\n';
    
    // Check for statement end
    if (trimmedLine.endsWith(';') && !inBlock && blockDepth <= 0) {
      if (currentStatement.trim().length > 0) {
        statements.push(currentStatement.trim());
      }
      currentStatement = '';
    }
  }
  
  // Add final statement if there is one
  if (currentStatement.trim().length > 0) {
    statements.push(currentStatement.trim());
  }
  
  console.log(`Executing ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      console.log(`Executing statement ${i+1}/${statements.length}`);
      
      const { error } = await supabase.rpc('exec', {
        query_string: statement
      });
      
      if (error) {
        console.error(`SQL execution error in statement ${i+1}:`, error);
        // Log a portion of the statement for debugging
        console.error('Statement preview:', statement.substring(0, 100) + '...');
      } else {
        console.log(`Statement ${i+1} executed successfully`);
      }
    } catch (error) {
      console.error(`Error executing statement ${i+1}:`, error);
      console.error('Statement preview:', statement.substring(0, 100) + '...');
    }
  }
}

async function runMigration() {
  try {
    console.log('Starting island categories migration...');
    
    // Create SQL execution function if needed
    await createSqlExecFunction();
    
    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'islands_rows_rpc.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('SQL file read successfully');
    
    // Execute SQL
    await executeSQL(sql);
    
    console.log('Migration completed!');
    
    // Check results
    const { data: categories } = await supabase.from('island_categories').select('count(*) as count').single();
    const { data: mappedIslands } = await supabase.from('islands').select('count(*) as count').not('island_categories_id', 'is', null).single();
    
    console.log('Results:');
    console.log(`- Categories created: ${categories?.count || 0}`);
    console.log(`- Islands mapped: ${mappedIslands?.count || 0}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
