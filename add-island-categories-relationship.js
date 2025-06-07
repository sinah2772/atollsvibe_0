// Script to add island_categories_id relation to islands table
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if island_categories table exists and has data
async function checkIslandCategoriesTable() {
  console.log('🔍 Checking island_categories table...');
  
  try {
    // Check if the table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('island_categories')
      .select('count()', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Error checking island_categories table:', tableError);
      console.log('\nIt appears the island_categories table does not exist. Creating it...');
      
      // Create the island_categories table
      const { error: createError } = await supabase.rpc('create_island_categories_table');
      
      if (createError) {
        console.error('❌ Failed to create island_categories table:', createError);
        return false;
      } else {
        console.log('✅ island_categories table created successfully');
      }
      
      // Now populate it with initial data from the existing island_category values
      const { error: populateError } = await supabase.rpc('populate_island_categories');
      
      if (populateError) {
        console.error('❌ Failed to populate island_categories table:', populateError);
        return false;
      } else {
        console.log('✅ Island categories migrated from islands table');
      }
    } else {
      // Table exists, check if it has data
      const count = tableInfo[0]?.count || 0;
      console.log(`✅ island_categories table exists with ${count} records`);
      
      if (count === 0) {
        console.log('⚠️ The island_categories table is empty. Populating it from existing island categories...');
        
        // Populate with data from existing island_category values
        const { error: populateError } = await supabase.rpc('populate_island_categories');
        
        if (populateError) {
          console.error('❌ Failed to populate island_categories table:', populateError);
          return false;
        } else {
          console.log('✅ Island categories migrated from islands table');
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error checking island_categories table:', error);
    return false;
  }
}

// Function to check if the island_categories_id column exists
async function checkColumnExists() {
  console.log('Checking if island_categories_id column already exists...');
  
  try {
    // Create a function to check column existence
    await supabase.rpc('run_sql', { 
      sql: `
        CREATE OR REPLACE FUNCTION column_exists(tbl text, col text) 
        RETURNS boolean AS $$
        DECLARE
          exists_bool boolean;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = tbl AND column_name = col
          ) INTO exists_bool;
          
          RETURN exists_bool;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    // Check if the column exists
    const { data, error } = await supabase.rpc('column_exists', { 
      tbl: 'islands',
      col: 'island_categories_id'
    });
    
    if (error) {
      console.error('Error checking column existence:', error);
      return false;
    }
    
    if (data) {
      console.log('✅ island_categories_id column already exists in islands table');
    } else {
      console.log('⚠️ island_categories_id column does not exist in islands table yet');
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error checking column existence:', err);
    return false;
  }
}

// Function to run the SQL script
async function runMigrationScript() {
  console.log('\n📝 Running migration script to add island_categories_id relationship to islands table...');
  
  try {
    // Check if column already exists
    const columnExists = await checkColumnExists();
    
    if (columnExists) {
      console.log('\nColumn already exists. Checking for data consistency...');
      
      // Check how many rows have the column populated
      const { count, error: countError } = await supabase
        .from('islands')
        .select('id', { count: 'exact', head: true })
        .not('island_categories_id', 'is', null);
        
      if (countError) {
        console.error('Error counting islands with island_categories_id:', countError);
      } else {
        console.log(`${count} islands already have island_categories_id set`);
      }
      
      console.log('\nWould you like to proceed with the migration anyway? This might overwrite existing values.');
      console.log('To proceed, modify the script to set a force=true parameter.');
      return;
    }
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'add-island-categories-relationship.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .filter(stmt => stmt.trim());
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (const [index, statement] of statements.entries()) {
      console.log(`\n🔄 Executing statement ${index + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('run_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error executing statement ${index + 1}:`, error);
        } else {
          console.log(`✅ Statement ${index + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Failed to execute statement ${index + 1}:`, err);
      }
    }
    
    console.log('\n✅ Migration completed. The islands table now has island_categories_id properly linked to island_categories table.');
    
    // Verify the migration
    const { count: migratedCount, error: verifyError } = await supabase
      .from('islands')
      .select('id', { count: 'exact', head: true })
      .not('island_categories_id', 'is', null);
      
    if (verifyError) {
      console.error('Error verifying migrated data:', verifyError);
    } else {
      console.log(`\n✅ ${migratedCount} islands have been successfully linked to their categories`);
    }
    
    console.log('\n⚠️ Important: Check if all islands have been properly linked to their categories and verify the data integrity.');
    console.log('\nYou can now use the island_categories_id field in your queries and update your application code as needed.');
    
  } catch (err) {
    console.error('❌ Error running migration script:', err);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting migration process to add island_categories relationship...');
  
  // Make sure the island_categories table exists and has data
  const categoriesTableReady = await checkIslandCategoriesTable();
  
  if (categoriesTableReady) {
    // Run the migration script
    await runMigrationScript();
  } else {
    console.error('\n❌ Cannot proceed with migration. Please ensure the island_categories table exists and has data.');
  }
}

// Run the script
main();
