import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Subcategory {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  category_id: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  created_at: string;
  subcategories?: Subcategory[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('id');

      if (categoriesError) throw categoriesError;

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('id');

      if (subcategoriesError) throw subcategoriesError;

      // Group subcategories by category_id
      const subcategoriesByCategory = subcategoriesData.reduce((acc, subcategory) => {
        if (!acc[subcategory.category_id]) {
          acc[subcategory.category_id] = [];
        }
        acc[subcategory.category_id].push(subcategory);
        return acc;
      }, {});

      // Combine categories with their subcategories
      const categoriesWithSubcategories = categoriesData.map(category => ({
        ...category,
        subcategories: subcategoriesByCategory[category.id] || []
      }));

      setCategories(categoriesWithSubcategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function createCategory(name: string, name_en: string, slug: string): Promise<Category | null> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('categories')
        .insert([
          { name, name_en, slug }
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh categories to include the new one
      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function createSubcategory(
    name: string, 
    name_en: string, 
    slug: string, 
    category_id: number
  ): Promise<Subcategory | null> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('subcategories')
        .insert([
          { name, name_en, slug, category_id }
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh categories to include the new subcategory
      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error creating subcategory:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateCategory(
    id: number, 
    name: string, 
    name_en: string, 
    slug: string
  ): Promise<Category | null> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('categories')
        .update({ name, name_en, slug })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Refresh categories to reflect the changes
      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateSubcategory(
    id: number,
    name: string, 
    name_en: string, 
    slug: string, 
    category_id: number
  ): Promise<Subcategory | null> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('subcategories')
        .update({ name, name_en, slug, category_id })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Refresh categories to reflect the changes
      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error updating subcategory:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      // Check if category has subcategories
      const category = categories.find(c => c.id === id);
      if (category?.subcategories && category.subcategories.length > 0) {
        throw new Error('Cannot delete category with existing subcategories. Please delete subcategories first.');
      }

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh categories to reflect the deletion
      await fetchCategories();
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubcategory(id: number): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh categories to reflect the deletion
      await fetchCategories();
      return true;
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    createCategory,
    createSubcategory,
    updateCategory,
    updateSubcategory,
    deleteCategory,
    deleteSubcategory
  };
}