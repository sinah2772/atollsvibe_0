// Check atolls table schema
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAtollsSchema() {
  console.log('🔍 Checking atolls table schema...\n');
  
  try {
    const { data: sample, error } = await supabase
      .from('atolls')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching atoll sample:', error);
      return;
    }

    if (sample && sample.length > 0) {
      console.log('✅ Available columns in atolls table:');
      const columns = Object.keys(sample[0]);
      columns.forEach(col => {
        console.log(`- ${col}: ${typeof sample[0][col]}`);
      });
      
      console.log('\n📝 Sample atoll data:');
      console.log(JSON.stringify(sample[0], null, 2));
    } else {
      console.log('❌ No data found in atolls table');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAtollsSchema();
