import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Supabase configuration with hardcoded values
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to count islands with null island_categories_id
async function countNullCategoriesIslands() {
  try {
    const { count, error } = await supabase
      .from('islands')
      .select('*', { count: 'exact', head: true })
      .is('island_categories_id', null);
    
    if (error) throw error;
    console.log(`Islands with null island_categories_id: ${count}`);
    return count;
  } catch (error) {
    console.error('Error counting islands with null categories:', error);
    return 0;
  }
}

// Function to get sample islands with their categories
async function getSampleIslands() {
  try {
    const { data, error } = await supabase
      .from('islands')
      .select('id, name_en, island_category_en, island_categories_id')
      .limit(10);
    
    if (error) throw error;
    console.log('Sample islands:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching sample islands:', error);
    return [];
  }
}

// Function to get some unique category values from the islands table
async function getUniqueIslandCategoryValues() {
  try {
    const { data, error } = await supabase
      .from('islands')
      .select('island_category_en')
      .limit(50);
    
    if (error) throw error;
    
    const uniqueCategories = new Set();
    data.forEach(item => {
      if (item.island_category_en) {
        // Handle cases where there might be multiple categories in one string
        const categories = item.island_category_en.split(',').map(c => c.trim());
        categories.forEach(cat => uniqueCategories.add(cat));
      }
    });
    
    console.log('Unique island category values:', Array.from(uniqueCategories));
    return Array.from(uniqueCategories);
  } catch (error) {
    console.error('Error fetching unique island categories:', error);
    return [];
  }
}

// Function to get all island categories
async function getIslandCategories() {
  try {
    const { data, error } = await supabase
      .from('island_categories')
      .select('*');
    
    if (error) throw error;
    console.log('Island categories:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching island categories:', error);
    return [];
  }
}

// Execute all functions
async function main() {
  console.log('===== ISLAND CATEGORIES MAPPING ANALYSIS =====');
  
  console.log('\n1. Fetching all island categories...');
  await getIslandCategories();
  
  console.log('\n2. Counting islands with null categories...');
  await countNullCategoriesIslands();
  
  console.log('\n3. Getting sample islands...');
  await getSampleIslands();
  
  console.log('\n4. Getting unique island category values...');
  await getUniqueIslandCategoryValues();
  
  console.log('\n===== ANALYSIS COMPLETE =====');
}

main();
