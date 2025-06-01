/**
 * Cache API Polyfill Test
 * 
 * This file contains tests to verify the cache polyfill is working correctly
 * and can handle browser extension compatibility issues.
 */

interface TestResults {
  cacheAvailable: boolean;
  cacheOpen: boolean;
  cacheMatch: boolean;
  cachePut: boolean;
  cacheDelete: boolean;
  extensionSafe: boolean;
}

// Test the cache API polyfill
export async function testCachePolyfill() {
  console.log('🧪 Testing Cache API polyfill...');
  
  const results = {
    cacheAvailable: false,
    cacheOpen: false,
    cacheMatch: false,
    cachePut: false,
    cacheDelete: false,
    extensionSafe: false
  };
  
  try {
    // Test 1: Check if caches is available
    if (typeof caches !== 'undefined') {
      results.cacheAvailable = true;
      console.log('✅ Cache API is available');
      
      // Test 2: Try to open a cache
      try {
        const cache = await caches.open('test-cache');
        results.cacheOpen = true;
        console.log('✅ Cache.open() works');
        
        // Test 3: Try to put something in cache
        try {
          const testRequest = new Request('test-key');
          const testResponse = new Response(JSON.stringify({ test: 'data' }));
          await cache.put(testRequest, testResponse);
          results.cachePut = true;
          console.log('✅ Cache.put() works');
          
          // Test 4: Try to match from cache
          try {
            const matchedResponse = await cache.match(testRequest);
            if (matchedResponse) {
              const data = await matchedResponse.json();
              if (data.test === 'data') {
                results.cacheMatch = true;
                console.log('✅ Cache.match() works');
              }
            }
          } catch (matchError) {
            console.warn('⚠️ Cache.match() failed:', matchError);
          }
          
          // Test 5: Try to delete from cache
          try {
            const deleted = await cache.delete(testRequest);
            results.cacheDelete = true;
            console.log('✅ Cache.delete() works');
          } catch (deleteError) {
            console.warn('⚠️ Cache.delete() failed:', deleteError);
          }
          
        } catch (putError) {
          console.warn('⚠️ Cache.put() failed:', putError);
        }
        
      } catch (openError) {
        console.warn('⚠️ Cache.open() failed:', openError);
      }
      
    } else {
      console.error('❌ Cache API is not available');
    }
    
    // Test 6: Extension safety test
    try {
      // Simulate what browser extensions do
      const testCache = await caches.open('extension-test-cache');
      await testCache.put(new Request('extension-test'), new Response('test'));
      results.extensionSafe = true;
      console.log('✅ Extension compatibility test passed');
    } catch (extensionError) {
      console.warn('⚠️ Extension compatibility test failed:', extensionError);
    }
    
  } catch (error) {
    console.error('❌ Cache polyfill test failed:', error);
  }
  
  // Clean up test cache
  try {
    await caches.delete('test-cache');
    await caches.delete('extension-test-cache');
  } catch (cleanupError) {
    console.warn('⚠️ Test cleanup failed:', cleanupError);
  }
  
  // Report results
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📊 Cache API Test Results: ${passedTests}/${totalTests} passed`);
  console.table(results);
  
  return results;
}

// Auto-run test in development mode
if (import.meta.env.DEV) {
  // Run test after a short delay to ensure polyfills are loaded
  setTimeout(testCachePolyfill, 2000);
}
