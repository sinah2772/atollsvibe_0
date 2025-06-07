// Check the actual islands table schema
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIslandsSchema() {
  console.log('🔍 Checking islands table schema...\n');
  
  try {
    // Try to fetch one record to see what columns actually exist
    const { data: sample, error } = await supabase
      .from('islands')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching sample data:', error);
      return;
    }

    if (sample && sample.length > 0) {
      console.log('✅ Available columns in islands table:');
      const columns = Object.keys(sample[0]);
      columns.forEach(col => {
        console.log(`- ${col}: ${typeof sample[0][col]}`);
      });
      
      console.log('\n📝 Sample data:');
      console.log(JSON.stringify(sample[0], null, 2));
    } else {
      console.log('❌ No data found in islands table');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkIslandsSchema();
