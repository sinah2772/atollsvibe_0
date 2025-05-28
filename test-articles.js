// Simple test script for articles hooks
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    acc[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return acc;
}, {});

// Set environment variables
Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
});

// Create Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testArticlesTable() {
  console.log('Testing connection to articles table...');
  
  try {
    // Test fetching articles
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        heading,
        social_heading,
        content,
        atoll_ids,
        island_ids,
        cover_image,
        image_caption,
        status,
        publish_date,
        views,
        likes,
        comments,
        user_id,
        created_at,
        updated_at,
        category_id,
        subcategory_id,
        category:category_id(id, name, name_en, slug),
        subcategory:subcategory_id(id, name, name_en, slug)
      `)
      .limit(2);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully fetched articles:');
    console.log(`Found ${data?.length || 0} articles`);
    
    if (data?.length) {
      // Show structure of first article
      const { content, ...rest } = data[0];
      console.log('\nArticle structure:');
      console.log(JSON.stringify({
        ...rest,
        content: '(content object present)'
      }, null, 2));
    }
    
    // Test fetching a single article
    if (data?.length) {
      const articleId = data[0].id;
      console.log(`\nFetching single article with ID: ${articleId}`);
      
      const { data: singleArticle, error: singleError } = await supabase
        .from('articles')
        .select(`
          *,
          category:category_id(id, name, name_en, slug),
          subcategory:subcategory_id(id, name, name_en, slug)
        `)
        .eq('id', articleId)
        .single();
      
      if (singleError) {
        console.error('❌ Error fetching single article:', singleError);
      } else {
        console.log('✅ Successfully fetched single article');
        console.log(`Title: ${singleArticle.title}`);
        console.log(`Category: ${singleArticle.category?.name || 'N/A'}`);
      }
    }
    
  } catch (err) {
    console.error('❌ Error testing articles table:', err);
  }
}

testArticlesTable();
