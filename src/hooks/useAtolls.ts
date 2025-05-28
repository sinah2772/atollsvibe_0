import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Atoll = Database['public']['Tables']['atolls']['Row'];

// Fallback mock data in case the database is not accessible or empty
const fallbackAtolls: Atoll[] = [
  { id: 1, name: 'ހއ', name_en: 'Ha Alif', slug: 'ha-alif', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
  { id: 2, name: 'ހދ', name_en: 'Ha Dhaalu', slug: 'ha-dhaalu', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
  { id: 3, name: 'ށ', name_en: 'Shaviyani', slug: 'shaviyani', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
  { id: 4, name: 'ނ', name_en: 'Noonu', slug: 'noonu', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
  { id: 5, name: 'ރ', name_en: 'Raa', slug: 'raa', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
  { id: 6, name: 'ބ', name_en: 'Baa', slug: 'baa', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
  { id: 7, name: 'ޅ', name_en: 'Lhaviyani', slug: 'lhaviyani', created_at: new Date().toISOString(), island_reference: null, island_reference_dv: null, island_category: null, island_category_en: null },
];

export function useAtolls(islandId?: number | null) {
  const [atolls, setAtolls] = useState<Atoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallbackData, setUseFallbackData] = useState(false);

  const fetchAtolls = useCallback(async () => {
    try {
      console.log('Starting to fetch atolls...');
      setLoading(true);
      setError(null);
      setUseFallbackData(false);
      
      if (islandId) {
        console.log(`Fetching atoll for island ID: ${islandId}`);
        // If island ID is provided, fetch only the atoll containing this island
        // First, get the atoll_id for this island
        const { data: islandData, error: islandError } = await supabase
          .from('islands')
          .select('atoll_id')
          .eq('id', islandId)
          .single();
        
        console.log('Island data:', islandData, 'Error:', islandError);
        if (islandError) throw islandError;
        if (islandData?.atoll_id) {
          // Then fetch just that atoll
          const { data: atollData, error: atollError } = await supabase
            .from('atolls')
            .select('*')
            .eq('id', islandData.atoll_id);
          
          console.log('Atoll data for specific island:', atollData, 'Error:', atollError);
          if (atollError) throw atollError;
          
          // Use real data if available, otherwise fallback
          if (atollData && atollData.length > 0) {
            setAtolls(atollData);
          } else {
            console.log('No atoll data found for specific island, using fallback data');
            // Filter fallback data to only include the matching atoll if possible
            const matchingAtoll = fallbackAtolls.find(atoll => atoll.id === islandData.atoll_id);
            setAtolls(matchingAtoll ? [matchingAtoll] : fallbackAtolls);
            setUseFallbackData(true);
          }
          setLoading(false);
          return;
        }
      }
      
      // If no island filter or island has no atoll, fetch all atolls
      console.log('Fetching all atolls...');
      const { data, error } = await supabase
        .from('atolls')
        .select('*')
        .order('id');
      
      console.log('All atolls data:', data?.length || 0, 'Error:', error);
      if (error) throw error;
      
      // Use real data if available, otherwise fallback
      if (data && data.length > 0) {
        setAtolls(data);
      } else {
        console.log('No atoll data found from API, using fallback data');
        setAtolls(fallbackAtolls);
        setUseFallbackData(true);
      }
    } catch (err) {
      console.error('Error fetching atolls:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Use fallback data on error
      console.log('Using fallback atoll data due to error');
      setAtolls(fallbackAtolls);
      setUseFallbackData(true);
    } finally {
      setLoading(false);
    }
  }, [islandId]);

  useEffect(() => {
    fetchAtolls();
  }, [fetchAtolls]);

  return {
    atolls,
    loading,
    error,
    refresh: fetchAtolls,
    useFallbackData
  };
}