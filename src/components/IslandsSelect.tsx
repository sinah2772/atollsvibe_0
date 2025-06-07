import React, { useEffect, useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { useIslands } from '../hooks/useIslands';

type IslandData = {
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
  created_at?: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
};

interface IslandsSelectProps {
  atollIds?: number[];
  value: number[];
  onChange: (values: number[]) => void;
  language?: 'en' | 'dv';
  placeholder?: string;
  className?: string;
  islandCategory?: string | string[];
}

export const IslandsSelect: React.FC<IslandsSelectProps> = ({
  atollIds,
  value,
  onChange,
  language = 'dv',
  placeholder,
  className,
  islandCategory
}) => {
  // Make sure we only call useIslands with a valid array of atoll IDs
  const validAtollIds = atollIds && atollIds.length > 0 ? atollIds : undefined;
  console.log('IslandsSelect with atollIds:', validAtollIds);
  
  const { islands, loading, error } = useIslands(validAtollIds);
  const [filteredIslands, setFilteredIslands] = useState<IslandData[]>([]);

  // Update filtered islands when atoll selection changes, islands data loads, or island category changes
  useEffect(() => {
    console.log('Islands, value, or islandCategory changed:', islands?.length, value, islandCategory);
    
    if (islands) {
      let filtered = islands;
      
      // Filter by island category if specified
      if (islandCategory && 
          ((typeof islandCategory === 'string' && islandCategory.trim() !== '') ||
           (Array.isArray(islandCategory) && islandCategory.length > 0))) {
        console.log('Filtering islands by category:', islandCategory);
        
        const categories = Array.isArray(islandCategory) ? islandCategory : [islandCategory];
        
        filtered = islands.filter(island => {
          // Safety check in case island is null or undefined
          if (!island) return false;
          
          // Check if the island matches any of the selected categories
          return categories.some(category => {
            // Skip empty categories
            if (!category) return false;
            
            const islandCategory = island.island_category_dv || '';
            const islandCategoryEn = island.island_category_en || '';
            
            return islandCategory === category || 
                   islandCategoryEn === category ||
                   islandCategory.toLowerCase() === category.toLowerCase() ||
                   islandCategoryEn.toLowerCase() === category.toLowerCase();
          });
        });
        console.log('Filtered islands count:', filtered.length);
      }
      
      // Keep any selected islands that are still valid after filtering
      const validSelectedIslands = value.filter(id => 
        filtered.some(island => island.id === id)
      );
      
      // If some selected islands are no longer valid, update the selection
      if (validSelectedIslands.length !== value.length) {
        console.log('Updating selected islands after filtering:', validSelectedIslands);
        onChange(validSelectedIslands);
      }
      
      setFilteredIslands(filtered);
    }
  }, [islands, value, onChange, islandCategory]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-[38px] bg-gray-200 rounded-lg w-full"></div>
      </div>
    );
  }

  if (error) {
    console.error('Islands loading error:', error);
    return (
      <div className={`text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md ${className}`}>
        <div className="mb-2">
          {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : `Failed to load islands: ${error}`}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.reload()}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            {language === 'dv' ? 'އަލުން ލޯޑުކުރުމަށް' : 'Refresh Page'}
          </button>
        </div>
      </div>
    );
  }
  
  // Filter and map islands to match MultiSelect option format
  const options = filteredIslands?.map(island => {
    // Ensure all required fields are present and have valid values
    const safeIsland = {
      id: island.id,
      name: island.name_dv || '(No Name)',
      name_en: island.name_en || '(Unnamed)',
      atoll: island.atoll ? {
        id: island.atoll.id,
        name: island.atoll.name || island.atoll.name_en || '(No Name)',
        name_en: island.atoll.name_en || '(Unnamed)',
        slug: island.atoll.slug || ''
      } : undefined
    };
    return safeIsland;
  }) || [];

  return (
    <div className={className}>
      <MultiSelect
        options={options}
        value={value}
        onChange={(values) => {
          // Convert back to number[] since we know islands always have number IDs
          const numberValues = values.filter(id => typeof id === 'number') as number[];
          onChange(numberValues);
        }}
        language={language}
        placeholder={placeholder || (language === 'dv' ? 'ރަށްތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select islands')}
      />
    </div>
  );
};