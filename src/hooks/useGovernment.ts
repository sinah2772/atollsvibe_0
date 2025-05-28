import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Government {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  archived: boolean;
  draft: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export function useGovernment() {
  const [government, setGovernment] = useState<Government[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallbackData, setUseFallbackData] = useState(false);
  // Fallback data in case the database connection fails
  const fallbackGovernmentData: Government[] = [
    { id: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', name: 'މިނިސްޓްރީ އޮފް ފޮރިން އެފެއާޒް', name_en: 'Ministry of Foreign Affairs', slug: 'ministree-of-forin-efe-aaz', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
    { id: 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', name: 'މިނިސްޓްރީ އޮފް ޑިފެންސް', name_en: 'Ministry of Defence', slug: 'ministree-of-difens', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
    { id: 'c3d4e5f6-a1b2-7890-c3d4-e5f6a1b27890', name: 'މިނިސްޓްރީ އޮފް އެޑިޔުކޭޝަން', name_en: 'Ministry of Education', slug: 'ministree-of-ediyukeyshan', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
    { id: 'd4e5f6a1-b2c3-7890-d4e5-f6a1b2c37890', name: 'މިނިސްޓްރީ އޮފް ހޯމް އެފެއާޒް', name_en: 'Ministry of Home Affairs', slug: 'ministree-of-hoam-efe-aaz', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
    { id: 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', name: 'މިނިސްޓްރީ އޮފް ފިނޭންސް', name_en: 'Ministry of Finance', slug: 'ministree-of-fineyns', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
    { id: 'f6a1b2c3-d4e5-7890-f6a1-b2c3d4e57890', name: 'މިނިސްޓްރީ އޮފް ހެލްތް', name_en: 'Ministry of Health', slug: 'ministree-of-helth', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
    { id: '12345678-abcd-4321-abcd-1234567890ab', name: 'މިނިސްޓްރީ  އޮފް ޓޫރިޒަމް', name_en: 'Ministry of Tourism', slug: 'ministree-of-toorizam', archived: false, draft: false, created_at: '2022-10-10', updated_at: '2022-10-10', published_at: '2024-08-25' },
  ];
  useEffect(() => {
    async function fetchGovernmentData() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('government')
          .select('*')
          .eq('archived', false)
          .not('published_at', 'is', null)
          .lte('published_at', new Date().toISOString())
          .order('name_en', { ascending: true });

        if (error) {
          console.error('Error fetching government data:', error);
          setError(`Database error: ${error.message}`);
          setUseFallbackData(true);
          setGovernment(fallbackGovernmentData);
          return;
        }

        if (data) {
          setGovernment(data);
          setUseFallbackData(false);
        }
      } catch (err) {
        console.error('Unexpected error fetching government data:', err);
        setError('Failed to fetch government data');
        setUseFallbackData(true);
        setGovernment(fallbackGovernmentData);
      } finally {
        setLoading(false);
      }
    }

    fetchGovernmentData();
  }, [fallbackGovernmentData]);

  return {
    government,
    loading,
    error,
    useFallbackData
  };
}
