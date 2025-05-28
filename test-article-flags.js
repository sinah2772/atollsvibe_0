// Test script for article flags
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envContent = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    acc[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return acc;
}, {});

Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
});

// Create Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testArticleFlags() {
  console.log('Testing article flags functionality...');
  
  try {
    // Fetch a sample article to work with
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .limit(1);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('No articles found to test with.');
      return;
    }
    
    const testArticle = data[0];
    console.log(`Testing with article: ${testArticle.id} - ${testArticle.title}`);
    
    // Check if the flag fields exist
    console.log('\nChecking for flag fields:');
    const flagFields = ['is_breaking', 'is_featured', 'is_developing', 'is_exclusive', 'is_sponsored'];
    
    flagFields.forEach(field => {
      console.log(`- ${field}: ${field in testArticle ? 'Present' : 'Missing'}`);
      if (field in testArticle) {
        console.log(`  Current value: ${testArticle[field]}`);
      }
    });
    
    // If the fields exist, try updating one
    if (flagFields.every(field => field in testArticle)) {
      console.log('\nUpdating article flags...');
      
      // Toggle the is_breaking flag
      const newBreakingValue = !testArticle.is_breaking;
      
      const { data: updateData, error: updateError } = await supabase
        .from('articles')
        .update({ is_breaking: newBreakingValue })
        .eq('id', testArticle.id)
        .select();
        
      if (updateError) {
        console.error('❌ Error updating article:', updateError);
      } else {
        console.log(`✅ Successfully updated is_breaking to: ${newBreakingValue}`);
        console.log('Updated article data:');
        console.log({
          id: updateData[0].id,
          title: updateData[0].title,
          is_breaking: updateData[0].is_breaking,
          is_featured: updateData[0].is_featured,
          is_developing: updateData[0].is_developing
        });
      }
    } else {
      console.log('\n❌ Some flag fields are missing. Please run the SQL migration first.');
      console.log('You need to execute the migration file in your Supabase SQL editor:');
      console.log('supabase/migrations/20250525120000_add_article_flags.sql');
    }
    
  } catch (err) {
    console.error('❌ Error testing article flags:', err);
  }
}

testArticleFlags();
