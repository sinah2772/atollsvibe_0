/**
 * Enhanced Authentication Timeout Management
 * 
 * This module provides improved timeout handling for authentication operations
 * to reduce the frequency of timeout warnings in the console.
 */

import { supabase } from '../lib/supabase';

// Define types for better TypeScript support
interface NetworkConnection extends EventTarget {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
}

interface TimeoutConfig {
  sessionFetch: number;
  authStateChange: number;
  signOut: number;
  userDataFetch: number;
}

// Optimized timeout configuration based on network conditions
const TIMEOUT_CONFIG: TimeoutConfig = {
  sessionFetch: 15000,      // Increased from 8s to 15s for session fetching
  authStateChange: 12000,   // Increased from 6s to 12s for auth state changes
  signOut: 8000,           // Increased from 5s to 8s for sign out
  userDataFetch: 10000     // 10s for user data fetching with retries
};

// Network condition detection
let networkCondition: 'fast' | 'slow' | 'offline' = 'fast';

// Detect network condition and adjust timeouts accordingly
function detectNetworkCondition(): void {
  if ('connection' in navigator) {
    const connection = (navigator as NavigatorWithConnection).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        networkCondition = 'slow';
      } else if (effectiveType === '3g') {
        networkCondition = 'fast';
      } else {
        networkCondition = 'fast';
      }
    }
  }
  
  // Also check online status
  if (!navigator.onLine) {
    networkCondition = 'offline';
  }
}

// Adjust timeouts based on network condition
function getAdjustedTimeout(baseTimeout: number): number {
  switch (networkCondition) {
    case 'slow':
      return baseTimeout * 1.5; // 50% longer for slow connections
    case 'offline':
      return baseTimeout * 0.5; // Shorter timeout if offline
    default:
      return baseTimeout;
  }
}

// Enhanced timeout wrapper with better error handling
export function withEnhancedTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  operationName: string = 'Operation'
): Promise<T> {
  detectNetworkCondition();
  const adjustedTimeout = getAdjustedTimeout(timeoutMs);
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      // More descriptive timeout messages based on network condition
      let message = `${operationName} timed out after ${adjustedTimeout}ms`;
      
      if (networkCondition === 'slow') {
        message += ' (slow network detected - this is expected)';
      } else if (networkCondition === 'offline') {
        message += ' (offline detected - check your connection)';
      }
      
      console.warn(message);
      reject(new Error(message));
    }, adjustedTimeout);
    
    operation()
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Enhanced session fetching with better timeout handling
export async function fetchSessionWithTimeout(): Promise<unknown> {
  return withEnhancedTimeout(
    () => supabase.auth.getSession(),
    TIMEOUT_CONFIG.sessionFetch,
    'Auth session fetch'
  );
}

// Enhanced user data fetching with retries
export async function fetchUserDataWithTimeout(userId: string): Promise<unknown> {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await withEnhancedTimeout(
        async () => {
          const result = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
          return result;
        },
        TIMEOUT_CONFIG.userDataFetch,
        `User data fetch (attempt ${attempt + 1}/${maxRetries})`
      );    } catch (err) {
      attempt++;
      
      if (attempt >= maxRetries) {
        throw err;
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`Retrying user data fetch in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Enhanced sign out with better error handling
export async function signOutWithTimeout(): Promise<void> {
  try {
    // Clear local storage first to ensure immediate UI update
    try {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      localStorage.removeItem('supabase.auth.refresh_token');
      sessionStorage.clear();
    } catch (storageError) {
      console.warn('Error clearing storage during sign out:', storageError);
    }
    
    // Attempt Supabase sign out with timeout
    await withEnhancedTimeout(
      () => supabase.auth.signOut(),
      TIMEOUT_CONFIG.signOut,
      'Auth sign out'    );
  } catch {
    // Don't throw on sign out timeout - the local storage has been cleared
    console.warn('Sign out timeout occurred, but local session was cleared');
  }
}

// Network status monitoring
export function initializeNetworkMonitoring(): void {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    networkCondition = 'fast';
    console.log('🌐 Network connection restored');
  });
  
  window.addEventListener('offline', () => {
    networkCondition = 'offline';
    console.log('📱 Network connection lost');
  });
    // Listen for network information changes
  if ('connection' in navigator) {
    const connection = (navigator as NavigatorWithConnection).connection;
    if (connection && connection.addEventListener) {
      connection.addEventListener('change', detectNetworkCondition);
    }
  }
  
  // Initial detection
  detectNetworkCondition();
}

// Auth state change timeout configuration
export const AUTH_TIMEOUTS = TIMEOUT_CONFIG;

// Initialize network monitoring on module load
if (typeof window !== 'undefined') {
  initializeNetworkMonitoring();
}
