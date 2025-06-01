import React, { useEffect, useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { useIslands } from '../hooks/useIslands';

type IslandData = {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  island_code: string | null;
  island_category: string | null;
  island_category_en: string | null;
  island_details: string | null;
  longitude: string | null;
  latitude: string | null;
  election_commission_code: string | null;
  postal_code: string | null;
  other_name_en: string | null;
  other_name_dv: string | null;
  list_order: number | null;
  atoll_id: number | null;
  created_at: string;
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
          // Check if the island matches any of the selected categories
          return categories.some(category => 
            island.island_category === category || 
            island.island_category_en === category ||
            (island.island_category && island.island_category.toLowerCase() === category.toLowerCase()) ||
            (island.island_category_en && island.island_category_en.toLowerCase() === category.toLowerCase())
          );
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
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : 'Failed to load islands'}
      </div>
    );
  }
  
  // Filter and map islands to match MultiSelect option format
  const options = filteredIslands?.map(island => ({
    id: island.id,
    name: island.name,
    name_en: island.name_en,
    atoll: island.atoll
  })) || [];

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