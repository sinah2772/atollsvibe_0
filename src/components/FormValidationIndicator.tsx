import React from 'react';

import { ValidationField } from '../types/editor';

interface FormValidationIndicatorProps {
  fields: ValidationField[];
  language: 'en' | 'dv';
}

const FormValidationIndicator: React.FC<FormValidationIndicatorProps> = ({
  fields,
  language
}) => {
  const invalidFields = fields.filter(field => !field.valid);
  const allValid = invalidFields.length === 0;
  
  if (allValid) {
    return (
      <div className="flex items-center text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className={`text-sm ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ފޯމު ފުރިހަމަވެއްޖެ' : 'Form is valid'}
        </span>
      </div>
    );
  }
  
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center text-yellow-700 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className={`text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ފޯމު ފުރިހަމަކުރައްވާ' : 'Please complete the form'}
        </span>
      </div>
      
      <ul className={`text-sm text-yellow-700 list-disc pl-5 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
        {invalidFields.map((field, index) => (
          <li key={index}>
            {language === 'dv' 
              ? field.errorMessage || `${field.name} ފުރިހަމަކުރައްވާ`
              : field.errorMessage || `${field.name} is required`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormValidationIndicator;
