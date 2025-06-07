// Test script to check islands hook functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testIslandsHookFunctionality() {
  console.log('🧪 Testing Islands Hook Functionality...\n');
  
  try {
    // Test 1: Basic islands fetch (simulating useIslands hook)
    console.log('📋 Test 1: Basic islands fetch');    const { data: islands, error: islandsError } = await supabase
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
        atoll_reference,
        created_at,
        atolls:atoll_id (
          id,
          name,
          name_en,
          slug
        )
      `)
      .order('name_en', { ascending: true });

    if (islandsError) {
      console.error('❌ Error fetching islands:', islandsError);
      return;
    }

    console.log(`✅ Successfully fetched ${islands?.length || 0} islands`);
    
    // Test 2: Check for missing created_at fields
    console.log('\n📅 Test 2: Checking created_at fields');
    const islandsWithoutCreatedAt = islands?.filter(island => !island.created_at) || [];
    if (islandsWithoutCreatedAt.length > 0) {
      console.log(`⚠️  Found ${islandsWithoutCreatedAt.length} islands without created_at field:`);      islandsWithoutCreatedAt.slice(0, 5).forEach(island => {
        console.log(`- ${island.name_en || island.name_dv} (ID: ${island.id})`);
      });
      if (islandsWithoutCreatedAt.length > 5) {
        console.log(`  ... and ${islandsWithoutCreatedAt.length - 5} more`);
      }
    } else {
      console.log('✅ All islands have created_at field');
    }    // Test 3: Check atoll relationships
    console.log('\n🏛️ Test 3: Checking atoll relationships');
    const islandsWithAtolls = islands?.filter(island => island.atolls) || [];
    const islandsWithoutAtolls = islands?.filter(island => !island.atolls && island.atoll_id) || [];
    
    console.log(`✅ ${islandsWithAtolls.length} islands have proper atoll relationships`);
    if (islandsWithoutAtolls.length > 0) {
      console.log(`⚠️  ${islandsWithoutAtolls.length} islands have atoll_id but no atoll data:`);      islandsWithoutAtolls.slice(0, 3).forEach(island => {
        console.log(`- ${island.name_en || island.name_dv} (atoll_id: ${island.atoll_id})`);
      });
    }

    // Test 4: Filter by atoll (simulating atollIds parameter)
    console.log('\n🔍 Test 4: Testing atoll filtering');
    const firstAtollId = islands?.[0]?.atoll_id;
    if (firstAtollId) {      const { data: filteredIslands, error: filterError } = await supabase
        .from('islands')
        .select('id, name_dv, name_en, atoll_id')
        .in('atoll_id', [firstAtollId])
        .order('name_en', { ascending: true });

      if (filterError) {
        console.error('❌ Error filtering islands by atoll:', filterError);
      } else {
        console.log(`✅ Successfully filtered ${filteredIslands?.length || 0} islands for atoll ${firstAtollId}`);
      }
    }

    // Test 5: Test individual island fetch (simulating useIslandData hook)
    console.log('\n🏝️ Test 5: Testing individual island fetch');
    const firstIslandId = islands?.[0]?.id;
    if (firstIslandId) {      const { data: singleIsland, error: singleError } = await supabase
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
        .eq('id', firstIslandId)
        .single();

      if (singleError) {
        console.error('❌ Error fetching single island:', singleError);
      } else {
        console.log(`✅ Successfully fetched island: ${singleIsland?.name_en || singleIsland?.name_dv}`);
        if (!singleIsland?.created_at) {
          console.log('⚠️  Single island also missing created_at field');
        }
      }
    }

    // Test 6: Check for null/undefined values that could cause issues
    console.log('\n🔍 Test 6: Checking for potential null/undefined issues');    const problematicIslands = islands?.filter(island => 
      !island.name_dv || !island.name_en || !island.slug
    ) || [];
    
    if (problematicIslands.length > 0) {
      console.log(`⚠️  Found ${problematicIslands.length} islands with missing essential fields:`);
      problematicIslands.slice(0, 3).forEach(island => {
        console.log(`- ID ${island.id}: name_dv=${!!island.name_dv}, name_en=${!!island.name_en}, slug=${!!island.slug}`);
      });
    } else {
      console.log('✅ All islands have essential fields (name_dv, name_en, slug)');
    }

    console.log('\n📊 Summary:');
    console.log(`- Total islands: ${islands?.length || 0}`);
    console.log(`- Islands with atoll relationships: ${islandsWithAtolls.length}`);
    console.log(`- Islands missing created_at: ${islandsWithoutCreatedAt.length}`);
    console.log(`- Islands with missing essential fields: ${problematicIslands.length}`);

  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
  }
}

testIslandsHookFunctionality();
