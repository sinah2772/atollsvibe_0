// ContentSubmissionStep.js
import React from 'react';

const ContentSubmissionStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('content', { [field]: value });
  };

  // Simple mock for rich text editor
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className="form-label">
          Main Content *
        </label>
        <div className="rich-text-editor-container">
          {isToolbarVisible && (
            <div className="rich-text-toolbar">
              <button type="button" className="toolbar-btn">B</button>
              <button type="button" className="toolbar-btn">I</button>
              <button type="button" className="toolbar-btn">U</button>
              <button type="button" className="toolbar-btn">H1</button>
              <button type="button" className="toolbar-btn">H2</button>
              <button type="button" className="toolbar-btn">Quote</button>
              <button type="button" className="toolbar-btn">Link</button>
              <button type="button" className="toolbar-btn">Image</button>
              <button type="button" className="toolbar-btn">List</button>
            </div>
          )}
          <textarea
            className={`rich-text-area ${errors.mainContent ? 'error' : ''}`}
            value={formData.content?.mainContent || ''}
            onChange={(e) => handleChange('mainContent', e.target.value)}
            onFocus={() => setIsToolbarVisible(true)}
            onBlur={() => setTimeout(() => setIsToolbarVisible(false), 200)}
            placeholder="Write the main content of your article here"
            rows="12"
          ></textarea>
          {errors.mainContent && (
            <p className="error-message">{errors.mainContent}</p>
          )}
        </div>
        {formData.content?.mainContent && (
          <div className="word-count">
            {formData.content.mainContent.split(/\s+/).filter(Boolean).length} words
          </div>
        )}
      </div>

      <div className="submission-options">
        <p className="text-sm text-gray-600 mb-4">When you're ready, choose one of the following options:</p>
        <div className="flex flex-wrap gap-4">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => handleChange('submissionStatus', 'draft')}
          >
            Save as Draft
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => handleChange('submissionStatus', 'review')}
          >
            Send to Review
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => handleChange('submissionStatus', 'publish')}
          >
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentSubmissionStep;
