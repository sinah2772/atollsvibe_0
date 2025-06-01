/**
 * Cache utility exports
 * 
 * This file re-exports CacheStore for easier imports in the application.
 */

import CacheStore, { defaultCache } from './CacheStore';

export { CacheStore, defaultCache };

// Helper functions for common cache operations
export const cacheData = async (key, data, ttlSeconds = 3600) => {
  return await defaultCache.setWithTTL(key, data, ttlSeconds);
};

export const getCachedData = async (key) => {
  return await defaultCache.getWithTTL(key);
};

export const clearCachedData = async (key) => {
  return await defaultCache.delete(key);
};

export const clearAllCache = async () => {
  return await defaultCache.clear();
};
