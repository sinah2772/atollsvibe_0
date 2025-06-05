// This is a Supabase Edge Function that handles an image processing request
// Learn more about Edge Functions: https://supabase.com/docs/guides/functions

// @ts-expect-error - These imports are handled by Deno runtime
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-expect-error - These imports are handled by Deno runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Sharp is a high-performance image processing library
// It's not directly available in Deno, but we could use remote APIs instead
// For this example, we'll simulate image processing using the Response directly

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

    // Only allow GET or POST requests
    if (req.method !== "GET" && req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers }
      );
    }

    // Get the request parameters
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");
    const width = Number(url.searchParams.get("width") || 800);
    const height = Number(url.searchParams.get("height") || 600);
    const format = url.searchParams.get("format") || "webp";
    const authHeader = req.headers.get("Authorization");

    // Validate the request
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers }
      );
    }

    // Create a Supabase client to verify the JWT token
    const supabaseClient = createClient(
      // @ts-expect-error - Deno.env is available in edge function environment  
      Deno.env.get("SUPABASE_URL") || "",
      // @ts-expect-error - Deno.env is available in edge function environment
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // If auth header is provided, verify the JWT token
    let userId = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data, error } = await supabaseClient.auth.getUser(token);
      
      if (error) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers }
        );
      }
      
      userId = data.user.id;
    }
    
    // Get the image from the URL
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch the image" }),
        { status: 500, headers }
      );
    }
    
    // Logging for processing information
    console.log(`Processing image: ${imageUrl} (width: ${width}, height: ${height}, format: ${format})`);
    
    // In a real implementation, here we would process the image
    // Since we don't have direct access to image processing libraries,
    // we'll just pass through the image with some modified headers
    
    // Log the access to the image for analytics
    if (userId) {
      // In a real implementation, log this to your database
      console.log(`User ${userId} accessed image: ${imageUrl}`);
    }
    
    // We're simulating image processing by returning the original image
    // In a real implementation, you would process the image with the requested parameters
    const imageData = await imageResponse.arrayBuffer();
    
    // Return the processed image
    return new Response(imageData, {
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Processed-By": "Supabase Edge Function",
        "X-Original-Size": imageResponse.headers.get("Content-Length") || "unknown",
        "X-Target-Size": `${width}x${height}`,
        "X-Target-Format": format,
      },
    });

  } catch (error) {
    console.error("Error processing image:", error);
    
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
