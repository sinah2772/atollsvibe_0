/**
 * Setup cache system for the application
 * 
 * This file handles the initialization of the cache system and polyfill,
 * ensuring compatibility across different environments including browser extensions.
 */

import './cachePolyfill';
import { defaultCache } from './cache';

// Initialize the default cache to ensure it's ready for use
export const initializeCache = async () => {
  try {
    // Test that the cache is working by storing and retrieving a test value
    await defaultCache.setWithTTL('cache-test', { status: 'ok' }, 10);
    const result = await defaultCache.getWithTTL('cache-test');
    
    if (result && result.status === 'ok') {
      console.log('Cache system initialized and working correctly');
      return true;
    } else {
      console.warn('Cache initialization check failed - cache might not be working correctly');
      return false;
    }
  } catch (err) {
    console.error('Failed to initialize cache system:', err);
    return false;
  }
};

// Function to monkey patch any known problematic code that might be causing cache errors
export const patchCacheProblems = () => {
  try {
    // This function is used to patch any known extensions or libraries that might 
    // be causing issues with the cache API
    
    // Check for GenAIWebpageEligibilityService which was seen in the error stack
    const globalContext = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis;
    
    // If we detect the problematic service, patch its methods
    if (globalContext.GenAIWebpageEligibilityService) {
      const originalGetExplicitBlockList = globalContext.GenAIWebpageEligibilityService.prototype.getExplicitBlockList;
      
      if (originalGetExplicitBlockList) {
        console.log('Patching GenAIWebpageEligibilityService.getExplicitBlockList');
        
        // Replace the method with our safe version
        globalContext.GenAIWebpageEligibilityService.prototype.getExplicitBlockList = async function(...args) {
          try {
            return await originalGetExplicitBlockList.apply(this, args);
          } catch (err) {
            console.warn('Caught error in getExplicitBlockList:', err);
            // Return a safe default value
            return { blockList: [] };
          }
        };
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error while attempting to patch cache problems:', err);
    return false;
  }
};

// Export a function that sets up the entire cache system
export const setupCacheSystem = async () => {
  // Apply any needed patches first
  await patchCacheProblems();
  
  // Then initialize the cache
  return await initializeCache();
};

// Auto-initialize when imported
setupCacheSystem().then(success => {
  if (success) {
    console.log('Cache system setup complete');
  } else {
    console.warn('Cache system setup encountered issues');
  }
});
