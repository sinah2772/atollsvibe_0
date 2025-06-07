/**
 * Console Error Fixes Validation Script
 * 
 * This script validates that our console error fixes are working correctly.
 * Run this in the browser console to test the implemented solutions.
 */

// Validation Results
const validationResults = {
  cacheAPIErrorSuppression: false,
  layoutShiftOptimization: false,
  authTimeoutEnhancement: false,
  utilityFilesLoaded: false
};

// Console colors for better output
const colors = {
  success: 'color: #28a745; font-weight: bold;',
  warning: 'color: #ffc107; font-weight: bold;',
  error: 'color: #dc3545; font-weight: bold;',
  info: 'color: #17a2b8; font-weight: bold;',
  header: 'color: #6f42c1; font-weight: bold; font-size: 16px;'
};

console.log('%c🔧 Console Error Fixes Validation', colors.header);
console.log('%c=======================================', colors.info);

// Test 1: Cache API Error Suppression
console.group('%c1. Testing Cache API Error Suppression', colors.info);
try {
  // Check if error suppression is loaded
  if (typeof window.suppressQuietErrors !== 'undefined') {
    console.log('%c✅ Quiet error suppression is loaded', colors.success);
    validationResults.cacheAPIErrorSuppression = true;
    
    // Test debug mode toggle
    if (typeof window.enableQuietErrorDebug === 'function') {
      console.log('%c✅ Debug mode toggle available', colors.success);
    } else {
      console.log('%c⚠️ Debug mode toggle not available', colors.warning);
    }
  } else {
    console.log('%c❌ Quiet error suppression not loaded', colors.error);
  }
  
  // Test cache API polyfill
  if ('caches' in window) {
    console.log('%c✅ Cache API is available (native or polyfilled)', colors.success);
  } else {
    console.log('%c⚠️ Cache API not available', colors.warning);
  }
} catch (err) {
  console.log('%c❌ Cache API test failed:', colors.error, err.message);
}
console.groupEnd();

// Test 2: Layout Shift Optimization
console.group('%c2. Testing Layout Shift Optimization', colors.info);
try {
  // Check if layout optimization utilities are loaded
  import('/src/utils/layoutOptimization.ts').then(module => {
    if (module.layoutOptimization) {
      console.log('%c✅ Layout optimization utilities loaded', colors.success);
      validationResults.layoutShiftOptimization = true;
      
      // Test layout shift monitoring
      if (typeof module.layoutOptimization.monitorLayoutShifts === 'function') {
        console.log('%c✅ Layout shift monitoring available', colors.success);
      }
      
      // Test image optimization
      if (typeof module.layoutOptimization.optimizeImageLoading === 'function') {
        console.log('%c✅ Image optimization utilities available', colors.success);
      }
    }
  }).catch(err => {
    console.log('%c⚠️ Layout optimization utilities not loaded:', colors.warning, err.message);
  });
  
  // Check Performance Observer support
  if ('PerformanceObserver' in window) {
    console.log('%c✅ PerformanceObserver supported for layout shift monitoring', colors.success);
  } else {
    console.log('%c⚠️ PerformanceObserver not supported', colors.warning);
  }
} catch (err) {
  console.log('%c❌ Layout optimization test failed:', colors.error, err.message);
}
console.groupEnd();

// Test 3: Auth Timeout Enhancement
console.group('%c3. Testing Auth Timeout Enhancement', colors.info);
try {
  import('/src/utils/authTimeoutManager.ts').then(module => {
    if (module.AUTH_TIMEOUTS) {
      console.log('%c✅ Enhanced auth timeout manager loaded', colors.success);
      console.log('%cTimeout values:', colors.info, module.AUTH_TIMEOUTS);
      validationResults.authTimeoutEnhancement = true;
      
      // Validate timeout values
      const timeouts = module.AUTH_TIMEOUTS;
      if (timeouts.sessionFetch >= 12000) {
        console.log('%c✅ Session fetch timeout optimized (≥12s)', colors.success);
      }
      if (timeouts.authStateChange >= 10000) {
        console.log('%c✅ Auth state change timeout optimized (≥10s)', colors.success);
      }
      if (timeouts.signOut >= 8000) {
        console.log('%c✅ Sign out timeout optimized (≥8s)', colors.success);
      }
    }
    
    // Test enhanced timeout functions
    if (module.fetchSessionWithTimeout) {
      console.log('%c✅ Enhanced session fetch function available', colors.success);
    }
    
    if (module.fetchUserDataWithTimeout) {
      console.log('%c✅ Enhanced user data fetch with retries available', colors.success);
    }
  }).catch(err => {
    console.log('%c⚠️ Auth timeout manager not loaded:', colors.warning, err.message);
  });
} catch (err) {
  console.log('%c❌ Auth timeout test failed:', colors.error, err.message);
}
console.groupEnd();

// Test 4: Network Condition Detection
console.group('%c4. Testing Network Condition Detection', colors.info);
try {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    console.log('%c✅ Network Information API available', colors.success);
    console.log('%cConnection type:', colors.info, connection.effectiveType);
    console.log('%cDownlink speed:', colors.info, connection.downlink + ' Mbps');
    console.log('%cRound-trip time:', colors.info, connection.rtt + ' ms');
  } else {
    console.log('%c⚠️ Network Information API not available', colors.warning);
  }
  
  console.log('%cOnline status:', colors.info, navigator.onLine ? 'Online' : 'Offline');
} catch (err) {
  console.log('%c❌ Network condition test failed:', colors.error, err.message);
}
console.groupEnd();

// Test 5: Console Error Monitoring
console.group('%c5. Testing Console Error Monitoring', colors.info);

// Count console errors before and after
let errorCount = 0;
const originalError = console.error;
console.error = function(...args) {
  errorCount++;
  return originalError.apply(console, args);
};

// Trigger some test scenarios
setTimeout(() => {
  // Test cache API error (should be suppressed)
  try {
    if (window.caches) {
      caches.keys(); // This might trigger extension errors
    }
  } catch (e) {
    // Expected to be caught
  }
  
  // Test layout shift (small - should not trigger warning)
  const testDiv = document.createElement('div');
  testDiv.style.height = '50px';
  testDiv.style.background = '#f0f0f0';
  document.body.appendChild(testDiv);
  
  setTimeout(() => {
    testDiv.style.height = '60px'; // Small change
    
    setTimeout(() => {
      console.log(`%cError count during tests: ${errorCount}`, 
        errorCount > 5 ? colors.warning : colors.success);
      document.body.removeChild(testDiv);
    }, 100);
  }, 100);
}, 500);

console.groupEnd();

// Summary Report
setTimeout(() => {
  console.log('%c📊 Validation Summary', colors.header);
  console.log('%c==================', colors.info);
  
  const passedTests = Object.values(validationResults).filter(Boolean).length;
  const totalTests = Object.keys(validationResults).length;
  
  console.log(`%c✅ Tests Passed: ${passedTests}/${totalTests}`, 
    passedTests === totalTests ? colors.success : colors.warning);
  
  Object.entries(validationResults).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? colors.success : colors.error;
    console.log(`%c${status} ${test}`, color);
  });
  
  if (passedTests === totalTests) {
    console.log('%c🎉 All console error fixes are working correctly!', colors.success);
  } else {
    console.log('%c⚠️ Some fixes may need attention. Check the logs above.', colors.warning);
  }
  
  console.log('%c🔍 To test interactively, visit: /console-test.html', colors.info);
}, 2000);

// Export for manual testing
window.validateConsoleFixes = () => {
  location.reload();
};
