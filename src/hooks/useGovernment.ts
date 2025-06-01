import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GovernmentEntity {
  id: string;
  name: string;
  name_en: string;
}

export const useGovernment = () => {
  const [government, setGovernment] = useState<GovernmentEntity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallbackData, setUseFallbackData] = useState(false);
  useEffect(() => {
    const fetchGovernment = async () => {
      try {
        setLoading(true);
          const { data, error } = await supabase
          .from('government')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          console.error('Error fetching government data:', error);
          setError(error.message);
          
          // Use fallback data if the fetch fails
          setGovernment(FALLBACK_GOVERNMENT_DATA);
          setUseFallbackData(true);
        } else if (data) {
          // Convert numeric IDs to strings to match the interface
          const formattedData = data.map(item => ({
            ...item,
            id: String(item.id)
          }));
          console.log('useGovernment: Formatted government data:', formattedData);
          setGovernment(formattedData);
          setUseFallbackData(false);
        }
      } catch (err) {
        console.error('Failed to fetch government data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Use fallback data if the fetch fails
        setGovernment(FALLBACK_GOVERNMENT_DATA);
        setUseFallbackData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGovernment();
  }, []);

  return { government, loading, error, useFallbackData };
};

// Fallback government data in case the API fails
const FALLBACK_GOVERNMENT_DATA: GovernmentEntity[] = [
  {
    id: '1',
    name: 'ރައީސް އޮފީސް',
    name_en: 'President\'s Office'
  },
  {
    id: '2',
    name: 'މިނިސްޓްރީ އޮފް ފިނޭންސް',
    name_en: 'Ministry of Finance'
  },
  {
    id: '3',
    name: 'މިނިސްޓްރީ އޮފް ފޮރިން އެފެއާޒް',
    name_en: 'Ministry of Foreign Affairs'
  },
  {
    id: '4',
    name: 'މިނިސްޓްރީ އޮފް ހެލްތް',
    name_en: 'Ministry of Health'
  },
  {
    id: '5',
    name: 'މިނިސްޓްރީ އޮފް އެޑިއުކޭޝަން',
    name_en: 'Ministry of Education'
  }
];