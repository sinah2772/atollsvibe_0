// Test inserting one island with the exact same format as existing data
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vtkxjgsnnslwjzfyvdqu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo');

async function testInsert() {
  try {
    console.log('Testing island insertion with exact format...');
    
    // First, let's get one existing island to copy its format exactly
    const { data: existing } = await supabase
      .from('islands')
      .select('*')
      .eq('id', 1)
      .single();
    
    console.log('Existing island format:');
    console.log(JSON.stringify(existing, null, 2));
    
    // Now try to insert a new island with the same format
    const newIsland = {
      id: 100, // Use a high ID to avoid conflicts
      name: 'ތެސްޓް',
      name_en: 'Test Island',
      slug: 'test-island',
      island_code: 'TEST001',
      island_category: 'މީހުން ދިރިއުޅޭ',
      island_category_en: 'inhabited',
      island_details: 'Test island for format validation',
      latitude: `4° 15' 30.000" N`,  // Copy exact format from existing
      longitude: `73° 30' 15.000" E`, // Copy exact format from existing
      election_commission_code: 'TEST001',
      postal_code: 99999,
      other_name_en: 'Test Island',
      other_name_dv: 'ތެސްޓް ރަށް',
      list_order: 999,
      atoll_id: 15 // Kaafu atoll
    };
    
    console.log('\nTrying to insert test island:');
    console.log(JSON.stringify(newIsland, null, 2));
    
    const { data, error } = await supabase
      .from('islands')
      .insert(newIsland)
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error);
    } else {
      console.log('✅ Insert successful:', data);
      
      // Clean up - delete the test record
      await supabase.from('islands').delete().eq('id', 100);
      console.log('🗑️ Test record cleaned up');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testInsert();
