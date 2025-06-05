import React from 'react';
import { StepProps } from '../../types/editor';

const AdditionalInfoStepNew: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Tags */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޓެގްތައް' : 'Tags'}
        </label>
        <input
          type="text"
          value={((formData.tags as string[]) || []).join(', ')}
          onChange={(e) => handleChange('tags', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ޓެގްތައް އެއްލަވާ' : 'Enter tags (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Author */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ލިޔުންތެރި' : 'Author'}
        </label>
        <input
          type="text"
          value={(formData.author as string) || ''}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder={language === 'dv' ? 'ލިޔުންތެރިގެ ނަން' : 'Author name'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Co-Authors */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އިތުރު ލިޔުންތެރިން' : 'Co-Authors'}
        </label>
        <input
          type="text"
          value={((formData.coAuthors as string[]) || []).join(', ')}
          onChange={(e) => handleChange('coAuthors', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'އިތުރު ލިޔުންތެރިން' : 'Co-authors (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Sources */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯސްތައް' : 'Sources'}
        </label>
        <textarea
          value={((formData.sources as string[]) || []).join('\n')}
          onChange={(e) => handleChange('sources', e.target.value.split('\n').filter(Boolean))}
          placeholder={language === 'dv' ? 'ސޯސްތައް ލިޔެފާ' : 'Enter sources (one per line)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>    </div>
  );
};

export { AdditionalInfoStepNew };
export default AdditionalInfoStepNew;
