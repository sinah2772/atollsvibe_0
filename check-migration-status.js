// Script to check the status of the island categories migration
// This script only checks the status without attempting to make changes

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Check if the island_categories table exists
 */
async function checkIslandCategoriesTable() {
  console.log(`${colors.cyan}Checking if island_categories table exists...${colors.reset}`);
  
  try {
    const { data, error } = await supabase
      .from('island_categories')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log(`${colors.red}✗ island_categories table does not exist${colors.reset}`);
        return false;
      } else {
        console.log(`${colors.red}✗ Error checking island_categories table: ${error.message}${colors.reset}`);
        return false;
      }
    }
    
    console.log(`${colors.green}✓ island_categories table exists${colors.reset}`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗ Error checking island_categories table: ${err.message}${colors.reset}`);
    return false;
  }
}

/**
 * Check column information for islands table
 */
async function checkIslandsTableColumns() {
  console.log(`${colors.cyan}Checking islands table columns...${colors.reset}`);
  
  try {
    // Use a query that works even if the column doesn't exist
    const { data, error } = await supabase.rpc('check_column_exists', { 
      table_name: 'islands',
      column_name: 'island_categories_id'
    }).single();
    
    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        // The function doesn't exist, fall back to a simple query
        const { data: islands, error: islandsError } = await supabase
          .from('islands')
          .select('island_categories_id')
          .limit(1);
        
        if (islandsError) {
          if (islandsError.message.includes('column') && islandsError.message.includes('does not exist')) {
            console.log(`${colors.red}✗ island_categories_id column does not exist${colors.reset}`);
            return false;
          } else {
            console.log(`${colors.red}✗ Error checking islands table: ${islandsError.message}${colors.reset}`);
            return false;
          }
        }
        
        console.log(`${colors.green}✓ island_categories_id column exists${colors.reset}`);
        return true;
      } else {
        console.log(`${colors.red}✗ Error checking column: ${error.message}${colors.reset}`);
        return false;
      }
    }
    
    const columnExists = data?.exists || false;
    if (columnExists) {
      console.log(`${colors.green}✓ island_categories_id column exists${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ island_categories_id column does not exist${colors.reset}`);
    }
    
    return columnExists;
  } catch (err) {
    console.log(`${colors.red}✗ Error checking islands table: ${err.message}${colors.reset}`);
    return false;
  }
}

/**
 * Check if categories have been populated
 */
async function checkCategoriesPopulated() {
  console.log(`${colors.cyan}Checking if island_categories table is populated...${colors.reset}`);
  
  try {
    const { data, error } = await supabase
      .from('island_categories')
      .select('count(*)', { count: 'exact', head: true });
      
    if (error) {
      console.log(`${colors.red}✗ Error checking categories: ${error.message}${colors.reset}`);
      return false;
    }
    
    const count = data?.count || 0;
    if (count > 0) {
      console.log(`${colors.green}✓ Found ${count} island categories${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠ No island categories found${colors.reset}`);
      return false;
    }
  } catch (err) {
    console.log(`${colors.red}✗ Error checking categories: ${err.message}${colors.reset}`);
    return false;
  }
}

/**
 * Check if islands have been mapped to categories
 */
async function checkIslandsMapped() {
  console.log(`${colors.cyan}Checking if islands are mapped to categories...${colors.reset}`);
  
  try {
    const { data: totalIslands, error: totalError } = await supabase
      .from('islands')
      .select('count(*)', { count: 'exact', head: true });
      
    if (totalError) {
      console.log(`${colors.red}✗ Error checking total islands: ${totalError.message}${colors.reset}`);
      return false;
    }
    
    // Try to get islands with island_categories_id set
    try {
      const { data: mappedIslands, error: mappedError } = await supabase
        .from('islands')
        .select('count(*)', { count: 'exact', head: true })
        .not('island_categories_id', 'is', null);
        
      if (mappedError) {
        if (mappedError.message.includes('column') && mappedError.message.includes('does not exist')) {
          console.log(`${colors.red}✗ island_categories_id column does not exist${colors.reset}`);
          return false;
        } else {
          console.log(`${colors.red}✗ Error checking mapped islands: ${mappedError.message}${colors.reset}`);
          return false;
        }
      }
      
      const totalCount = totalIslands?.count || 0;
      const mappedCount = mappedIslands?.count || 0;
      const percentage = totalCount > 0 ? (mappedCount / totalCount * 100).toFixed(2) : 0;
      
      if (mappedCount > 0) {
        console.log(`${colors.green}✓ ${mappedCount}/${totalCount} islands (${percentage}%) are mapped to categories${colors.reset}`);
        return true;
      } else {
        console.log(`${colors.yellow}⚠ No islands are mapped to categories${colors.reset}`);
        return false;
      }
    } catch (err) {
      console.log(`${colors.red}✗ Error checking mapped islands: ${err.message}${colors.reset}`);
      return false;
    }
  } catch (err) {
    console.log(`${colors.red}✗ Error checking mapped islands: ${err.message}${colors.reset}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.magenta}=== Island Categories Migration Status Check ===${colors.reset}`);
  console.log(`${colors.blue}Connecting to Supabase at ${supabaseUrl}${colors.reset}`);
  
  // Check if we can connect to Supabase
  try {
    const { data, error } = await supabase
      .from('islands')
      .select('count(*)', { count: 'exact', head: true });
      
    if (error) {
      console.log(`${colors.red}✗ Connection error: ${error.message}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.green}✓ Successfully connected to Supabase${colors.reset}`);
    
    // Check migration status
    const tableExists = await checkIslandCategoriesTable();
    const columnsExist = await checkIslandsTableColumns();
    const categoriesPopulated = await checkCategoriesPopulated();
    const islandsMapped = await checkIslandsMapped();
    
    // Summary
    console.log(`\n${colors.magenta}=== Migration Status Summary ===${colors.reset}`);
    console.log(`${tableExists ? colors.green : colors.red}1. Island categories table: ${tableExists ? 'EXISTS' : 'MISSING'}${colors.reset}`);
    console.log(`${columnsExist ? colors.green : colors.red}2. Foreign key column: ${columnsExist ? 'EXISTS' : 'MISSING'}${colors.reset}`);
    console.log(`${categoriesPopulated ? colors.green : colors.yellow}3. Categories populated: ${categoriesPopulated ? 'YES' : 'NO'}${colors.reset}`);
    console.log(`${islandsMapped ? colors.green : colors.yellow}4. Islands mapped: ${islandsMapped ? 'YES' : 'NO'}${colors.reset}`);
    
    // Overall status
    const migrationComplete = tableExists && columnsExist && categoriesPopulated && islandsMapped;
    console.log(`\n${migrationComplete ? colors.green : colors.yellow}Overall migration status: ${migrationComplete ? 'COMPLETE' : 'INCOMPLETE'}${colors.reset}`);
    
    if (!migrationComplete) {
      console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
      console.log(`Run the migration SQL script in the Supabase SQL Editor as described in the ISLAND-CATEGORIES-MIGRATION-GUIDE.md file.`);
    }
  } catch (err) {
    console.log(`${colors.red}✗ Unexpected error: ${err.message}${colors.reset}`);
  }
}

// Run the check
main();
