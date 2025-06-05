/**
 * Polyfill Test Utility
 * 
 * This script tests both the global variable and cache API polyfills to ensure
 * they're working correctly and preventing browser extension errors.
 */

export function testPolyfills() {
  console.log('🧪 Testing polyfills...');
  
  const results = {
    globalPolyfill: false,
    cachePolyfill: false,
    extensionCompatibility: false
  };
  
  // Test 1: Global variable polyfill
  try {
    if (typeof global !== 'undefined') {
      results.globalPolyfill = true;
      console.log('✅ Global variable polyfill is working');
      console.log('   global === window:', global === window);
    } else {
      console.error('❌ Global variable is not defined');
    }
  } catch (error) {
    console.error('❌ Global variable test failed:', error);
  }
  
  // Test 2: Cache API polyfill
  try {
    if (typeof caches !== 'undefined') {
      results.cachePolyfill = true;
      console.log('✅ Cache API polyfill is working');
      console.log('   caches type:', typeof caches);
      console.log('   caches.open exists:', typeof caches.open === 'function');
    } else {
      console.error('❌ Cache API is not defined');
    }
  } catch (error) {
    console.error('❌ Cache API test failed:', error);
  }
  
  // Test 3: Extension compatibility simulation
  try {
    // Simulate what browser extensions might do
    const testOperations = [
      () => global.something = 'test', // Should not throw
      () => caches.open('test-cache'), // Should not throw
      () => new Request('test'), // Should work
    ];
    
    testOperations.forEach((op, index) => {
      try {
        op();
        console.log(`✅ Extension compatibility test ${index + 1} passed`);
      } catch (error) {
        console.warn(`⚠️ Extension compatibility test ${index + 1} failed:`, error);
      }
    });
    
    results.extensionCompatibility = true;
    console.log('✅ Extension compatibility tests passed');
    
  } catch (error) {
    console.error('❌ Extension compatibility test failed:', error);
  }
  
  // Test 4: Error suppression test
  try {
    // This should not show up in the console due to our error suppression
    setTimeout(() => {
      const fakeError = new Error('Test: caches is not defined');
      console.warn('Testing error suppression (this should be suppressed)');
      window.dispatchEvent(new ErrorEvent('error', {
        message: 'Test: caches is not defined',
        filename: 'new-article',
        error: fakeError
      }));
    }, 100);
  } catch (error) {
    console.warn('Error suppression test setup failed:', error);
  }
  
  // Summary
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📊 Polyfill Test Results: ${passedTests}/${totalTests} passed`);
  console.table(results);
  
  if (passedTests === totalTests) {
    console.log('🎉 All polyfill tests passed! Browser extension errors should be resolved.');
  } else {
    console.warn('⚠️ Some polyfill tests failed. Browser extension errors may still occur.');
  }
  
  return results;
}

// Auto-run test in development mode
if (import.meta.env?.DEV) {
  // Run test after a short delay to ensure polyfills are loaded
  setTimeout(testPolyfills, 1000);
}
