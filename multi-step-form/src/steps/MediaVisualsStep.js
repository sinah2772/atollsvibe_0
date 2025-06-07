// MediaVisualsStep.js
import React from 'react';

const MediaVisualsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('mediaVisuals', { [field]: value });
  };

  // Mock file upload handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you'd upload this file to a server
      // For now, we'll just store the file name
      handleChange('coverImage', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className="form-label">
          Cover Image Upload *
        </label>
        <div className="file-upload-container">
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            className={`file-input ${errors.coverImage ? 'error' : ''}`}
            onChange={handleFileChange}
          />
          <label htmlFor="coverImage" className="file-upload-label">
            {formData.mediaVisuals?.coverImage?.name 
              ? `Selected: ${formData.mediaVisuals.coverImage.name}`
              : 'Click to select image or drag and drop'}
          </label>
        </div>
        {errors.coverImage && (
          <p className="error-message">{errors.coverImage}</p>
        )}
        {formData.mediaVisuals?.coverImage?.name && (
          <div className="image-preview-container">
            <p>Image selected: {formData.mediaVisuals.coverImage.name}</p>
            <button 
              type="button" 
              className="btn-text"
              onClick={() => handleChange('coverImage', null)}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Image Caption
        </label>
        <textarea
          className="form-textarea"
          value={formData.mediaVisuals?.imageCaption || ''}
          onChange={(e) => handleChange('imageCaption', e.target.value)}
          placeholder="Enter caption for the cover image"
          rows="3"
        ></textarea>
      </div>
    </div>
  );
};

export default MediaVisualsStep;
