import { useEffect } from 'react';

/**
 * A custom hook that triggers when the user attempts to close the browser window or tab.
 * Used to warn users about potentially unsaved changes or ongoing processes.
 */
export const useBeforeUnload = (
  shouldBlock: boolean, 
  message = 'You have unsaved changes. Are you sure you want to leave?'
) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    if (shouldBlock) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock, message]);
};
