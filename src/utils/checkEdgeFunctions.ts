/**
 * This utility checks if the edge functions are properly deployed and configured
 */

export const checkEdgeFunctions = async () => {
  console.log('Checking Edge Functions...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.log('Please ensure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined.');
    return {
      status: 'error',
      message: 'Missing environment variables'
    };
  }
  
  try {
    console.log('Testing the images edge function...');
    
    // Testing with a simple query
    const response = await fetch(
      `${supabaseUrl}/functions/v1/images?query=beach&page=1`,
      {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }
    );
    
    // Log status
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;      try {
        // Try to parse error as JSON
        const errorData = await response.json();
        errorMessage = errorData.error || `HTTP error ${response.status}`;
      } catch {
        // If not JSON, get as text
        errorMessage = await response.text() || `HTTP error ${response.status}`;
      }
      
      console.error('❌ Edge function error:', errorMessage);
      
      // Check for common issues
      if (response.status === 404) {
        console.log('\nThe Edge Function might not be deployed. You need to:');
        console.log('1. Deploy the functions using: supabase functions deploy images');
        console.log('2. Make sure your project has Edge Functions enabled');
      } else if (response.status === 401 || response.status === 403) {
        console.log('\nAuthorization issue. Check that:');
        console.log('1. Your anon key has the right permissions');
        console.log('2. Edge Functions are properly configured to accept your token');
      } else {
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure the PEXELS_API_KEY environment variable is set in your Supabase project');
        console.log('2. Check the Edge Function logs in the Supabase dashboard');
        console.log('3. Verify the function code is correctly implemented');
      }
      
      return {
        status: 'error',
        message: errorMessage
      };
    }
    
    // Try to parse the response
    const data = await response.json();
    
    if (!data || !data.photos) {
      console.error('❌ Invalid response from Edge Function');
      console.log('Response does not contain expected data structure');
      return {
        status: 'error',
        message: 'Invalid response format'
      };
    }
    
    console.log('✅ Edge Function successfully tested!');
    console.log(`Retrieved ${data.photos.length} images from the API`);
    
    return {
      status: 'success',
      data
    };
  } catch (error) {
    console.error('❌ Error testing Edge Function:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your network connectivity');
    console.log('2. Verify the Supabase URL is correct');
    console.log('3. Ensure Edge Functions are enabled for your project');
    
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
