// Script to analyze articles table relationships
import { createClient } from '@supabase/supabase-js';

// Use the hardcoded values from supabase.ts
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Analyze relationships between tables
 */
async function analyzeRelationships() {
  console.log('Analyzing Supabase database relationships...');
  
  try {
    // Check for key tables we know should exist based on our code exploration
    const expectedTables = ['articles', 'categories', 'subcategories', 'atolls', 'islands', 'users', 'government'];
    const tableExistence = {};
    
    console.log('\nChecking for key tables:');
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count()', { count: 'exact', head: true });
        
        tableExistence[tableName] = !error;
        const status = !error ? '✅ exists' : '❌ not found/no access';
        const count = !error ? `(${data.count} rows)` : '';
        console.log(`- ${tableName}: ${status} ${count}`);
      } catch (e) {
        tableExistence[tableName] = false;
        console.log(`- ${tableName}: ❌ error checking`);
      }
    }
    
    // Now focus on the articles table
    console.log('\nArticles table relationships:');
    
    // 1. Category relationship
    console.log('\n1. Articles to Categories:');
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, name_en')
      .limit(5);
      
    if (categoryError) {
      console.log('  ❌ Error accessing categories:', categoryError);
    } else if (categories && categories.length > 0) {
      console.log(`  ✅ Found ${categories.length} categories`);
      console.log('  Sample categories:', categories.map(c => `${c.name} (${c.name_en})`).join(', '));
      
      // Check for articles with this relationship
      const { data: articlesWithCategories, error: articlesCatError } = await supabase
        .from('articles')
        .select('id, title, category:category_id(name, name_en)')
        .limit(3);
        
      if (articlesCatError) {
        console.log('  ❌ Error joining articles with categories:', articlesCatError);
      } else if (articlesWithCategories && articlesWithCategories.length > 0) {
        console.log('  Sample article-category relationship:');
        articlesWithCategories.forEach((article, i) => {
          console.log(`  ${i+1}. ${article.title} - Category: ${article.category?.name || 'None'}`);
        });
      }
    } else {
      console.log('  No categories found');
    }
    
    // 2. Subcategory relationship
    console.log('\n2. Articles to Subcategories:');
    const { data: subcategories, error: subcategoryError } = await supabase
      .from('subcategories')
      .select('id, name, name_en, category_id, category:category_id(name)')
      .limit(5);
      
    if (subcategoryError) {
      console.log('  ❌ Error accessing subcategories:', subcategoryError);
    } else if (subcategories && subcategories.length > 0) {
      console.log(`  ✅ Found ${subcategories.length} subcategories`);
      console.log('  Sample subcategories:', subcategories.map(sc => `${sc.name} (${sc.name_en})`).join(', '));
      
      // Check for articles with this relationship
      const { data: articlesWithSubcategories, error: articlesSubError } = await supabase
        .from('articles')
        .select('id, title, subcategory:subcategory_id(name, name_en)')
        .limit(3);
        
      if (articlesSubError) {
        console.log('  ❌ Error joining articles with subcategories:', articlesSubError);
      } else if (articlesWithSubcategories && articlesWithSubcategories.length > 0) {
        console.log('  Sample article-subcategory relationship:');
        articlesWithSubcategories.forEach((article, i) => {
          console.log(`  ${i+1}. ${article.title} - Subcategory: ${article.subcategory?.name || 'None'}`);
        });
      }
    } else {
      console.log('  No subcategories found');
    }
    
    // 3. Atolls relationships
    console.log('\n3. Articles to Atolls (using atoll_ids array):');
    const { data: atolls, error: atollsError } = await supabase
      .from('atolls')
      .select('id, name, name_en')
      .limit(5);
      
    if (atollsError) {
      console.log('  ❌ Error accessing atolls:', atollsError);
    } else if (atolls && atolls.length > 0) {
      console.log(`  ✅ Found ${atolls.length} atolls`);
      console.log('  Sample atolls:', atolls.map(a => `${a.name} (${a.name_en})`).join(', '));
      
      // Check for articles with atoll IDs
      const { data: articlesWithAtolls, error: articlesAtollsError } = await supabase
        .from('articles')
        .select('id, title, atoll_ids')
        .not('atoll_ids', 'is', null)
        .limit(3);
        
      if (articlesAtollsError) {
        console.log('  ❌ Error finding articles with atolls:', articlesAtollsError);
      } else if (articlesWithAtolls && articlesWithAtolls.length > 0) {
        console.log('  Sample article-atoll relationships:');
        for (const article of articlesWithAtolls) {
          console.log(`  - ${article.title} - Atoll IDs: ${article.atoll_ids.join(', ')}`);
          
          // Look up the actual atolls
          if (article.atoll_ids && article.atoll_ids.length > 0) {
            const { data: articleAtolls } = await supabase
              .from('atolls')
              .select('name, name_en')
              .in('id', article.atoll_ids);
              
            if (articleAtolls && articleAtolls.length > 0) {
              console.log('    Linked atolls:', articleAtolls.map(a => `${a.name} (${a.name_en})`).join(', '));
            }
          }
        }
      } else {
        console.log('  No articles with atoll relationships found');
      }
    } else {
      console.log('  No atolls found');
    }
    
    // 4. Islands relationships
    console.log('\n4. Articles to Islands (using island_ids array):');
    const { data: islands, error: islandsError } = await supabase
      .from('islands')
      .select('id, name, name_en')
      .limit(5);
      
    if (islandsError) {
      console.log('  ❌ Error accessing islands:', islandsError);
    } else if (islands && islands.length > 0) {
      console.log(`  ✅ Found ${islands.length} islands`);
      console.log('  Sample islands:', islands.map(i => `${i.name} (${i.name_en})`).join(', '));
    } else {
      console.log('  No islands found');
    }
    
    // 5. User relationship
    console.log('\n5. Articles to Users:');
    const { data: articlesWithUsers, error: articlesUsersError } = await supabase
      .from('articles')
      .select('id, title, user_id')
      .limit(3);
      
    if (articlesUsersError) {
      console.log('  ❌ Error getting articles with user info:', articlesUsersError);
    } else if (articlesWithUsers && articlesWithUsers.length > 0) {
      console.log('  Sample article user IDs:');
      articlesWithUsers.forEach(article => {
        console.log(`  - ${article.title} - User ID: ${article.user_id}`);
      });
    }

    console.log('\nAnalysis complete!');
    
  } catch (err) {
    console.error('❌ Unexpected error during analysis:', err);
  }
}

// Run the analysis
analyzeRelationships();
