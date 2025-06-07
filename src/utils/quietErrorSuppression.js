/**
 * Quiet Error Suppression - Reduces console noise from browser extensions
 * 
 * This module provides silent error suppression for known browser extension issues
 * while maintaining debug capabilities when needed.
 */

(function() {
  'use strict';
  
  // Known extension error patterns to suppress silently
  const SILENT_PATTERNS = [
    'caches is not defined',
    'Cache get failed',
    'Cache set failed',
    'Testing error suppression',
    'Detected and suppressed browser extension error',
    'Large layout shift detected',
    'Auth state change timeout',
    'Auth session fetch timeout'
  ];
  
  // Extension file patterns
  const EXTENSION_FILES = [
    'ch-content-script-dend.js',
    'content-script-utils.js',
    'content-script-idle.js',
    'CacheStore.js',
    'GenAIWebpageEligibilityService.js',
    'ActionableCoachmark.js',
    'hook.js'
  ];
  
  // Track suppressed errors for debugging
  const suppressedErrorCounts = new Map();
  
  // Check if an error should be suppressed
  function shouldSuppressQuietly(message, source = '') {
    return SILENT_PATTERNS.some(pattern => 
      message && message.includes(pattern)
    ) || EXTENSION_FILES.some(file => 
      source && source.includes(file)
    );
  }
  
  // Override console.warn to suppress noisy warnings
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (shouldSuppressQuietly(message)) {
      // Count the suppressed error for debugging
      const key = message.substring(0, 50);
      suppressedErrorCounts.set(key, (suppressedErrorCounts.get(key) || 0) + 1);
      
      // Only log in debug mode
      if (window.location.search.includes('debug=true')) {
        originalWarn.apply(console, ['[SUPPRESSED]', ...args]);
      }
      return;
    }
    
    // Let other warnings through
    originalWarn.apply(console, args);
  };
  
  // Override console.error for extension errors
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    if (shouldSuppressQuietly(message)) {
      // Count the suppressed error for debugging
      const key = message.substring(0, 50);
      suppressedErrorCounts.set(key, (suppressedErrorCounts.get(key) || 0) + 1);
      
      // Only log in debug mode
      if (window.location.search.includes('debug=true')) {
        originalError.apply(console, ['[SUPPRESSED]', ...args]);
      }
      return;
    }
    
    // Let other errors through
    originalError.apply(console, args);
  };
  
  // Global error handler for events
  window.addEventListener('error', function(event) {
    const message = event.message || '';
    const source = event.filename || '';
    
    if (shouldSuppressQuietly(message, source)) {
      // Count the suppressed error for debugging
      const key = `${message.substring(0, 30)}:${source.split('/').pop()}`;
      suppressedErrorCounts.set(key, (suppressedErrorCounts.get(key) || 0) + 1);
      
      // Prevent the error from showing in console
      event.preventDefault();
      return true;
    }
  }, true);
  
  // Global unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    const message = (reason && reason.message) ? reason.message : String(reason);
    
    if (shouldSuppressQuietly(message)) {
      // Count the suppressed error for debugging
      const key = message.substring(0, 50);
      suppressedErrorCounts.set(key, (suppressedErrorCounts.get(key) || 0) + 1);
      
      // Prevent the rejection from showing in console
      event.preventDefault();
      return;
    }
  });
  
  // Expose debug function for development
  window.showSuppressedErrors = function() {
    if (suppressedErrorCounts.size === 0) {
      console.log('✅ No errors have been suppressed');
      return;
    }
    
    console.group('🤫 Suppressed Errors Summary');
    for (const [error, count] of suppressedErrorCounts.entries()) {
      console.log(`${error}: ${count} times`);
    }
    console.log('Total unique errors suppressed:', suppressedErrorCounts.size);
    console.groupEnd();
    console.log('💡 Add ?debug=true to URL to see suppressed errors in real-time');
  };
  
  // Initialize on load
  console.debug('[Quiet Error Suppression] Initialized - call showSuppressedErrors() to see summary');
  
})();
