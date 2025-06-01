/**
 * Content Script Error Handler
 * 
 * This module provides a robust solution for handling the "caches is not defined" error
 * that occurs when browser extensions try to use the Cache API in content script contexts.
 * 
 * This addresses the specific error:
 * ReferenceError: caches is not defined at ch-content-script-dend.js
 */

// Define a safe cache implementation for content scripts
class ContentScriptSafeCache {
  constructor() {
    this.store = new Map();
  }

  async match(request) {
    try {
      const key = request instanceof Request ? request.url : String(request);
      if (this.store.has(key)) {
        const data = this.store.get(key);
        return new Response(data);
      }
      return undefined;
    } catch (error) {
      console.debug('ContentScriptSafeCache match error:', error);
      return undefined;
    }
  }

  async put(request, response) {
    try {
      const key = request instanceof Request ? request.url : String(request);
      if (response && typeof response.text === 'function') {
        const text = await response.text();
        this.store.set(key, text);
      } else {
        this.store.set(key, String(response));
      }
    } catch (error) {
      console.debug('ContentScriptSafeCache put error:', error);
    }
  }

  async delete(request) {
    try {
      const key = request instanceof Request ? request.url : String(request);
      return this.store.delete(key);
    } catch (error) {
      console.debug('ContentScriptSafeCache delete error:', error);
      return false;
    }
  }

  async keys() {
    try {
      return Array.from(this.store.keys());
    } catch (error) {
      console.debug('ContentScriptSafeCache keys error:', error);
      return [];
    }
  }
}

class ContentScriptSafeCacheStorage {
  constructor() {
    this.caches = new Map();
  }

  async open(cacheName) {
    try {
      if (!this.caches.has(cacheName)) {
        this.caches.set(cacheName, new ContentScriptSafeCache());
      }
      return this.caches.get(cacheName);
    } catch (error) {
      console.debug('ContentScriptSafeCacheStorage open error:', error);
      return new ContentScriptSafeCache();
    }
  }

  async has(cacheName) {
    try {
      return this.caches.has(cacheName);
    } catch (error) {
      console.debug('ContentScriptSafeCacheStorage has error:', error);
      return false;
    }
  }

  async delete(cacheName) {
    try {
      return this.caches.delete(cacheName);
    } catch (error) {
      console.debug('ContentScriptSafeCacheStorage delete error:', error);
      return false;
    }
  }

  async keys() {
    try {
      return Array.from(this.caches.keys());
    } catch (error) {
      console.debug('ContentScriptSafeCacheStorage keys error:', error);
      return [];
    }
  }

  async match(request, options) {
    try {
      for (const cache of this.caches.values()) {
        const response = await cache.match(request);
        if (response) return response;
      }
      return undefined;
    } catch (error) {
      console.debug('ContentScriptSafeCacheStorage match error:', error);
      return undefined;
    }
  }
}

/**
 * Install the content script safe cache implementation
 */
export function installContentScriptSafeCache() {
  // Only install if caches is not already defined
  if (typeof caches === 'undefined') {
    console.log('Installing content script safe cache implementation...');
    
    const safeCacheStorage = new ContentScriptSafeCacheStorage();
    
    // Install on multiple contexts to ensure coverage
    const contexts = [window, self, globalThis];
    
    contexts.forEach(context => {
      if (context && typeof context.caches === 'undefined') {
        try {
          // Try to use Object.defineProperty for immutable installation
          Object.defineProperty(context, 'caches', {
            value: safeCacheStorage,
            writable: false,
            configurable: false,
            enumerable: false
          });
          console.debug('Content script safe cache installed on context:', context.constructor.name);
        } catch (defineError) {
          // Fallback to direct assignment
          try {
            context.caches = safeCacheStorage;
            console.debug('Content script safe cache installed via assignment on context:', context.constructor.name);
          } catch (assignError) {
            console.debug('Failed to install content script safe cache on context:', assignError);
          }
        }
      }
    });
    
    return true;
  } else {
    console.debug('Cache API already available, skipping content script safe cache installation');
    return false;
  }
}

/**
 * Enhanced error suppression for content script cache errors
 */
export function suppressContentScriptCacheErrors() {
  // List of known problematic content script files
  const CONTENT_SCRIPT_FILES = [
    'ch-content-script-dend.js',
    'content-script-utils.js',
    'content-script-idle.js',
    'CacheStore.js'
  ];

  // Cache error patterns to suppress
  const CACHE_ERROR_PATTERNS = [
    'caches is not defined',
    'Cache get failed',
    'Cache set failed',
    'ReferenceError: caches is not defined'
  ];

  // Override window.onerror to catch and suppress content script cache errors
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if this is a content script cache error
    const isContentScriptError = CONTENT_SCRIPT_FILES.some(file => 
      source && source.includes(file)
    );
    
    const isCacheError = CACHE_ERROR_PATTERNS.some(pattern =>
      message && message.includes(pattern)
    );
    
    if (isContentScriptError && isCacheError) {
      console.debug(`[Content Script Error Suppressed] ${message} from ${source}`);
      return true; // Suppress the error
    }
    
    // Call original handler for other errors
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Also handle unhandled promise rejections
  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    const reason = event.reason;
    
    if (reason && reason.message) {
      const isCacheError = CACHE_ERROR_PATTERNS.some(pattern =>
        reason.message.includes(pattern)
      );
      
      const isContentScriptError = reason.stack && CONTENT_SCRIPT_FILES.some(file =>
        reason.stack.includes(file)
      );
      
      if (isContentScriptError && isCacheError) {
        console.debug(`[Content Script Promise Rejection Suppressed] ${reason.message}`);
        event.preventDefault();
        return;
      }
    }
    
    // Call original handler for other rejections
    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.call(this, event);
    }
  };

  console.log('Content script cache error suppression activated');
}

/**
 * Initialize all content script safety measures
 */
export function initializeContentScriptSafety() {
  // Install the safe cache implementation
  installContentScriptSafeCache();
  
  // Activate error suppression
  suppressContentScriptCacheErrors();
  
  console.log('Content script safety measures initialized');
}

// Auto-initialize if this script is loaded in a browser context
if (typeof window !== 'undefined') {
  // Run immediately
  initializeContentScriptSafety();
  
  // Also run on DOMContentLoaded in case extensions load later
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScriptSafety);
  }
}
