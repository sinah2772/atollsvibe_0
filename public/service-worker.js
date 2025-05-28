// Service worker for better performance and offline support

// Cache name - update version when deploying new code
const CACHE_NAME = 'atollsvibe-cache-v1';

// Check if we're in a development environment
const isDev = self.location.hostname === 'localhost' || 
              self.location.hostname.includes('.app.github.dev') ||
              self.location.hostname.includes('127.0.0.1');

// Get the base URL path from self.location
const getBasePath = () => {
  const pathParts = self.location.pathname.split('/');
  // Remove the "service-worker.js" part
  pathParts.pop();
  return pathParts.join('/') || '/';
};

// The actual base path for the application
const basePath = getBasePath();

// Helper to prepend base path to asset URLs
const prependBase = (path) => {
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  return `${basePath}${basePath.endsWith('/') ? '' : '/'}${path}`;
};

// Assets to cache on install - adjust based on environment
const PRECACHE_ASSETS = isDev ? 
  // Dev mode - minimal caching
  [
    basePath,
    prependBase('index.html')
  ] : 
  // Production mode - more aggressive caching
  [
    basePath,
    prependBase('index.html'),
    prependBase('assets/index.js'),
    prependBase('assets/index.css')
  ];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting(); // Force activation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service worker pre-caching assets');
        return cache.addAll(PRECACHE_ASSETS).catch(error => {
          console.warn('Pre-cache failed, but continuing:', error);
          // Continue even if some assets fail to cache
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  // Delete old cache versions
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: clearing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Claim any clients immediately, rather than waiting for reload
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Don't attempt to cache anything in development mode
  if (isDev) {
    return;
  }
  
  // Skip for API requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co')) {
    return;
  }

  // Skip for non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle HTML navigation specially
  if (event.request.mode === 'navigate' && 
      event.request.headers.get('accept')?.includes('text/html')) {
    
    // For navigation, try network first, then cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the fresh response
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          // If network fails, try cache or fall back to a cached index.html
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match(prependBase('index.html'));
            });
        })
    );
    return;
  }

  // For other resources, try cache first
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Fetch updated version in the background for next time
          fetch(event.request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => {});
          
          return cachedResponse;
        }

        // Otherwise fetch from network and cache the response
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be used once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline fallback
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Return a basic error for other resources
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Listen for message events from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    // Since we don't need to send an asynchronous response,
    // no need to return true or use event.ports[0].postMessage()
  }
  
  // No return or explicit return false since we're not sending an asynchronous response
});

/* 
// EXAMPLE: How to properly handle asynchronous responses in a message listener
// Uncomment and modify this example when you need to handle messages with responses

self.addEventListener('message', (event) => {
  // Check if this message expects a response by looking for a MessagePort
  const hasPort = event.ports && event.ports.length > 0;
  
  if (event.data && event.data.type === 'EXAMPLE_ASYNC_REQUEST') {
    if (hasPort) {
      // This is an asynchronous request that needs a response
      
      // Process the request asynchronously
      Promise.resolve().then(() => {
        // Example async work
        const result = { success: true, data: 'Response data' };
        
        // Send the response through the message port
        event.ports[0].postMessage(result);
      });
      
      // Return true to indicate we'll respond asynchronously
      return true;
    } else {
      // No port available, can't respond
      console.warn('Received message requiring response but no MessagePort was provided');
    }
  }
  
  // For messages not requiring a response, return nothing or false
  return false;
});
*/

// Add special handling for GitHub Codespaces previews
self.addEventListener('fetch', (event) => {
  // Don't attempt to cache anything in development mode
  if (isDev) {
    return;
  }
  
  const request = event.request;
  
  // Only cache GET requests
  if (request.method !== 'GET') return;
  
  // For HTML navigations, try network first, then cache
  if (request.mode === 'navigate' && request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        return cachedResponse || fetch(request)
          .then(response => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            return response;
          });
      })
  );
});
