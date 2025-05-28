/**
 * Utilities for monitoring and improving application performance
 */

// Performance timing markers
const perfMarkers = new Map<string, number>();

/**
 * Marks the start of a performance measurement
 * @param id Unique identifier for this performance measurement
 */
export function startMeasure(id: string): void {
  perfMarkers.set(id, performance.now());
}

/**
 * Ends a performance measurement and logs the result
 * @param id The identifier used when starting the measurement
 * @param logThreshold Only log if duration exceeds this threshold (in ms)
 * @returns The duration in milliseconds
 */
export function endMeasure(id: string, logThreshold = 100): number {
  const start = perfMarkers.get(id);
  if (!start) {
    console.warn(`No start marker found for performance measurement: ${id}`);
    return 0;
  }
  
  const duration = performance.now() - start;
  perfMarkers.delete(id);
  
  // Only log if it took longer than threshold
  if (duration > logThreshold) {
    console.warn(`Performance: ${id} took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
}

/**
 * Image loading optimization helper
 * @param src Image source URL
 * @param fallbackSrc Fallback image if main source fails
 * @returns An object with props to spread onto an img element
 */
export function optimizedImageProps(src: string, fallbackSrc: string) {
  return {
    src,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      if (target.src !== fallbackSrc) {
        target.src = fallbackSrc;
      }
    }
  };
}

/**
 * Detects slow responses and connection issues with configurable retry
 * @param promise The promise factory function to wrap (like a fetch call)
 * @param options Configuration options for timeout and retries
 * @returns A promise with timeout handling and retries
 */
export async function withTimeoutAndRetry<T>(
  promiseFactory: () => Promise<T>,
  options: {
    timeoutMs?: number;
    name?: string;
    retries?: number;
    retryDelayMs?: number;
    exponentialBackoff?: boolean;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    timeoutMs = 10000,
    name = 'Operation',
    retries = 2,
    retryDelayMs = 1000,
    exponentialBackoff = true,
    onRetry = undefined
  } = options;
  
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= retries) {
    let timeoutId: number | undefined;
    
    try {
      // Create a new timeout promise for each attempt
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          const errorMsg = `${name} timed out after ${timeoutMs}ms (attempt ${attempt + 1}/${retries + 1})`;
          console.warn(errorMsg);
          reject(new Error(errorMsg));
        }, timeoutMs) as unknown as number;
      });
      
      // Race the operation against the timeout
      const result = await Promise.race([promiseFactory(), timeoutPromise]);
      
      // Success! Clear the timeout and return the result
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      return result;
    } catch (error) {
      // Clear the timeout if it's still active
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Store the last error to throw if all retries fail
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the error and notify via callback if provided
      console.warn(`${name} attempt ${attempt + 1}/${retries + 1} failed:`, lastError);
      
      if (onRetry) {
        onRetry(attempt, lastError);
      }
      
      // If we've used all our retries, throw the last error
      if (attempt >= retries) {
        break;
      }
      
      // Wait before retrying with optional exponential backoff
      const delay = exponentialBackoff
        ? retryDelayMs * Math.pow(2, attempt)
        : retryDelayMs;
        
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
  
  // If we got here, all retries failed
  throw lastError || new Error(`${name} failed after ${retries + 1} attempts`);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use withTimeoutAndRetry instead
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 10000,
  name = 'Operation'
): Promise<T> {
  return withTimeoutAndRetry(() => promise, { timeoutMs, name, retries: 0 });
}
