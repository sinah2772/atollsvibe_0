// Script to create and populate island_category_links junction table
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
 * Helper function to ask for user confirmation in terminal
 */
function askUserConfirmation(question) {
  return new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(question, answer => {
      readline.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Create island_category_links table and set up relationships
 */
async function createIslandCategoryLinks() {
  console.log('=== Creating island_category_links Junction Table ===\n');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'island-category-links.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    console.log('SQL script loaded successfully.');
    console.log('Script will perform the following actions:');
    console.log('1. Create island_category_links junction table');
    console.log('2. Add foreign key constraints to islands and island_categories');
    console.log('3. Populate the junction table with existing relationships\n');
    
    // Ask for confirmation
    const confirmed = await askUserConfirmation('Do you want to proceed with creating the junction table? (y/N): ');
    
    if (!confirmed) {
      console.log('❌ Operation cancelled by user.');
      return;
    }
    
    console.log('\n🚀 Executing SQL script...');
    
    // Execute the SQL script using Supabase's raw SQL query
    const { error } = await supabase.rpc('exec', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL script:', error);
      return;
    }
    
    console.log('✅ SQL script executed successfully.');
    
    // Verify the table was created and count entries
    const { data: linkData, error: linkError } = await supabase
      .from('island_category_links')
      .select('count', { count: 'exact', head: true });
      
    if (linkError) {
      console.error('❌ Error verifying island_category_links table:', linkError);
      return;
    }
    
    console.log(`✅ island_category_links table created with ${linkData?.count || 0} relationships.`);
    
    // Show some sample data
    const { data: sampleData, error: sampleError } = await supabase
      .from('island_category_links')
      .select(`
        id,
        island_id,
        island_category_id,
        island:island_id (name, name_en),
        category:island_category_id (name, name_en)
      `)
      .limit(5);
    
    if (sampleError) {
      console.error('❌ Error fetching sample data:', sampleError);
      return;
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log('\n📋 Sample data:');
      sampleData.forEach((link, i) => {
        console.log(`${i+1}. Island: ${link.island?.name_en} (ID: ${link.island_id}) -> Category: ${link.category?.name_en} (ID: ${link.island_category_id})`);
      });
    } else {
      console.log('\nNo relationships found in the junction table.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the function
createIslandCategoryLinks();
