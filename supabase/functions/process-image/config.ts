// @ts-expect-error - This will be handled by Deno runtime
import { defineConfig } from '@supabase/functions-js';

export default defineConfig({
  external_apis: {
    allowlist: [
      'api.openai.com',
      'api.cloudflare.com',
      '*.imgix.net',
      '*.cloudinary.com',
      '*.unsplash.com',
    ],
  },
  env: {
    // You can define environment variables here, but for security reasons,
    // it's better to configure them in the Supabase Dashboard
    RUNTIME_ENV: 'production',
  },
});
