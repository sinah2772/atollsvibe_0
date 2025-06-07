import React, { useState } from 'react';
import { StepProps } from '../../types/editor';
import { Upload, X } from 'lucide-react';
import ImageBrowser from '../ImageBrowser';

const MediaVisualsStep: React.FC<StepProps> = ({ 
  formData, 
  onFormDataChange, 
  language
}) => {
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  const handleImageSelect = (imageUrl: string) => {
    handleChange('coverImage', imageUrl);
    setShowImageBrowser(false);
  };

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ކަވަރ ފޮޓޯ' : 'Cover Image'} *
        </label>
        
        {formData.coverImage ? (
          <div className="mb-6 relative group aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500">
            <img
              src={formData.coverImage as string}
              alt={formData.imageCaption as string || ''}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleChange('coverImage', '')}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={language === 'dv' ? 'ފޮޓޯ ނައްތާލާ' : 'Remove image'}
              title={language === 'dv' ? 'ފޮޓޯ ނައްތާލާ' : 'Remove image'}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowImageBrowser(true)}
            className="w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500 transition-colors"
          >
            <Upload size={36} />
            <span className={`mt-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ފޮޓޯ އިތުރުކުރައްވާ' : 'Add cover image'}
            </span>
          </button>
        )}
      </div>      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ފޮޓޯގެ ކެޕްޝަން' : 'Image Caption'}
        </label>
        <input
          type="text"
          value={(formData.imageCaption as string) || ''}
          onChange={(e) => handleChange('imageCaption', e.target.value)}
          placeholder={language === 'dv' ? 'ފޮޓޯގެ ސިފަ ލިޔޭ' : 'Describe the image'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ImageBrowser
        isOpen={showImageBrowser}
        onClose={() => setShowImageBrowser(false)}
        onSelect={handleImageSelect}
        language={language}
      />
    </div>
  );
};

export default MediaVisualsStep;
