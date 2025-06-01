/**
 * CacheStore - A storage system that avoids Cache API completely
 * 
 * This class uses chrome.storage.local as primary storage with localStorage
 * and memory storage as fallbacks, completely avoiding the problematic Cache API
 * that causes issues in browser extension contexts.
 */

class CacheStore {
  constructor(cacheName = 'default-cache') {
    this.cacheName = cacheName;
    this.isExtensionContext = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
    this.memoryCache = new Map();
    
    // Initialize chrome storage availability check
    this.chromeStorageAvailable = this.isExtensionContext;
    
    // Test chrome.storage.local availability on first use
    if (this.isExtensionContext) {
      this._testChromeStorage();
    }
  }

  /**
   * Test if chrome.storage.local is actually working
   */
  async _testChromeStorage() {
    try {
      await chrome.storage.local.set({ [`${this.cacheName}_test`]: 'test' });
      await chrome.storage.local.remove(`${this.cacheName}_test`);
      this.chromeStorageAvailable = true;
    } catch (error) {
      console.debug('Chrome storage test failed, will use localStorage fallback');
      this.chromeStorageAvailable = false;
    }
  }
  /**
   * Get an item from cache using chrome.storage.local or localStorage
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached value or null if not found
   */
  async get(key) {
    const storageKey = `${this.cacheName}:${key}`;
    
    try {
      // Try chrome.storage.local first (if available)
      if (this.chromeStorageAvailable) {
        try {
          const result = await chrome.storage.local.get(storageKey);
          if (result[storageKey] !== undefined) {
            return result[storageKey];
          }
        } catch (chromeError) {
          console.debug(`Chrome storage get failed for key ${key}, falling back to localStorage:`, chromeError);
          this.chromeStorageAvailable = false;
        }
      }
      
      // Fallback to localStorage
      try {
        const item = localStorage.getItem(storageKey);
        if (item !== null) {
          return JSON.parse(item);
        }
      } catch (localStorageError) {
        console.debug(`localStorage get failed for key ${key}, using memory cache:`, localStorageError);
      }
      
      // Final fallback to memory cache
      return this.memoryCache.get(key) || null;
      
    } catch (err) {
      console.debug(`Cache get failed for key ${key}, using memory cache:`, err);
      return this.memoryCache.get(key) || null;
    }
  }
  /**
   * Set an item in cache using chrome.storage.local or localStorage
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @returns {Promise<boolean>} - Success status
   */
  async set(key, value) {
    const storageKey = `${this.cacheName}:${key}`;
    
    try {
      // Always store in memory cache for immediate access
      this.memoryCache.set(key, value);
      
      // Try chrome.storage.local first (if available)
      if (this.chromeStorageAvailable) {
        try {
          await chrome.storage.local.set({ [storageKey]: value });
          return true;
        } catch (chromeError) {
          console.debug(`Chrome storage set failed for key ${key}, falling back to localStorage:`, chromeError);
          this.chromeStorageAvailable = false;
        }
      }
      
      // Fallback to localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
        return true;
      } catch (localStorageError) {
        console.debug(`localStorage set failed for key ${key}, using memory cache only:`, localStorageError);
        // Memory cache was already set above, so this is still considered a success
        return true;
      }
      
    } catch (err) {
      console.debug(`Cache set failed for key ${key}, using memory cache only:`, err);
      // Memory cache fallback was already set above
      return false;
    }
  }
  /**
   * Delete an item from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  async delete(key) {
    const storageKey = `${this.cacheName}:${key}`;
    
    try {
      // Remove from memory cache
      this.memoryCache.delete(key);
      
      // Try chrome.storage.local first (if available)
      if (this.chromeStorageAvailable) {
        try {
          await chrome.storage.local.remove(storageKey);
        } catch (chromeError) {
          console.debug(`Chrome storage delete failed for key ${key}:`, chromeError);
          this.chromeStorageAvailable = false;
        }
      }
      
      // Also remove from localStorage
      try {
        localStorage.removeItem(storageKey);
      } catch (localStorageError) {
        console.debug(`localStorage delete failed for key ${key}:`, localStorageError);
      }
      
      return true;
    } catch (err) {
      console.debug(`Cache delete failed for key ${key}:`, err);
      return false;
    }
  }
  /**
   * Clear all cache entries
   * @returns {Promise<boolean>} - Success status
   */
  async clear() {
    try {
      // Clear memory cache
      this.memoryCache.clear();
      
      // Clear chrome.storage.local entries (if available)
      if (this.chromeStorageAvailable) {
        try {
          // Get all keys and filter for our cache
          const allKeys = await chrome.storage.local.get(null);
          const keysToRemove = Object.keys(allKeys).filter(key => 
            key.startsWith(`${this.cacheName}:`)
          );
          
          if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
          }
        } catch (chromeError) {
          console.debug(`Chrome storage clear failed:`, chromeError);
          this.chromeStorageAvailable = false;
        }
      }
      
      // Clear localStorage entries
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`${this.cacheName}:`)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (localStorageError) {
        console.debug(`localStorage clear failed:`, localStorageError);
      }
      
      return true;
    } catch (err) {
      console.debug('Cache clear failed:', err);
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
