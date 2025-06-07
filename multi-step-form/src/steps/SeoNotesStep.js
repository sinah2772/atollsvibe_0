// SeoNotesStep.js
import React from 'react';

const SeoNotesStep = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData('seoNotes', { [field]: value });
  };

  // Auto-generate SEO fields based on article identity
  React.useEffect(() => {
    if (formData.articleIdentity?.title && !formData.seoNotes?.seoTitle) {
      handleChange('seoTitle', formData.articleIdentity.title);
    }
    
    // Generate a simple meta description from the title
    if (formData.articleIdentity?.title && !formData.seoNotes?.seoDescription) {
      handleChange('seoDescription', `Read about ${formData.articleIdentity.title} on Atolls Vibe - The latest news and updates from the Maldives.`);
    }
    
    // Generate simple keywords
    if (formData.metadata?.tags?.length > 0 && !formData.seoNotes?.seoKeywords) {
      handleChange('seoKeywords', formData.metadata.tags.join(', '));
    }
  }, [formData.articleIdentity, formData.metadata?.tags]);

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className="form-label">
          SEO Title
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.seoNotes?.seoTitle || ''}
          onChange={(e) => handleChange('seoTitle', e.target.value)}
          placeholder="SEO optimized title (auto-generated, can edit)"
        />
        <p className="help-text">Recommended length: 50-60 characters</p>
        {formData.seoNotes?.seoTitle && (
          <div className="character-count">
            {formData.seoNotes.seoTitle.length} characters
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          SEO Description
        </label>
        <textarea
          className="form-textarea"
          value={formData.seoNotes?.seoDescription || ''}
          onChange={(e) => handleChange('seoDescription', e.target.value)}
          placeholder="Meta description for search engines (auto-generated, can edit)"
          rows="3"
        ></textarea>
        <p className="help-text">Recommended length: 120-155 characters</p>
        {formData.seoNotes?.seoDescription && (
          <div className="character-count">
            {formData.seoNotes.seoDescription.length} characters
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          SEO Keywords
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.seoNotes?.seoKeywords || ''}
          onChange={(e) => handleChange('seoKeywords', e.target.value)}
          placeholder="Comma-separated keywords (auto-generated from tags, can edit)"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Author Notes
        </label>
        <textarea
          className="form-textarea"
          value={formData.seoNotes?.authorNotes || ''}
          onChange={(e) => handleChange('authorNotes', e.target.value)}
          placeholder="Add any notes for editors (not published)"
          rows="3"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">
          Editor Notes
        </label>
        <textarea
          className="form-textarea"
          value={formData.seoNotes?.editorNotes || ''}
          onChange={(e) => handleChange('editorNotes', e.target.value)}
          placeholder="Editor's notes about this article (not published)"
          rows="3"
        ></textarea>
      </div>
    </div>
  );
};

export default SeoNotesStep;
