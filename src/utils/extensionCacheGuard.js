/**
 * Extension Cache Guard - Advanced protection against extension cache errors
 * 
 * This module provides aggressive protection against browser extension content scripts
 * that try to use the Cache API in contexts where it's not available.
 * 
 * Specifically targets errors like:
 * - CacheStore.js:18 Cache get failed: ReferenceError: caches is not defined
 */

(function() {
  'use strict';
  
  console.debug('[Extension Cache Guard] Initializing advanced cache protection');
  
  // Enhanced safe cache implementation
  const createSafeCache = () => ({
    async match(request) {
      console.debug('[Extension Cache Guard] Cache match called, returning undefined');
      return undefined;
    },
    async put(request, response) {
      console.debug('[Extension Cache Guard] Cache put called, ignoring');
      return;
    },
    async delete(request) {
      console.debug('[Extension Cache Guard] Cache delete called, returning false');
      return false;
    },
    async keys() {
      console.debug('[Extension Cache Guard] Cache keys called, returning empty array');
      return [];
    },
    async addAll(requests) {
      console.debug('[Extension Cache Guard] Cache addAll called, ignoring');
      return;
    }
  });
  
  const createSafeCacheStorage = () => ({
    async open(cacheName) {
      console.debug(`[Extension Cache Guard] CacheStorage open called for "${cacheName}"`);
      return createSafeCache();
    },
    async has(cacheName) {
      console.debug(`[Extension Cache Guard] CacheStorage has called for "${cacheName}"`);
      return false;
    },
    async delete(cacheName) {
      console.debug(`[Extension Cache Guard] CacheStorage delete called for "${cacheName}"`);
      return false;
    },
    async keys() {
      console.debug('[Extension Cache Guard] CacheStorage keys called');
      return [];
    },
    async match(request, options) {
      console.debug('[Extension Cache Guard] CacheStorage match called');
      return undefined;
    }
  });
  
  // Advanced polyfill installation
  function installAdvancedPolyfill(context, contextName) {
    if (!context || typeof context.caches !== 'undefined') {
      return false;
    }
    
    try {
      const safeCacheStorage = createSafeCacheStorage();
        // Try configurable property first (allows other polyfills to work)
      try {
        Object.defineProperty(context, 'caches', {
          value: safeCacheStorage,
          writable: false,
          configurable: true, // Allow other polyfills to modify if needed
          enumerable: false
        });
        console.debug(`[Extension Cache Guard] Configurable caches installed on ${contextName}`);
        return true;
      } catch (e) {
        // Fallback to writable and configurable
        Object.defineProperty(context, 'caches', {
          value: safeCacheStorage,
          writable: true,
          configurable: true,
          enumerable: false
        });
        console.debug(`[Extension Cache Guard] Configurable caches installed on ${contextName}`);
        return true;
      }
    } catch (e) {
      // Final fallback - direct assignment
      try {
        context.caches = createSafeCacheStorage();
        console.debug(`[Extension Cache Guard] Direct assignment caches installed on ${contextName}`);
        return true;
      } catch (e2) {
        console.warn(`[Extension Cache Guard] Failed to install caches on ${contextName}:`, e2);
        return false;
      }
    }
  }
  
  // Install on all known contexts
  const contexts = [
    { context: typeof window !== 'undefined' ? window : null, name: 'window' },
    { context: typeof self !== 'undefined' ? self : null, name: 'self' },
    { context: typeof globalThis !== 'undefined' ? globalThis : null, name: 'globalThis' },
    { context: typeof global !== 'undefined' ? global : null, name: 'global' }
  ];
  
  contexts.forEach(({ context, name }) => {
    if (context) {
      installAdvancedPolyfill(context, name);
    }
  });
  
  // Extension-specific error handling
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress known extension cache errors
    if (message.includes('caches is not defined') || 
        message.includes('Cache get failed') || 
        message.includes('Cache set failed')) {
      console.debug('[Extension Cache Guard] Suppressed cache error:', message);
      return;
    }
    
    return originalConsoleError.apply(console, args);
  };
  
  // Monitor for new contexts being created
  if (typeof window !== 'undefined') {
    // Watch for iframe creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'iframe') {
        element.addEventListener('load', () => {
          try {
            if (element.contentWindow) {
              installAdvancedPolyfill(element.contentWindow, 'iframe.contentWindow');
            }
          } catch (e) {
            // Cross-origin iframe, can't access
          }
        });
      }
      
      return element;
    };
    
    // Monitor for script injections by extensions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && 
                (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME')) {
              
              // Re-check cache availability after a delay
              setTimeout(() => {
                contexts.forEach(({ context, name }) => {
                  if (context && typeof context.caches === 'undefined') {
                    installAdvancedPolyfill(context, `${name}-recheck`);
                  }
                });
              }, 100);
            }
          });
        }
      });
    });
    
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
  
  // Periodic re-installation (in case extensions overwrite our polyfill)
  setInterval(() => {
    contexts.forEach(({ context, name }) => {
      if (context && typeof context.caches === 'undefined') {
        installAdvancedPolyfill(context, `${name}-periodic`);
      }
    });
  }, 5000); // Check every 5 seconds
  
  console.debug('[Extension Cache Guard] Advanced cache protection initialized');
})();

// Auto-install if in browser environment
if (typeof window !== 'undefined') {
  // Run immediately
  window.addEventListener('DOMContentLoaded', () => {
    console.debug('[Extension Cache Guard] DOM ready, cache protection active');
  });
}
