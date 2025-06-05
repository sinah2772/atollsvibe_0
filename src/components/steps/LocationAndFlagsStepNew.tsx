import React from 'react';
import { StepProps } from '../../types/editor';

const LocationAndFlagsStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ތަން' : 'Location'}
        </label>
        <input
          type="text"
          value={(formData.location as string) || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder={language === 'dv' ? 'ތަން ލިޔެފާ' : 'Enter location'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Atoll */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އަތޮޅު' : 'Atoll'}
        </label>
        <input
          type="text"
          value={(formData.atoll as string) || ''}
          onChange={(e) => handleChange('atoll', e.target.value)}
          placeholder={language === 'dv' ? 'އަތޮޅު ފޯކާ' : 'Select atoll'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Island */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ރަށް' : 'Island'}
        </label>
        <input
          type="text"
          value={(formData.island as string) || ''}
          onChange={(e) => handleChange('island', e.target.value)}
          placeholder={language === 'dv' ? 'ރަށް ފޯކާ' : 'Select island'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Priority */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އިސްކަން' : 'Priority'}
        </label>        <select
          value={(formData.priority as string) || 'medium'}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={language === 'dv' ? 'އިސްކަން ޚިޔާރުކޮށް' : 'Select priority level'}
        >
          <option value="low">{language === 'dv' ? 'އުނި' : 'Low'}</option>
          <option value="medium">{language === 'dv' ? 'މެދުނީ' : 'Medium'}</option>
          <option value="high">{language === 'dv' ? 'ބާރު' : 'High'}</option>
          <option value="urgent">{language === 'dv' ? 'އަވަހަށް' : 'Urgent'}</option>
        </select>
      </div>

      {/* Flags */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ފްލެގްތައް' : 'Flags'}
        </label>
        <input
          type="text"
          value={((formData.flags as string[]) || []).join(', ')}
          onChange={(e) => handleChange('flags', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ފްލެގްތައް އެއްލަވާ' : 'Enter flags (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>
    </div>  );
};

export { LocationAndFlagsStep as LocationAndFlagsStepNew };
export default LocationAndFlagsStep;
