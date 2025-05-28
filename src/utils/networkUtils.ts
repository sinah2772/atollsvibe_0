/**
 * Network utilities for handling connectivity issues
 */

/**
 * Interface for NetworkStatusMonitor to ensure type safety
 */
export interface INetworkStatusMonitor {
  /** 
   * Subscribe to network status changes
   * @param callback Function called whenever network status changes
   * @returns Function to unsubscribe
   */
  subscribe(callback: (online: boolean) => void): () => void;
  
  /**
   * Get the current network status
   * @returns true if online, false if offline
   */
  getStatus(): boolean;
}

/**
 * Observable to detect network status changes
 */
class NetworkStatusMonitor implements INetworkStatusMonitor {
  private listeners: Set<(online: boolean) => void> = new Set();
  private isOnline: boolean;
  
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.setupListeners();
  }
  
  private setupListeners() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      console.log('🌐 Network connection restored');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
      console.warn('❌ Network connection lost');
    });
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }
  
  /**
   * Subscribe to network status changes
   * @param callback Function to call when network status changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (online: boolean) => void) {
    this.listeners.add(callback);
    // Immediately notify with current status
    callback(this.isOnline);
    
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  /**
   * Get current network status
   * @returns true if online, false if offline
   */
  getStatus(): boolean {
    return this.isOnline;
  }
}

// Singleton instance
export const networkMonitor = new NetworkStatusMonitor();

/**
 * Hook to retry an operation when network comes back online
 * @param operation Function to retry
 * @param maxRetries Maximum number of retries
 * @returns Promise that resolves when operation succeeds or max retries reached
 */
export async function retryWhenOnline<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      return await operation();
    } catch (error) {
      retryCount++;
      
      const isNetworkError = 
        error instanceof Error && (
          error.message.includes('network') || 
          error.message.includes('fetch') ||
          error.message.includes('timeout') ||
          error.message.includes('connection') ||
          !navigator.onLine
        );
      
      if (!isNetworkError || retryCount > maxRetries) {
        throw error;
      }
      
      console.log(`Network error detected, retry ${retryCount}/${maxRetries}`);
      
      // Wait for network to come back online
      if (!navigator.onLine) {
        console.log('Waiting for network connection...');
        await new Promise<void>(resolve => {
          const unsubscribe = networkMonitor.subscribe(online => {
            if (online) {
              unsubscribe();
              resolve();
            }
          });
        });
        console.log('Network connection restored, retrying operation');
      }
      
      // Add exponential backoff delay
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 30000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`Operation failed after ${maxRetries} retries`);
}

/**
 * Check if the given error is likely a network-related error
 * @param error The error to check
 * @returns true if it seems to be a network error
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error && (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('connection') ||
      error.name === 'AbortError' ||
      !navigator.onLine
    )
  );
}

/**
 * Get a human-readable error message for the given error
 * @param error The error object
 * @returns A user-friendly error message
 */
export function getNetworkErrorMessage(error: unknown): string {
  if (!navigator.onLine) {
    return 'You appear to be offline. Please check your internet connection and try again.';
  }
  
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return 'The request timed out. Please try again later.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'A network error occurred. Please check your connection and try again.';
    }
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
