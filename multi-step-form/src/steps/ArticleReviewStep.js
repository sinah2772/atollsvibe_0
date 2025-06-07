// ArticleReviewStep.js
import React from 'react';

const ArticleReviewStep = ({ formData, onEdit }) => {
  // Helper function to render review section
  const renderSection = (title, data, sectionKey) => {
    if (!data) return null;
    
    return (
      <div className="review-section">
        <div className="review-header">
          <h3>{title}</h3>
          {onEdit && (
            <button 
              type="button" 
              className="btn-text"
              onClick={() => onEdit(sectionKey)}
            >
              Edit
            </button>
          )}
        </div>
        <div className="review-content">
          {Object.entries(data).map(([key, value]) => {
            // Skip some fields that don't need to be displayed or need special handling
            if (key === 'tagsInput' || key === 'submissionStatus' || !value) return null;
            
            // Handle arrays and objects specially
            if (Array.isArray(value)) {
              if (key === 'tags') {
                return (
                  <div key={key} className="review-item">
                    <span className="item-label">Tags:</span>
                    <div className="tags-display">
                      {value.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                );
              } else if (key === 'categories' || key === 'subcategories') {
                return (
                  <div key={key} className="review-item">
                    <span className="item-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <span className="item-value">{value.join(', ')}</span>
                  </div>
                );
              } else if (key === 'relatedArticles') {
                return (
                  <div key={key} className="review-item">
                    <span className="item-label">Related Articles:</span>
                    <ul className="item-list">
                      {value.map((article, i) => (
                        <li key={i}>{article.title}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
            } else if (key === 'coverImage' && typeof value === 'object') {
              return (
                <div key={key} className="review-item">
                  <span className="item-label">Cover Image:</span>
                  <span className="item-value">{value.name}</span>
                </div>
              );
            }
            
            // Format the key name for display
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            // For boolean values
            if (typeof value === 'boolean') {
              return (
                <div key={key} className="review-item">
                  <span className="item-label">{formattedKey}:</span>
                  <span className="item-value">{value ? 'Yes' : 'No'}</span>
                </div>
              );
            }

            // Special case for content
            if (key === 'mainContent') {
              return (
                <div key={key} className="review-item content-preview">
                  <span className="item-label">Content Preview:</span>
                  <div className="content-preview-text">
                    {value.length > 300 
                      ? value.substring(0, 300) + '...' 
                      : value}
                  </div>
                  <div className="word-count">
                    {value.split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>
              );
            }
            
            // Default case for string values
            return (
              <div key={key} className="review-item">
                <span className="item-label">{formattedKey}:</span>
                <span className="item-value">
                  {typeof value === 'string' && value.startsWith('http') 
                    ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                    : value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Map step indices to their corresponding section keys in formData
  const sectionMap = {
    0: 'articleIdentity',
    1: 'mediaVisuals',
    2: 'classification',
    3: 'articleOptions',
    4: 'metadata',
    5: 'seoNotes',
    6: 'translation',
    7: 'content'
  };

  return (
    <div className="article-review">
      <p className="mb-4 text-gray-700">
        Please review all the information you've entered before submitting your article.
      </p>
      
      {renderSection('Article Identity', formData.articleIdentity, 0)}
      {renderSection('Media & Visuals', formData.mediaVisuals, 1)}
      {renderSection('Classification', formData.classification, 2)}
      {renderSection('Article Options', formData.articleOptions, 3)}
      {renderSection('Metadata', formData.metadata, 4)}
      {renderSection('SEO & Notes', formData.seoNotes, 5)}
      {renderSection('Translation Info', formData.translation, 6)}
      {renderSection('Content', formData.content, 7)}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-blue-800">Ready to Submit?</h3>
        <p className="text-blue-700">
          Choose an action to proceed with this article:
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <button 
            type="button" 
            className="btn btn-outline"
          >
            Save as Draft
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
          >
            Send to Review
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
          >
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleReviewStep;
