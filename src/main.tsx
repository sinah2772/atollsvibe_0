// Import essential cache compatibility modules in the correct order
import './utils/aggressiveErrorSuppression'; // Error suppression FIRST
import './utils/globalCachePolyfill'; // Core cache polyfill
import './utils/setupCache'; // Cache setup and initialization
import './utils/layoutOptimization'; // Layout optimization for CLS

// Import extension error monitor in development mode
if (import.meta.env.DEV) {
  // @ts-expect-error - Development utility doesn't need strict typing
  import('./utils/extensionErrorMonitor');
}

// Import cache polyfill test in development mode
if (import.meta.env.DEV) {
  import('./utils/cachePolyfillTest');
  // @ts-expect-error - Test file doesn't need strict typing
  import('./utils/cacheStorageTest');
  // @ts-expect-error - Test file doesn't need strict typing
  import('./utils/polyfillTest');
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import service worker utilities
import { registerServiceWorker, unregisterServiceWorkers } from './utils/serviceWorkerUtils';

// Register service worker
window.addEventListener('load', () => {
  // First unregister any existing service workers to avoid conflicts
  unregisterServiceWorkers().then(() => {
    console.log('Existing service workers unregistered');
    
    // In development mode, log the import.meta.env.BASE_URL for debugging
    if (import.meta.env.DEV) {
      console.log('Base URL from Vite config:', import.meta.env.BASE_URL);
    }
    
    // Register the service worker
    registerServiceWorker()
      .then(registration => {
        if (registration) {
          console.log('Service worker registered successfully');
        }
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
});

// Define interfaces for performance entries
interface LayoutShift extends PerformanceEntry {
  value: number;
}

// Monitor performance metrics
if ('performance' in window && 'PerformanceObserver' in window) {
  // Create performance observer
  const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // Log large layout shifts and long tasks
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as LayoutShift;
        if (layoutShiftEntry.value && layoutShiftEntry.value > 0.25) {
          console.warn(`Large layout shift detected: ${layoutShiftEntry.value.toFixed(2)}`);
        }
      }
      if (entry.entryType === 'longtask' && entry.duration > 50) {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
      }
    });
  });

  // Observe relevant metrics
  try {
    perfObserver.observe({ entryTypes: ['layout-shift', 'longtask'] });
  } catch (e) {
    console.warn('Performance metrics not supported:', e);
  }
}

// Mark initial load time
performance.mark('app-init');

const root = createRoot(document.getElementById('root')!);

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Mark render complete time 
performance.mark('app-rendered');
performance.measure('app-startup', 'app-init', 'app-rendered');

// Log startup performance
const startupMeasure = performance.getEntriesByName('app-startup')[0];
if (startupMeasure) {
  console.log(`App startup time: ${startupMeasure.duration.toFixed(2)}ms`);
}