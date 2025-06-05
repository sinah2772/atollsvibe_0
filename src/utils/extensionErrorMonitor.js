/**
 * Browser Extension Error Monitor
 * 
 * This script monitors and logs browser extension errors to help debug
 * compatibility issues and verify that our polyfills are working correctly.
 */

class ExtensionErrorMonitor {
  constructor() {
    this.errorCount = 0;
    this.suppressedErrors = new Map();
    this.startTime = Date.now();
    
    this.init();
  }
  
  init() {
    console.log('🔍 Browser Extension Error Monitor initialized');
    
    // Override console.error to catch extension errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.analyzeError('console.error', args.join(' '));
      originalConsoleError.apply(console, args);
    };
    
    // Override console.warn to catch extension warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.analyzeError('console.warn', args.join(' '));
      originalConsoleWarn.apply(console, args);
    };
    
    // Monitor window errors
    window.addEventListener('error', (event) => {
      this.analyzeError('window.error', event.message, event.filename);
    });
    
    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.analyzeError('unhandledrejection', event.reason?.message || String(event.reason));
    });
    
    // Report statistics every 30 seconds in development
    if (import.meta.env?.DEV) {
      setInterval(() => this.reportStatistics(), 30000);
    }
  }
  
  analyzeError(type, message, source = '') {
    // Check if this looks like a browser extension error
    const extensionKeywords = [
      'caches is not defined',
      'global is not defined',
      'CacheStore',
      'GenAIWebpageEligibilityService',
      'ActionableCoachmark',
      'ch-content-script',
      'content-script-utils',
      'content-script-idle',
      'new-article',
      'chrome-extension://',
      'moz-extension://'
    ];
    
    const isExtensionError = extensionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase()) ||
      source.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (isExtensionError) {
      this.errorCount++;
      
      // Track suppressed errors
      const errorKey = `${type}:${message.substring(0, 50)}`;
      const count = this.suppressedErrors.get(errorKey) || 0;
      this.suppressedErrors.set(errorKey, count + 1);
      
      // Log detailed info in development
      if (import.meta.env?.DEV) {
        console.group('🛡️ Extension Error Detected');
        console.log('Type:', type);
        console.log('Message:', message);
        console.log('Source:', source);
        console.log('Count for this error:', count + 1);
        console.groupEnd();
      }
    }
  }
  
  reportStatistics() {
    if (this.errorCount === 0) {
      console.log('✅ No browser extension errors detected');
      return;
    }
    
    const uptime = Math.round((Date.now() - this.startTime) / 1000);
    
    console.group('📊 Extension Error Statistics');
    console.log(`Total errors detected: ${this.errorCount}`);
    console.log(`Uptime: ${uptime} seconds`);
    console.log('Error breakdown:');
    
    for (const [error, count] of this.suppressedErrors.entries()) {
      console.log(`  ${error}: ${count} occurrence(s)`);
    }
    
    console.groupEnd();
  }
  
  getStatistics() {
    return {
      totalErrors: this.errorCount,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
      errorBreakdown: Object.fromEntries(this.suppressedErrors)
    };
  }
}

// Initialize the monitor
const extensionErrorMonitor = new ExtensionErrorMonitor();

// Export for manual access
export { extensionErrorMonitor };

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.extensionErrorMonitor = extensionErrorMonitor;
}
