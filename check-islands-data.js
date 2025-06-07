// Check current islands data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIslandsData() {
  console.log('🏝️ Checking current islands data...');
  
  try {    // Let's examine if we can see the islands table structure
    console.log('Checking islands table structure...');
    
    try {
      // Try fetching a single record to see what fields are available
      const { data: sampleIsland, error: sampleError } = await supabase
        .from('islands')
        .select('*')
        .limit(1)
        .single();
      
      if (!sampleError && sampleIsland) {
        console.log('Island fields found in the database:');
        
        // Print all fields in the island record
        const fields = Object.keys(sampleIsland);
        fields.forEach(field => {
          console.log(`- ${field}: ${typeof sampleIsland[field]}`);
        });
        
        // Check if created_at exists
        if (fields.includes('created_at')) {
          console.log('✅ created_at field exists in the islands table');
        } else {
          console.log('❌ created_at field is MISSING from the islands table');
          console.log('See fix-islands-created-at.js for instructions on how to fix this');
        }
      } else {
        console.error('Error fetching sample island:', sampleError);
      }
    } catch (schemaErr) {
      console.error('Could not analyze island structure:', schemaErr);
    }
    
    const { data: islands, error } = await supabase
      .from('islands')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Error fetching islands:', error);
      return;
    }

    console.log(`✅ Found ${islands.length} islands in the database`);
    
    if (islands.length > 0) {
      console.log('\n🏝️ Current islands:');
      islands.forEach((island, index) => {
        console.log(`\n${index + 1}. ${island.name_en || island.name} (ID: ${island.id})`);
        console.log(`   - Name (Dhivehi): ${island.name}`);
        console.log(`   - Name (English): ${island.name_en}`);
        console.log(`   - Slug: ${island.slug}`);
        console.log(`   - Island Code: ${island.island_code}`);
        console.log(`   - Category: ${island.island_category} / ${island.island_category_en}`);
        console.log(`   - Location: ${island.latitude}, ${island.longitude}`);
        console.log(`   - Atoll ID: ${island.atoll_id}`);
        console.log(`   - Created: ${island.created_at}`);
      });

      console.log('\n📊 Summary:');
      console.log(`- Total islands: ${islands.length}`);
      console.log(`- Islands with English names: ${islands.filter(i => i.name_en).length}`);
      console.log(`- Islands with coordinates: ${islands.filter(i => i.latitude && i.longitude).length}`);
      console.log(`- Islands with atoll_id: ${islands.filter(i => i.atoll_id).length}`);
    }

    // Check atolls for reference
    console.log('\n🏛️ Checking atolls for reference...');
    const { data: atolls, error: atollError } = await supabase
      .from('atolls')
      .select('*');

    if (!atollError && atolls) {
      console.log(`✅ Found ${atolls.length} atolls:`);
      atolls.forEach(atoll => {
        console.log(`- ${atoll.name_en || atoll.name} (ID: ${atoll.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkIslandsData();
