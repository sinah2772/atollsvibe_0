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
      <div className="glass-card p-4">
        <label className="form-label">
          Main Content *
        </label>
        <div className="glass-card p-4">
          {isToolbarVisible && (
            <div className="glass-card p-2 mb-2">
              <button type="button" className="glass-button mr-2">B</button>
              <button type="button" className="glass-button mr-2">I</button>
              <button type="button" className="glass-button mr-2">U</button>
              <button type="button" className="glass-button mr-2">H1</button>
              <button type="button" className="glass-button mr-2">H2</button>
              <button type="button" className="glass-button mr-2">Quote</button>
              <button type="button" className="glass-button mr-2">Link</button>
              <button type="button" className="glass-button mr-2">Image</button>
              <button type="button" className="glass-button">List</button>
            </div>
          )}
          <textarea
            className={`glass-input ${errors.mainContent ? 'error' : ''}`}
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

      <div className="glass-card p-4">
        <p className="text-sm text-gray-600 mb-4">When you're ready, choose one of the following options:</p>
        <div className="flex flex-wrap gap-4">
          <button 
            type="button" 
            className="glass-button"
            onClick={() => handleChange('submissionStatus', 'draft')}
          >
            Save as Draft
          </button>
          <button 
            type="button" 
            className="glass-button"
            onClick={() => handleChange('submissionStatus', 'review')}
          >
            Send to Review
          </button>
          <button 
            type="button" 
            className="glass-button"
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
