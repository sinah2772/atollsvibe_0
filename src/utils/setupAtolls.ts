// This file helps populate the atolls table for testing when direct database access is unavailable
import { supabase } from '../lib/supabase';

// Data matching the structure in our migration file
const atollsData = [
  { id: 1, name: 'ހއ', name_en: 'Ha Alif', slug: 'ha-alif', created_at: new Date().toISOString(), island_reference: 'North Thiladhunmathi', island_reference_dv: 'ތިލަދުންމަތީ އުތުރުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 2, name: 'ހދ', name_en: 'Ha Dhaalu', slug: 'ha-dhaalu', created_at: new Date().toISOString(), island_reference: 'South Thiladhunmathi', island_reference_dv: 'ތިލަދުންމަތީ ދެކުނުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 3, name: 'ށ', name_en: 'Shaviyani', slug: 'shaviyani', created_at: new Date().toISOString(), island_reference: 'North Miladhunmadulu', island_reference_dv: 'މިލަދުންމަޑުލު އުތުރުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 4, name: 'ނ', name_en: 'Noonu', slug: 'noonu', created_at: new Date().toISOString(), island_reference: 'South Miladhunmadulu', island_reference_dv: 'މިލަދުންމަޑުލު ދެކުނުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 5, name: 'ރ', name_en: 'Raa', slug: 'raa', created_at: new Date().toISOString(), island_reference: 'North Maalhosmadulu', island_reference_dv: 'މާޅޮސްމަޑުލު އުތުރުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 6, name: 'ބ', name_en: 'Baa', slug: 'baa', created_at: new Date().toISOString(), island_reference: 'South Maalhosmadulu', island_reference_dv: 'މާޅޮސްމަޑުލު ދެކުނުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 7, name: 'ޅ', name_en: 'Lhaviyani', slug: 'lhaviyani', created_at: new Date().toISOString(), island_reference: 'Faadhippolhu', island_reference_dv: 'ފާދިއްޕޮޅު', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 8, name: 'ކ', name_en: 'Kaafu', slug: 'kaafu', created_at: new Date().toISOString(), island_reference: 'Male Atoll', island_reference_dv: 'މާލެ އަތޮޅު', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 9, name: 'އއ', name_en: 'Alif Alif', slug: 'alif-alif', created_at: new Date().toISOString(), island_reference: 'North Ari Atoll', island_reference_dv: 'އަރިއަތޮޅު އުތުރުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
  { id: 10, name: 'އދ', name_en: 'Alif Dhaal', slug: 'alif-dhaal', created_at: new Date().toISOString(), island_reference: 'South Ari Atoll', island_reference_dv: 'އަރިއަތޮޅު ދެކުނުބުރި', island_category: 'Atoll', island_category_en: 'Atoll' },
];

// Function to insert the atolls data into the Supabase table
async function populateAtolls() {
  console.log('Starting to populate atolls table...');
  
  try {
    // First, check if the table already has data
    const { data: existingData, error: checkError } = await supabase
      .from('atolls')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking atolls table:', checkError);
      return;
    }
    
    // If data already exists, don't insert again
    if (existingData && existingData.length > 0) {
      console.log('Atolls table already has data. Skipping population.');
      return;
    }
    
    // Insert the data
    const { error: insertError } = await supabase
      .from('atolls')
      .insert(atollsData);
    
    if (insertError) {
      console.error('Error inserting atolls data:', insertError);
      return;
    }
    
    console.log('Successfully populated atolls table!');
  } catch (err) {
    console.error('Unexpected error populating atolls table:', err);
  }
}

// Execute the function when the script is run
populateAtolls();

// Export for potential use in other scripts or modules
export { populateAtolls, atollsData };
