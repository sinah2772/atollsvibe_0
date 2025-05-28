// @ts-ignore - This will be handled by Deno runtime
import { defineConfig } from '@supabase/functions-js';

export default defineConfig({
  env: {
    // You can define environment variables here, but for security reasons,
    // it's better to configure them in the Supabase Dashboard
    RUNTIME_ENV: 'production',
  },
});
