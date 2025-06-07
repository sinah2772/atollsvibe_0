// Script to migrate island categories using Supabase REST API
// Uses the public Supabase API instead of direct PostgreSQL connection

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exit } from 'process';

// Load environment variables
dotenv.config();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Log file path
const logPath = join(__dirname, 'migration-log-supabase.txt');

/**
 * Write log to file and console
 */
function writeLog(message) {
  try {
    fs.appendFileSync(logPath, message + '\n');
    console.log(message);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

/**
 * Execute SQL statements separated by semicolons
 */
async function executeSqlStatements(sql) {
  try {
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    writeLog(`Found ${statements.length} SQL statements to execute`);
    let successCount = 0;
    
    // Execute each statement - we'll use RPC to execute custom SQL
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        writeLog(`Executing statement ${i+1}/${statements.length}...`);
        
        // Use the Supabase stored procedure to execute SQL
        // This assumes you've created the sql_exec function in your database
        const { data, error } = await supabase.rpc('exec', {
          query_string: stmt
        });
        
        if (error) {
          writeLog(`Error executing statement ${i+1}: ${error.message}`);
          continue;
        }
        
        writeLog(`Statement ${i+1} executed successfully`);
        successCount++;
      } catch (stmtError) {
        writeLog(`Error executing statement ${i+1}: ${stmtError.message}`);
      }
    }
    
    return {
      success: true,
      totalStatements: statements.length,
      successfulStatements: successCount
    };
  } catch (error) {
    writeLog(`Error executing SQL: ${error.message}`);
    return { success: false, error };
  }
}

/**
 * Check if SQL exec function exists
 */
async function checkSqlExecFunction() {
  try {
    // Check if the exec function exists
    const { error } = await supabase.rpc('exec', {
      query_string: 'SELECT 1;'
    });
    
    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        writeLog('SQL exec function does not exist in the database');
        return false;
      }
      
      writeLog(`Error checking exec function: ${error.message}`);
      return false;
    }
    
    writeLog('SQL exec function exists');
    return true;
  } catch (err) {
    writeLog(`Error checking exec function: ${err.message}`);
    return false;
  }
}

/**
 * Create SQL exec function
 */
async function createSqlExecFunction() {
  try {
    writeLog('Creating SQL exec function...');
    
    // Use raw HTTP request since we can't use the function that doesn't exist yet
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to create SQL exec function');
    }
    
    writeLog('SQL exec function created successfully');
    return true;
  } catch (err) {
    writeLog(`Error creating SQL exec function: ${err.message}`);
    return false;
  }
}

/**
 * Check and display island categories after migration
 */
async function checkIslandCategories() {
  try {
    writeLog('\nChecking island_categories table...');
    const { data: categories, error } = await supabase
      .from('island_categories')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    if (!categories || categories.length === 0) {
      writeLog('No island categories found.');
      return;
    }
    
    writeLog(`Found ${categories.length} island categories:`);
    categories.forEach(cat => {
      writeLog(`- ${cat.id}: ${cat.name} (${cat.name_en})`);
    });
    
    // Check islands with categories assigned
    const { count: assignedCount, error: countError } = await supabase
      .from('islands')
      .select('*', { count: 'exact', head: true })
      .not('island_categories_id', 'is', null);
    
    if (!countError) {
      writeLog(`\nIslands with category references: ${assignedCount}`);
    }
    
    // Check islands without category references
    const { count: unassignedCount, error: unassignedError } = await supabase
      .from('islands')
      .select('*', { count: 'exact', head: true })
      .is('island_categories_id', null)
      .not('island_category', 'is', null);
    
    if (!unassignedError) {
      writeLog(`Islands missing category references: ${unassignedCount}`);
    }
    
  } catch (error) {
    writeLog(`Error checking island categories: ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Create a fresh log file
    fs.writeFileSync(logPath, `Island categories migration via Supabase - ${new Date().toISOString()}\n\n`);
    
    writeLog('🏝️ Starting island categories migration via Supabase...');
    
    // Check connectivity
    writeLog(`Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`);
    
    // Test connection
    const { data, error } = await supabase.from('islands').select('count(*)').limit(1);
    if (error) {
      writeLog(`Connection error: ${error.message}`);
      exit(1);
    } else {
      writeLog('Successfully connected to Supabase');
    }
    
    // Check or create SQL exec function
    const hasExecFunction = await checkSqlExecFunction();
    if (!hasExecFunction) {
      const created = await createSqlExecFunction();
      if (!created) {
        writeLog('Failed to create SQL exec function');
        exit(1);
      }
      // Wait a moment for the function to be available
      writeLog('Waiting for SQL exec function to be available...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Path to SQL file
    const sqlFilePath = join(__dirname, 'islands_rows.sql');
    writeLog(`SQL file path: ${sqlFilePath}`);
    
    // Read SQL file
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    writeLog('SQL file loaded successfully');
    
    // Execute SQL statements
    const { success, totalStatements, successfulStatements } = await executeSqlStatements(sql);
    
    if (!success) {
      writeLog('Migration failed');
      exit(1);
    }
    
    writeLog(`Migration executed ${successfulStatements}/${totalStatements} statements successfully`);
    
    // Check results
    await checkIslandCategories();
    
    writeLog('\n✅ Island categories migration completed via Supabase');
  } catch (err) {
    writeLog(`Unexpected error: ${err.message}`);
    writeLog(err.stack);
    exit(1);
  }
}

// Run the migration
main();
