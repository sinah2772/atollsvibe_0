import React from 'react';
import { StepProps } from '../../types/editor';

const ArticleIdentityStep: React.FC<StepProps> = ({ 
  formData, 
  onFormDataChange, 
  language
}) => {
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };
  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސުރުޚީ (އިނގިރޭސި)' : 'Title (Latin)'} *
        </label>
        <input
          type="text"
          value={(formData.title as string) || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={language === 'dv' ? 'ލިޔުމުގެ ސުރުޚީ (އިނގިރޭސިން) ލިޔޭ' : 'Enter article title in Latin'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސުރުޚީ (ދިވެހި)' : 'Heading (Thaana)'} *
        </label>
        <input
          type="text"
          value={(formData.heading as string) || ''}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder={language === 'dv' ? 'ލިޔުމުގެ ސުރުޚީ (ދިވެހިން) ލިޔޭ' : 'Enter heading in Thaana'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ' : 'Social Heading'}
        </label>
        <input
          type="text"
          value={(formData.socialHeading as string) || ''}
          onChange={(e) => handleChange('socialHeading', e.target.value)}
          placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާގައި ބޭނުންކުރާ ސުރުޚީ ލިޔޭ' : 'Enter social media heading'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯޝަލް މީޑިއާގައި ޝެއަރކުރުމަށް ބޭނުންކުރާ ސުރުޚީ' : 'Optional heading optimized for social media sharing'}
        </p>
      </div>
    </div>
  );
};

export default ArticleIdentityStep;
