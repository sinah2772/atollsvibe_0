/**
 * Runtime Cache Interceptor
 * 
 * This module intercepts cache operations at runtime and provides safe fallbacks
 * specifically targeting the browser extension cache errors that are still occurring.
 */

(function() {
  'use strict';
  
  // Create an ultra-safe cache implementation that never throws
  const createSafeCache = () => ({
    async match() { 
      try { return undefined; } catch { return undefined; }
    },
    async put() { 
      try { return Promise.resolve(); } catch { return Promise.resolve(); }
    },
    async delete() { 
      try { return false; } catch { return false; }
    },
    async keys() { 
      try { return []; } catch { return []; }
    },
    async addAll() { 
      try { return Promise.resolve(); } catch { return Promise.resolve(); }
    }
  });
  
  const createSafeCacheStorage = () => ({
    async open() { 
      try { return createSafeCache(); } catch { return createSafeCache(); }
    },
    async has() { 
      try { return false; } catch { return false; }
    },
    async delete() { 
      try { return false; } catch { return false; }
    },
    async keys() { 
      try { return []; } catch { return []; }
    },
    async match() { 
      try { return undefined; } catch { return undefined; }
    }
  });
    // Function to force-install cache polyfill
  function forceInstallCache() {
    const safeCacheStorage = createSafeCacheStorage();
    
    // Install on all possible contexts
    [window, self, globalThis, global].filter(Boolean).forEach(ctx => {
      if (ctx) {
        // Check if caches property already exists and its configuration
        const descriptor = Object.getOwnPropertyDescriptor(ctx, 'caches');
        
        if (!descriptor) {
          // Property doesn't exist, safe to create
          try {
            Object.defineProperty(ctx, 'caches', {
              value: safeCacheStorage,
              writable: true,
              configurable: true,
              enumerable: false
            });
          } catch (err) {
            console.debug('[Runtime Cache Interceptor] Failed to define property, trying assignment:', err.message);
            try {
              ctx.caches = safeCacheStorage;
            } catch (err2) {
              console.debug('[Runtime Cache Interceptor] Assignment also failed:', err2.message);
            }
          }
        } else {
          // Property exists - check if we can modify it
          if (descriptor.configurable && (typeof ctx.caches === 'undefined' || ctx.caches === null)) {
            // Property is configurable and undefined/null, safe to set
            try {
              ctx.caches = safeCacheStorage;
            } catch (err) {
              console.debug('[Runtime Cache Interceptor] Failed to assign to configurable property:', err.message);
            }
          } else if (descriptor.configurable === false) {
            // Property is not configurable - don't try to modify it
            console.debug('[Runtime Cache Interceptor] Skipping non-configurable caches property on', ctx.constructor.name);
          }
          // If property exists and has value, leave it alone
        }
      }
    });
    
    console.debug('[Runtime Cache Interceptor] Safe cache installation completed');
  }
  
  // Install immediately
  forceInstallCache();
  
  // Monitor for cache access and reinstall if needed
  let checkCount = 0;
  const maxChecks = 100;
  
  const monitorAndReinstall = () => {
    if (checkCount >= maxChecks) return;
    checkCount++;
    
    // Check if cache is still available
    if (typeof window !== 'undefined' && typeof window.caches === 'undefined') {
      console.debug('[Runtime Cache Interceptor] Cache lost, reinstalling...');
      forceInstallCache();
    }
    
    // Schedule next check
    setTimeout(monitorAndReinstall, 100);
  };
  
  // Start monitoring
  setTimeout(monitorAndReinstall, 10);
  
  // Also reinstall on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceInstallCache);
  } else {
    forceInstallCache();
  }
  
  // Reinstall when page is fully loaded
  window.addEventListener('load', forceInstallCache);
  
  // Intercept any direct cache property access
  if (typeof window !== 'undefined') {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'caches');
    if (!descriptor || descriptor.configurable) {
      Object.defineProperty(window, 'caches', {
        get() {
          // Always return a safe cache implementation
          return createSafeCacheStorage();
        },
        set(value) {
          // Allow setting but ignore it - we always return our safe version
          console.debug('[Runtime Cache Interceptor] Cache assignment intercepted');
        },
        configurable: true,
        enumerable: false
      });
    }
  }
  
  console.debug('[Runtime Cache Interceptor] Comprehensive cache monitoring installed');
  
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
