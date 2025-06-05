import { useEffect, useState } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface DatabaseRecord {
  id: string | number;
  [key: string]: unknown;
}

// Custom hook for real-time subscriptions
export function useRealtimeSubscription<T extends DatabaseRecord>(
  table: string,
  options: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    filter?: string;
    filterValue?: string | number | boolean;
    initialData?: T[];
    callback?: (payload: RealtimePostgresChangesPayload<T>) => void;
  } = {}
) {
  const { event, filter, filterValue, initialData, callback } = options;
  const [data, setData] = useState<T[]>(initialData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    setLoading(true);
    
    // Fetch initial data if not provided
    const fetchInitialData = async () => {
      try {
        if (!initialData) {
          let query = supabase.from(table).select('*');
          
          if (filter && filterValue !== undefined) {
            query = query.eq(filter, filterValue);
          }
          
          const { data: fetchedData, error: fetchError } = await query;
          
          if (fetchError) {
            throw fetchError;
          }
          
          if (fetchedData) {
            setData(fetchedData as T[]);
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
    const channelFilter = filter && filterValue !== undefined 
      ? `${filter}=eq.${filterValue}`
      : '';
      
    let channel: RealtimeChannel;
    
    if (channelFilter) {
      channel = supabase
        .channel(`${table}-${channelFilter}`)
        .on(
          'postgres_changes' as unknown as "system",
          {
            event: event || '*',
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
            event: event || '*',
            schema: 'public',
            table
          },
          handleRealtimeChange
        )
        .subscribe();
    }
    
    // Handle changes from real-time subscription
    function handleRealtimeChange(payload: RealtimePostgresChangesPayload<T>) {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      console.log(`Real-time event on ${table}:`, eventType, payload);
      
      // Call the optional callback if provided
      if (callback) {
        callback(payload);
      }
      
      // Update the local data state based on the event
      if (eventType === 'INSERT') {
        setData(currentData => [...currentData, newRecord as T]);
      } 
      else if (eventType === 'UPDATE') {
        setData(currentData => 
          currentData.map(item => 
            item.id === (newRecord as T).id ? newRecord as T : item
          )
        );
      } 
      else if (eventType === 'DELETE') {
        setData(currentData => 
          currentData.filter(item => item.id !== (oldRecord as T).id)
        );
      }
    }
    
    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [table, filter, filterValue, event, callback, initialData]);
  
  return { data, loading, error };
}

// Example usage:
// const { data: comments, loading, error } = useRealtimeSubscription('comments', {
//   filter: 'article_id',
//   filterValue: 123
// });
