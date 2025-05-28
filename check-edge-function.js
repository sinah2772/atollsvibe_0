#!/usr/bin/env node
/**
 * Check Edge Function Status
 * 
 * This utility performs a quick check to see if the images Edge Function is
 * properly deployed and running on your Supabase project.
 */

const checkFunction = async () => {
  // Load environment variables
  try {
    require('dotenv').config();
  } catch (err) {
    console.error('Warning: dotenv not available, using process.env');
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase configuration in environment:');
    console.log(`VITE_SUPABASE_URL: ${SUPABASE_URL ? 'Provided' : 'Missing'}`);
    console.log(`VITE_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'Provided' : 'Missing'}`);
    console.log('\nPlease create a .env file with these variables.');
    process.exit(1);
  }

  console.log('Testing Edge Function...');
  console.log(`URL: ${SUPABASE_URL}/functions/v1/images?query=beach&page=1`);
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/images?query=beach&page=1`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Edge Function is WORKING!');
      console.log(`Retrieved ${data.photos?.length || 0} images`);
      return;
    }
    
    console.error(`\n❌ Edge Function returned status code: ${response.status}`);
    
    try {
      const errorData = await response.json();
      console.error('Error details:', errorData);
    } catch {
      const text = await response.text();
      console.error('Response:', text || '(empty response)');
    }
    
    console.log('\nPossible solutions:');
    console.log('1. Deploy the Edge Function: supabase functions deploy images');
    console.log('2. Set the PEXELS_API_KEY: supabase secrets set PEXELS_API_KEY=your-api-key');
    console.log('3. Check your Supabase project\'s Edge Function settings');

  } catch (error) {
    console.error('\n❌ Failed to connect to Edge Function.');
    console.error(error);
    
    console.log('\nPossible solutions:');
    console.log('1. Make sure your Supabase project is online');
    console.log('2. Verify your VITE_SUPABASE_URL is correct');
    console.log('3. Check your network connectivity');
  }
};

checkFunction().catch(console.error);
