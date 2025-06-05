/**
 * Content Script Error Suppressor - Specifically targets known problematic extensions
 * 
 * This module provides targeted fixes for specific browser extensions that cause
 * cache-related errors by trying to use the Cache API in unsupported contexts.
 */

(function() {
  'use strict';
  
  console.debug('[Content Script Suppressor] Initializing targeted extension fixes');
  
  // Known problematic extension files and their fixes
  const PROBLEMATIC_EXTENSIONS = {
    'ch-content-script-dend.js': 'ChatGPT Assistant extension',
    'content-script-utils.js': 'ChatGPT Assistant utilities',
    'GenAIWebpageEligibilityService.js': 'AI webpage service',
    'ActionableCoachmark.js': 'UI coaching extension',
    'content-script-idle.js': 'Extension idle handler'
  };
  
  // Create a comprehensive cache polyfill specifically for extensions
  function createExtensionSafeCache() {
    const extensionCache = {
      // Core cache methods
      async match(request) {
        console.debug('[Extension Cache] match() called - returning undefined');
        return undefined;
      },
      
      async put(request, response) {
        console.debug('[Extension Cache] put() called - operation ignored');
        return Promise.resolve();
      },
      
      async delete(request) {
        console.debug('[Extension Cache] delete() called - returning false');
        return false;
      },
      
      async keys() {
        console.debug('[Extension Cache] keys() called - returning empty array');
        return [];
      },
      
      async addAll(requests) {
        console.debug('[Extension Cache] addAll() called - operation ignored');
        return Promise.resolve();
      }
    };
    
    const extensionCacheStorage = {
      async open(cacheName) {
        console.debug(`[Extension CacheStorage] open("${cacheName}") called`);
        return extensionCache;
      },
      
      async has(cacheName) {
        console.debug(`[Extension CacheStorage] has("${cacheName}") called - returning false`);
        return false;
      },
      
      async delete(cacheName) {
        console.debug(`[Extension CacheStorage] delete("${cacheName}") called - returning false`);
        return false;
      },
      
      async keys() {
        console.debug('[Extension CacheStorage] keys() called - returning empty array');
        return [];
      },
      
      async match(request, options) {
        console.debug('[Extension CacheStorage] match() called - returning undefined');
        return undefined;
      }
    };
    
    return extensionCacheStorage;
  }
  
  // Install polyfill with maximum compatibility
  function installExtensionPolyfill() {
    const contexts = [
      { obj: window, name: 'window' },
      { obj: self, name: 'self' },
      { obj: globalThis, name: 'globalThis' }
    ];
    
    if (typeof global !== 'undefined') {
      contexts.push({ obj: global, name: 'global' });
    }
    
    contexts.forEach(({ obj, name }) => {
      if (obj && typeof obj.caches === 'undefined') {
        try {
          // Try to install with different configurations
          const cache = createExtensionSafeCache();
          
          // First try: non-configurable (most secure)
          try {
            Object.defineProperty(obj, 'caches', {
              value: cache,
              writable: false,
              configurable: false,
              enumerable: false
            });
            console.debug(`[Content Script Suppressor] Non-configurable cache installed on ${name}`);
          } catch (e) {
            // Second try: configurable (allows extensions to override if needed)
            try {
              Object.defineProperty(obj, 'caches', {
                value: cache,
                writable: true,
                configurable: true,
                enumerable: false
              });
              console.debug(`[Content Script Suppressor] Configurable cache installed on ${name}`);
            } catch (e2) {
              // Final fallback: direct assignment
              obj.caches = cache;
              console.debug(`[Content Script Suppressor] Direct assignment cache installed on ${name}`);
            }
          }
        } catch (error) {
          console.warn(`[Content Script Suppressor] Failed to install cache on ${name}:`, error);
        }
      }
    });
  }
  
  // Monitor for extension script loading
  function monitorExtensionScripts() {
    if (typeof MutationObserver === 'undefined') return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
              const src = node.src || '';
              const isProblematic = Object.keys(PROBLEMATIC_EXTENSIONS).some(ext => 
                src.includes(ext) || node.textContent?.includes(ext)
              );
              
              if (isProblematic) {
                console.debug('[Content Script Suppressor] Detected problematic extension script:', src || 'inline');
                
                // Reinstall polyfill immediately
                setTimeout(() => {
                  installExtensionPolyfill();
                }, 1);
              }
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
  
  // Error suppression for known extension errors
  function suppressExtensionErrors() {
    // Override console.error to suppress known cache errors
    const originalError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      
      // Check if this is a known extension cache error
      const isExtensionCacheError = Object.keys(PROBLEMATIC_EXTENSIONS).some(ext => 
        message.includes(ext)
      ) && (
        message.includes('caches is not defined') ||
        message.includes('Cache get failed') ||
        message.includes('Cache set failed')
      );
      
      if (isExtensionCacheError) {
        console.debug('[Content Script Suppressor] Suppressed extension cache error:', message);
        return;
      }
      
      return originalError.apply(console, args);
    };
    
    // Global error event suppression
    window.addEventListener('error', (event) => {
      const message = event.message || '';
      const filename = event.filename || '';
      
      const isExtensionError = Object.keys(PROBLEMATIC_EXTENSIONS).some(ext => 
        filename.includes(ext) || message.includes(ext)
      ) && message.includes('caches is not defined');
      
      if (isExtensionError) {
        console.debug('[Content Script Suppressor] Suppressed extension error event:', message);
        event.preventDefault();
        return false;
      }
    }, true);
  }
  
  // Initialize all protection mechanisms
  installExtensionPolyfill();
  monitorExtensionScripts();
  suppressExtensionErrors();
  
  // Periodic reinstallation (in case extensions override our polyfill)
  setInterval(() => {
    installExtensionPolyfill();
  }, 3000);
  
  console.debug('[Content Script Suppressor] All extension protection mechanisms active');
  
})();
