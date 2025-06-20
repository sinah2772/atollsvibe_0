// TranslationStep.js
import React from 'react';

const TranslationStep = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData('translation', { [field]: value });
  };

  // Languages that might be translated from
  const languages = [
    'English', 'Dhivehi', 'Arabic', 'Hindi', 'Urdu', 'Bengali', 
    'Sinhala', 'Tamil', 'French', 'German', 'Chinese', 'Japanese', 'Other'
  ];
  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <label className="form-label">
          Original Source URL
        </label>
        <input
          type="url"
          className="glass-input"
          value={formData.translation?.originalSourceUrl || ''}
          onChange={(e) => handleChange('originalSourceUrl', e.target.value)}
          placeholder="https://example.com/original-article"
        />
        <div className="glass-card p-2 mt-2">
          <p className="help-text">The URL of the original article (if this is a republication)</p>
        </div>
      </div>

      <div className="glass-card p-4">
        <label className="form-label">
          Translation Source URL
        </label>
        <input
          type="url"
          className="glass-input"
          value={formData.translation?.translationSourceUrl || ''}
          onChange={(e) => handleChange('translationSourceUrl', e.target.value)}
          placeholder="https://example.com/source-to-translate"
        />
        <div className="glass-card p-2 mt-2">
          <p className="help-text">The URL of the article being translated (if this is a translation)</p>
        </div>
      </div>

      <div className="glass-card p-4">
        <label className="form-label">
          Translation Source Language
        </label>
        <select
          className="glass-input"
          value={formData.translation?.translationSourceLanguage || ''}
          onChange={(e) => handleChange('translationSourceLanguage', e.target.value)}
        >
          <option value="">Select language</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-card p-4">
        <label className="form-label">
          Translation Notes
        </label>
        <textarea
          className="glass-input"
          value={formData.translation?.translationNotes || ''}
          onChange={(e) => handleChange('translationNotes', e.target.value)}
          placeholder="Notes about the translation process, challenges, or adaptations made"
          rows="4"
        ></textarea>
      </div>
    </div>
  );
};

export default TranslationStep;
