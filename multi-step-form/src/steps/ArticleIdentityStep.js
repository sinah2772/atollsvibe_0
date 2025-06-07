// ArticleIdentityStep.js
import React from 'react';

const ArticleIdentityStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('articleIdentity', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className="form-label">
          Title (Latin) *
        </label>        <input
          type="text"
          className={`glass-input ${errors.title ? 'error' : ''}`}
          value={formData.articleIdentity?.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter article title in Latin"
        />
        {errors.title && (
          <p className="error-message">{errors.title}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Heading (Thaana) *
        </label>        <input
          type="text"
          className={`glass-input ${errors.headingThaana ? 'error' : ''}`}
          value={formData.articleIdentity?.headingThaana || ''}
          onChange={(e) => handleChange('headingThaana', e.target.value)}
          placeholder="Enter heading in Thaana"
          dir="rtl"
        />
        {errors.headingThaana && (
          <p className="error-message">{errors.headingThaana}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Social Heading
        </label>        <input
          type="text"
          className="glass-input"
          value={formData.articleIdentity?.socialHeading || ''}
          onChange={(e) => handleChange('socialHeading', e.target.value)}
          placeholder="Enter social media heading"
        />
        <p className="help-text">Optional heading optimized for social media sharing</p>
      </div>
    </div>
  );
};

export default ArticleIdentityStep;
