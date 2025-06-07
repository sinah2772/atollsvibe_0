// ArticleOptionsStep.js
import React from 'react';

const ArticleOptionsStep = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData('articleOptions', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="checkbox-group feature-options">
        <div className="feature-option">
          <input
            type="checkbox"
            id="breaking-news"
            checked={formData.articleOptions?.breakingNews || false}
            onChange={(e) => handleChange('breakingNews', e.target.checked)}
          />
          <label htmlFor="breaking-news">
            <span className="option-title">Breaking News</span>
            <span className="option-description">Mark as breaking news (displays with special indicator)</span>
          </label>
        </div>
        
        <div className="feature-option">
          <input
            type="checkbox"
            id="featured"
            checked={formData.articleOptions?.featured || false}
            onChange={(e) => handleChange('featured', e.target.checked)}
          />
          <label htmlFor="featured">
            <span className="option-title">Featured</span>
            <span className="option-description">Feature this article in the prominent sections</span>
          </label>
        </div>
        
        <div className="feature-option">
          <input
            type="checkbox"
            id="developing-story"
            checked={formData.articleOptions?.developingStory || false}
            onChange={(e) => handleChange('developingStory', e.target.checked)}
          />
          <label htmlFor="developing-story">
            <span className="option-title">Developing Story</span>
            <span className="option-description">Mark as an ongoing story that will be updated</span>
          </label>
        </div>
        
        <div className="feature-option">
          <input
            type="checkbox"
            id="exclusive"
            checked={formData.articleOptions?.exclusive || false}
            onChange={(e) => handleChange('exclusive', e.target.checked)}
          />
          <label htmlFor="exclusive">
            <span className="option-title">Exclusive</span>
            <span className="option-description">Mark as an exclusive story</span>
          </label>
        </div>
        
        <div className="feature-option">
          <input
            type="checkbox"
            id="sponsored"
            checked={formData.articleOptions?.sponsored || false}
            onChange={(e) => handleChange('sponsored', e.target.checked)}
          />
          <label htmlFor="sponsored">
            <span className="option-title">Sponsored</span>
            <span className="option-description">Mark as a sponsored article</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ArticleOptionsStep;
