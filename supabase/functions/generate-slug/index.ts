// This is a Supabase Edge Function that generates and validates slugs
// Learn more about Edge Functions: https://supabase.com/docs/guides/functions

// @ts-ignore - These imports are handled by Deno runtime
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore - These imports are handled by Deno runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    // CORS headers
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Update this to match your front-end domain
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response("OK", { headers });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers }
      );
    }

    // Parse the request body
    const { title, table = "articles", existingSlug = null, id = null } = await req.json();

    // Validate the request
    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers }
      );
    }

    // Create a Supabase client
    // @ts-ignore - Deno is available in edge function environment
    const supabaseClient = createClient(
      // @ts-ignore - Deno.env is available in edge function environment
      Deno.env.get("SUPABASE_URL") || "",
      // @ts-ignore - Deno.env is available in edge function environment
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    // Generate a slug from the title
    const baseSlug = generateSlug(title);
    
    // If we're updating an existing item and the slug hasn't changed, return the existing slug
    if (existingSlug && baseSlug === existingSlug) {
      return new Response(
        JSON.stringify({ slug: existingSlug, isUnique: true }),
        { headers }
      );
    }

    // Check if the slug already exists in the database
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;
    
    while (!isUnique) {
      let query = supabaseClient
        .from(table)
        .select('id')
        .eq('slug', slug);
      
      // If we're updating an existing item, exclude it from the check
      if (id !== null) {
        query = query.neq('id', id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data && data.length === 0) {
        isUnique = true;
      } else {
        // If the slug already exists, append a counter
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    return new Response(
      JSON.stringify({ slug, isUnique: true }),
      { headers }
    );

  } catch (error) {
    console.error("Error generating slug:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { 
        status: 500, 
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        } 
      }
    );
  }
});

// Function to generate a slug from a string
function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .substring(0, 200); // Limit the length of the slug
}
