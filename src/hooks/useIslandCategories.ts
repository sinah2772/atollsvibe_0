import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface IslandCategory {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  created_at: string;
}

export function useIslandCategories() {
  const [islandCategories, setIslandCategories] = useState<IslandCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIslandCategories();
  }, []);

  async function fetchIslandCategories() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('island_categories')
        .select('*')
        .order('id');

      if (fetchError) throw fetchError;

      setIslandCategories(data || []);
    } catch (err) {
      console.error('Error fetching island categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function createIslandCategory(name: string, name_en: string, slug: string): Promise<IslandCategory | null> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('island_categories')
        .insert([
          { name, name_en, slug }
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh island categories to include the new one
      await fetchIslandCategories();
      return data;
    } catch (err) {
      console.error('Error creating island category:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateIslandCategory(
    id: number, 
    name: string, 
    name_en: string, 
    slug: string
  ): Promise<IslandCategory | null> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('island_categories')
        .update({ name, name_en, slug })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Refresh island categories to reflect the changes
      await fetchIslandCategories();
      return data;
    } catch (err) {
      console.error('Error updating island category:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function deleteIslandCategory(id: number): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('island_categories')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh island categories to reflect the deletion
      await fetchIslandCategories();
      return true;
    } catch (err) {
      console.error('Error deleting island category:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    islandCategories,
    loading,
    error,
    refresh: fetchIslandCategories,
    createIslandCategory,
    updateIslandCategory,
    deleteIslandCategory
  };
}
