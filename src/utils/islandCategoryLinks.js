// Utility functions for managing island-category links
import { supabase } from '../lib/supabase';

/**
 * Get all categories associated with a specific island
 * 
 * @param {number} islandId - The ID of the island
 * @returns {Promise<Array>} - Array of categories associated with this island
 */
export async function getIslandCategories(islandId) {
  const { data, error } = await supabase
    .from('island_category_links')
    .select(`
      island_category_id,
      category:island_category_id (
        id,
        name,
        name_en,
        slug
      )
    `)
    .eq('island_id', islandId);
    
  if (error) {
    console.error('Error fetching island categories:', error);
    throw error;
  }
  
  return data?.map(link => link.category) || [];
}

/**
 * Get all islands associated with a specific category
 * 
 * @param {number} categoryId - The ID of the category
 * @returns {Promise<Array>} - Array of islands in this category
 */
export async function getCategoryIslands(categoryId) {
  const { data, error } = await supabase
    .from('island_category_links')
    .select(`
      island_id,
      island:island_id (
        id,
        name,
        name_en,
        slug,
        atoll_id,
        island_code
      )
    `)
    .eq('island_category_id', categoryId);
    
  if (error) {
    console.error('Error fetching category islands:', error);
    throw error;
  }
  
  return data?.map(link => link.island) || [];
}

/**
 * Associate an island with a category
 * 
 * @param {number} islandId - The ID of the island
 * @param {number} categoryId - The ID of the category
 * @returns {Promise<boolean>} - Success status
 */
export async function addIslandToCategory(islandId, categoryId) {
  try {
    const { error } = await supabase
      .from('island_category_links')
      .insert([
        { island_id: islandId, island_category_id: categoryId }
      ]);
      
    if (error) {
      console.error('Error adding island to category:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to add island to category:', err);
    return false;
  }
}

/**
 * Remove an association between an island and a category
 * 
 * @param {number} islandId - The ID of the island
 * @param {number} categoryId - The ID of the category
 * @returns {Promise<boolean>} - Success status
 */
export async function removeIslandFromCategory(islandId, categoryId) {
  try {
    const { error } = await supabase
      .from('island_category_links')
      .delete()
      .match({ island_id: islandId, island_category_id: categoryId });
      
    if (error) {
      console.error('Error removing island from category:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to remove island from category:', err);
    return false;
  }
}

/**
 * Set all categories for an island (replaces existing associations)
 * 
 * @param {number} islandId - The ID of the island
 * @param {number[]} categoryIds - Array of category IDs to associate with the island
 * @returns {Promise<boolean>} - Success status
 */
export async function setIslandCategories(islandId, categoryIds) {
  try {
    // Start a transaction
    const { error: txnError } = await supabase.rpc('begin_transaction');
    if (txnError) throw txnError;
    
    try {
      // Remove existing relationships for this island
      const { error: deleteError } = await supabase
        .from('island_category_links')
        .delete()
        .eq('island_id', islandId);
        
      if (deleteError) throw deleteError;
      
      // Add new relationships
      if (categoryIds && categoryIds.length > 0) {
        const newLinks = categoryIds.map(categoryId => ({
          island_id: islandId,
          island_category_id: categoryId
        }));
        
        const { error: insertError } = await supabase
          .from('island_category_links')
          .insert(newLinks);
          
        if (insertError) throw insertError;
      }
      
      // Commit the transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;
      
      return true;
    } catch (error) {
      // Rollback on error
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (err) {
    console.error('Failed to set island categories:', err);
    return false;
  }
}
