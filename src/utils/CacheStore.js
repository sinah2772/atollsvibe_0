/**
 * CacheStore - A wrapper for cache API that works in both browser and service worker contexts
 * 
 * This class provides a fallback to localStorage when the Cache API is not available,
 * ensuring cache operations don't fail regardless of execution context.
 */

class CacheStore {
  constructor(cacheName = 'default-cache') {
    this.cacheName = cacheName;
    this.isServiceWorker = typeof self !== 'undefined' && typeof self.clients !== 'undefined';
    // Check if Cache API is available
    this.cacheAvailable = typeof caches !== 'undefined';
    // Use memory cache as fallback when Cache API is not available
    this.memoryCache = new Map();
  }

  /**
   * Get an item from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached value or null if not found
   */
  async get(key) {
    try {
      if (this.cacheAvailable) {
        const cache = await caches.open(this.cacheName);
        const response = await cache.match(new Request(key));
        if (response) {
          return await response.json();
        }
        return null;
      } else {
        // Fallback to localStorage or memory cache
        try {
          const item = localStorage.getItem(`cache:${this.cacheName}:${key}`);
          return item ? JSON.parse(item) : this.memoryCache.get(key) || null;
        } catch (e) {
          // If localStorage fails (e.g., in private browsing), use memory cache
          return this.memoryCache.get(key) || null;
        }
      }
    } catch (err) {
      console.warn(`Cache get failed for key ${key}:`, err);
      // Try memory cache as last resort
      return this.memoryCache.get(key) || null;
    }
  }

  /**
   * Set an item in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @returns {Promise<boolean>} - Success status
   */
  async set(key, value) {
    try {
      if (this.cacheAvailable) {
        const cache = await caches.open(this.cacheName);
        const response = new Response(JSON.stringify(value), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        await cache.put(new Request(key), response);
      } else {
        // Fallback to localStorage or memory cache
        try {
          localStorage.setItem(`cache:${this.cacheName}:${key}`, JSON.stringify(value));
        } catch (e) {
          // If localStorage fails, use memory cache
          this.memoryCache.set(key, value);
        }
      }
      return true;
    } catch (err) {
      console.warn(`Cache set failed for key ${key}:`, err);
      // Use memory cache as last resort
      this.memoryCache.set(key, value);
      return false;
    }
  }

  /**
   * Delete an item from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  async delete(key) {
    try {
      if (this.cacheAvailable) {
        const cache = await caches.open(this.cacheName);
        await cache.delete(new Request(key));
      }
      
      // Always clear from fallback stores too
      try {
        localStorage.removeItem(`cache:${this.cacheName}:${key}`);
      } catch (e) {
        // Ignore localStorage errors
      }
      this.memoryCache.delete(key);
      
      return true;
    } catch (err) {
      console.warn(`Cache delete failed for key ${key}:`, err);
      return false;
    }
  }

  /**
   * Clear all cache entries
   * @returns {Promise<boolean>} - Success status
   */
  async clear() {
    try {
      if (this.cacheAvailable) {
        await caches.delete(this.cacheName);
      }
      
      // Clear fallback stores too
      this.memoryCache.clear();
      
      try {
        // Clear localStorage entries for this cache
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(`cache:${this.cacheName}:`)) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // Ignore localStorage errors
      }
      
      return true;
    } catch (err) {
      console.warn('Cache clear failed:', err);
      return false;
    }
  }

  /**
   * Get with time-to-live functionality
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached value or null if expired or not found
   */
  async getWithTTL(key) {
    try {
      const data = await this.get(key);
      if (!data) return null;
      
      const { value, expiry } = data;
      if (!expiry || Date.now() < expiry) {
        return value;
      }
      
      // Expired - delete and return null
      await this.delete(key);
      return null;
    } catch (err) {
      console.warn(`Cache getWithTTL failed for key ${key}:`, err);
      return null;
    }
  }

  /**
   * Set with time-to-live functionality
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlSeconds - Time to live in seconds
   * @returns {Promise<boolean>} - Success status
   */
  async setWithTTL(key, value, ttlSeconds = 3600) {
    try {
      const data = {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      };
      return await this.set(key, data);
    } catch (err) {
      console.warn(`Cache setWithTTL failed for key ${key}:`, err);
      return false;
    }
  }
}

// Export singleton instance with default cache name
export const defaultCache = new CacheStore('atollsvibe-cache');

// Export class for custom cache instances
export default CacheStore;
