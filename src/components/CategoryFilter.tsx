import React, { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';
import CategorySelector from './CategorySelector';

interface Item {
  id: number;
  title: string;
  category_id: number;
  subcategory_id: number | null;
}

interface CategoryFilterProps {
  items: Item[];
  onFilteredItemsChange: (items: Item[]) => void;
  language: 'en' | 'dv';
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ items, onFilteredItemsChange, language }) => {
  const { categories, loading, error } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  // Filter items when selection changes
  useEffect(() => {
    let filtered = [...items];
    
    if (selectedCategoryId) {
      filtered = filtered.filter(item => item.category_id === parseInt(selectedCategoryId));
    }
    
    if (selectedSubcategoryId) {
      filtered = filtered.filter(item => item.subcategory_id === parseInt(selectedSubcategoryId));
    }
    
    onFilteredItemsChange(filtered);
  }, [selectedCategoryId, selectedSubcategoryId, items, onFilteredItemsChange]);

  if (loading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading categories: {error}</div>;
  }

  return (
    <div className="mb-6">
      <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
        {language === 'dv' ? 'ބައިތަކުން ހޯއްދަވާ' : 'Filter by Category'}
      </h3>
      
      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        selectedSubcategoryId={selectedSubcategoryId}
        onCategoryChange={setSelectedCategoryId}
        onSubcategoryChange={setSelectedSubcategoryId}
        language={language}
      />
      
      <div className="mt-3 text-sm">
        <button 
          onClick={() => {
            setSelectedCategoryId('');
            setSelectedSubcategoryId(null);
          }}
          className={`text-blue-600 hover:underline ${language === 'dv' ? 'thaana-waheed' : ''}`}
        >
          {language === 'dv' ? 'ހުރިހާ ބައިތައް ދައްކަވާ' : 'Show all categories'}
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;
