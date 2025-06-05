import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { networkMonitor } from '../../utils/networkMonitor';

interface NetworkStatusBannerProps {
  className?: string;
}

/**
 * Component that displays network connectivity status
 * Only shows when there are connectivity issues
 */
const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [hasReconnected, setHasReconnected] = useState(false);
  
  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = networkMonitor.subscribe((online: boolean) => {
      if (isOnline && !online) {
        // Just went offline
        setIsOnline(false);
        setShowBanner(true);
        setHasReconnected(false);
      } else if (!isOnline && online) {
        // Just came back online
        setIsOnline(true);
        setHasReconnected(true);
        
        // Hide the "back online" message after a delay
        setTimeout(() => {
          setShowBanner(false);
          setHasReconnected(false);
        }, 3000);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [isOnline]);
  
  // Don't render anything if online and no recent reconnection
  if (isOnline && !hasReconnected) {
    return null;
  }
  
  // Don't render if we shouldn't show the banner
  if (!showBanner) {
    return null;
  }
  
  return (
    <div 
      className={`fixed top-0 inset-x-0 z-50 p-2 text-center text-sm font-medium flex items-center justify-center transition-all duration-300 ${className} ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Connection restored! You're back online.</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>You appear to be offline. Some features may be unavailable.</span>
            <button 
              onClick={() => window.location.reload()} 
              className="ml-2 px-2 py-0.5 bg-white text-red-600 rounded text-xs hover:bg-red-50"
              aria-label="Retry connection"
              title="Retry connection"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Component for showing an error message with network troubleshooting tips
 */
export const NetworkErrorMessage: React.FC<{
  error: Error | string | null;
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className = '' }) => {
  if (!error) return null;
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  const isNetworkRelated = 
    !navigator.onLine || 
    errorMessage.includes('network') || 
    errorMessage.includes('timeout') ||
    errorMessage.includes('fetch');
  
  return (
    <div className={`rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 mr-3" />
        <div>
          <p className="font-medium">{errorMessage}</p>
          
          {isNetworkRelated && (
            <ul className="mt-2 text-sm list-disc ml-5 space-y-1">
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>The server might be temporarily unavailable</li>
            </ul>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
              aria-label="Try again to connect"
              title="Try again to connect"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusBanner;
