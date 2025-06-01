import React, { useState } from 'react';
import { useCategories, Category, Subcategory } from '../hooks/useCategories';
import { getCategoryColor, getSubcategoryColor } from '../utils/categoryColors';

interface CategoryManagementProps {
  language: 'en' | 'dv';
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ language }) => {
  const { 
    categories, 
    loading, 
    error, 
    createCategory, 
    createSubcategory, 
    updateCategory, 
    updateSubcategory,
    deleteCategory,
    deleteSubcategory
  } = useCategories();
  
  // New category form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  
  // New subcategory form state
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryNameEn, setNewSubcategoryNameEn] = useState('');
  const [newSubcategorySlug, setNewSubcategorySlug] = useState('');
  
  // Edit mode states
  const [editMode, setEditMode] = useState<'none' | 'category' | 'subcategory'>('none');
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{id: number, type: 'category' | 'subcategory'} | null>(null);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Handle creating a new category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      // Basic validation
      // Basic validation
      if (!newCategoryName || !newCategoryNameEn || !newCategorySlug) {
        throw new Error(language === 'dv' ? 'ހުރިހާ މަޢުލޫމާތެއް ފުރިހަމަކުރައްވާ' : 'Please fill in all fields');
      }
      
      // Check if we're in edit mode
      if (editMode === 'category' && editItemId) {
        const result = await updateCategory(
          editItemId,
          newCategoryName,
          newCategoryNameEn,
          newCategorySlug
        );
        
        if (result) {
          setFormSuccess(language === 'dv' ? 'ބައި އަޕްޑޭޓް ކުރެވިއްޖެ' : 'Category updated successfully');
          // Clear form and exit edit mode
          resetForm();
        }
      } else {
        // Create new category
        const result = await createCategory(newCategoryName, newCategoryNameEn, newCategorySlug);
        
        if (result) {
          setFormSuccess(language === 'dv' ? 'ބައި އިތުރުކުރެވިއްޖެ' : 'Category added successfully');
          // Clear form
          resetForm();
        }
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle creating a new subcategory
  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      // Basic validation
      if (!selectedCategoryId || !newSubcategoryName || !newSubcategoryNameEn || !newSubcategorySlug) {
        throw new Error(language === 'dv' ? 'ހުރިހާ މަޢުލޫމާތެއް ފުރިހަމަކުރައްވާ' : 'Please fill in all fields');
      }
      
      // Check if we're in edit mode
      if (editMode === 'subcategory' && editItemId) {
        const result = await updateSubcategory(
          editItemId,
          newSubcategoryName,
          newSubcategoryNameEn,
          newSubcategorySlug,
          selectedCategoryId
        );
        
        if (result) {
          setFormSuccess(language === 'dv' ? 'ކުޑިބައި ަޕްޑޭޓް ކުރެވިއްޖެ' : 'Subcategory updated successfully');
          // Clear form and exit edit mode
          resetForm();
        }
      } else {
        // Create new subcategory
        const result = await createSubcategory(
          newSubcategoryName, 
          newSubcategoryNameEn, 
          newSubcategorySlug, 
          selectedCategoryId
        );
        
        if (result) {
          setFormSuccess(language === 'dv' ? 'ކުޑިބައި އިތުރުކުރެވިއްޖެ' : 'Subcategory added successfully');
          // Clear form
          resetForm();
        }
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set up form for editing a category
  const handleEditCategory = (category: Category) => {
    setEditMode('category');
    setEditItemId(category.id);
    setNewCategoryName(category.name);
    setNewCategoryNameEn(category.name_en);
    setNewCategorySlug(category.slug);
    
    // Scroll to the category form
    document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Set up form for editing a subcategory
  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditMode('subcategory');
    setEditItemId(subcategory.id);
    setSelectedCategoryId(subcategory.category_id);
    setNewSubcategoryName(subcategory.name);
    setNewSubcategoryNameEn(subcategory.name_en);
    setNewSubcategorySlug(subcategory.slug);
    
    // Scroll to the subcategory form
    document.getElementById('subcategory-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle category delete
  const handleDeleteCategory = async (id: number) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      const success = await deleteCategory(id);
      
      if (success) {
        setFormSuccess(language === 'dv' ? 'ބައި ޑިލީޓްކުރެވިއްޖެ' : 'Category deleted successfully');
        setConfirmDelete(null);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle subcategory delete
  const handleDeleteSubcategory = async (id: number) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      const success = await deleteSubcategory(id);
      
      if (success) {
        setFormSuccess(language === 'dv' ? 'ކުޑިބައި ޑިލީޓްކުރެވިއްޖެ' : 'Subcategory deleted successfully');
        setConfirmDelete(null);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setEditMode('none');
    setEditItemId(null);
    setNewCategoryName('');
    setNewCategoryNameEn('');
    setNewCategorySlug('');
    setSelectedCategoryId(null);
    setNewSubcategoryName('');
    setNewSubcategoryNameEn('');
    setNewSubcategorySlug('');
  };

  // Cancel edit operation
  const handleCancelEdit = () => {
    resetForm();
  };

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with dashes
      .slice(0, 50);             // Truncate if too long
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm text-red-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'މަޢުލޫމާތު ލިބުމުގައި މައްސަލައެއް ދިމާވެއްޖެ' : 'Error loading categories'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success message */}
      {formSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm text-green-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {formSuccess}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {formError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm text-red-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {formError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Categories List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className={`text-xl font-semibold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ބައިތައް އަދި ކުޑިބައިތައް' : 'Categories and Subcategories'}
        </h2>
        
        <ul className="space-y-4">
          {categories.map((category) => {
            const categoryColors = getCategoryColor(category.id);
            return (
              <li key={category.id} className="p-3 border-b border-gray-200 rounded hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm mr-2 ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`}>
                        🏷️ {language === 'dv' ? category.name : category.name_en}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({category.slug})</span>
                    </div>
                    
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ul className="mt-2 space-y-2">
                        {category.subcategories.map((sub) => {
                          const subColors = getSubcategoryColor(category.id);
                          return (
                            <li key={sub.id} className="pl-4 border-l-2 border-gray-200">
                              <div className="flex justify-between items-center">
                                <div className={`text-sm ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs mr-2 ${subColors.bg} ${subColors.text} ${subColors.border} border`}>
                                    → {language === 'dv' ? sub.name : sub.name_en} ({language === 'dv' ? category.name : category.name_en})
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">({sub.slug})</span>
                                </div>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleEditSubcategory(sub)}
                                    aria-label={language === 'dv' ? 'ކުޑިބައި އެޑިޓް ކުރައްވާ' : 'Edit subcategory'}
                                    title={language === 'dv' ? 'ކުޑިބައި އެޑިޓް ކުރައްވާ' : 'Edit subcategory'}
                                    className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => setConfirmDelete({id: sub.id, type: 'subcategory'})}
                                    aria-label={language === 'dv' ? 'ކުޑިބައި ޑިލީޓް ކުރައްވާ' : 'Delete subcategory'}
                                    title={language === 'dv' ? 'ކުޑިބައި ޑިލީޓް ކުރައްވާ' : 'Delete subcategory'}
                                    className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      aria-label={language === 'dv' ? 'ބައި އެޑިޓް ކުރައްވާ' : 'Edit category'}
                      title={language === 'dv' ? 'ބައި އެޑިޓް ކުރައްވާ' : 'Edit category'}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({id: category.id, type: 'category'})}
                      aria-label={language === 'dv' ? 'ބައި ޑިލީޓް ކުރައްވާ' : 'Delete category'}
                      title={language === 'dv' ? 'ބައި ޑިލީޓް ކުރައްވާ' : 'Delete category'}
                      disabled={category.subcategories && category.subcategories.length > 0}
                      className={`${
                        category.subcategories && category.subcategories.length > 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* New Category Form */}
      <div id="category-form" className="bg-white rounded-lg shadow p-4">
        <h2 className={`text-xl font-semibold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {editMode === 'category'
            ? language === 'dv'
              ? 'ބައި އަޕްޑޭޓް ކުރައްވާ'
              : 'Update Category'
            : language === 'dv'
            ? 'އައު ބައެއް އިތުރުކުރައްވާ'
            : 'Add New Category'}
        </h2>
        
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބައިގެ ނަން (ދިވެހިން)' : 'Category Name (Dhivehi)'}
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                if (newCategorySlug === '' || editMode === 'none') {
                  setNewCategorySlug(generateSlug(e.target.value));
                }
              }}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
              required
              title={language === 'dv' ? 'ބައިގެ ނަން (ދިވެހިން)' : 'Category Name (Dhivehi)'}
              placeholder={language === 'dv' ? 'ބައިގެ ނަން ދިވެހިން ލިޔުއްވާ' : 'Enter category name in Dhivehi'}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބައިގެ ނަން (އިނގިރޭސިން)' : 'Category Name (English)'}
            </label>
            <input
              type="text"
              value={newCategoryNameEn}
              onChange={(e) => setNewCategoryNameEn(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              title={language === 'dv' ? 'ބައިގެ ނަން (އިނގިރޭސިން)' : 'Category Name (English)'}
              placeholder="Enter category name in English"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އަވެށިނަން' : 'Slug'}
            </label>
            <input
              type="text"
              value={newCategorySlug}
              onChange={(e) => setNewCategorySlug(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              title={language === 'dv' ? 'އަވެށިނަން' : 'Slug'}
              placeholder="category-slug"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            {editMode === 'category' && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {editMode === 'category'
                ? language === 'dv'
                  ? 'އަޕްޑޭޓް ކުރައްވާ'
                  : 'Update Category'
                : language === 'dv'
                ? 'ބައި އިތުރުކުރައްވާ'
                : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
      
      {/* New Subcategory Form */}
      <div id="subcategory-form" className="bg-white rounded-lg shadow p-4">
        <h2 className={`text-xl font-semibold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {editMode === 'subcategory'
            ? language === 'dv'
              ? 'ކުޑިބައި އަޕްޑޭޓް ކުރައްވާ'
              : 'Update Subcategory'
            : language === 'dv'
            ? 'އައު ކުޑިބައެއް އިތުރުކުރައްވާ'
            : 'Add New Subcategory'}
        </h2>
        
        <form onSubmit={handleSubcategorySubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބައި' : 'Parent Category'}
            </label>
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : null)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed text-right' : ''
              }`}
              required
              title={language === 'dv' ? 'ބައި ހޮއްވަވާ' : 'Select parent category'}
            >
              <option value="">{language === 'dv' ? 'ބައެއް ހޮއްވަވާ' : 'Select a category'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {language === 'dv' ? cat.name : cat.name_en}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ކުޑިބައިގެ ނަން (ދިވެހިން)' : 'Subcategory Name (Dhivehi)'}
            </label>
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => {
                setNewSubcategoryName(e.target.value);
                if (newSubcategorySlug === '' || editMode === 'none') {
                  setNewSubcategorySlug(generateSlug(e.target.value));
                }
              }}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
              required
              title={language === 'dv' ? 'ކުޑިބައިގެ ނަން (ދިވެހިން)' : 'Subcategory Name (Dhivehi)'}
              placeholder={language === 'dv' ? 'ކުޑިބައިގެ ނަން ދިވެހިން ލިޔުއްވާ' : 'Enter subcategory name in Dhivehi'}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ކުޑިބައިގެ ނަން (އިނގިރޭސިން)' : 'Subcategory Name (English)'}
            </label>
            <input
              type="text"
              value={newSubcategoryNameEn}
              onChange={(e) => setNewSubcategoryNameEn(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              title={language === 'dv' ? 'ކުޑިބައިގެ ނަން (އިނގިރޭސިން)' : 'Subcategory Name (English)'}
              placeholder="Enter subcategory name in English"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އަވެށިނަން' : 'Slug'}
            </label>
            <input
              type="text"
              value={newSubcategorySlug}
              onChange={(e) => setNewSubcategorySlug(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              title={language === 'dv' ? 'އަވެށިނަން' : 'Slug'}
              placeholder="subcategory-slug"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            {editMode === 'subcategory' && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {editMode === 'subcategory'
                ? language === 'dv'
                  ? 'އަޕްޑޭޓް ކުރައްވާ'
                  : 'Update Subcategory'
                : language === 'dv'
                ? 'ކުޑިބައި އިތުރުކުރައްވާ'
                : 'Add Subcategory'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-medium text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`} id="modal-title">
                      {language === 'dv' 
                        ? confirmDelete.type === 'category' 
                          ? 'ބައި ޑިލީޓްކުރައްވާނަންތޯ؟' 
                          : 'ކުޑިބައި ޑިލީޓްކުރައްވާނަންތޯ؟'
                        : confirmDelete.type === 'category'
                        ? 'Delete category?'
                        : 'Delete subcategory?'
                      }
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                        {language === 'dv'
                          ? confirmDelete.type === 'category'
                            ? 'މި ބައި ޑިލީޓްކުރެވުމުން، އަލުން އިޔާދަ ނުކުރެވޭނެއެވެ. ޔަގީންތޯ؟'
                            : 'މި ކުޑިބައި ޑިލީޓްކުރެވުމުން، އަލުން އިޔާދަ ނުކުރެވޭނެއެވެ. ޔަގީންތޯ؟'
                          : confirmDelete.type === 'category'
                          ? 'Are you sure you want to delete this category? This action cannot be undone.'
                          : 'Are you sure you want to delete this subcategory? This action cannot be undone.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => confirmDelete.type === 'category' ? handleDeleteCategory(confirmDelete.id) : handleDeleteSubcategory(confirmDelete.id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {language === 'dv' ? 'ޑިލީޓްކުރައްވާ' : 'Delete'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmDelete(null)}
                >
                  {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;


