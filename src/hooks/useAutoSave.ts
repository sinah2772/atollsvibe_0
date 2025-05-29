import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: () => Promise<void>;
  interval?: number; // In milliseconds
  enabled?: boolean;
  minChanges?: number;
}

/**
 * A hook that automatically saves data at specified intervals
 * @param options Configuration options for auto-save
 * @returns void
 */
export function useAutoSave<T>({
  data,
  onSave,
  interval = 60000, // Default: 1 minute
  enabled = true,
  minChanges = 1
}: UseAutoSaveOptions<T>): void {
  // Use refs to store previous data and change count
  const prevDataRef = useRef<T>(data);
  const changeCountRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect for detecting changes
  useEffect(() => {
    if (!enabled) return;
    
    // Simple change detection by JSON stringifying the data
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      // Update previous data
      prevDataRef.current = data;
      // Increment change counter
      changeCountRef.current += 1;
    }
  }, [data, enabled]);
  
  // Effect for managing auto-save timer
  useEffect(() => {
    if (!enabled) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
      // Set up new timer
    timerRef.current = setInterval(async () => {
      // Only save if there have been enough changes
      if (changeCountRef.current >= minChanges) {
        try {
          // Create a timeout to prevent auto-save from hanging indefinitely
          const savePromise = onSave();
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Auto-save timeout')), 10000); // 10 second timeout
          });
          
          // Race between the save operation and the timeout
          await Promise.race([savePromise, timeoutPromise]);
          
          // Reset change counter after successful save
          changeCountRef.current = 0;
        } catch (error) {
          console.error('Auto-save failed:', error);
          // We don't reset the change counter on failure, so it will try again next interval
        }
      }
    }, interval);
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval, minChanges, onSave]);
}

export default useAutoSave;
