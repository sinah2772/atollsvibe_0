// Check database constraints for islands table
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vtkxjgsnnslwjzfyvdqu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo');

async function checkConstraints() {
  try {
    // Try to get constraint information from information_schema
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          cc.check_clause
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
        WHERE tc.table_name = 'islands' AND tc.constraint_type = 'CHECK';
      `
    });

    if (error) {
      console.log('Cannot query constraints directly. Let me check the exact format used in existing data...');
      
      // Let's analyze the exact format pattern
      const { data: islands } = await supabase
        .from('islands')
        .select('name_en, latitude, longitude')
        .limit(10);

      console.log('Analyzing coordinate patterns in existing data:');
      islands.forEach(island => {
        console.log(`${island.name_en}:`);
        console.log(`  Latitude:  "${island.latitude}"`);
        console.log(`  Longitude: "${island.longitude}"`);
        console.log('');
      });

      // Check latitude patterns
      const latPattern = islands[0].latitude;
      console.log('Latitude pattern analysis:');
      console.log(`Example: "${latPattern}"`);
      console.log(`Length: ${latPattern.length}`);
      console.log(`Contains quotes: ${latPattern.includes('"')}`);
      console.log(`Ends with direction: ${/[NS]$/.test(latPattern)}`);
      
    } else {
      console.log('Constraints:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkConstraints();
