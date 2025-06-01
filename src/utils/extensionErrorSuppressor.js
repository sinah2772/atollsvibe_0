/**
 * Browser Extension Error Suppressor
 * 
 * This module provides comprehensive error suppression for browser extension conflicts,
 * specifically targeting cache API errors that don't affect our application functionality.
 */

// List of known problematic extension files/methods
const EXTENSION_IDENTIFIERS = [
  'CacheStore.js',
  'GenAIWebpageEligibilityService.js',
  'ActionableCoachmark.js',
  'content-script-utils.js',
  'ch-content-script-dend.js',
  'content-script-idle.js',
  'ShowOneChild.js'
];

// Cache-related error patterns to suppress
const CACHE_ERROR_PATTERNS = [
  'caches is not defined',
  'Cache get failed',
  'Cache set failed', 
  'ReferenceError: caches is not defined'
];

// Track suppressed errors to avoid spam
const suppressedErrors = new Set();

/**
 * Check if an error should be suppressed based on our criteria
 */
function shouldSuppressError(error, source, message) {
  // Check if it's a cache-related error
  const isCacheError = CACHE_ERROR_PATTERNS.some(pattern => 
    message && message.includes(pattern)
  );
  
  // Check if it's from a known extension
  const isExtensionError = EXTENSION_IDENTIFIERS.some(identifier => 
    (source && source.includes(identifier)) ||
    (error && error.stack && error.stack.includes(identifier))
  );
  
  return isCacheError && isExtensionError;
}

/**
 * Generate a unique error ID for deduplication
 */
function getErrorId(message, source, line) {
  return `${message}:${source}:${line}`;
}

/**
 * Install global error suppression
 */
export function installErrorSuppressor() {
  if (typeof window === 'undefined') {
    return; // Not in browser context
  }
  
  // Wrap the original onerror handler
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    if (shouldSuppressError(error, source, message)) {
      const errorId = getErrorId(message, source, lineno);
      
      if (!suppressedErrors.has(errorId)) {
        console.debug('[Extension Compat] Suppressed browser extension cache error:', {
          message: message ? message.substring(0, 100) + '...' : 'N/A',
          source: source ? source.substring(source.lastIndexOf('/') + 1) : 'N/A',
          line: lineno
        });
        suppressedErrors.add(errorId);
      }
      
      return true; // Prevent the error from propagating
    }
    
    // Call original handler for other errors
    if (typeof originalOnError === 'function') {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    
    if (reason && reason.message && shouldSuppressError(reason, '', reason.message)) {
      console.debug('[Extension Compat] Suppressed browser extension promise rejection:', {
        message: reason.message.substring(0, 100) + '...'
      });
      event.preventDefault();
    }
  });
  
  console.log('[Extension Compat] Error suppressor installed successfully');
}

/**
 * Monitor for cache API availability and provide diagnostics
 */
export function monitorCacheAPI() {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Check cache API availability periodically
  let cacheCheckCount = 0;
  const maxChecks = 10;
  
  const checkInterval = setInterval(() => {
    cacheCheckCount++;
    
    if (typeof caches === 'undefined') {
      console.warn(`[Extension Compat] Cache API still not available (check ${cacheCheckCount}/${maxChecks})`);
      
      if (cacheCheckCount >= maxChecks) {
        console.error('[Extension Compat] Cache API polyfill may have failed. Browser extensions may continue to show errors.');
        clearInterval(checkInterval);
      }
    } else {
      console.log(`[Extension Compat] Cache API confirmed available after ${cacheCheckCount} checks`);
      clearInterval(checkInterval);
    }
  }, 1000);
}

/**
 * Provide a safe wrapper for cache operations
 */
export function safeCacheOperation(operation, fallback = null) {
  return async function(...args) {
    try {
      if (typeof caches === 'undefined') {
        console.debug('[Extension Compat] Cache API not available, using fallback');
        return fallback;
      }
      
      return await operation(...args);
    } catch (error) {
      if (error.message && error.message.includes('caches is not defined')) {
        console.debug('[Extension Compat] Cache operation failed, using fallback');
        return fallback;
      }
      
      // Re-throw other errors
      throw error;
    }
  };
}

// Auto-install on import if in browser context
if (typeof window !== 'undefined') {
  installErrorSuppressor();
  monitorCacheAPI();
}
