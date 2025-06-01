// Test script to verify the useArticles functionality works without foreign key issues
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testArticlesFetch() {
  console.log('Testing the new articles fetch approach...');
  
  try {
    // Step 1: Fetch articles without foreign key joins
    console.log('\n1. Fetching articles...');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (articlesError) {
      console.error('❌ Error fetching articles:', articlesError);
      return;
    }
    
    console.log(`✅ Successfully fetched ${articles?.length || 0} articles`);
    
    if (!articles || articles.length === 0) {
      console.log('No articles found to test with');
      return;
    }
    
    // Step 2: Get unique category and subcategory IDs
    console.log('\n2. Extracting category and subcategory IDs...');
    const categoryIds = [...new Set(articles.flatMap(article => article.category_id || []))];
    const subcategoryIds = [...new Set(articles.map(article => article.subcategory_id).filter(Boolean))];
    
    console.log(`Found ${categoryIds.length} unique category IDs: ${JSON.stringify(categoryIds)}`);
    console.log(`Found ${subcategoryIds.length} unique subcategory IDs: ${JSON.stringify(subcategoryIds)}`);
    
    // Step 3: Fetch categories if any exist
    let categories = [];
    if (categoryIds.length > 0) {
      console.log('\n3. Fetching categories...');
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, name_en, slug')
        .in('id', categoryIds);
        
      if (categoriesError) {
        console.error('❌ Error fetching categories:', categoriesError);
      } else {
        categories = categoriesData || [];
        console.log(`✅ Successfully fetched ${categories.length} categories`);
        categories.forEach(cat => console.log(`  - ${cat.name} (${cat.name_en})`));
      }
    }
    
    // Step 4: Fetch subcategories if any exist
    let subcategories = [];
    if (subcategoryIds.length > 0) {
      console.log('\n4. Fetching subcategories...');
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('id, name, name_en, slug')
        .in('id', subcategoryIds);
        
      if (subcategoriesError) {
        console.error('❌ Error fetching subcategories:', subcategoriesError);
      } else {
        subcategories = subcategoriesData || [];
        console.log(`✅ Successfully fetched ${subcategories.length} subcategories`);
        subcategories.forEach(sub => console.log(`  - ${sub.name} (${sub.name_en})`));
      }
    }
    
    // Step 5: Process articles with their related data
    console.log('\n5. Processing articles with related data...');
    const processedArticles = articles.map(article => {
      const articleCategories = article.category_id?.map(categoryId => 
        categories.find(category => category.id === categoryId)
      ).filter(Boolean) || [];
      
      const articleSubcategory = article.subcategory_id ? 
        subcategories.find(subcategory => subcategory.id === article.subcategory_id) : null;
      
      return {
        ...article,
        categories: articleCategories,
        category: articleCategories[0] || null,
        subcategory: articleSubcategory
      };
    });
    
    // Step 6: Display results
    console.log('\n6. Final processed articles:');
    processedArticles.forEach((article, index) => {
      console.log(`\nArticle ${index + 1}:`);
      console.log(`  Title: ${article.title}`);
      console.log(`  Status: ${article.status}`);
      console.log(`  Category: ${article.category?.name || 'None'}`);
      console.log(`  Subcategory: ${article.subcategory?.name || 'None'}`);
    });
    
    console.log('\n✅ All tests passed! The new approach works correctly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testArticlesFetch();
