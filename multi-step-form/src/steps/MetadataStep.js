// MetadataStep.js
import React from 'react';

const MetadataStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('metadata', { [field]: value });
  };
  
  const handleTagsChange = (e) => {
    const tagsText = e.target.value;
    const tagsArray = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleChange('tags', tagsArray);
    // Store the raw input for display purposes
    handleChange('tagsInput', tagsText);
  };

  // Mock data
  const newsTypes = ['General News', 'Feature', 'Opinion', 'Investigation', 'Interview', 'Analysis'];
  const newsPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  const newsSources = ['Staff Reporter', 'Press Release', 'News Wire', 'Social Media', 'Other Source'];
  
  // Mock related articles (in a real app, these would come from an API)
  const relatedArticleSuggestions = [
    { id: '1', title: 'Government Announces New Healthcare Initiative' },
    { id: '2', title: 'Tourism Numbers Reach Record High in Maldives' },
    { id: '3', title: 'Parliament Passes Key Environmental Protection Bill' },
    { id: '4', title: 'President Meets with Foreign Dignitaries' },
    { id: '5', title: 'New Marine Conservation Efforts Launched' }
  ];

  const handleRelatedArticleSelect = (articleId) => {
    const currentRelated = formData.metadata?.relatedArticles || [];
    
    // Check if already selected
    if (currentRelated.some(item => item.id === articleId)) {
      // Remove if already selected
      handleChange('relatedArticles', currentRelated.filter(item => item.id !== articleId));
    } else {
      // Add if not already selected
      const articleToAdd = relatedArticleSuggestions.find(article => article.id === articleId);
      if (articleToAdd) {
        handleChange('relatedArticles', [...currentRelated, articleToAdd]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            News Type
          </label>
          <select
            className="form-select"
            value={formData.metadata?.newsType || ''}
            onChange={(e) => handleChange('newsType', e.target.value)}
          >
            <option value="">Select news type</option>
            {newsTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            News Priority
          </label>
          <select
            className="form-select"
            value={formData.metadata?.newsPriority || ''}
            onChange={(e) => handleChange('newsPriority', e.target.value)}
          >
            <option value="">Select priority</option>
            {newsPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          News Source
        </label>
        <select
          className="form-select"
          value={formData.metadata?.newsSource || ''}
          onChange={(e) => handleChange('newsSource', e.target.value)}
        >
          <option value="">Select news source</option>
          {newsSources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.metadata?.tagsInput || ''}
          onChange={handleTagsChange}
          placeholder="Enter tags separated by commas (e.g., politics, economy, election)"
        />
        {formData.metadata?.tags?.length > 0 && (
          <div className="tags-display">
            {formData.metadata.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Related Articles
        </label>
        <div className="related-articles-container">
          {relatedArticleSuggestions.map((article) => (
            <div key={article.id} className="related-article-item">
              <input
                type="checkbox"
                id={`article-${article.id}`}
                checked={(formData.metadata?.relatedArticles || []).some(item => item.id === article.id)}
                onChange={() => handleRelatedArticleSelect(article.id)}
              />
              <label htmlFor={`article-${article.id}`}>
                {article.title}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetadataStep;
