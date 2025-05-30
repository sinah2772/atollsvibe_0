import { useBeforeUnload } from '../hooks/useBeforeUnload';

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  navigationBlockMessage?: string;
}

/**
 * Component to prevent accidentally navigating away with unsaved changes
 * Shows a confirmation dialog when user attempts to navigate away when closing the browser window
 */
const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({
  hasUnsavedChanges,
  navigationBlockMessage = 'You have unsaved changes. Are you sure you want to leave?'
}) => {
  // Use our custom hook to handle the beforeunload event
  useBeforeUnload(hasUnsavedChanges, navigationBlockMessage);

  // This component doesn't render anything visible
  return null;
};

export default UnsavedChangesWarning;
