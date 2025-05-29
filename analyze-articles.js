// Simple script to analyze the articles table structure
import { createClient } from '@supabase/supabase-js';

// Use the hardcoded values from supabase.ts
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Analyze the articles table
 */
async function analyzeArticles() {
  console.log('Analyzing Supabase articles table...');
  
  try {
    // Check if articles table exists
    console.log('\nVerifying articles table exists...');
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('id')
      .limit(1);
    
    if (articlesError) {
      console.error('❌ Error accessing articles table:', articlesError);
      console.log('\nTips:');
      console.log('1. Check that your Supabase project is running');
      console.log('2. Verify the table exists in your database');
      return;
    }

    console.log('✅ Successfully connected to articles table!');
    
    // Get article count
    const { count: totalCount, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('❌ Error getting article count:', countError);
    } else {
      console.log(`\nTotal articles in database: ${totalCount || 0}`);
    }

    // Fetch a sample article to analyze structure
    const { data: sampleArticle, error: sampleError } = await supabase
      .from('articles')
      .select(`
        *,
        category:category_id(*),
        subcategory:subcategory_id(*)
      `)
      .limit(1)
      .single();
    
    if (sampleError) {
      console.error('❌ Error fetching sample article:', sampleError);
    } else if (sampleArticle) {
      console.log('\nArticle table schema:');
      
      // Extract field names from the first row
      const fields = Object.keys(sampleArticle);
      const relationships = fields.filter(field => 
        typeof sampleArticle[field] === 'object' && 
        sampleArticle[field] !== null && 
        !Array.isArray(sampleArticle[field])
      );
      const arrayFields = fields.filter(field => 
        Array.isArray(sampleArticle[field])
      );
      
      // Log field types
      console.log('\nField types:');
      fields.forEach(field => {
        const value = sampleArticle[field];
        let type = typeof value;
        
        if (Array.isArray(value)) {
          type = 'array';
          if (value.length > 0) {
            type += ` of ${typeof value[0]}`;
          }
        } else if (value === null) {
          type = 'null';
        } else if (type === 'object') {
          type = 'relation/json';
        }
        
        // Skip showing full content object
        if (field === 'content' && type === 'relation/json') {
          console.log(`- ${field}: json (content object)`);
        } else {
          console.log(`- ${field}: ${type} ${value === null ? '(null)' : ''}`);
        }
      });

      // Analyze relationships
      if (relationships.length > 0) {
        console.log('\nRelationships:');
        relationships.forEach(rel => {
          console.log(`- ${rel}: ${JSON.stringify(sampleArticle[rel])}`);
        });
      }
      
      // Analyze array fields
      if (arrayFields.length > 0) {
        console.log('\nArray fields:');
        arrayFields.forEach(field => {
          console.log(`- ${field}: ${JSON.stringify(sampleArticle[field])}`);
        });
      }
      
      // Group fields by category
      console.log('\nFields by category:');
      
      // Basic fields
      const basicFields = fields.filter(f => 
        ['id', 'title', 'heading', 'slug', 'status', 'created_at', 'updated_at'].includes(f)
      );
      console.log('Basic fields:', basicFields.join(', '));
      
      // Content fields
      const contentFields = fields.filter(f => 
        ['content', 'social_heading', 'cover_image', 'image_caption'].includes(f)
      );
      console.log('Content fields:', contentFields.join(', '));
      
      // Relationship fields
      const relationshipFields = fields.filter(f => 
        ['category_id', 'subcategory_id', 'user_id', 'category', 'subcategory'].includes(f)
      );
      console.log('Relationship fields:', relationshipFields.join(', '));
      
      // Location fields 
      const locationFields = fields.filter(f => 
        ['atoll_ids', 'island_ids', 'government_ids'].includes(f)
      );
      console.log('Location fields:', locationFields.join(', '));
      
      // Flag fields
      const flagFields = fields.filter(f => 
        ['is_breaking', 'is_featured', 'is_developing', 'is_exclusive', 'is_sponsored'].includes(f)
      );
      console.log('Flag fields:', flagFields.join(', '));

      // Statistics fields
      const statsFields = fields.filter(f => 
        ['views', 'likes', 'comments', 'news_priority'].includes(f)
      );
      console.log('Statistics fields:', statsFields.join(', '));
      
      // Editorial fields
      const editorialFields = fields.filter(f => 
        ['author_notes', 'editor_notes', 'fact_checked', 'fact_checker_id', 'fact_checked_at',
         'approved_by_id', 'approved_at', 'published_by_id', 'last_updated_by_id'].includes(f)
      );
      console.log('Editorial fields:', editorialFields.join(', '));
      
      // SEO fields
      const seoFields = fields.filter(f => 
        ['meta_title', 'meta_description', 'meta_keywords', 'tags'].includes(f)
      );
      console.log('SEO fields:', seoFields.join(', '));
      
      // Get unique values for important fields
      console.log('\nAnalyzing field value distributions:');
      
      // Check status distribution
      const { data: statusData, error: statusError } = await supabase
        .from('articles')
        .select('status')
        .limit(1000);
        
      if (!statusError && statusData) {
        const statusCounts = statusData.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        
        console.log('Status distribution:', statusCounts);
      }
      
      // Example article ID
      console.log('\nSample article ID for reference:', sampleArticle.id);

    } else {
      console.log('\nNo articles found in the database.');
    }
  } catch (err) {
    console.error('❌ Unexpected error during analysis:', err);
  }
}

// Run the analysis
analyzeArticles();
