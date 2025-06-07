// Simple test to verify our fixed hooks work
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFixedHooks() {
  console.log('🔍 Testing Fixed Islands Hook Queries...\n');
  
  // Test the exact query from useIslands hook
  console.log('Test 1: useIslands hook query');
  try {
    const { data: islands, error } = await supabase
      .from('islands')
      .select(`
        id,
        name_dv,
        name_en,
        slug,
        island_code,
        island_category_dv,
        island_category_en,
        island_details,
        longitude,
        latitude,
        election_commission_code,
        postal_code,
        other_name_en,
        other_name_dv,
        atoll_id,
        created_at,
        atolls:atoll_id (
          id,
          name,
          name_en,
          slug
        )
      `)
      .order('name_en', { ascending: true })
      .limit(5);

    if (error) {
      console.error('❌ useIslands query failed:', error);
    } else {
      console.log('✅ useIslands query successful!');
      console.log(`Found ${islands.length} islands`);
      console.log('Sample island:', {
        id: islands[0].id,
        name_dv: islands[0].name_dv,
        name_en: islands[0].name_en,
        hasAtoll: !!islands[0].atolls,
        atollData: islands[0].atolls
      });
    }
  } catch (e) {
    console.error('❌ Exception in useIslands test:', e.message);
  }

  // Test the exact query from useIslandData hook
  console.log('\nTest 2: useIslandData hook query');
  try {
    const { data: island, error } = await supabase
      .from('islands')
      .select(`
        *,
        atolls:atoll_id (
          id,
          name,
          name_en,
          slug
        )
      `)
      .eq('id', 738) // Use a known island ID that has an atoll
      .single();

    if (error) {
      console.error('❌ useIslandData query failed:', error);
    } else {
      console.log('✅ useIslandData query successful!');
      console.log('Island details:', {
        id: island.id,
        name_dv: island.name_dv,
        name_en: island.name_en,
        hasAtoll: !!island.atolls,
        atollData: island.atolls
      });
    }
  } catch (e) {
    console.error('❌ Exception in useIslandData test:', e.message);
  }

  // Test filtering by atoll
  console.log('\nTest 3: Filter islands by atoll (simulating atollIds parameter)');
  try {
    const { data: filteredIslands, error } = await supabase
      .from('islands')
      .select('id, name_dv, name_en, atoll_id')
      .in('atoll_id', [8]) // Dhaalu atoll
      .order('name_en', { ascending: true })
      .limit(5);

    if (error) {
      console.error('❌ Atoll filtering failed:', error);
    } else {
      console.log('✅ Atoll filtering successful!');
      console.log(`Found ${filteredIslands.length} islands in atoll 8`);
      filteredIslands.forEach(island => {
        console.log(`- ${island.name_en} (${island.name_dv})`);
      });
    }
  } catch (e) {
    console.error('❌ Exception in atoll filtering test:', e.message);
  }

  console.log('\n🎉 All tests completed!');
}

testFixedHooks();
