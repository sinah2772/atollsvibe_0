/**
 * Browser extension compatibility module
 * 
 * This module provides patches for known browser extensions that might conflict
 * with the application, particularly around cache APIs.
 */

// Import our cache polyfill to ensure it's available globally
import './cachePolyfill';

// List of browser extensions we know may cause issues
const KNOWN_PROBLEMATIC_EXTENSIONS = [
  'GenAIWebpageEligibilityService',
  'ActionableCoachmark',
  'CacheStore'
];

// Apply patches immediately when this module loads
applyExtensionPatches();

// Also apply patches after the window/document is fully loaded in case extensions load later
window.addEventListener('DOMContentLoaded', () => {
  applyExtensionPatches();
});

// Apply patches when the window loads completely
window.addEventListener('load', () => {
  applyExtensionPatches();
});

// Detect and apply patches for known problematic extensions
function applyExtensionPatches() {
  console.log('Applying browser extension compatibility patches...');
  
  // First, ensure our cache polyfill is in place
  if (typeof window.caches === 'undefined') {
    console.warn('Cache API still not available, extensions may cause errors');
  }
  
  // Detect if any problematic extensions are present by checking for their methods
  const extensionMethods = [
    'GenAIWebpageEligibilityService',
    'ActionableCoachmark',
    'CacheStore'
  ];
  
  extensionMethods.forEach(methodName => {
    // Check if the method exists on window or any global scope
    if (window[methodName] || (typeof globalThis !== 'undefined' && globalThis[methodName])) {
      console.log(`Detected potentially conflicting extension method: ${methodName}`);
      
      // Apply specific patches based on the method
      switch (methodName) {
        case 'CacheStore':
          patchCacheStore();
          break;
        case 'GenAIWebpageEligibilityService':
          patchGenAIService();
          break;
        case 'ActionableCoachmark':
          patchActionableCoachmark();
          break;
      }
    }
  });
  
  // Monitor for extension errors and apply runtime patches
  monitorForExtensionErrors();
  
  // Try to patch any existing extension CacheStore instances
  patchExistingCacheStores();
}

// Patch the CacheStore implementation
function patchCacheStore() {
  try {
    // If we detect that CacheStore is present but caches API is not,
    // we need to provide a mock implementation
    if (window.CacheStore && typeof caches === 'undefined') {
      console.log('Patching CacheStore for compatibility');
      
      // Create a replacement CacheStore constructor that uses localStorage
      const OriginalCacheStore = window.CacheStore;
      
      window.CacheStore = function(cacheName = 'default-cache') {
        // If this is not called as a constructor, redirect to the proper constructor
        if (!(this instanceof window.CacheStore)) {
          return new window.CacheStore(cacheName);
        }
        
        this.cacheName = cacheName;
        this.memoryCache = new Map();
        
        // Override the problematic methods
        this.get = async function(key) {
          try {
            // Try localStorage first
            const item = localStorage.getItem(`cache-patch:${this.cacheName}:${key}`);
            return item ? JSON.parse(item) : this.memoryCache.get(key) || null;
          } catch (err) {
            // Fall back to memory cache
            return this.memoryCache.get(key) || null;
          }
        };
        
        this.set = async function(key, value) {
          try {
            localStorage.setItem(`cache-patch:${this.cacheName}:${key}`, JSON.stringify(value));
            this.memoryCache.set(key, value);
            return true;
          } catch (err) {
            // Fall back to memory cache only
            this.memoryCache.set(key, value);
            return false;
          }
        };
        
        this.getWithTTL = async function(key) {
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
        };
        
        this.setWithTTL = async function(key, value, ttlSeconds = 3600) {
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
        };
        
        this.delete = async function(key) {
          try {
            localStorage.removeItem(`cache-patch:${this.cacheName}:${key}`);
            this.memoryCache.delete(key);
            return true;
          } catch (err) {
            // Try only memory cache
            this.memoryCache.delete(key);
            return false;
          }
        };
      };
      
      // Copy over any static properties
      for (const prop in OriginalCacheStore) {
        if (Object.prototype.hasOwnProperty.call(OriginalCacheStore, prop)) {
          window.CacheStore[prop] = OriginalCacheStore[prop];
        }
      }
    }
  } catch (err) {
    console.error('Failed to patch CacheStore:', err);
  }
}

// Patch GenAIWebpageEligibilityService
function patchGenAIService() {
  try {
    if (window.GenAIWebpageEligibilityService) {
      const proto = window.GenAIWebpageEligibilityService.prototype;
      
      // Patch getExplicitBlockList method
      if (proto.getExplicitBlockList) {
        const original = proto.getExplicitBlockList;
        proto.getExplicitBlockList = async function(...args) {
          try {
            return await original.apply(this, args);
          } catch (err) {
            console.warn('Caught error in getExplicitBlockList:', err);
            return { blockList: [] };
          }
        };
      }
      
      // Patch _shouldShowTouchpoints method
      if (proto._shouldShowTouchpoints) {
        const original = proto._shouldShowTouchpoints;
        proto._shouldShowTouchpoints = async function(...args) {
          try {
            return await original.apply(this, args);
          } catch (err) {
            console.warn('Caught error in _shouldShowTouchpoints:', err);
            return false;
          }
        };
      }
      
      // Patch shouldShowTouchpoints method
      if (proto.shouldShowTouchpoints) {
        const original = proto.shouldShowTouchpoints;
        proto.shouldShowTouchpoints = async function(...args) {
          try {
            return await original.apply(this, args);
          } catch (err) {
            console.warn('Caught error in shouldShowTouchpoints:', err);
            return false;
          }
        };
      }
    }
  } catch (err) {
    console.error('Failed to patch GenAIWebpageEligibilityService:', err);
  }
}

// Patch ActionableCoachmark
function patchActionableCoachmark() {
  try {
    if (window.ActionableCoachmark) {
      const proto = window.ActionableCoachmark.prototype;
      
      // Patch isEligible method
      if (proto.isEligible) {
        const original = proto.isEligible;
        proto.isEligible = async function(...args) {
          try {
            return await original.apply(this, args);
          } catch (err) {
            console.warn('Caught error in ActionableCoachmark.isEligible:', err);
            return false;
          }
        };
      }
    }
  } catch (err) {
    console.error('Failed to patch ActionableCoachmark:', err);
  }
}

// Set up global error monitoring for extension errors
function monitorForExtensionErrors() {
  // Create a record to avoid reporting the same error repeatedly
  const reportedErrors = new Set();
  
  // Original window.onerror
  const originalOnError = window.onerror;
  
  // Override window.onerror
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if this is a cache-related error
    if (message && (
        message.includes('caches is not defined') || 
        message.includes('CacheStore') ||
        (error && error.stack && (
          error.stack.includes('CacheStore') || 
          error.stack.includes('GenAIWebpageEligibilityService') ||
          error.stack.includes('ActionableCoachmark')
        ))
      )
    ) {
      // Create a unique ID for this error
      const errorId = `${message}:${source}:${lineno}:${colno}`;
      
      // Only handle if we haven't seen it before
      if (!reportedErrors.has(errorId)) {
        console.warn('Detected and suppressed browser extension error:', message);
        reportedErrors.add(errorId);
        
        // If this is a 'caches is not defined' error, try to install our polyfill
        if (message.includes('caches is not defined') && typeof caches === 'undefined') {
          console.log('Attempting to install caches polyfill after error detection');
          
          // Simple Map-based cache implementation for global context
          const globalContext = typeof window !== 'undefined' ? window : self;
          
          if (!globalContext.caches) {
            class Cache {
              constructor() { this.store = new Map(); }
              async match(request) {
                const key = request instanceof Request ? request.url : String(request);
                if (this.store.has(key)) return new Response(this.store.get(key));
                return undefined;
              }
              async put(request, response) {
                const key = request instanceof Request ? request.url : String(request);
                try {
                  const clone = response.clone();
                  const text = await clone.text();
                  this.store.set(key, text);
                } catch (e) {
                  this.store.set(key, String(response));
                }
                return;
              }
              async delete(request) {
                const key = request instanceof Request ? request.url : String(request);
                return this.store.delete(key);
              }
            }
            class CacheStorage {
              constructor() { this.caches = new Map(); }
              async open(cacheName) {
                if (!this.caches.has(cacheName)) this.caches.set(cacheName, new Cache());
                return this.caches.get(cacheName);
              }
              async has(cacheName) { return this.caches.has(cacheName); }
              async delete(cacheName) { return this.caches.delete(cacheName); }
              async keys() { return Array.from(this.caches.keys()); }
            }
            
            globalContext.caches = new CacheStorage();
            console.log('Installed emergency caches polyfill after error detection');
          }
        }
        
        // Prevent the error from propagating to the console
        return true;
      }
    }
    
    // Call the original handler if it exists
    if (typeof originalOnError === 'function') {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
      // Return false to let the error propagate
    return false;
  };
  
  // Set up unhandled promise rejection handling
  const originalPromiseRejection = window.onunhandledrejection;
  
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    if (reason && typeof reason.message === 'string' && (
        reason.message.includes('caches is not defined') ||
        reason.message.includes('CacheStore') ||
        (reason.stack && (
          reason.stack.includes('GenAIWebpageEligibilityService') ||
          reason.stack.includes('ActionableCoachmark')
        ))
      )) {
      
      console.warn('Detected and suppressed browser extension promise rejection:', reason.message);
      event.preventDefault(); // Prevent the error from showing up in console
    }  });
}

// Function to patch existing CacheStore instances that might be created by extensions
function patchExistingCacheStores() {
  try {
    // Look for CacheStore instances in common extension namespaces
    const possibleNamespaces = [window, globalThis];
    
    possibleNamespaces.forEach(namespace => {
      if (namespace && typeof namespace === 'object') {
        Object.keys(namespace).forEach(key => {
          try {
            const obj = namespace[key];
            if (obj && typeof obj === 'object' && obj.constructor && obj.constructor.name === 'CacheStore') {
              console.log(`Found CacheStore instance at ${key}, applying compatibility patch`);
              
              // Wrap the get and set methods with error handling
              if (typeof obj.get === 'function') {
                const originalGet = obj.get;
                obj.get = async function(...args) {
                  try {
                    return await originalGet.apply(this, args);
                  } catch (error) {
                    if (error.message.includes('caches is not defined')) {
                      console.warn('CacheStore.get failed due to missing caches API, returning null');
                      return null;
                    }
                    throw error;
                  }
                };
              }
              
              if (typeof obj.set === 'function') {
                const originalSet = obj.set;
                obj.set = async function(...args) {
                  try {
                    return await originalSet.apply(this, args);
                  } catch (error) {
                    if (error.message.includes('caches is not defined')) {
                      console.warn('CacheStore.set failed due to missing caches API, ignoring');
                      return false;
                    }
                    throw error;
                  }
                };
              }
            }
          } catch (error) {
            // Ignore errors when checking objects
          }
        });
      }
    });
  } catch (error) {
    console.warn('Error while patching existing CacheStore instances:', error);
  }
}

export default {
  applyExtensionPatches
};
