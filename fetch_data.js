const { createClient } = require('@supabase/supabase-js'); 
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Get all island categories
  console.log('Fetching island categories...');
  const { data: categories, error: catError } = await supabase.from('island_categories').select('*');
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }
  console.log(`Found ${categories.length} island categories`);
  
  // Get sample islands data
  console.log('Fetching sample islands...');
  const { data: islands, error: islandError } = await supabase.from('islands').select('id, name_dv, name_en, island_category_dv, island_category_en, island_categories_id').limit(5);
  if (islandError) {
    console.error('Error fetching islands:', islandError);
    return;
  }
  console.log('Sample islands:');
  console.log(JSON.stringify(islands, null, 2));
  
  // Check some statistics
  const { data: stats, error: statsError } = await supabase
    .from('islands')
    .select('island_categories_id')
    .is('island_categories_id', null);
  
  if (statsError) {
    console.error('Error fetching stats:', statsError);
    return;
  }
  
  console.log(`Islands with null island_categories_id: ${stats.length}`);
  
  // Get distinct category values from islands table
  const { data: islandsCats, error: distinctError } = await supabase
    .from('islands')
    .select('island_category_en')
    .limit(50);
  
  if (distinctError) {
    console.error('Error fetching distinct categories:', distinctError);
    return;
  }
  
  const uniqueCats = new Set();
  islandsCats.forEach(item => {
    if (item.island_category_en) uniqueCats.add(item.island_category_en);
  });
  
  console.log('Unique island_category_en values:');
  console.log(Array.from(uniqueCats));
}

main();
