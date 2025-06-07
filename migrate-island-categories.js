// Script to migrate island categories and update references
// This uses the pg module directly to execute SQL commands

import pg from 'pg';
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

// Supabase configuration - for application-level operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL direct connection configuration - for SQL execution
// First try individual parameters, then fall back to DATABASE_URL
const password = process.env.PG_PASSWORD ? encodeURIComponent(process.env.PG_PASSWORD) : 'postgres';
const pgConfig = (process.env.PG_HOST && process.env.PG_USER) ? 
  {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD, // Use raw password for direct connection
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    database: process.env.PG_DATABASE || 'postgres',
    ssl: { rejectUnauthorized: false }
  } : {
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '54322'),
    database: process.env.PG_DATABASE || 'postgres',
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

// Create a PostgreSQL client
const client = new pg.Client(pgConfig);

/**
 * Execute raw SQL file
 */
async function executeSqlFile(filePath) {
  try {
    // Read SQL file
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log('SQL file loaded successfully');
      // Connect to PostgreSQL
    console.log('Connecting to PostgreSQL database with config:', {
      host: pgConfig.host || 'Using connection string',
      port: pgConfig.port || 'default',
      database: pgConfig.database || 'default',
      user: pgConfig.user || 'from connection string',
      ssl: pgConfig.ssl ? 'enabled' : 'disabled',
    });
    
    await client.connect();
    console.log('Connected to PostgreSQL database successfully');
    
    // Execute SQL in smaller batches by splitting on semicolons
    console.log('Executing SQL file...');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        console.log(`Executing statement ${i+1}/${statements.length}...`);
        await client.query(stmt + ';');
        console.log(`Statement ${i+1} executed successfully`);
      } catch (stmtError) {
        console.error(`Error executing statement ${i+1}:`, stmtError);
        // Continue with other statements
      }
    }
    
    console.log('SQL file execution completed');
    return { success: true };
  } catch (error) {
    console.error('Error executing SQL file:', error);
    return { success: false, error };
  } finally {
    // Close connection
    try {
      await client.end();
      console.log('PostgreSQL connection closed');
    } catch (err) {
      console.error('Error closing PostgreSQL connection:', err);
    }
  }
}

/**
 * Check and display island categories after migration
 */
async function checkIslandCategories() {
  try {
    console.log('\nChecking island_categories table...');
    const { data: categories, error } = await supabase
      .from('island_categories')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    if (!categories || categories.length === 0) {
      console.log('No island categories found.');
      return;
    }
    
    console.log(`Found ${categories.length} island categories:`);
    categories.forEach(cat => {
      console.log(`- ${cat.id}: ${cat.name} (${cat.name_en})`);
    });
    
    // Check islands with categories assigned
    const { count: assignedCount, error: countError } = await supabase
      .from('islands')
      .select('*', { count: 'exact', head: true })
      .not('island_categories_id', 'is', null);
    
    if (!countError) {
      console.log(`\nIslands with category references: ${assignedCount}`);
    }
    
    // Check islands without category references
    const { count: unassignedCount, error: unassignedError } = await supabase
      .from('islands')
      .select('*', { count: 'exact', head: true })
      .is('island_categories_id', null)
      .not('island_category', 'is', null);
    
    if (!unassignedError) {
      console.log(`Islands missing category references: ${unassignedCount}`);
    }
    
  } catch (error) {
    console.error('Error checking island categories:', error);
  }
}

/**
 * Write log to file
 */
function writeLog(message) {
  const logPath = join(__dirname, 'migration-log.txt');
  try {
    fs.appendFileSync(logPath, message + '\n');
    console.log(message);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Create a fresh log file
    const logPath = join(__dirname, 'migration-log.txt');
    fs.writeFileSync(logPath, `Island categories migration log - ${new Date().toISOString()}\n\n`);
    
    writeLog('🏝️ Starting island categories migration...');
    
    // Path to SQL file
    const sqlFilePath = join(__dirname, 'islands_rows.sql');
    writeLog(`SQL file path: ${sqlFilePath}`);
    
    // Log environment variables (excluding sensitive data)
    writeLog('Environment configuration:');
    writeLog(`- Database host: ${process.env.PG_HOST || 'Not set'}`);
    writeLog(`- Database port: ${process.env.PG_PORT || 'Not set'}`);
    writeLog(`- SSL enabled: ${process.env.PG_SSL || 'Not set'}`);
    writeLog(`- Database URL defined: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
    writeLog(`- Supabase URL: ${supabaseUrl.substring(0, 20)}...`);
    
    // Execute SQL file
    const { success, error } = await executeSqlFile(sqlFilePath);
    
    if (!success) {
      writeLog(`Migration failed: ${error}`);
      exit(1);
    }
    
    // Check results
    await checkIslandCategories();
    
    writeLog('\n✅ Island categories migration completed successfully');
  } catch (err) {
    writeLog(`Unexpected error: ${err.message}`);
    writeLog(err.stack);
    exit(1);
  }
}

// Run the migration
main();
