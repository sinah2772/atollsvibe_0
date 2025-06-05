// filepath: e:\Atolls_mv\atolslvibe\New\atollsvibe_02-main\atollsvibe_02-main\src\components\steps\BasicInfoStep.tsx
import React from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import { CollaborativeInput } from '../CollaborativeInput';
import { ColoredMultiSelect } from '../ColoredMultiSelect';

// Define the structure for the collaborative interface
interface CollaborativeInterface {
  enabled: boolean;
  isFieldLocked: (fieldId: string) => boolean;
  lockField: (fieldId: string) => void;
  unlockField: (fieldId: string) => void;
  broadcastFieldUpdate: (fieldId: string, value: string) => void;
  getFieldLocker: (fieldId: string) => string | null;
  pendingUpdates: Record<string, string>;
}

// Define category option type for internal use
interface CategoryOption {
  value: string;
  label: string;
  color: string;
}

// Define local ColoredOption interface that matches what ColoredMultiSelect expects
interface ColoredOption {
  id: string | number;
  name: string;
  name_en: string;
  type: 'category' | 'subcategory';
  color: string;
}

interface BasicInfoStepProps {
  // Basic article fields
  title: string;
  setTitle: (value: string) => void;
  heading: string;
  setHeading: (value: string) => void;
  socialHeading: string;
  setSocialHeading: (value: string) => void;
  
  // Categories
  category: string[];
  setCategory: (value: string[]) => void;
  subcategory: string[];
  setSubcategory: (value: string[]) => void;
    // Editor and image
  editor: Editor;
  coverImage: string;
  setCoverImage: (value: string) => void;
  imageCaption: string;
  setImageCaption: (value: string) => void;
  showImageBrowser: boolean;
  setShowImageBrowser: (value: boolean) => void;
  
  // Data sources
  categories: {
    id: number;
    name: string;
    name_en?: string;
  }[];
  subcategories: {
    id: number;
    name: string;
    name_en?: string;
    category_id: number;
  }[];
  
  // Collaborative editing
  collaborative: CollaborativeInterface;
  currentUser: string;
  language: 'en' | 'dv';
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  title,
  setTitle,
  heading,
  setHeading,
  socialHeading,
  setSocialHeading,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  editor,
  coverImage,
  setCoverImage,
  imageCaption,
  setImageCaption,
  showImageBrowser,
  setShowImageBrowser,
  categories,
  subcategories,
  collaborative,
  currentUser,
  language
}) => {
  const categoryOptions: CategoryOption[] = categories.map(cat => ({
    value: cat.id.toString(),
    label: language === 'dv' ? cat.name : cat.name_en || cat.name,
    color: `hsl(${cat.id * 137.508}, 70%, 50%)`
  }));

  const subcategoryOptions: CategoryOption[] = subcategories
    .filter(sub => category.includes(sub.category_id.toString()))
    .map(sub => ({
      value: sub.id.toString(),
      label: language === 'dv' ? sub.name : sub.name_en || sub.name,
      color: `hsl(${sub.id * 137.508}, 50%, 60%)`
    }));

  // Convert to ColoredOption format
  const convertToColoredOptions = (options: CategoryOption[], type: 'category' | 'subcategory'): ColoredOption[] => {
    return options.map(opt => ({
      id: opt.value,
      name: opt.label,
      name_en: opt.label,
      type,
      color: opt.color
    }));
  };

  // Handler for category change
  const handleCategoryChange = (values: (string | number)[]): void => {
    setCategory(values.map(v => v.toString()));
  };

  // Handler for subcategory change
  const handleSubcategoryChange = (values: (string | number)[]): void => {
    setSubcategory(values.map(v => v.toString()));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? '???' : 'Title'} *
        </label>
        <CollaborativeInput
          fieldId="title"
          value={title}
          onChange={setTitle}
          collaborative={collaborative}
          currentUser={currentUser}
          placeholder={language === 'dv' ? '????? ??? ???' : 'Enter article title'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Heading */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? '???' : 'Heading'} *
        </label>
        <CollaborativeInput
          fieldId="heading"
          value={heading}
          onChange={setHeading}
          collaborative={collaborative}
          currentUser={currentUser}
          placeholder={language === 'dv' ? '????? ??? ???' : 'Enter article heading'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Social Heading */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? '??? ??? ???' : 'Social Media Heading'}
        </label>
        <CollaborativeInput
          fieldId="socialHeading"
          value={socialHeading}
          onChange={setSocialHeading}
          collaborative={collaborative}
          currentUser={currentUser}
          placeholder={language === 'dv' ? '??? ????? ???? ???' : 'Heading for social media sharing'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? '??' : 'Category'} *
          </label>
          <ColoredMultiSelect
            options={convertToColoredOptions(categoryOptions, 'category')}
            value={category}
            onChange={handleCategoryChange}
            placeholder={language === 'dv' ? '?? ????' : 'Select categories'}
            language={language}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? '????' : 'Subcategory'}
          </label>
          <ColoredMultiSelect
            options={convertToColoredOptions(subcategoryOptions, 'subcategory')}
            value={subcategory}
            onChange={handleSubcategoryChange}
            placeholder={language === 'dv' ? '???? ????' : 'Select subcategories'}
            language={language}
          />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? '??? ???' : 'Cover Image'}
        </label>
        <div className="flex items-center space-x-3">
          <CollaborativeInput
            fieldId="coverImage"
            value={coverImage}
            onChange={setCoverImage}
            collaborative={collaborative}
            currentUser={currentUser}
            placeholder={language === 'dv' ? '??? URL ???' : 'Enter image URL'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowImageBrowser(!showImageBrowser)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label={language === 'dv' ? '??? ???? ????' : 'Browse for images'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        {coverImage && (
          <div className="mt-3">
            <img 
              src={coverImage} 
              alt="Cover preview" 
              className="max-w-xs rounded-md shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Image Caption */}
      {coverImage && (
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? '??? ????' : 'Image Caption'}
          </label>
          <CollaborativeInput
            fieldId="imageCaption"
            value={imageCaption}
            onChange={setImageCaption}
            collaborative={collaborative}
            currentUser={currentUser}
            placeholder={language === 'dv' ? '??? ???? ???' : 'Enter image caption'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir={language === 'dv' ? 'rtl' : 'ltr'}
          />
        </div>
      )}

      {/* Content Editor */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? '???' : 'Content'} *
        </label>
        <div className="border border-gray-300 rounded-md">
          <EditorContent 
            editor={editor} 
            className="prose prose-lg max-w-none min-h-[300px] p-4 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
