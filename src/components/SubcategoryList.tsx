import React from 'react';
import { Link } from 'react-router-dom';
import { Subcategory } from '../types';
import { getSubcategoryColor } from '../utils/categoryColors';

interface SubcategoryListProps {
  subcategories: Subcategory[];
  categorySlug: string;
  language?: 'en' | 'dv';
  className?: string;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ 
  subcategories, 
  categorySlug, 
  language = 'dv',
  className = ''
}) => {
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {subcategories.map(subcategory => {
        const colors = getSubcategoryColor(subcategory.category_id);
        return (
          <Link
            key={subcategory.id}
            to={`/category/${categorySlug}/${subcategory.slug}`}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${colors.bg} ${colors.text} ${colors.hover} ${
              language === 'dv' ? 'thaana-waheed' : ''
            }`}
          >
            → {language === 'dv' ? subcategory.name : subcategory.name_en}
          </Link>
        );
      })}
    </div>
  );
};

export default SubcategoryList;