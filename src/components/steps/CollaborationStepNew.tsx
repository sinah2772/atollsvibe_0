import React from 'react';
import { StepProps } from '../../types/editor';

const CollaborationStepNew: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Allow Comments */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={(formData.allowComments as boolean) || false}
            onChange={(e) => handleChange('allowComments', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ކޮމެންޓް ހުއްދަ ކުރުން' : 'Allow Comments'}
          </span>
        </label>
      </div>

      {/* Enable Collaboration */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={(formData.enableCollaboration as boolean) || false}
            onChange={(e) => handleChange('enableCollaboration', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ކޮލެބޮރޭޝަން ހުއްދަ ކުރުން' : 'Enable Collaboration'}
          </span>
        </label>
      </div>

      {/* Notify Subscribers */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={(formData.notifySubscribers as boolean) || false}
            onChange={(e) => handleChange('notifySubscribers', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ސަބްސްކްރައިބަރުންނަށް އަންގައިދިނުން' : 'Notify Subscribers'}
          </span>
        </label>
      </div>
    </div>  );
};

export { CollaborationStepNew };
export default CollaborationStepNew;
