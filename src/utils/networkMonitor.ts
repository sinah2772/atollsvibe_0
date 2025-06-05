/**
 * Interface for NetworkStatusMonitor to ensure type safety
 */
interface INetworkStatusMonitor {
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

// Singleton instance - this can be imported from other components as needed
export const networkMonitor = new NetworkStatusMonitor();
