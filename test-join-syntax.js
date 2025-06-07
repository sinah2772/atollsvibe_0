// Test to find the correct join syntax for islands -> atolls
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testJoinSyntax() {
  console.log('🔍 Testing different join syntaxes...\n');
  
  // Test 1: Try atolls:atoll_id
  console.log('Test 1: atolls:atoll_id');
  try {
    const { data, error } = await supabase
      .from('islands')
      .select(`
        id,
        name_en,
        atoll_id,
        atolls:atoll_id (
          id,
          name_en
        )
      `)
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Success with atolls:atoll_id');
      console.log('Sample:', JSON.stringify(data[0], null, 2));
    }
  } catch (e) {
    console.log('❌ Exception:', e.message);
  }

  // Test 2: Try different syntax
  console.log('\nTest 2: Simple direct reference');
  try {
    const { data, error } = await supabase
      .from('islands')
      .select(`
        id,
        name_en,
        atoll_id
      `)
      .not('atoll_id', 'is', null)
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Success - got island with atoll_id');
      console.log('Sample:', JSON.stringify(data[0], null, 2));
      
      // Now try to get the atoll separately
      const atollId = data[0].atoll_id;
      const { data: atollData, error: atollError } = await supabase
        .from('atolls')
        .select('*')
        .eq('id', atollId)
        .single();
        
      if (atollError) {
        console.log('❌ Atoll fetch error:', atollError.message);
      } else {
        console.log('✅ Atoll data:', JSON.stringify(atollData, null, 2));
      }
    }
  } catch (e) {
    console.log('❌ Exception:', e.message);
  }
}

testJoinSyntax();
