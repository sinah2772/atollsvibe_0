# Supabase Edge Functions

This directory contains Edge Functions that run on Supabase's Edge Functions infrastructure powered by Deno.

## Development Notes

### TypeScript Editor Support

Edge Functions use Deno, which has a different module system from Node.js. This can cause TypeScript errors in your editor for imports like:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
```

These errors are expected when working with Deno files in a Node.js context. The functions will work correctly when deployed to Supabase, even if your editor shows errors.

### Local Testing

To test functions locally:

1. Install the Supabase CLI

   ```bash
   npm install -g supabase
   ```

2. Start the local Supabase stack

   ```bash
   supabase start
   ```

3. Serve an Edge Function locally

   ```bash
   supabase functions serve images
   ```

4. Set local environment variables

   ```bash
   supabase functions env set PEXELS_API_KEY=your-api-key --local
   ```

### Deployment

Deploy Edge Functions to your Supabase project:

```bash
supabase functions deploy images
```

Set environment variables for your deployed function:

```bash
supabase secrets set PEXELS_API_KEY=your-api-key
```

## Troubleshooting

If you're experiencing issues with the images function, you can run the diagnostic tool:

```powershell
cd ../../
node edge-functions-check.js
```

For more details, see the [IMAGE-FETCH-TROUBLESHOOTING.md](../../IMAGE-FETCH-TROUBLESHOOTING.md) file in the root directory.
