import { useEffect, useRef } from 'react';

interface UseFormChangeTrackerOptions {
  onChange: () => void;
  resetOnInit?: boolean;
  enabled?: boolean;
}

/**
 * A hook that tracks changes in form fields and detects unsaved changes
 * @param formData - The data object containing all form field values
 * @param options - Configuration options for change tracking
 */
export function useFormChangeTracker<T = unknown>(
  formData: Record<string, T>, 
  options: UseFormChangeTrackerOptions
): void {
  const { onChange, resetOnInit = true, enabled = true } = options;
  const isInitialRender = useRef(true);
  const prevDataRef = useRef<string>('');
  
  useEffect(() => {
    if (!enabled) return;
    
    // Convert the form data to a string for comparison
    const formDataString = JSON.stringify(formData);

    // Skip the initial render if resetOnInit is true
    if (isInitialRender.current && resetOnInit) {
      isInitialRender.current = false;
      prevDataRef.current = formDataString;
      return;
    }
    
    isInitialRender.current = false;
    
    // Check if the data has changed compared to previous render
    if (prevDataRef.current !== formDataString) {
      prevDataRef.current = formDataString;
      onChange();
    }
  }, [formData, onChange, enabled, resetOnInit]);
}

export default useFormChangeTracker;
