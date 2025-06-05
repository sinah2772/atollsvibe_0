import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function analyzeMapping() {
  console.log('=== Analysis: Islands to Atolls Mapping ===\n');
  
  // Get all atolls with their island references
  console.log('1. Checking Atolls with island references...');
  const { data: atolls, error: atollsError } = await supabase
    .from('atolls')
    .select('*')
    .not('island_reference', 'is', null);
  
  if (atollsError) {
    console.error('Error fetching atolls:', atollsError);
    return;
  }

  console.log(`Found ${atolls.length} atolls with island references.\n`);

  // For each atoll, show what islands it references
  for (const atoll of atolls) {
    console.log(`\nAtoll: ${atoll.name} (${atoll.name_en})`);
    console.log(`Category: ${atoll.island_category} (${atoll.island_category_en})`);
    
    if (atoll.island_reference) {
      const islandNames = atoll.island_reference.split(';').map(name => name.trim());
      console.log(`Referenced islands (${islandNames.length}):`);
      
      // Check if these islands exist in our islands table
      for (const islandRef of islandNames.slice(0, 5)) { // Show first 5 only
        const { data: matchingIsland } = await supabase
          .from('islands')
          .select('id, name_dv, name_en, island_category_dv')
          .or(`name_en.ilike.%${islandRef}%,slug.ilike.%${islandRef}%`)
          .limit(1);
        
        if (matchingIsland && matchingIsland.length > 0) {
          const island = matchingIsland[0];
          console.log(`  ✅ ${islandRef} -> ${island.name_dv} (${island.name_en}) [${island.island_category_dv}]`);
        } else {
          console.log(`  ❌ ${islandRef} -> Not found in islands table`);
        }
      }
      
      if (islandNames.length > 5) {
        console.log(`  ... and ${islandNames.length - 5} more islands`);
      }
    }
  }
}

async function implementMapping() {
  console.log('\n\n=== Implementing Islands to Atolls Mapping ===\n');
  
  // Get all atolls with their island references
  const { data: atolls, error: atollsError } = await supabase
    .from('atolls')
    .select('*')
    .not('island_reference', 'is', null);
  
  if (atollsError) {
    console.error('Error fetching atolls:', atollsError);
    return;
  }

  let totalUpdated = 0;
  
  for (const atoll of atolls) {
    if (!atoll.island_reference) continue;
    
    console.log(`\nProcessing atoll: ${atoll.name} (${atoll.name_en})`);
    const islandNames = atoll.island_reference.split(';').map(name => name.trim());
    let atollUpdated = 0;
    
    for (const islandRef of islandNames) {
      // Try to find the island by various matching criteria
      const { data: matchingIslands } = await supabase
        .from('islands')
        .select('id, name_dv, name_en, atoll_id')
        .or(`name_en.ilike.%${islandRef}%,slug.ilike.%${islandRef}%,name_dv.ilike.%${islandRef}%`)
        .is('atoll_id', null); // Only update islands that don't have atoll_id set
      
      if (matchingIslands && matchingIslands.length > 0) {
        for (const island of matchingIslands) {
          // Update the island's atoll_id
          const { error: updateError } = await supabase
            .from('islands')
            .update({ atoll_id: atoll.id })
            .eq('id', island.id);
          
          if (updateError) {
            console.log(`  ❌ Failed to update ${island.name_en}: ${updateError.message}`);
          } else {
            console.log(`  ✅ Updated ${island.name_dv} (${island.name_en}) -> Atoll ID ${atoll.id}`);
            atollUpdated++;
            totalUpdated++;
          }
        }
      }
    }
    
    console.log(`  Updated ${atollUpdated} islands for this atoll`);
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total islands updated with atoll references: ${totalUpdated}`);
}

async function verifyMapping() {
  console.log('\n\n=== Verification: Islands with Atoll References ===\n');
  
  const { data: islandsWithAtolls, error } = await supabase
    .from('islands')
    .select(`
      id, name_dv, name_en, island_category_dv, atoll_id,
      atoll:atoll_id (
        id, name, name_en, island_category
      )
    `)
    .not('atoll_id', 'is', null)
    .limit(10);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Found ${islandsWithAtolls.length} islands with atoll references:`);
  islandsWithAtolls.forEach(island => {
    console.log(`- ${island.name_dv} (${island.name_en}) -> ${island.atoll?.name} (${island.atoll?.name_en})`);
    console.log(`  Category: ${island.island_category_dv}`);
  });
  
  // Count total islands with and without atoll references
  const { data: allIslands } = await supabase
    .from('islands')
    .select('atoll_id');
  
  const withAtoll = allIslands.filter(i => i.atoll_id !== null).length;
  const withoutAtoll = allIslands.filter(i => i.atoll_id === null).length;
  
  console.log(`\nStatistics:`);
  console.log(`- Islands with atoll reference: ${withAtoll}`);
  console.log(`- Islands without atoll reference: ${withoutAtoll}`);
  console.log(`- Total islands: ${allIslands.length}`);
}

// Main execution
(async () => {
  try {
    await analyzeMapping();
    
    console.log('\n' + '='.repeat(50));
    const proceed = true; // Set to true to proceed with mapping, false to just analyze
    
    if (proceed) {
      await implementMapping();
      await verifyMapping();
    } else {
      console.log('\nSet proceed=true in the script to implement the mapping.');
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
})();
