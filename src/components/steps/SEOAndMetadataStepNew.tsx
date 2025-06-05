import React from 'react';
import { StepProps } from '../../types/editor';

const SEOAndMetadataStepNew: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މެޓާ ސުރުޚީ' : 'Meta Title'}
        </label>
        <input
          type="text"
          value={(formData.metaTitle as string) || ''}
          onChange={(e) => handleChange('metaTitle', e.target.value)}
          placeholder={language === 'dv' ? 'މެޓާ ސުރުޚީ ލިޔެފާ' : 'Enter meta title'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Meta Description */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މެޓާ ތަފްސީލު' : 'Meta Description'}
        </label>
        <textarea
          value={(formData.metaDescription as string) || ''}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          placeholder={language === 'dv' ? 'މެޓާ ތަފްސީލު ލިޔެފާ' : 'Enter meta description'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Keywords */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ކީވޯޑްތައް' : 'Keywords'}
        </label>
        <input
          type="text"
          value={((formData.keywords as string[]) || []).join(', ')}
          onChange={(e) => handleChange('keywords', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ކީވޯޑްތައް އެއްލަވާ' : 'Enter keywords (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Slug */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސްލަގް' : 'URL Slug'}
        </label>
        <input
          type="text"
          value={(formData.slug as string) || ''}
          onChange={(e) => handleChange('slug', e.target.value)}
          placeholder={language === 'dv' ? 'ސްލަގް ލިޔެފާ' : 'Enter URL slug'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Social Image */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯޝަލް ފޮޓޯ' : 'Social Image'}
        </label>
        <input
          type="url"
          value={(formData.socialImage as string) || ''}
          onChange={(e) => handleChange('socialImage', e.target.value)}
          placeholder={language === 'dv' ? 'ސޯޝަލް ފޮޓޯގެ ލިންކް' : 'Social image URL'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>    </div>
  );
};

export { SEOAndMetadataStepNew };
export default SEOAndMetadataStepNew;
