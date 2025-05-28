/**
 * Image Service - Handles image search and fallback
 * 
 * This service provides functions to search for images using either:
 * 1. The primary Supabase Edge Function that calls the Pexels API
 * 2. A fallback implementation using placeholder images
 */

// Default fallback images if everything fails
const FALLBACK_IMAGES = [
  {
    id: 'fallback-1',
    src: {
      medium: 'https://picsum.photos/400/300?random=1',
      large: 'https://picsum.photos/1200/800?random=1',
    },
    alt: 'Maldives Beach',
    photographer: 'Placeholder'
  },
  {
    id: 'fallback-2',
    src: {
      medium: 'https://picsum.photos/400/300?random=2',
      large: 'https://picsum.photos/1200/800?random=2',
    },
    alt: 'Maldives Island',
    photographer: 'Placeholder'
  },
  {
    id: 'fallback-3',
    src: {
      medium: 'https://picsum.photos/400/300?random=3',
      large: 'https://picsum.photos/1200/800?random=3',
    },
    alt: 'Tropical Beach',
    photographer: 'Placeholder'
  },
];

/**
 * Fetches images using the Supabase Edge Function
 */
export const fetchImagesFromSupabase = async (query: string, page: number) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/images?query=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Supabase image fetch error:', errorText);
    throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Fetches images using placeholder images as a fallback
 * This is a simple implementation that returns generic placeholder images
 * In a production app, you might integrate with another image API as backup
 */
export const fetchImagesFallback = async (_query: string, page: number) => {
  console.log('Using fallback placeholder images');
  // This is a simplified fallback that uses free placeholder images
  // In a real app, you might use another proper image API as backup
  
  return {
    page,
    per_page: 15,
    total_results: FALLBACK_IMAGES.length,
    photos: FALLBACK_IMAGES,
  };
};

/**
 * Tries to fetch images from the primary source, falls back to alternatives if needed
 */
export const fetchImages = async (query = '', page = 1) => {
  try {
    // First try the Supabase Edge Function
    return await fetchImagesFromSupabase(query, page);
  } catch (err) {
    console.warn('Primary image service failed, using fallback:', err);
    // If that fails, use the fallback implementation
    return await fetchImagesFallback(query, page);
  }
};
