import React, { useState } from 'react';
import { useCategories, Category, Subcategory } from '../hooks/useCategories';

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

  // Generate slug from name (simple version)
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-8 p-4">
      <h1 className={`text-2xl font-bold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
        {language === 'dv' ? 'ބައިތަކާއި ކުދިބައިތައް މެނޭޖްކުރުން' : 'Manage Categories & Subcategories'}
      </h1>
      
      {/* Success/Error messages */}
      {formSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className={language === 'dv' ? 'thaana-waheed' : ''}>{formSuccess}</p>
        </div>
      )}
      {formError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className={language === 'dv' ? 'thaana-waheed' : ''}>{formError}</p>
        </div>
      )}
      
      {/* Categories list */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className={`text-xl font-semibold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މިހާރު ހުރި ބައިތައް' : 'Existing Categories'}
        </h2>
        
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="p-3 border-b border-gray-200 rounded hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className={`font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? category.name : category.name_en} 
                    <span className="text-sm text-gray-500 ml-2">({category.slug})</span>
                  </div>
                  
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id} className="pl-4 border-l-2 border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className={`text-sm ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                              {language === 'dv' ? sub.name : sub.name_en}
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
                      ))}
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
          ))}
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
              placeholder={language === 'dv' ? 'އަވެށި ނަން (މިސާލު: example-slug)' : 'Enter slug (e.g. example-slug)'}
            />
          </div>
          
          <div className="flex space-x-3 justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              } ${language === 'dv' ? 'thaana-waheed' : ''}`}
            >
              {isSubmitting
                ? language === 'dv'
                  ? 'ކުރިއަށްދަނީ...'
                  : 'Processing...'
                : editMode === 'category'
                ? language === 'dv'
                  ? 'އަޕްޑޭޓް ކުރައްވާ'
                  : 'Update'
                : language === 'dv'
                ? 'އިތުރުކުރައްވާ'
                : 'Add Category'}
            </button>
            
            {editMode === 'category' && (
              <button
                type="button"
                onClick={resetForm}
                className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                  language === 'dv' ? 'thaana-waheed' : ''
                }`}
              >
                {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
              </button>
            )}
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
            <label className={`block text-sm font-medium mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބައި' : 'Parent Category'}
            </label>
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
              required
              title={language === 'dv' ? 'ބައި އިޚްތިޔާރު ކުރައްވާ' : 'Select Parent Category'}
            >
              <option value="">{language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Select a category'}</option>
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
              placeholder={language === 'dv' ? 'އަވެށި ނަން (މިސާލު: example-slug)' : 'Enter slug (e.g. example-slug)'}
            />
          </div>
          
          <div className="flex space-x-3 justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              } ${language === 'dv' ? 'thaana-waheed' : ''}`}
            >
              {isSubmitting
                ? language === 'dv'
                  ? 'ކުރިއަށްދަނީ...'
                  : 'Adding...'
                : language === 'dv'
                ? 'އިތުރުކުރައްވާ'
                : 'Add Subcategory'}
            </button>
            
            {editMode === 'subcategory' && (
              <button
                type="button"
                onClick={resetForm}
                className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                  language === 'dv' ? 'thaana-waheed' : ''
                }`}
              >
                {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Confirmation Dialog for Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className={`text-lg font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {confirmDelete.type === 'category' 
                ? (language === 'dv' ? 'ބައި ޑިލީޓް ކުރަން ޔަގީންތޯ؟' : 'Delete Category?')
                : (language === 'dv' ? 'ކުޑިބައި ޑިލީޓް ކުރަން ޔަގީންތޯ؟' : 'Delete Subcategory?')}
            </h3>
            <p className={`mt-2 text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {confirmDelete.type === 'category'
                ? (language === 'dv' ? 'މި ބައި ޑިލީޓްކުރުމުން ނައްތާލެވޭނެއެވެ. މި ޢަމަލު ކުރިއަށް ގެންދަން ބޭނުންތޯ؟' : 'This category will be permanently deleted. Are you sure you want to proceed?')
                : (language === 'dv' ? 'މި ކުޑިބައި ޑިލީޓްކުރުމުން ނައްތާލެވޭނެއެވެ. މި ޢަމަލު ކުރިއަށް ގެންދަން ބޭނުންތޯ؟' : 'This subcategory will be permanently deleted. Are you sure you want to proceed?')}
            </p>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ${language === 'dv' ? 'thaana-waheed' : ''}`}
              >
                {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
              </button>
              <button
                onClick={() => confirmDelete.type === 'category' 
                  ? handleDeleteCategory(confirmDelete.id) 
                  : handleDeleteSubcategory(confirmDelete.id)}
                disabled={isSubmitting}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${language === 'dv' ? 'thaana-waheed' : ''}`}
              >
                {isSubmitting
                  ? language === 'dv'
                    ? 'ޑިލީޓްކުރަނީ...'
                    : 'Deleting...'
                  : language === 'dv'
                  ? 'ޑިލީޓްކުރަން ޔަގީން'
                  : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
