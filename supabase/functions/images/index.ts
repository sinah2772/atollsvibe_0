// Importing in this unique Deno style - VS Code might show errors but it works in Deno runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Error response helper - used to create consistent error responses
function errorResponse(message: string, status = 500) {
  console.error(`Error: ${message}`);
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = 15;

    // Get API key from environment variable
    // This code runs in Deno Edge Functions where Deno namespace is available
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pexelsApiKey = Deno?.env?.get('PEXELS_API_KEY');
    if (!pexelsApiKey) {
      throw new Error('Pexels API key not configured');
    }

    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query || 'maldives')}&per_page=${perPage}&page=${page}`;
    
    const response = await fetch(pexelsUrl, {
      headers: {
        'Authorization': pexelsApiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
});