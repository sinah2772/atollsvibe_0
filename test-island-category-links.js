// Test the island-category links functionality
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Test the island_category_links table and functionality
 */
async function testIslandCategoryLinks() {
  console.log('=== Testing Island-Category Links ===\n');
  
  try {
    // 1. Check if the table exists
    console.log('1. Checking if island_category_links table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('island_category_links')
      .select('count', { count: 'exact', head: true });
      
    if (tableError) {
      console.error('❌ Error checking island_category_links table:', tableError);
      if (tableError.code === '42P01') {
        console.error('Table does not exist. Please run the migration script first.');
      }
      return;
    }
    
    console.log(`✅ island_category_links table exists with ${tableData?.count || 0} rows.\n`);
    
    // 2. Get some sample islands for testing
    console.log('2. Fetching sample islands and categories for testing...');
    const { data: islands, error: islandsError } = await supabase
      .from('islands')
      .select('id, name, name_en')
      .limit(3);
      
    if (islandsError) {
      console.error('❌ Error fetching islands:', islandsError);
      return;
    }
    
    const { data: categories, error: categoriesError } = await supabase
      .from('island_categories')
      .select('id, name, name_en')
      .limit(3);
      
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
      return;
    }
    
    console.log('Sample islands:');
    islands.forEach(island => console.log(`- ${island.name_en} (ID: ${island.id})`));
    
    console.log('\nSample categories:');
    categories.forEach(category => console.log(`- ${category.name_en} (ID: ${category.id})`));
    
    // 3. Test creating a link
    if (islands.length > 0 && categories.length > 0) {
      const testIsland = islands[0];
      const testCategory = categories[0];
      
      console.log(`\n3. Testing link creation between island "${testIsland.name_en}" and category "${testCategory.name_en}"...`);
      
      // Delete any existing link first to ensure clean test
      const { error: deleteError } = await supabase
        .from('island_category_links')
        .delete()
        .match({ island_id: testIsland.id, island_category_id: testCategory.id });
        
      if (deleteError) {
        console.error('❌ Error cleaning up existing link:', deleteError);
      }
      
      // Create a new link
      const { data: insertData, error: insertError } = await supabase
        .from('island_category_links')
        .insert([
          { island_id: testIsland.id, island_category_id: testCategory.id }
        ])
        .select();
        
      if (insertError) {
        console.error('❌ Error creating link:', insertError);
      } else {
        console.log('✅ Successfully created link with ID:', insertData[0].id);
      }
      
      // 4. Test fetching islands in a category
      console.log(`\n4. Testing fetch of islands in category "${testCategory.name_en}"...`);
      const { data: categoryIslands, error: categoryIslandsError } = await supabase
        .from('island_category_links')
        .select(`
          island_id,
          island:island_id (
            id,
            name,
            name_en
          )
        `)
        .eq('island_category_id', testCategory.id);
        
      if (categoryIslandsError) {
        console.error('❌ Error fetching islands in category:', categoryIslandsError);
      } else if (categoryIslands && categoryIslands.length > 0) {
        console.log(`✅ Found ${categoryIslands.length} islands in category:`);
        categoryIslands.forEach(link => {
          console.log(`- ${link.island.name_en} (ID: ${link.island.id})`);
        });
      } else {
        console.log('No islands found in this category.');
      }
      
      // 5. Test fetching categories for an island
      console.log(`\n5. Testing fetch of categories for island "${testIsland.name_en}"...`);
      const { data: islandCategories, error: islandCategoriesError } = await supabase
        .from('island_category_links')
        .select(`
          island_category_id,
          category:island_category_id (
            id,
            name,
            name_en
          )
        `)
        .eq('island_id', testIsland.id);
        
      if (islandCategoriesError) {
        console.error('❌ Error fetching categories for island:', islandCategoriesError);
      } else if (islandCategories && islandCategories.length > 0) {
        console.log(`✅ Found ${islandCategories.length} categories for island:`);
        islandCategories.forEach(link => {
          console.log(`- ${link.category.name_en} (ID: ${link.category.id})`);
        });
      } else {
        console.log('No categories found for this island.');
      }
      
      // 6. Clean up test data if needed
      // This is commented out for now to keep the test data for verification
      /*
      console.log('\n6. Cleaning up test data...');
      const { error: cleanupError } = await supabase
        .from('island_category_links')
        .delete()
        .match({ island_id: testIsland.id, island_category_id: testCategory.id });
        
      if (cleanupError) {
        console.error('❌ Error cleaning up test data:', cleanupError);
      } else {
        console.log('✅ Test data cleaned up successfully.');
      }
      */
      
      console.log('\nTests completed successfully!');
    } else {
      console.log('\n❌ Not enough sample data to perform tests.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
  }
}

// Run the test
testIslandCategoryLinks();
