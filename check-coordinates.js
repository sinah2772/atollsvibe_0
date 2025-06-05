// Check coordinate formats
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vtkxjgsnnslwjzfyvdqu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo');

const { data } = await supabase.from('islands').select('name_en, latitude, longitude').limit(5);
console.log('Current coordinate formats:');
data.forEach(island => {
  console.log(`${island.name_en}: Lat=${island.latitude}, Lng=${island.longitude}`);
});
