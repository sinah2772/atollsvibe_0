// Script to update island_categories_id in islands table 
// Updated: June 6, 2025 - Adds improved error handling and column mapping

// Using ES modules
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase configuration - read from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetch island categories
 */
async function fetchIslandCategories() {
  try {
    console.log('Fetching island categories...');
    const { data, error } = await supabase.from('island_categories').select('*');
    
    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('No island categories found!');
      return [];
    }
    
    console.log(`Found ${data.length} island categories`);
    return data;
  } catch (err) {
    console.error('Error fetching island categories:', err);
    return [];
  }
}

/**
 * Create island_categories table if it doesn't exist
 */
async function createIslandCategoriesTable() {
  try {
    console.log('Checking if island_categories table exists...');
    
    // Attempt to query the table to check if it exists
    const { error } = await supabase
      .from('island_categories')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      // Table does not exist, create it
      console.log('Creating island_categories table...');
      
      // Use raw SQL to create the table
      const { error: createError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS island_categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            name_en VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          
          -- Create indexes for improved lookup performance
          CREATE INDEX IF NOT EXISTS idx_island_categories_name ON island_categories(name);
          CREATE INDEX IF NOT EXISTS idx_island_categories_name_en ON island_categories(name_en);
        `
      });
      
      if (createError) {
        console.error('Error creating island_categories table:', createError);
        return false;
      }
      
      console.log('✅ island_categories table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking island_categories table:', error);
      return false;
    } else {
      console.log('✅ island_categories table already exists');
      return true;
    }
  } catch (err) {
    console.error('Error creating island_categories table:', err);
    return false;
  }
}

/**
 * Fetch islands that need updating (where island_categories_id is null)
 */
async function fetchIslandsNeedingUpdate() {
  try {
    console.log('Fetching islands without island_categories_id...');
    
    // First check for newer column name format
    let { data, error } = await supabase
      .from('islands')
      .select('id, name, name_en, island_category, island_category_en, island_categories_id')
      .is('island_categories_id', null)
      .order('id');
    
    // If we get an error for these column names, try alternate column names (name_dv, etc.)
    if (error && error.message.includes("column") && error.message.includes("does not exist")) {
      console.log('Trying alternate column names (name_dv, island_category_dv)...');
      const result = await supabase
        .from('islands')
        .select('id, name_dv, name_en, island_category_dv, island_category_en, island_categories_id')
        .is('island_categories_id', null)
        .order('id');
      
      data = result.data;
      error = result.error;
    }
    
    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('All islands already have island_categories_id set!');
      return [];
    }
    
    console.log(`Found ${data.length} islands that need category mapping`);
    return data;
  } catch (err) {
    console.error('Error fetching islands:', err);
    return [];
  }
}

/**
 * Handle possible field name variations in islands table
 */
function getIslandCategory(island) {
  return {
    nameLocal: island.name || island.name_dv,
    nameEn: island.name_en,
    categoryLocal: island.island_category || island.island_category_dv,
    categoryEn: island.island_category_en
  };
}

/**
 * Populate island_categories table from unique values in islands
 */
async function populateIslandCategories() {
  try {
    console.log('Checking for unique island categories in islands table...');
    
    // Get distinct categories from islands table
    let { data: uniqueCategories, error } = await supabase.rpc('exec', {
      sql: `
        SELECT DISTINCT island_category, island_category_en
        FROM islands
        WHERE island_category IS NOT NULL AND island_category_en IS NOT NULL
      `
    });
    
    if (error) {
      console.error('Error getting unique categories:', error);
      
      // Try with alternate column names
      const result = await supabase.rpc('exec', {
        sql: `
          SELECT DISTINCT island_category_dv AS island_category, island_category_en
          FROM islands
          WHERE island_category_dv IS NOT NULL AND island_category_en IS NOT NULL
        `
      });
      
      if (result.error) {
        console.error('Error getting unique categories with alternate column names:', result.error);
        return false;
      }
      
      uniqueCategories = result.data;
    }
    
    if (!uniqueCategories || uniqueCategories.length === 0) {
      console.log('No categories found in islands table');
      return false;
    }
    
    console.log(`Found ${uniqueCategories.length} unique categories in islands table`);
    
    // Insert each unique category into island_categories table
    for (const category of uniqueCategories) {
      const slug = category.island_category_en
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      
      // Check if this category already exists
      const { data: existing, error: checkError } = await supabase
        .from('island_categories')
        .select('id')
        .or(`name.eq.${category.island_category},name_en.eq.${category.island_category_en}`)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking for existing category:', checkError);
        continue;
      }
      
      if (!existing) {
        // Insert new category
        const { error: insertError } = await supabase
          .from('island_categories')
          .insert([{
            name: category.island_category,
            name_en: category.island_category_en,
            slug: slug
          }]);
        
        if (insertError) {
          console.error('Error inserting category:', insertError);
        } else {
          console.log(`✅ Inserted category: ${category.island_category} (${category.island_category_en})`);
        }
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error populating island categories:', err);
    return false;
  }
}

/**
 * Find best matching category ID for an island
 */
function findMatchingCategoryId(island, categories) {
  // Get standardized field names
  const { categoryLocal, categoryEn } = getIslandCategory(island);
  
  // First try exact match on name/name_en
  const exactMatch = categories.find(
    cat => cat.name === categoryLocal || cat.name_en === categoryEn
  );
  
  if (exactMatch) return exactMatch.id;
  
  // Try case-insensitive match
  const caseInsensitiveMatch = categories.find(
    cat => 
      (categoryLocal && cat.name && categoryLocal.toLowerCase() === cat.name.toLowerCase()) || 
      (categoryEn && cat.name_en && categoryEn.toLowerCase() === cat.name_en.toLowerCase())
  );
  
  if (caseInsensitiveMatch) return caseInsensitiveMatch.id;
  
  // Try to match partial
  if (categoryEn) {
    const partialMatch = categories.find(
      cat => cat.name_en && cat.name_en.toLowerCase().includes(categoryEn.toLowerCase())
    );
    
    if (partialMatch) return partialMatch.id;
  }
  
  if (categoryLocal) {
    const partialMatch = categories.find(
      cat => cat.name && cat.name.toLowerCase().includes(categoryLocal.toLowerCase())
    );
    
    if (partialMatch) return partialMatch.id;
  }
  
  // No match found
  return null;
}

/**
 * Update island_categories_id for islands
 */
async function updateIslandCategories(islands, categories) {
  console.log('Updating island categories mapping...');
  let successCount = 0;
  let failCount = 0;
  let batchSize = 20; // Process in batches to avoid rate limits
  
  // Process islands in batches
  for (let i = 0; i < islands.length; i += batchSize) {
    const batch = islands.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(islands.length/batchSize)}`);
    
    const updates = [];
    const skippedIslands = [];
    
    // Prepare batch updates
    for (const island of batch) {
      const { nameLocal, nameEn } = getIslandCategory(island);
      const displayName = nameEn || nameLocal || `ID: ${island.id}`;
      const categoryId = findMatchingCategoryId(island, categories);
      
      if (categoryId) {
        updates.push({
          id: island.id,
          island_categories_id: categoryId
        });
      } else {
        skippedIslands.push({ id: island.id, name: displayName });
      }
    }
    
    // Execute batch update if we have updates
    if (updates.length > 0) {
      const { error } = await supabase
        .from('islands')
        .upsert(updates);
      
      if (error) {
        console.error(`Error updating batch:`, error);
        failCount += updates.length;
      } else {
        successCount += updates.length;
        console.log(`✅ Updated ${updates.length} islands with category references`);
      }
    }
    
    // Log skipped islands
    if (skippedIslands.length > 0) {
      failCount += skippedIslands.length;
      console.log(`❌ Skipped ${skippedIslands.length} islands with no matching categories:`);
      skippedIslands.forEach(island => {
        console.log(`   - ${island.name} (ID: ${island.id})`);
      });
    }
    
    // Small delay between batches
    if (i + batchSize < islands.length) {
      console.log('Waiting before processing next batch...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\nUpdate Summary:`);
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Failed to update: ${failCount}`);
  
  return { successCount, failCount };
}

/**
 * Display a report on category distribution
 */
async function showCategoryReport() {
  try {
    console.log('\n📊 Island Categories Report:');
    
    // Get counts by category
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        SELECT 
          ic.id, 
          ic.name, 
          ic.name_en, 
          COUNT(i.id) AS island_count
        FROM 
          island_categories ic
        LEFT JOIN 
          islands i ON ic.id = i.island_categories_id
        GROUP BY 
          ic.id, ic.name, ic.name_en
        ORDER BY 
          island_count DESC
      `
    });
    
    if (error) {
      console.error('Error generating report:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No categories or associations found.');
      return;
    }
    
    // Display the report
    console.log('Category Distribution:');
    data.forEach(row => {
      console.log(`- ${row.name} (${row.name_en}): ${row.island_count} islands`);
    });
    
    // Get count of islands still without category reference
    const { data: remaining, error: remainingError } = await supabase.rpc('exec', {
      sql: `
        SELECT COUNT(*) as count
        FROM islands
        WHERE island_categories_id IS NULL 
        AND (island_category IS NOT NULL OR island_category_en IS NOT NULL OR island_category_dv IS NOT NULL)
      `
    });
    
    if (!remainingError && remaining && remaining.length > 0) {
      console.log(`\nIslands still needing category reference: ${remaining[0].count}`);
    }
    
  } catch (err) {
    console.error('Error generating report:', err);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🏝️ Starting island categories mapping update...');
    
    // Make sure island_categories table exists
    const tableCreated = await createIslandCategoriesTable();
    if (!tableCreated) {
      console.log('⚠️ Continuing with existing tables but there may be issues...');
    }
    
    // Populate island_categories table from islands data
    console.log('\n💾 Populating island_categories from unique values...');
    await populateIslandCategories();
    
    // Get all island categories
    const categories = await fetchIslandCategories();
    if (categories.length === 0) {
      console.error('Cannot proceed without island categories.');
      return;
    }
    
    // Get islands needing update
    const islands = await fetchIslandsNeedingUpdate();
    if (islands.length === 0) {
      console.log('No islands need updating.');
    } else {
      // Update islands
      await updateIslandCategories(islands, categories);
    }
    
    // Show final report
    await showCategoryReport();
    
    console.log('\n✅ Island categories mapping update completed.');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Function to handle RPC when exec isn't available
async function setupRpc() {
  try {
    // Check if exec function exists
    const { data, error } = await supabase.rpc('exec', {
      sql: 'SELECT 1 as test'
    });
    
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('Creating exec function for SQL execution...');
      // Create the function
      const { error: createError } = await supabase
        .from('_rpc')
        .update({ definition: 'SELECT query_sql($1)' })
        .eq('name', 'exec');
      
      if (createError) {
        throw createError;
      }
    } else if (error) {
      console.warn('Warning: exec function may not be available:', error.message);
    } else {
      console.log('exec RPC function is available');
    }
  } catch (err) {
    console.warn('Warning: Could not set up SQL execution function, will use alternative methods:', err.message);
  }
}

// Run the script
(async () => {
  try {
    await setupRpc();
    await main();
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  }
})();
