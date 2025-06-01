import { useState, useCallback } from 'react';

/**
 * Hook to manage collaborators selection
 * Handles conversion between comma-separated string (database format) and array (UI format)
 */
export const useCollaborators = (initialCollaborators: string = '') => {
  // Convert comma-separated string to array for UI
  const parseCollaborators = useCallback((collaboratorsString: string): string[] => {
    if (!collaboratorsString?.trim()) return [];
    return collaboratorsString
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
  }, []);

  // Convert array back to comma-separated string for database
  const stringifyCollaborators = useCallback((collaboratorIds: string[]): string => {
    return collaboratorIds.filter(id => id.trim().length > 0).join(', ');
  }, []);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(() => 
    parseCollaborators(initialCollaborators)
  );

  const handleCollaboratorsChange = useCallback((userIds: string[]) => {
    setSelectedUserIds(userIds);
  }, []);

  const getCollaboratorsString = useCallback((): string => {
    return stringifyCollaborators(selectedUserIds);
  }, [selectedUserIds, stringifyCollaborators]);

  return {
    selectedUserIds,
    handleCollaboratorsChange,
    getCollaboratorsString,
    parseCollaborators,
    stringifyCollaborators
  };
};
