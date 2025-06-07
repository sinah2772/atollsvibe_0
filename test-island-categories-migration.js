// Test script for island categories migration
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check island_categories table
async function checkIslandCategories() {
  console.log('Checking island_categories table...');
  
  try {
    const { data, error } = await supabase.from('island_categories').select('*');
    
    if (error) {
      console.error('Error checking island_categories table:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log('island_categories table exists but is empty');
      return false;
    }
    
    console.log(`Found ${data.length} island categories:`);
    data.slice(0, 5).forEach((category, index) => {
      console.log(`  ${index+1}. ${category.name} / ${category.name_en} (ID: ${category.id})`);
    });
    
    if (data.length > 5) {
      console.log(`  ... and ${data.length - 5} more categories`);
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error checking island_categories table:', err);
    return false;
  }
}

// Function to check distinct island categories in the islands table
async function getDistinctIslandCategories() {
  console.log('\nChecking distinct island categories in islands table...');
  
  try {
    const { data, error } = await supabase.rpc('get_distinct_island_categories');
    
    if (error) {
      console.error('Error getting distinct island categories:', error);
      console.log('Creating SQL function to get distinct island categories...');
      
      // Create the SQL function
      await supabase.rpc('run_sql', { 
        sql: `
          CREATE OR REPLACE FUNCTION get_distinct_island_categories()
          RETURNS TABLE (category text, category_en text, count bigint) AS $$
          BEGIN
            RETURN QUERY
            SELECT 
              island_category AS category,
              island_category_en AS category_en,
              COUNT(*) AS count
            FROM islands
            WHERE island_category IS NOT NULL
            GROUP BY island_category, island_category_en
            ORDER BY count DESC;
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      
      console.log('SQL function created, retrying...');
      const { data: retryData, error: retryError } = await supabase.rpc('get_distinct_island_categories');
      
      if (retryError) {
        console.error('Error retrying to get distinct island categories:', retryError);
        return [];
      }
      
      data = retryData;
    }
    
    if (!data || data.length === 0) {
      console.log('No island categories found in islands table');
      return [];
    }
    
    console.log(`Found ${data.length} distinct island categories in use:`);
    data.forEach((row, index) => {
      console.log(`  ${index+1}. ${row.category} / ${row.category_en} (${row.count} islands)`);
    });
    
    return data;
  } catch (err) {
    console.error('Unexpected error getting distinct island categories:', err);
    return [];
  }
}

// Function to test migration logic (without actually modifying anything)
async function testMigrationLogic() {
  console.log('\nTesting migration logic (simulation only)...');
  
  try {
    // Get distinct categories from islands table
    const distinctCategories = await getDistinctIslandCategories();
    
    if (distinctCategories.length === 0) {
      console.log('No categories to migrate');
      return;
    }
    
    // Get categories from island_categories table
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('island_categories')
      .select('*');
    
    if (categoriesError) {
      console.error('Error fetching island_categories:', categoriesError);
      return;
    }
    
    console.log('\nSimulating category mapping:');
    
    // For each distinct category in islands table, find or create a match
    for (const category of distinctCategories) {
      // Try to find a match in existing categories
      const match = existingCategories?.find(c => 
        c.name === category.category || 
        c.name_en === category.category_en
      );
      
      if (match) {
        console.log(`✅ "${category.category}" / "${category.category_en}" → match found with ID ${match.id}`);
      } else {
        console.log(`❌ "${category.category}" / "${category.category_en}" → no match found, would need to be created`);
      }
    }
    
    // Count how many islands would be affected
    const { count: totalIslands } = await supabase
      .from('islands')
      .select('id', { count: 'exact', head: true });
    
    const { count: islandsWithCategories } = await supabase
      .from('islands')
      .select('id', { count: 'exact', head: true })
      .not('island_category', 'is', null);
    
    console.log(`\nTotal islands: ${totalIslands}`);
    console.log(`Islands with categories: ${islandsWithCategories} (${Math.round(islandsWithCategories/totalIslands*100)}%)`);
    console.log(`Islands without categories: ${totalIslands - islandsWithCategories} (${Math.round((totalIslands - islandsWithCategories)/totalIslands*100)}%)`);
  } catch (err) {
    console.error('Unexpected error testing migration logic:', err);
  }
}

// Main function
async function main() {
  console.log('🏝️ Island Categories Migration Test\n');
  
  // Check if island_categories table exists and has data
  const hasCategories = await checkIslandCategories();
  
  if (!hasCategories) {
    console.log('\nThe island_categories table is missing or empty.');
    console.log('You should run the scripts in this order:');
    console.log('1. Run setup-island-categories.sql in the Supabase SQL editor');
    console.log('2. Run sql-util-function.sql in the Supabase SQL editor');
    console.log('3. Run add-island-categories-relationship.js to perform the migration');
  } else {
    // Test the migration logic
    await testMigrationLogic();
    
    console.log('\nReady to proceed with migration:');
    console.log('1. Run setup-island-categories.sql in the Supabase SQL editor');
    console.log('2. Run sql-util-function.sql in the Supabase SQL editor');
    console.log('3. Run add-island-categories-relationship.js to perform the migration');
  }
}

// Run the script
main();
