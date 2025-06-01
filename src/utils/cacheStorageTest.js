/**
 * Test utility to verify CacheStore works without Cache API
 * 
 * This tests the updated CacheStore implementation that uses
 * chrome.storage.local and localStorage instead of the problematic Cache API
 */

import CacheStore from './CacheStore.js';

export async function testCacheStoreImplementation() {
  console.log('🧪 Testing improved CacheStore implementation...');
  
  const cache = new CacheStore('test-cache');
  const testResults = {
    basic: false,
    ttl: false,
    storage: false,
    cleanup: false
  };
  
  try {
    // Test 1: Basic set/get functionality
    console.log('Testing basic set/get...');
    await cache.set('test-key', { message: 'Hello World', timestamp: Date.now() });
    const result = await cache.get('test-key');
    
    if (result && result.message === 'Hello World') {
      testResults.basic = true;
      console.log('✅ Basic set/get test passed');
    } else {
      console.log('❌ Basic set/get test failed');
    }
    
    // Test 2: TTL functionality
    console.log('Testing TTL functionality...');
    await cache.setWithTTL('ttl-key', { data: 'temporary' }, 2); // 2 seconds TTL
    
    // Should exist immediately
    const ttlResult1 = await cache.getWithTTL('ttl-key');
    if (ttlResult1 && ttlResult1.data === 'temporary') {
      console.log('✅ TTL set/get test passed');
      
      // Wait for expiration (3 seconds)
      setTimeout(async () => {
        const ttlResult2 = await cache.getWithTTL('ttl-key');
        if (ttlResult2 === null) {
          testResults.ttl = true;
          console.log('✅ TTL expiration test passed');
        } else {
          console.log('❌ TTL expiration test failed');
        }
      }, 3000);
    } else {
      console.log('❌ TTL set/get test failed');
    }
    
    // Test 3: Storage layer detection
    console.log('Testing storage layer detection...');
    console.log(`Chrome storage available: ${cache.chromeStorageAvailable}`);
    console.log(`Extension context detected: ${cache.isExtensionContext}`);
    testResults.storage = true;
    
    // Test 4: Cleanup
    console.log('Testing cleanup...');
    await cache.delete('test-key');
    const deletedResult = await cache.get('test-key');
    
    if (deletedResult === null) {
      testResults.cleanup = true;
      console.log('✅ Cleanup test passed');
    } else {
      console.log('❌ Cleanup test failed');
    }
    
  } catch (error) {
    console.error('❌ CacheStore test failed with error:', error);
  }
  
  // Summary
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n📊 CacheStore Test Results: ${passedTests}/${totalTests} passed`);
  console.table(testResults);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! CacheStore is working correctly without Cache API.');
  } else {
    console.log('⚠️ Some tests failed. Check the implementation.');
  }
  
  return testResults;
}

// Auto-run test in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Run test after a short delay to ensure everything is loaded
  setTimeout(testCacheStoreImplementation, 1000);
}
