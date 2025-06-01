/**
 * Cache polyfill initialization
 * 
 * This script provides a global caches API polyfill if it's not available in the current context.
 * It should be imported early in the application to ensure cache operations don't fail.
 * 
 * This polyfill specifically targets:
 * - CacheStore.js:18 Cache get failed: ReferenceError: caches is not defined
 * - CacheStore.js:18 Cache set failed: ReferenceError: caches is not defined
 */

// Only polyfill if caches is not available (browser context without Cache API support)
if (typeof caches === 'undefined') {
  console.log('Cache API not available, implementing polyfill');

  // Simple Map-based cache implementation
  class Cache {
    constructor() {
      this.store = new Map();
    }

    async match(request) {
      const key = request instanceof Request ? request.url : String(request);
      if (this.store.has(key)) {
        return new Response(this.store.get(key));
      }
      return undefined;
    }

    async put(request, response) {
      const key = request instanceof Request ? request.url : String(request);
      // Handle various response types
      try {
        const clone = response.clone();
        const text = await clone.text();
        this.store.set(key, text);
      } catch (err) {
        // Fallback for non-clonable responses or strings
        this.store.set(key, String(response));
      }
      return;
    }

    async delete(request) {
      const key = request instanceof Request ? request.url : String(request);
      return this.store.delete(key);
    }
  }

  // Global cache manager
  class CacheStorage {
    constructor() {
      this.caches = new Map();
    }

    async open(cacheName) {
      if (!this.caches.has(cacheName)) {
        this.caches.set(cacheName, new Cache());
      }
      return this.caches.get(cacheName);
    }

    async has(cacheName) {
      return this.caches.has(cacheName);
    }

    async delete(cacheName) {
      return this.caches.delete(cacheName);
    }

    async keys() {
      return Array.from(this.caches.keys());
    }
  }

  // Create global caches object - attach to either window or self depending on context
  const globalContext = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis;
  globalContext.caches = new CacheStorage();
  
  console.log('Cache API polyfill successfully installed');
}
