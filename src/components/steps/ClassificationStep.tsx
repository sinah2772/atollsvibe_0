import React, { useState, useEffect, useMemo } from 'react';
import { StepProps } from '../../types/editor';
import { MultiSelect } from '../MultiSelect';
import { ColoredMultiSelect } from '../ColoredMultiSelect';
import { IslandsSelect } from '../IslandsSelect';

// Define proper types for the component data
interface CategoryData {
  id: number;
  name: string;
  name_en: string;
  color?: string;
  subcategories?: SubcategoryData[];
}

interface SubcategoryData {
  id: number;
  name: string;
  name_en: string;
}

interface GovernmentData {
  id: string;
  name: string;
  name_en: string;
}

// Define ColoredOption interface to match ColoredMultiSelect expectations
interface ColoredOption {
  id: number | string;
  name: string;
  name_en: string;
  type: 'category' | 'subcategory';
  parentCategoryName?: string;
  parentCategoryNameEn?: string;
  categoryId?: number;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

// Define Option interface to match MultiSelect expectations
interface Option {
  id: number | string;
  name: string;
  name_en: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

const ClassificationStep: React.FC<StepProps> = ({ 
  formData, 
  onFormDataChange, 
  language,
  categories,
  government
}) => {
  const [availableSubcategories, setAvailableSubcategories] = useState<SubcategoryData[]>([]);
  
  const typedCategories = useMemo(() => (categories as unknown as CategoryData[]) || [], [categories]);
  const typedGovernment = useMemo(() => (government as unknown as GovernmentData[]) || [], [government]);  
  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category && Array.isArray(formData.category) && formData.category.length > 0) {
      const catId = parseInt(formData.category[0] as string);
      
      // Find selected category
      const category = typedCategories.find(cat => cat.id === catId);
      if (category && category.subcategories) {
        setAvailableSubcategories(category.subcategories);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.category, typedCategories]);
  
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  // Convert categories to ColoredOption format
  const categoryOptions: ColoredOption[] = typedCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    name_en: cat.name_en,
    type: 'category' as const
  }));

  // Convert subcategories to Option format
  const subcategoryOptions: Option[] = availableSubcategories.map(sub => ({
    id: sub.id,
    name: sub.name,
    name_en: sub.name_en
  }));

  // Convert government to Option format
  const governmentOptions: Option[] = typedGovernment.map(gov => ({
    id: gov.id,
    name: gov.name,
    name_en: gov.name_en
  }));

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ކެޓަގަރީ' : 'Category'} *
        </label>
        <ColoredMultiSelect
          options={categoryOptions}
          value={formData.category as (number | string)[] || []}
          onChange={(value) => {
            handleChange('category', value);
            // Reset subcategory when category changes
            handleChange('subcategory', []);
          }}
          language={language}
          placeholder={language === 'dv' ? 'ކެޓަގަރީ އިޚްތިޔާރުކުރޭ' : 'Select a category'}
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސަބް ކެޓަގަރީ' : 'Subcategory'}
        </label>
        <MultiSelect
          options={subcategoryOptions}
          value={formData.subcategory as (number | string)[] || []}
          onChange={(value) => handleChange('subcategory', value)}
          language={language}
          placeholder={language === 'dv' ? 'ސަބް ކެޓަގަރީ އިޚްތިޔާރުކުރޭ' : 'Select a subcategory'}
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އަތޮޅުތައް' : 'Atolls'}
        </label>
        <IslandsSelect
          atollIds={formData.selectedAtolls as number[] || []}
          value={formData.selectedIslands as number[] || []}
          onChange={(value: number[]) => handleChange('selectedIslands', value)}
          language={language}
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މިނިސްޓްރީތައް' : 'Government Ministries'}
        </label>
        <MultiSelect
          options={governmentOptions}
          value={formData.selectedGovernmentIds as (number | string)[] || []}
          onChange={(value) => handleChange('selectedGovernmentIds', value)}
          language={language}
          placeholder={language === 'dv' ? 'މިނިސްޓްރީ އިޚްތިޔާރުކުރޭ' : 'Select ministries'}
        />
      </div>
    </div>
  );
};

export default ClassificationStep;
