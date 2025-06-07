import React from 'react';
import { StepProps } from '../../types/editor';

// Create a simpler version that doesn't use the CollaborativeInput component
const TranslationStep: React.FC<StepProps> = ({
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
          {language === 'dv' ? 'އަސްލު އަރޓިކަލްގެ ލިންކް' : 'Original Source URL'}
        </label>
        <input
          type="url"
          value={(formData.originalSourceUrl as string) || ''}
          onChange={(e) => handleChange('originalSourceUrl', e.target.value)}
          placeholder="https://example.com/original-article"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މި ލިޔުމަކީ އެހެން ތަނަކުން ފެށިގެން އައިސްފައިވާ އެއްޗެއްނަމަ އަސްލު ލިންކް' : 'If this is originally from another source, provide the link'}
        </p>
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ތަރުޖަމާ ސޯސް އަރޓިކަލްގެ ލިންކް' : 'Translation Source URL'}
        </label>
        <input
          type="url"
          value={(formData.translationSourceUrl as string) || ''}
          onChange={(e) => handleChange('translationSourceUrl', e.target.value)}
          placeholder="https://example.com/source-for-translation"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މި ލިޔުމަކީ ތަރުޖަމާކުރެވިފައިވާ ލިޔުމެއްނަމަ ތަރުޖަމާ ކުރެވުނު އަސްލު ލިންކް' : 'If this is a translation, provide the source link used for translation'}
        </p>
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ތަރުޖަމާ ބަސް' : 'Translation Source Language'}
        </label>
        <input
          type="text"
          value={(formData.translationSourceLanguage as string) || ''}
          onChange={(e) => handleChange('translationSourceLanguage', e.target.value)}
          placeholder={language === 'dv' ? 'މިސާލަކަށް: އިނގިރޭސި، އަރަބި' : 'E.g.: English, Arabic'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ތަރުޖަމާ ނޯޓްސް' : 'Translation Notes'}
        </label>
        <textarea
          value={(formData.translationNotes as string) || ''}
          onChange={(e) => handleChange('translationNotes', e.target.value)}
          placeholder={language === 'dv' ? 'ތަރުޖަމާކުރުމުގައި ފާހަގަކުރަން ބޭނުންވާ ކަންތައްތައް' : 'Any notes about the translation process'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          rows={4}
        />
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ތަރުޖަމާ ކުރުމުގައި ދިމާވި އުނދަގޫތައް ނުވަތަ ތަރުޖަމާ ކުރެވިފައިވާ ގޮތުގެ ނޯޓް' : 'Notes about translation challenges, context, or special considerations'}
        </p>
      </div>
    </div>
  );
};

export default TranslationStep;
