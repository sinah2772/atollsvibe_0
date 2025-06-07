import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  getIslandCategories, 
  getCategoryIslands, 
  addIslandToCategory,
  removeIslandFromCategory,
  setIslandCategories
} from '../utils/islandCategoryLinks';

/**
 * Hook for managing relationships between islands and categories
 */
export function useIslandCategoryLinks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Get all categories for a specific island
   */
  const fetchIslandCategories = async (islandId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await getIslandCategories(islandId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get all islands for a specific category
   */
  const fetchCategoryIslands = async (categoryId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await getCategoryIslands(categoryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Add an island to a category
   */
  const linkIslandToCategory = async (islandId, categoryId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await addIslandToCategory(islandId, categoryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Remove an island from a category
   */
  const unlinkIslandFromCategory = async (islandId, categoryId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await removeIslandFromCategory(islandId, categoryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update all categories for an island
   */
  const updateIslandCategories = async (islandId, categoryIds) => {
    try {
      setIsLoading(true);
      setError(null);
      return await setIslandCategories(islandId, categoryIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    fetchIslandCategories,
    fetchCategoryIslands,
    linkIslandToCategory,
    unlinkIslandFromCategory,
    updateIslandCategories
  };
}
