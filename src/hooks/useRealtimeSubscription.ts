import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Custom hook for real-time subscriptions
export function useRealtimeSubscription<T>(
  table: string,
  options: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    filter?: string;
    filterValue?: any;
    initialData?: T[];
    callback?: (payload: any) => void;
  } = {}
) {
  const [data, setData] = useState<T[]>(options.initialData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    setLoading(true);
    
    // Fetch initial data if not provided
    const fetchInitialData = async () => {
      try {
        if (!options.initialData) {
          let query = supabase.from(table).select('*');
          
          if (options.filter && options.filterValue !== undefined) {
            query = query.eq(options.filter, options.filterValue);
          }
          
          const { data: initialData, error: fetchError } = await query;
          
          if (fetchError) {
            throw fetchError;
          }
          
          if (initialData) {
            setData(initialData as T[]);
          }
        }
      } catch (err) {
        console.error(`Error fetching initial data from ${table}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Set up real-time subscription
    let channelFilter = options.filter && options.filterValue !== undefined 
      ? `${options.filter}=eq.${options.filterValue}`
      : '';
      
    let channel: RealtimeChannel;
    
    if (channelFilter) {
      channel = supabase
        .channel(`${table}-${channelFilter}`)
        .on(
          'postgres_changes' as unknown as "system",
          {
            event: options.event || '*', 
            schema: 'public',
            table,
            filter: channelFilter
          },
          handleRealtimeChange
        )
        .subscribe();
    } else {
      channel = supabase
        .channel(`${table}`)
        .on(
          'postgres_changes' as unknown as "system",
          {
            event: options.event || '*',
            schema: 'public',
            table
          },
          handleRealtimeChange
        )
        .subscribe();
    }
    
    // Handle changes from real-time subscription
    function handleRealtimeChange(payload: any) {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      console.log(`Real-time event on ${table}:`, eventType, payload);
      
      // Call the optional callback if provided
      if (options.callback) {
        options.callback(payload);
      }
      
      // Update the local data state based on the event
      if (eventType === 'INSERT') {
        setData(currentData => [...currentData, newRecord as T]);
      } 
      else if (eventType === 'UPDATE') {
        setData(currentData => 
          currentData.map(item => 
            (item as any).id === (newRecord as any).id ? newRecord as T : item
          )
        );
      } 
      else if (eventType === 'DELETE') {
        setData(currentData => 
          currentData.filter(item => (item as any).id !== (oldRecord as any).id)
        );
      }
    }
    
    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [table, options.filter, options.filterValue, options.event, options.callback]);
  
  return { data, loading, error };
}

// Example usage:
// const { data: comments, loading, error } = useRealtimeSubscription('comments', {
//   filter: 'article_id',
//   filterValue: 123
// });
