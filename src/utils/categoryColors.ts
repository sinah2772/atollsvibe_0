// Category color utility functions
interface CategoryColor {
  bg: string;
  text: string;
  border: string;
  hover: string;
  selected: string;
}

// Predefined color schemes for categories
const colorSchemes: CategoryColor[] = [
  {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100',
    selected: 'bg-blue-100'
  },
  {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-100',
    selected: 'bg-emerald-100'
  },
  {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100',
    selected: 'bg-purple-100'
  },
  {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100',
    selected: 'bg-amber-100'
  },
  {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-100',
    selected: 'bg-rose-100'
  },
  {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-100',
    selected: 'bg-indigo-100'
  },
  {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    hover: 'hover:bg-teal-100',
    selected: 'bg-teal-100'
  },
  {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100',
    selected: 'bg-orange-100'
  },
  {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-100',
    selected: 'bg-cyan-100'
  },
  {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    hover: 'hover:bg-pink-100',
    selected: 'bg-pink-100'
  }
];

/**
 * Get color scheme for a category based on its ID
 */
export function getCategoryColor(categoryId: number): CategoryColor {
  const index = (categoryId - 1) % colorSchemes.length;
  return colorSchemes[index];
}

/**
 * Get color scheme for a subcategory (slightly lighter than parent category)
 */
export function getSubcategoryColor(categoryId: number): CategoryColor {
  const index = (categoryId - 1) % colorSchemes.length;
  const scheme = colorSchemes[index];
  
  // Return a slightly modified version for subcategories using valid Tailwind classes
  return {
    bg: scheme.bg.replace('-50', '-100'),
    text: scheme.text.replace('-700', '-600'),
    border: scheme.border.replace('-200', '-300'),
    hover: scheme.hover.replace('-100', '-200'),
    selected: scheme.selected.replace('-100', '-200')
  };
}

/**
 * Create a display name for subcategory that includes parent category
 */
export function getSubcategoryDisplayName(
  subcategory: { name: string; category_id: number },
  parentCategory?: { name: string }
): string {
  if (parentCategory) {
    return `${subcategory.name} (${parentCategory.name})`;
  }
  return subcategory.name;
}

/**
 * Create colored options for MultiSelect component
 */
export function createColoredCategoryOptions(
  categories: Array<{ id: number; name: string; subcategories?: Array<{ id: number; name: string; category_id: number }> }>
): Array<{ value: string; label: string; color?: CategoryColor }> {
  const options: Array<{ value: string; label: string; color?: CategoryColor }> = [];
  
  categories.forEach(category => {
    const categoryColor = getCategoryColor(category.id);
    
    // Add main category
    options.push({
      value: category.id.toString(),
      label: category.name,
      color: categoryColor
    });
      // Add subcategories
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        const subcategoryColor = getSubcategoryColor(category.id);
        const displayName = getSubcategoryDisplayName(subcategory, category);
        
        options.push({
          value: subcategory.id.toString(),
          label: displayName,
          color: subcategoryColor
        });
      });
    }
  });
  
  return options;
}

export type { CategoryColor };