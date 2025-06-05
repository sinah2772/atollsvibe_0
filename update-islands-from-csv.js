// Script to update islands table from CSV data
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple CSV parser function
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || null;
      
      // Convert empty strings to null
      if (value === '' || value === '""') {
        value = null;
      }
      
      // Try to convert numbers
      if (value !== null && !isNaN(value) && value !== '') {
        const num = Number(value);
        if (Number.isInteger(num)) {
          value = num;
        }
      }
      
      row[header] = value;
    });
    
    rows.push(row);
  }

  return { headers, rows };
}

async function updateIslandsTable() {
  console.log('Starting islands table update from CSV...');
  
  try {    // Check for CSV file - try multiple options
    let csvPath = path.join(__dirname, 'Is Neww.csv');
    let csvFileName = 'Is Neww.csv';
    
    if (!fs.existsSync(csvPath)) {
      // Try sample CSV if main file doesn't exist
      csvPath = path.join(__dirname, 'sample-islands.csv');
      csvFileName = 'sample-islands.csv';
      
      if (!fs.existsSync(csvPath)) {
        console.error('❌ No CSV file found. Looking for:');
        console.log('  1. "Is Neww.csv" (main file)');
        console.log('  2. "sample-islands.csv" (fallback)');
        console.log('Please make sure one of these CSV files is in the same directory as this script');
        return;
      } else {
        console.log('ℹ️  Using sample CSV file for testing. Replace with "Is Neww.csv" for actual data.');
      }
    }    // Read and parse CSV
    console.log(`📄 Reading CSV file: ${csvFileName}...`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const { headers, rows } = parseCSV(csvContent);
    
    console.log(`✅ Parsed CSV with ${rows.length} rows and ${headers.length} columns`);
    console.log('Headers:', headers);

    // Show first row as sample
    if (rows.length > 0) {
      console.log('\n📋 Sample row:');
      console.log(JSON.stringify(rows[0], null, 2));
    }

    // Get current islands table structure
    console.log('\n🔍 Checking current islands table...');
    const { data: existingIslands, error: fetchError } = await supabase
      .from('islands')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching islands table:', fetchError);
      return;
    }

    if (existingIslands && existingIslands.length > 0) {
      console.log('✅ Current table columns:', Object.keys(existingIslands[0]));
    }

    // Map CSV columns to database columns
    const columnMapping = {
      'id': 'id',
      'name': 'name',
      'name_en': 'name_en', 
      'slug': 'slug',
      'island_code': 'island_code',
      'island_category': 'island_category',
      'island_category_en': 'island_category_en',
      'island_details': 'island_details',
      'longitude': 'longitude',
      'latitude': 'latitude',
      'election_commission_code': 'election_commission_code',
      'postal_code': 'postal_code',
      'other_name_en': 'other_name_en',
      'other_name_dv': 'other_name_dv',
      'list_order': 'list_order',
      'atoll_id': 'atoll_id'
    };

    // Process rows for database insertion
    console.log('\n🔄 Processing rows for database update...');
    const processedRows = rows.map(row => {
      const dbRow = {};
      
      // Map CSV columns to database columns
      Object.entries(columnMapping).forEach(([csvCol, dbCol]) => {
        if (headers.includes(csvCol)) {
          dbRow[dbCol] = row[csvCol];
        }
      });

      // Ensure required fields
      if (!dbRow.slug && dbRow.name_en) {
        dbRow.slug = dbRow.name_en.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // Set created_at if not present
      if (!dbRow.created_at) {
        dbRow.created_at = new Date().toISOString();
      }

      return dbRow;
    });

    console.log(`✅ Processed ${processedRows.length} rows`);

    // Ask user to confirm before updating
    console.log('\n⚠️  READY TO UPDATE ISLANDS TABLE');
    console.log('This will update/insert island records in the database.');
    console.log('\nFirst 3 processed rows:');
    processedRows.slice(0, 3).forEach((row, i) => {
      console.log(`Row ${i + 1}:`, JSON.stringify(row, null, 2));
    });

    // For now, just show what would be updated - uncomment below to actually update
    console.log('\n🚀 To proceed with the update, uncomment the upsert code in the script');
    
    /*
    // Uncomment this section to actually perform the update
    console.log('\n🚀 Starting database update...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of processedRows) {
      try {
        const { data, error } = await supabase
          .from('islands')
          .upsert(row, { 
            onConflict: 'id' // Update if ID exists, insert if not
          })
          .select();
        
        if (error) {
          console.error(`❌ Error updating row with ID ${row.id}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Successfully updated/inserted island: ${row.name_en || row.name}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Unexpected error for row ${row.id}:`, err);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📋 Total processed: ${processedRows.length}`);
    */

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updateIslandsTable();
