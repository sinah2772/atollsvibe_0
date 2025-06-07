import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase-types';

// Use hardcoded URL and environment variable for Supabase key
const supabaseUrl = 'https://vtkxjgsnnslwjzfyvdqu.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a3hqZ3NubnNsd2p6Znl2ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk4NjEsImV4cCI6MjA2MDU3NTg2MX0.kvsiZP-vug6oYs6CYU6pwxbrUL33ZCL146jWH0-DOVo';

// Log whether we have the environment variables we need
if (import.meta.env.VITE_SUPABASE_ANON_KEY === undefined) {
  console.warn('Using default anon key for Supabase. Set VITE_SUPABASE_KEY in .env for custom key');
  // This is okay for development, but should use environment variables for production
  if (!import.meta.env.DEV) {
    console.error('Missing Supabase key environment variable in production!');
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.error('Error accessing localStorage:', e);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error('Error setting localStorage item:', e);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error('Error removing localStorage item:', e);
        }
      }
    }
  },
  // Add performance improvements
  global: {
    headers: {
      'Cache-Control': 'max-age=600', // Cache responses for 10 minutes
      'X-Client-Info': 'atollsvibe/1.0.0' // Add custom client info header to track requests
    },
    fetch: (url, options) => {
      // Add performance monitoring and retry logic for fetch operations
      const startTime = performance.now();
      
      // Create a function to handle retrying the fetch with exponential backoff
      const fetchWithRetry = async (retriesLeft = 2, delay = 1000) => {
        try {
          const response = await fetch(url, {
            ...options,
            // Add a more aggressive timeout to each fetch request (reduced from 15s to 8s)
            signal: options?.signal || AbortSignal.timeout(8000)
          });
          
          const duration = performance.now() - startTime;
          if (duration > 1500) {
            console.warn(`Slow Supabase request: ${duration.toFixed(2)}ms for ${url}`);
          }
          
          return response;
        } catch (error) {
          if (retriesLeft === 0) {
            console.error(`Fetch failed after all retries for ${url}:`, error);
            throw error;
          }
          
          console.warn(`Fetch attempt failed, retrying (${retriesLeft} left):`, error);
          
          // Wait with exponential backoff before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry with one fewer retry and doubled delay
          return fetchWithRetry(retriesLeft - 1, delay * 2);
        }
      };
      
      // Return the fetch with retry logic
      return fetchWithRetry();
    }
  }
});

// Helper function to check if a user has a specific permission
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const has_permission = (_permission: string): boolean => {
  return true; // Simplified for now - will be implemented properly with roles
};