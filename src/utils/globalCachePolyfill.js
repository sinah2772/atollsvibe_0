/**
 * Global Cache API Polyfill
 * 
 * This polyfill is designed to be injected as early as possible to prevent
 * browser extension errors related to the Cache API not being available.
 * 
 * This specifically addresses these errors:
 * - CacheStore.js:18 Cache get failed: ReferenceError: caches is not defined
 * - CacheStore.js:18 Cache set failed: ReferenceError: caches is not defined
 */

(function() {
  'use strict';
  
  // Define all possible global contexts
  const contexts = [];
  
  if (typeof window !== 'undefined') contexts.push(window);
  if (typeof self !== 'undefined') contexts.push(self);
  if (typeof globalThis !== 'undefined') contexts.push(globalThis);
  if (typeof global !== 'undefined') contexts.push(global);
  
  // Check if any context already has the caches API
  const hasExistingCaches = contexts.some(ctx => typeof ctx.caches !== 'undefined');
  
  if (hasExistingCaches) {
    console.log('Cache API already available, skipping polyfill');
    return;
  }
  
  console.log('Installing global Cache API polyfill...');
  
  // Simple Cache implementation
  class Cache {
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
        console.warn('Cache match error:', error);
        return undefined;
      }
    }

    async put(request, response) {
      try {
        const key = request instanceof Request ? request.url : String(request);
        if (response && typeof response.clone === 'function') {
          const clone = response.clone();
          const text = await clone.text();
          this.store.set(key, text);
        } else {
          this.store.set(key, String(response));
        }
      } catch (error) {
        console.warn('Cache put error:', error);
      }
    }

    async delete(request) {
      try {
        const key = request instanceof Request ? request.url : String(request);
        return this.store.delete(key);
      } catch (error) {
        console.warn('Cache delete error:', error);
        return false;
      }
    }
    
    async keys() {
      try {
        return Array.from(this.store.keys()).map(key => new Request(key));
      } catch (error) {
        console.warn('Cache keys error:', error);
        return [];
      }
    }
  }

  // CacheStorage implementation
  class CacheStorage {
    constructor() {
      this.caches = new Map();
    }

    async open(cacheName) {
      try {
        if (!this.caches.has(cacheName)) {
          this.caches.set(cacheName, new Cache());
        }
        return this.caches.get(cacheName);
      } catch (error) {
        console.warn('CacheStorage open error:', error);
        return new Cache(); // Return a new cache as fallback
      }
    }

    async has(cacheName) {
      try {
        return this.caches.has(cacheName);
      } catch (error) {
        console.warn('CacheStorage has error:', error);
        return false;
      }
    }

    async delete(cacheName) {
      try {
        return this.caches.delete(cacheName);
      } catch (error) {
        console.warn('CacheStorage delete error:', error);
        return false;
      }
    }

    async keys() {
      try {
        return Array.from(this.caches.keys());
      } catch (error) {
        console.warn('CacheStorage keys error:', error);
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
        console.warn('CacheStorage match error:', error);
        return undefined;
      }
    }
  }
  
  // Create the polyfill instance
  const cacheStorage = new CacheStorage();
  
  // Install the polyfill on all available contexts
  contexts.forEach(ctx => {
    try {
      Object.defineProperty(ctx, 'caches', {
        value: cacheStorage,
        writable: false,
        configurable: true,
        enumerable: false
      });
      
      console.log('Cache API polyfill installed on context:', ctx.constructor.name);
    } catch (error) {
      console.warn('Failed to install polyfill on context:', error);
    }
  });
  
  // Also try to set it as a simple property as fallback
  contexts.forEach(ctx => {
    if (!ctx.caches) {
      try {
        ctx.caches = cacheStorage;
      } catch (error) {
        console.warn('Failed to set caches property:', error);
      }
    }
  });
  
  console.log('Global Cache API polyfill installation complete');
  
})();
