import { useState, useEffect } from 'react';
import { useAtolls } from '../hooks/useAtolls';
import { useIslands } from '../hooks/useIslands';
import { useCategories } from '../hooks/useCategories';
import { useSubcategories } from '../hooks/useSubcategories';
import { getCategoryColor, getSubcategoryColor, getSubcategoryDisplayName } from '../utils/categoryColors';

// Interface for subcategory data
interface Subcategory {
  id: number;
  name: string;
  name_en?: string;
  slug?: string;
  category_id: number;
}

interface ArticleFiltersProps {
  onFilterChange: (filters: ArticleFilters) => void;
  initialFilters?: ArticleFilters;
}

export interface ArticleFilters {
  categoryId?: number | null;
  subcategoryId?: number | null;
  atollIds?: number[];
  islandIds?: number[];
  status?: string;
  newsType?: string;
  newsPriority?: number | null;
  newsSource?: string;
  factChecked?: boolean | null;
  approved?: boolean | null;
  flags?: {
    isBreaking?: boolean;
    isFeatured?: boolean;
    isDeveloping?: boolean;
    isExclusive?: boolean;
    isSponsored?: boolean;
  };
}

export function ArticleFilters({ onFilterChange, initialFilters }: ArticleFiltersProps) {
  const { atolls } = useAtolls();
  const { islands } = useIslands();
  const { categories } = useCategories();
  const { subcategories } = useSubcategories();
  
  const [filters, setFilters] = useState<ArticleFilters>(initialFilters || {
    atollIds: [],
    islandIds: [],
    flags: {}
  });

  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

  // Update subcategories when category changes
  useEffect(() => {
    if (filters.categoryId) {
      const filtered = subcategories.filter(sub => sub.category_id === filters.categoryId);
      setAvailableSubcategories(filtered);
    } else {
      setAvailableSubcategories(subcategories);
    }
  }, [filters.categoryId, subcategories]);

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({
      ...prev,
      categoryId: value,
      // Clear subcategory when category changes
      subcategoryId: null
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({
      ...prev,
      subcategoryId: value
    }));
  };

  const handleAtollChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    
    setFilters(prev => {
      const atollIds = [...(prev.atollIds || [])];
      
      if (e.target.value === "") {
        // "All" option selected
        return { ...prev, atollIds: [] };
      }
      
      if (atollIds.includes(value)) {
        // Remove if already selected
        const updatedIds = atollIds.filter(id => id !== value);
        return { ...prev, atollIds: updatedIds };
      } else {
        // Add if not already selected
        return { ...prev, atollIds: [...atollIds, value] };
      }
    });
  };

  const handleIslandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    
    setFilters(prev => {
      const islandIds = [...(prev.islandIds || [])];
      
      if (e.target.value === "") {
        // "All" option selected
        return { ...prev, islandIds: [] };
      }
      
      if (islandIds.includes(value)) {
        // Remove if already selected
        const updatedIds = islandIds.filter(id => id !== value);
        return { ...prev, islandIds: updatedIds };
      } else {
        // Add if not already selected
        return { ...prev, islandIds: [...islandIds, value] };
      }
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      status: e.target.value || undefined
    }));
  };

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFilters(prev => ({
      ...prev,
      flags: {
        ...(prev.flags || {}),
        [name]: checked
      }
    }));
  };

  const handleNewsTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      newsType: e.target.value || undefined
    }));
  };

  const handleNewsPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({
      ...prev,
      newsPriority: value
    }));
  };

  const handleNewsSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      newsSource: e.target.value || undefined
    }));
  };

  const handleFactCheckedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value: boolean | null = null;
    if (e.target.value === 'true') value = true;
    else if (e.target.value === 'false') value = false;
    
    setFilters(prev => ({
      ...prev,
      factChecked: value
    }));
  };

  const handleApprovedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value: boolean | null = null;
    if (e.target.value === 'true') value = true;
    else if (e.target.value === 'false') value = false;
    
    setFilters(prev => ({
      ...prev,
      approved: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      atollIds: [],
      islandIds: [],
      flags: {}
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Category filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.categoryId || ""}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => {
              const colors = getCategoryColor(category.id);
              return (
                <option 
                  key={category.id} 
                  value={category.id}
                  className={`font-medium ${colors.text}`}
                >
                  🏷️ {category.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Subcategory filter */}
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory
          </label>
          <select
            id="subcategory"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.subcategoryId || ""}
            onChange={handleSubcategoryChange}
            disabled={!filters.categoryId}
          >
            <option value="">All Subcategories</option>
            {availableSubcategories.map(subcategory => {
              const colors = getSubcategoryColor(subcategory.category_id);
              const parentCategory = categories.find(cat => cat.id === subcategory.category_id);
              const displayName = getSubcategoryDisplayName(subcategory, parentCategory);
              return (
                <option 
                  key={subcategory.id} 
                  value={subcategory.id}
                  className={`pl-4 ${colors.text}`}
                >
                  → {displayName}
                </option>
              );
            })}
          </select>
        </div>

        {/* Atoll filter */}
        <div>
          <label htmlFor="atoll" className="block text-sm font-medium text-gray-700 mb-1">
            Atoll
          </label>
          <select
            id="atoll"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value=""
            onChange={handleAtollChange}
          >
            <option value="">All Atolls</option>
            {atolls.map(atoll => (
              <option key={atoll.id} value={atoll.id}>
                {atoll.name} ({atoll.name_en})
              </option>
            ))}
          </select>
          {/* Selected atolls */}
          {filters.atollIds && filters.atollIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.atollIds.map(id => {
                const atoll = atolls.find(a => a.id === id);
                return atoll ? (
                  <span key={`selected-atoll-${id}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {atoll.name}
                    <button
                      type="button"
                      className="ml-1 text-teal-600 hover:text-teal-800"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        atollIds: prev.atollIds?.filter(atollId => atollId !== id)
                      }))}
                    >
                      ✕
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Island filter */}
        <div>
          <label htmlFor="island" className="block text-sm font-medium text-gray-700 mb-1">
            Island
          </label>
          <select
            id="island"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value=""
            onChange={handleIslandChange}
          >
            <option value="">All Islands</option>
            {islands.map(island => (
              <option key={island.id} value={island.id}>
                {island.name} ({island.name_en})
              </option>
            ))}
          </select>
          {/* Selected islands */}
          {filters.islandIds && filters.islandIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.islandIds.map(id => {
                const island = islands.find(i => i.id === id);
                return island ? (
                  <span key={`selected-island-${id}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {island.name}
                    <button
                      type="button"
                      className="ml-1 text-amber-600 hover:text-amber-800"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        islandIds: prev.islandIds?.filter(islandId => islandId !== id)
                      }))}
                    >
                      ✕
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Status filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.status || ""}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {/* News Type filter */}
        <div>
          <label htmlFor="newsType" className="block text-sm font-medium text-gray-700 mb-1">
            News Type
          </label>
          <select
            id="newsType"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.newsType || ""}
            onChange={handleNewsTypeChange}
          >
            <option value="">All Types</option>
            <option value="breaking">Breaking News</option>
            <option value="general">General News</option>
            <option value="politics">Politics</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="technology">Technology</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="culture">Culture</option>
            <option value="opinion">Opinion</option>
          </select>
        </div>

        {/* News Priority filter */}
        <div>
          <label htmlFor="newsPriority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority Level
          </label>
          <select
            id="newsPriority"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.newsPriority || ""}
            onChange={handleNewsPriorityChange}
          >
            <option value="">All Priorities</option>
            <option value="1">High Priority (1)</option>
            <option value="2">Medium Priority (2)</option>
            <option value="3">Normal Priority (3)</option>
            <option value="4">Low Priority (4)</option>
            <option value="5">Lowest Priority (5)</option>
          </select>
        </div>

        {/* News Source filter */}
        <div>
          <label htmlFor="newsSource" className="block text-sm font-medium text-gray-700 mb-1">
            News Source
          </label>
          <input
            type="text"
            id="newsSource"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Filter by source..."
            value={filters.newsSource || ""}
            onChange={handleNewsSourceChange}
          />
        </div>
      </div>

      {/* Workflow Status Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Fact Checked filter */}
        <div>
          <label htmlFor="factChecked" className="block text-sm font-medium text-gray-700 mb-1">
            Fact Check Status
          </label>
          <select
            id="factChecked"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.factChecked === null ? "" : filters.factChecked?.toString() || ""}
            onChange={handleFactCheckedChange}
          >
            <option value="">All</option>
            <option value="true">Fact Checked</option>
            <option value="false">Not Fact Checked</option>
          </select>
        </div>

        {/* Approved filter */}
        <div>
          <label htmlFor="approved" className="block text-sm font-medium text-gray-700 mb-1">
            Approval Status
          </label>
          <select
            id="approved"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.approved === null ? "" : filters.approved?.toString() || ""}
            onChange={handleApprovedChange}
          >
            <option value="">All</option>
            <option value="true">Approved</option>
            <option value="false">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Article flags */}
      <div className="mb-4">
        <p className="block text-sm font-medium text-gray-700 mb-1">Article Type</p>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              name="isBreaking"
              checked={filters.flags?.isBreaking || false}
              onChange={handleFlagChange}
            />
            <span className="ml-2 text-sm text-gray-700">Breaking News</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              name="isFeatured"
              checked={filters.flags?.isFeatured || false}
              onChange={handleFlagChange}
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              name="isDeveloping"
              checked={filters.flags?.isDeveloping || false}
              onChange={handleFlagChange}
            />
            <span className="ml-2 text-sm text-gray-700">Developing</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              name="isExclusive"
              checked={filters.flags?.isExclusive || false}
              onChange={handleFlagChange}
            />
            <span className="ml-2 text-sm text-gray-700">Exclusive</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              name="isSponsored"
              checked={filters.flags?.isSponsored || false}
              onChange={handleFlagChange}
            />
            <span className="ml-2 text-sm text-gray-700">Sponsored</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default ArticleFilters;
