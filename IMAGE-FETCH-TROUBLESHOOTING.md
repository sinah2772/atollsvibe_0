# Troubleshooting Image Fetching Issues

This guide will help you resolve issues with image fetching in the AtollsVibe application. The primary issue "Failed to fetch images" is typically related to the Supabase Edge Function that fetches images from the Pexels API.

## Quick Fix

If you're experiencing image fetching issues, the app is configured to automatically fall back to a local implementation that provides some default images. You can still use the application by:

1. Using the "Upload" button in the Image Browser to upload your own images
2. Using the default fallback images that appear when the Edge Function fails

## Checking Your Environment

Make sure your `.env` file has the correct Supabase configuration:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-goes-here
```

You can run the diagnostics to check your config:

```bash
node supabase-check.js
```

## Edge Function Issues

The most common causes of image fetching failures are:

1. **Edge Function Not Deployed**: The "images" Edge Function hasn't been deployed to your Supabase project.
2. **Missing Pexels API Key**: The Edge Function is deployed but doesn't have the required `PEXELS_API_KEY` environment variable.
3. **Network/CORS Issues**: CORS or other network configuration problems between your app and Supabase.

## Deploying the Edge Function

Follow these steps to deploy the Edge Function:

1. Install the Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Log in to Supabase:

   ```bash
   supabase login
   ```

3. Link to your project:

   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy the function:

   ```bash
   supabase functions deploy images
   ```

5. Set the Pexels API Key:

   ```bash
   supabase secrets set PEXELS_API_KEY=your-pexels-api-key
   ```

If you don't have a Pexels API key, you can get one for free at [https://www.pexels.com/api/](https://www.pexels.com/api/).

## Verifying Edge Function Status

Use our diagnostic tool to verify if the Edge Function is working correctly:

```bash
node edge-functions-check.js
```

Add the `--verbose` flag for more detailed output:

```bash
node edge-functions-check.js --verbose
```

## Alternative: Using the Dashboard

You can also deploy and configure the Edge Function through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to "Edge Functions"
3. Create a new function named "images"
4. Upload the code from `supabase/functions/images/index.ts`
5. Add the `PEXELS_API_KEY` environment variable in the "Configuration" section

## Still Having Problems?

If you're still experiencing issues:

1. Check the Edge Function logs in the Supabase dashboard
2. Verify your network connectivity to Supabase
3. Ensure that function invocations are enabled in your project

The application includes a fallback mechanism that provides default images even when the Edge Function fails, so you should be able to continue using the app while resolving these issues.
