import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get island categories
const getIslandCategories = async () => {
  const { data, error } = await supabase.from('island_categories').select('*');
  if (error) console.error('Error fetching categories:', error);
  else console.log('Island categories:', JSON.stringify(data, null, 2));
};

// Get sample islands
const getSampleIslands = async () => {
  const { data, error } = await supabase
    .from('islands')
    .select('id, name_en, island_category_en, island_categories_id')
    .limit(5);
  if (error) console.error('Error fetching islands:', error);
  else console.log('Sample islands:', JSON.stringify(data, null, 2));
};

// Count islands with null categories
const countNullCategories = async () => {
  const { data, error } = await supabase
    .from('islands')
    .select('id')
    .is('island_categories_id', null);
  if (error) console.error('Error counting null categories:', error);
  else console.log(Islands with null categories: );
};

// Run analysis
(async () => {
  console.log('=== ANALYSIS START ===');
  await getIslandCategories();
  await getSampleIslands();
  await countNullCategories();
  console.log('=== ANALYSIS COMPLETE ===');
})();

