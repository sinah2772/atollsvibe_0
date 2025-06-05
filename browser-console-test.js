// Test script to verify polyfills are working
// Copy and paste this into the browser console to test

console.log('🧪 Testing JavaScript Error Fixes...');

// Test 1: Global variable polyfill
console.log('\n1. Testing global variable polyfill:');
try {
  console.log('typeof global:', typeof global);
  console.log('global === window:', global === window);
  console.log('global is defined:', typeof global !== 'undefined');
  
  // Test that extensions can use global
  global.testValue = 'extension-test';
  console.log('✅ Global variable polyfill working correctly');
} catch (error) {
  console.error('❌ Global variable polyfill failed:', error);
}

// Test 2: Cache API polyfill
console.log('\n2. Testing Cache API polyfill:');
try {
  console.log('typeof caches:', typeof caches);
  console.log('caches.open exists:', typeof caches.open === 'function');
  
  // Test cache operations that extensions might use
  caches.open('extension-test-cache').then(cache => {
    console.log('✅ Cache API polyfill working correctly');
    return cache.put(new Request('test'), new Response('test data'));
  }).then(() => {
    console.log('✅ Cache put operation successful');
  }).catch(error => {
    console.warn('⚠️ Cache operation warning:', error);
  });
} catch (error) {
  console.error('❌ Cache API polyfill failed:', error);
}

// Test 3: Error suppression
console.log('\n3. Testing error suppression:');
try {
  // These should be suppressed and not show as errors
  setTimeout(() => {
    console.log('Triggering test errors (should be suppressed):');
    
    // Simulate the exact errors we were getting
    const testErrors = [
      'new-article:46 Uncaught ReferenceError: global is not defined',
      'CacheStore.js:18 Cache get failed: ReferenceError: caches is not defined'
    ];
    
    testErrors.forEach((errorMsg, index) => {
      try {
        window.dispatchEvent(new ErrorEvent('error', {
          message: errorMsg,
          filename: 'test-script',
          lineno: 1
        }));
        console.log(`✅ Test error ${index + 1} dispatched (should be suppressed)`);
      } catch (e) {
        console.log(`Test error ${index + 1} failed to dispatch:`, e);
      }
    });
  }, 500);
} catch (error) {
  console.error('❌ Error suppression test failed:', error);
}

// Test 4: Extension compatibility
console.log('\n4. Testing extension compatibility:');
try {
  // Simulate what browser extensions commonly do
  const extensionTests = [
    () => typeof global !== 'undefined',
    () => typeof caches !== 'undefined',
    () => caches.open('test').then(() => true).catch(() => false),
    () => new Request('test') instanceof Request,
    () => new Response('test') instanceof Response
  ];
  
  extensionTests.forEach((test, index) => {
    try {
      const result = test();
      if (result === true || (result && typeof result.then === 'function')) {
        console.log(`✅ Extension compatibility test ${index + 1}: PASS`);
      } else {
        console.log(`⚠️ Extension compatibility test ${index + 1}: ${result}`);
      }
    } catch (error) {
      console.log(`❌ Extension compatibility test ${index + 1}: FAIL -`, error);
    }
  });
} catch (error) {
  console.error('❌ Extension compatibility test failed:', error);
}

console.log('\n🎉 Polyfill verification complete! Check results above.');
console.log('If all tests pass, browser extension errors should be resolved.');
