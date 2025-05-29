import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  navigationBlockMessage?: string;
}

/**
 * Component to prevent accidentally navigating away with unsaved changes
 * Shows a confirmation dialog when user attempts to navigate away
 */
const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({
  hasUnsavedChanges,
  navigationBlockMessage = 'You have unsaved changes. Are you sure you want to leave?'
}) => {
  const navigate = useNavigate();
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    setIsBlocking(hasUnsavedChanges);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    // Handler for the beforeunload event (browser close/refresh)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isBlocking) {
        event.preventDefault();
        event.returnValue = navigationBlockMessage;
        return navigationBlockMessage;
      }
    };

    // Handler for attempted navigation within the app
    const handleNavigateAway = (path: string) => {
      if (isBlocking) {
        if (window.confirm(navigationBlockMessage)) {
          navigate(path);
        }
        return false;
      }
      return true;
    };

    // Set up the beforeunload listener
    if (isBlocking) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Set up a location change listener
    const unblock = navigate((_, action) => {
      if (isBlocking && action !== 'POP') {
        return false;
      }
      return true;
    });

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unblock();
    };
  }, [isBlocking, navigate, navigationBlockMessage]);

  // This component doesn't render anything visible
  return null;
};

export default UnsavedChangesWarning;
