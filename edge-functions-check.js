// Script to check if Edge Functions are properly deployed and configured

import { checkSupabaseConfig } from './src/utils/checkSupabase.ts';
import { checkEdgeFunctions } from './src/utils/checkEdgeFunctions.ts';

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');

const printEdgeFunctionsHelp = () => {
  console.log('\nTo deploy the Images edge function:');
  console.log('1. Install Supabase CLI if you haven\'t already:');
  console.log('   npm install -g supabase');
  console.log('2. Log in to Supabase:');
  console.log('   supabase login');
  console.log('3. Link your project:');
  console.log('   supabase link --project-ref <project-id>');
  console.log('4. Deploy the function:');
  console.log('   supabase functions deploy images');
  console.log('5. Set up the required environment variables:');
  console.log('   supabase secrets set PEXELS_API_KEY=<your-pexels-api-key>');
  console.log('\nAlternatively, you can deploy via the Supabase Dashboard:');
  console.log('1. Go to your project dashboard');
  console.log('2. Navigate to Edge Functions');
  console.log('3. Create a new function named "images"');
  console.log('4. Upload the code from supabase/functions/images/index.ts');
  console.log('5. Add the PEXELS_API_KEY environment variable');
};

(async () => {
  console.log('==========================================');
  console.log('Atollsvibe Edge Functions Diagnostic');
  console.log('==========================================');
  
  if (verbose) {
    console.log('Checking Supabase configuration first...');
    await checkSupabaseConfig();
  }
  
  console.log('\nTesting Edge Functions...');
  const result = await checkEdgeFunctions();
  
  if (result.status === 'success') {
    console.log('\n✅ Edge Functions are working correctly!');
  } else {
    console.log('\n❌ Edge Functions test failed');
    console.log('Error:', result.message);
    printEdgeFunctionsHelp();
  }
  
  if (result.status === 'success' && result.data) {
    if (verbose) {
      console.log('\nSample image data received:');
      console.log(JSON.stringify(result.data.photos[0], null, 2));
    } else {
      console.log(`\nSuccessfully retrieved ${result.data.photos.length} images from the API`);
    }
  }
})();
