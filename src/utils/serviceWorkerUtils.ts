// Service worker utilities

/**
 * Register the service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      // Get the base URL from import.meta.env or fallback to auto-detection
      const baseUrl = import.meta.env.BASE_URL || 
                     (document.querySelector('base')?.getAttribute('href') || '/');
      
      // Use the correct path based on development or production environment
      const swPath = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}service-worker.js`;
      const swScope = baseUrl;
      
      console.log(`Registering service worker at: ${swPath} with scope: ${swScope}`);
      
      const registration = await navigator.serviceWorker.register(swPath, { 
        scope: swScope 
      });
      
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

/**
 * Unregister any existing service workers
 */
export const unregisterServiceWorkers = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      return true;
    } catch (error) {
      console.error('Error unregistering service workers:', error);
      return false;
    }
  }
  return false;
};

/**
 * Check if there's an active service worker
 */
export const checkServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active !== null;
    } catch (error) {
      console.error('Error checking service worker status:', error);
      return false;
    }
  }
  return false;
};

/**
 * Send a message to the service worker and optionally wait for a response
 * This utility demonstrates the proper way to send messages to service workers
 * and handle asynchronous responses
 * 
 * @param message The message object to send to the service worker
 * @param expectResponse Whether to expect an asynchronous response
 * @param timeout Optional timeout in ms for the response (default: 3000)
 * @returns A promise that resolves to the response from the service worker, or undefined if no response
 */
export const sendMessageToServiceWorker = async (
  message: Record<string, unknown>, 
  expectResponse: boolean = false,
  timeout: number = 3000
): Promise<unknown | undefined> => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    console.error('No active service worker found');
    return undefined;
  }

  if (!expectResponse) {
    // Simple case: fire and forget, no response needed
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
    return undefined;
  }
  
  // For messages expecting a response, use MessageChannel
  return new Promise((resolve, reject) => {
    // Create a message channel for the response
    const messageChannel = new MessageChannel();
    
    // Set up a timeout
    const timeoutId = setTimeout(() => {
      messageChannel.port1.close();
      reject(new Error(`Service worker response timeout after ${timeout}ms`));
    }, timeout);
    
    // Set up the response handler
    messageChannel.port1.onmessage = (event) => {
      clearTimeout(timeoutId);
      resolve(event.data);
    };
    
    // Send the message, transferring the port to the service worker
    try {
      if (!navigator.serviceWorker.controller) {
        throw new Error('No active service worker controller found');
      }
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    } catch (error) {
      clearTimeout(timeoutId);
      messageChannel.port1.close();
      reject(error);
    }
  });
};
