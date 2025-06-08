import React, { useState, useEffect } from 'react';
import { MultiSelect } from './MultiSelect';
import { useIslandCategories } from '../hooks/useIslandCategories';
import { getCategoryIslands } from '../utils/islandCategoryLinks';

interface Island {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  atoll_id: number;
  island_code?: string;
}

interface CategoryDependentIslandSelectorProps {
  selectedCategories: number[];
  selectedIslands: number[];
  onCategoriesChange: (categoryIds: number[]) => void;
  onIslandsChange: (islandIds: number[]) => void;
  language?: 'en' | 'dv';
  className?: string;
  required?: boolean;
}

export const CategoryDependentIslandSelector: React.FC<CategoryDependentIslandSelectorProps> = ({
  selectedCategories,
  selectedIslands,
  onCategoriesChange,
  onIslandsChange,
  language = 'dv',
  className = '',
  required = false
}) => {
  const { islandCategories, loading: categoriesLoading, error: categoriesError } = useIslandCategories();
  const [availableIslands, setAvailableIslands] = useState<Island[]>([]);
  const [islandsLoading, setIslandsLoading] = useState(false);
  const [islandsError, setIslandsError] = useState<string | null>(null);

  // Fetch islands when categories are selected
  useEffect(() => {
    const fetchIslandsForCategories = async () => {
      if (selectedCategories.length === 0) {
        setAvailableIslands([]);
        // Clear selected islands if no categories are selected
        if (selectedIslands.length > 0) {
          onIslandsChange([]);
        }
        return;
      }

      try {
        setIslandsLoading(true);
        setIslandsError(null);

        // Fetch islands for all selected categories
        const islandPromises = selectedCategories.map(categoryId => 
          getCategoryIslands(categoryId)
        );
        
        const islandArrays = await Promise.all(islandPromises);
        
        // Combine and deduplicate islands from all categories
        const allIslands = islandArrays.flat();
        const uniqueIslands = allIslands.filter((island, index, self) => 
          index === self.findIndex(i => i.id === island.id)
        );

        setAvailableIslands(uniqueIslands);

        // Remove any selected islands that are no longer available
        const validSelectedIslands = selectedIslands.filter(islandId =>
          uniqueIslands.some(island => island.id === islandId)
        );
        
        if (validSelectedIslands.length !== selectedIslands.length) {
          onIslandsChange(validSelectedIslands);
        }

      } catch (error) {
        console.error('Error fetching islands for categories:', error);
        setIslandsError(error instanceof Error ? error.message : 'Failed to load islands');
        setAvailableIslands([]);
      } finally {
        setIslandsLoading(false);
      }
    };

    fetchIslandsForCategories();
  }, [selectedCategories, selectedIslands, onIslandsChange]);

  // Category options for MultiSelect
  const categoryOptions = islandCategories.map(category => ({
    id: category.id,
    name: language === 'dv' ? category.name : category.name_en,
    name_en: category.name_en
  }));

  // Island options for MultiSelect
  const islandOptions = availableIslands.map(island => ({
    id: island.id,
    name: language === 'dv' ? island.name : island.name_en,
    name_en: island.name_en
  }));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Island Categories Selection */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${
          language === 'dv' ? 'thaana-waheed' : ''
        }`}>
          {language === 'dv' ? 'ރަށުގެ ބާވަތް އިޚްތިޔާރު ކުރައްވާ' : 'Select Island Categories'}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {categoriesLoading ? (
          <div className="w-full rounded-lg border-gray-300 shadow-sm p-3 text-center text-gray-500">
            <div className="animate-pulse">
              {language === 'dv' ? 'ބާވަތްތައް ލޯޑްވަނީ...' : 'Loading categories...'}
            </div>
          </div>
        ) : categoriesError ? (
          <div className="w-full rounded-lg border-red-300 shadow-sm p-3 text-center text-red-500">
            {language === 'dv' ? 'ބާވަތްތައް ލޯޑް ކުރެވުނެއް ނުގަނެ' : 'Failed to load categories'}
          </div>
        ) : (
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onChange={(values) => {
              const numberValues = values.filter(id => typeof id === 'number') as number[];
              onCategoriesChange(numberValues);
            }}
            language={language}
            placeholder={language === 'dv' ? 'ބާވަތްތައް ހޮއްވަވާ...' : 'Select categories...'}
          />
        )}
      </div>

      {/* Islands Selection - Only show if categories are selected */}
      {selectedCategories.length > 0 && (
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${
            language === 'dv' ? 'thaana-waheed' : ''
          }`}>
            {language === 'dv' ? 'ރަށްތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select Islands'}
          </label>
          
          {islandsLoading ? (
            <div className="w-full rounded-lg border-gray-300 shadow-sm p-3 text-center text-gray-500">
              <div className="animate-pulse">
                {language === 'dv' ? 'ރަށްތައް ލޯޑްވަނީ...' : 'Loading islands...'}
              </div>
            </div>
          ) : islandsError ? (
            <div className="w-full rounded-lg border-red-300 shadow-sm p-3 text-center text-red-500">
              {language === 'dv' ? 'ރަށްތައް ލޯޑް ކުރެވުނެއް ނުގަނެ' : 'Failed to load islands'}
            </div>
          ) : availableIslands.length === 0 ? (
            <div className="w-full rounded-lg border-gray-300 shadow-sm p-3 text-center text-gray-500">
              {language === 'dv' ? 'ހޮއްވާފައިވާ ބާވަތްތަކަށް ރަށެއް ނުފެނެ' : 'No islands found for selected categories'}
            </div>
          ) : (
            <MultiSelect
              options={islandOptions}
              value={selectedIslands}
              onChange={(values) => {
                const numberValues = values.filter(id => typeof id === 'number') as number[];
                onIslandsChange(numberValues);
              }}
              language={language}
              placeholder={language === 'dv' ? 'ރަށްތައް ހޮއްވަވާ...' : 'Select islands...'}
            />
          )}
        </div>
      )}

      {/* Helpful Info */}
      {selectedCategories.length === 0 && (
        <div className="text-sm text-gray-600">
          {language === 'dv' 
            ? 'ރަށްތައް ހޮއްވުމަށް ކުރިން ބާވަތެއް ހޮއްވަވާ'
            : 'Please select a category first to see available islands'
          }
        </div>
      )}
      
      {selectedCategories.length > 0 && availableIslands.length > 0 && (
        <div className="text-sm text-gray-600">
          {language === 'dv' 
            ? `${availableIslands.length} ރަށް ލިބެން އެވެ`
            : `${availableIslands.length} islands available`
          }
        </div>
      )}
    </div>
  );
};
