/**
 * Aggressive Error Suppression for Browser Extension Cache Errors
 * 
 * This module aggressively suppresses and handles cache-related errors from browser extensions,
 * specifically targeting the CacheStore.js errors that are still slipping through.
 */

(function() {
  'use strict';
  
  // Store original console methods to avoid infinite loops
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  // Enhanced error patterns that we want to suppress
  const CACHE_ERROR_PATTERNS = [
    /caches is not defined/i,
    /Cache get failed.*ReferenceError.*caches is not defined/i,
    /Cache set failed.*ReferenceError.*caches is not defined/i,
    /CacheStore\.js.*Cache.*failed.*ReferenceError/i,
    /GenAIWebpageEligibilityService\.js.*getExplicitBlockList/i,
    /ActionableCoachmark\.js.*isEligible/i,
    /content-script-utils\.js/i,
    /ch-content-script-dend\.js/i
  ];
  
  // Files that are known to be problematic
  const PROBLEMATIC_FILES = [
    'CacheStore.js',
    'GenAIWebpageEligibilityService.js',
    'ActionableCoachmark.js',
    'content-script-utils.js',
    'ch-content-script-dend.js',
    'ShowOneChild.js'
  ];
  
  // Enhanced error suppression function
  function suppressCacheError(message, source) {
    // Check if this is a cache-related error
    const isCacheError = CACHE_ERROR_PATTERNS.some(pattern => pattern.test(message));
    const isProblematicFile = PROBLEMATIC_FILES.some(file => 
      source && source.includes(file)
    );
    
    if (isCacheError || isProblematicFile) {
      // Suppress the error but log it for debugging
      console.debug('[Cache Error Suppressed]', message, source);
      return true;
    }
    
    return false;
  }
  
  // Override console.error to suppress cache errors
  console.error = function(...args) {
    const message = args.join(' ');
    const hasStackTrace = args.some(arg => 
      typeof arg === 'string' && (arg.includes('at ') || arg.includes('CacheStore.js'))
    );
    
    if (hasStackTrace && suppressCacheError(message)) {
      return; // Suppress the error
    }
    
    // Call original console.error for non-cache errors
    return originalConsoleError.apply(console, args);
  };
  
  // Override console.warn for cache warnings
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (suppressCacheError(message)) {
      return; // Suppress the warning
    }
    
    return originalConsoleWarn.apply(console, args);
  };
  
  // Enhanced window error handler
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (suppressCacheError(message, source)) {
      return true; // Prevent default error handling
    }
    
    // Call original error handler if it exists
    if (originalOnError) {
      return originalOnError.apply(this, arguments);
    }
    
    return false;
  };
  
  // Enhanced unhandled promise rejection handler
  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    const reason = event.reason;
    const message = reason && reason.message ? reason.message : String(reason);
    
    if (suppressCacheError(message)) {
      event.preventDefault();
      return;
    }
    
    // Call original handler if it exists
    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.apply(this, arguments);
    }
  };
  
  // Global try-catch wrapper for async functions
  const originalPromiseReject = Promise.reject;
  Promise.reject = function(reason) {
    const message = reason && reason.message ? reason.message : String(reason);
    
    if (suppressCacheError(message)) {
      // Return a resolved promise instead of rejection for cache errors
      return Promise.resolve(null);
    }
    
    return originalPromiseReject.apply(this, arguments);
  };
  
  // Patch any existing error event listeners
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'error' && typeof listener === 'function') {
      const wrappedListener = function(event) {
        const message = event.error && event.error.message ? event.error.message : event.message;
        
        if (suppressCacheError(message, event.filename)) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        
        return listener.apply(this, arguments);
      };
      
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    
    return originalAddEventListener.apply(this, arguments);
  };
  
  console.debug('[Aggressive Cache Error Suppression] Installed comprehensive error suppression');
  
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
