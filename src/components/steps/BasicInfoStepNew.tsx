import React from 'react';
import { StepProps } from '../../types/editor';

const BasicInfoStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސުރުޚީ' : 'Title'} *
        </label>
        <input
          type="text"
          value={(formData.title as string) || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={language === 'dv' ? 'މަޝްހޫރުގެ ސުރުޚީ ލިޔެފާ' : 'Enter article title'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Heading */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސުރުޚީ' : 'Heading'} *
        </label>
        <input
          type="text"
          value={(formData.heading as string) || ''}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder={language === 'dv' ? 'ސުރުޚީ ލިޔެފާ' : 'Enter heading'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Content */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ލިޔުން' : 'Content'} *
        </label>
        <textarea
          value={(formData.content as string) || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder={language === 'dv' ? 'ލިޔުން ލިޔެފާ' : 'Enter content'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={10}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Categories */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ބައި' : 'Categories'} *
        </label>
        <input
          type="text"
          value={((formData.category as string[]) || []).join(', ')}
          onChange={(e) => handleChange('category', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ބައި އެއްލަވާ' : 'Enter categories (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ކަވަރ ފޮޓޯ' : 'Cover Image'}
        </label>
        <input
          type="url"
          value={(formData.coverImage as string) || ''}
          onChange={(e) => handleChange('coverImage', e.target.value)}
          placeholder={language === 'dv' ? 'ފޮޓޯގެ ލިންކް' : 'Image URL'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>    </div>
  );
};

export { BasicInfoStep as BasicInfoStepNew };
export default BasicInfoStep;
