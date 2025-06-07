import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

type Island = {
  id: number;
  name_dv: string;
  name_en: string;
  slug: string;
  island_code: string | null;
  island_category_dv: string | null;
  island_category_en: string | null;
  island_details: string | null;
  longitude: string | null;
  latitude: string | null;
  election_commission_code: string | null;
  postal_code: string | null;
  other_name_en: string | null;
  other_name_dv: string | null;
  atoll_id: number | null;
  created_at?: string;  // Made optional since it might be missing in the database
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
};

export function useIslands(atollIds?: number[]) {
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevAtollIdsRef = useRef<number[] | undefined>();
  
  const fetchIslands = useCallback(async () => {
    try {
      // Check if the atollIds have actually changed
      const prevAtollIds = prevAtollIdsRef.current;
      const atollIdsChanged = 
        !prevAtollIds && atollIds || 
        !atollIds && prevAtollIds || 
        (atollIds && prevAtollIds && 
          (atollIds.length !== prevAtollIds.length || 
           !atollIds.every((id, i) => id === prevAtollIds[i])));

      console.log('Fetching islands with atollIds:', atollIds, 'changed:', atollIdsChanged);
      
      // Update the ref to current atollIds
      prevAtollIdsRef.current = atollIds;
      
      setLoading(true);
      setError(null);

      let query = supabase
        .from('islands')
        .select(`
          id,
          name_dv,
          name_en,
          slug,
          island_code,
          island_category_dv,
          island_category_en,
          island_details,
          longitude,
          latitude,
          election_commission_code,
          postal_code,
          other_name_en,
          other_name_dv,
          atoll_id,
          created_at,
          atolls:atoll_id (
            id,
            name,
            name_en,
            slug
          )
        `);

      // Filter by atolls if provided
      if (atollIds && atollIds.length > 0) {
        query = query.in('atoll_id', atollIds);
      }

      // Apply ordering after filtering
      query = query.order('name_en', { ascending: true });

      const { data: rawData, error: dbError } = await query;

      if (dbError) throw dbError;
      
      // Add a created_at field if missing to prevent errors and handle atoll data
      const data = rawData?.map(island => {
        // Process island data to ensure it has all required fields
        const processedIsland = {
          ...island,
          created_at: island.created_at || new Date().toISOString(),
          atoll: Array.isArray(island.atolls) ? island.atolls[0] : island.atolls
        };
        
        // Log missing fields for debugging purposes
        if (!island.created_at) {
          console.log(`Fixed missing created_at field for island: ${island.name_en || island.name_dv} (ID: ${island.id})`);
        }
        
        return processedIsland;
      });
      
      console.log('Islands data fetched:', data?.length || 0, 'islands');
      setIslands(data || []);
    } catch (err) {
      console.error('Error fetching islands:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [atollIds]);

  useEffect(() => {
    console.log('useIslands useEffect triggered, atollIds:', atollIds);
    fetchIslands();
  }, [fetchIslands, atollIds]);

  return {
    islands,
    loading,
    error,
    refresh: fetchIslands
  };
}