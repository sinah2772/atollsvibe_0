import React, { useState } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { StepProps } from '../../types/editor';
import { CollaborativeInput } from '../CollaborativeInput';
import { CollaborativeTextArea } from '../CollaborativeTextArea';

const MetadataStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language,
  collaborative = {
    isFieldLocked: () => false,
    lockField: () => {},
    unlockField: () => {},
    broadcastFieldUpdate: () => {},
    getFieldLocker: () => null,
    pendingUpdates: {}
  }
}) => {
  const [newTag, setNewTag] = useState('');
  const [newRelatedArticle, setNewRelatedArticle] = useState('');
  
  const tags = Array.isArray(formData.tags) ? formData.tags as string[] : [];
  const relatedArticles = Array.isArray(formData.relatedArticles) ? formData.relatedArticles as string[] : [];
  const excerpt = formData.excerpt as string || '';
  const newsType = formData.newsType as string || '';
  const newsPriority = formData.newsPriority as number || 3;
  const newsSource = formData.newsSource as string || '';
  
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onFormDataChange({ tags: [...tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onFormDataChange({ tags: tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addRelatedArticle = () => {
    if (newRelatedArticle.trim() && !relatedArticles.includes(newRelatedArticle.trim())) {
      onFormDataChange({ relatedArticles: [...relatedArticles, newRelatedArticle.trim()] });
      setNewRelatedArticle('');
    }
  };

  const removeRelatedArticle = (articleToRemove: string) => {
    onFormDataChange({ 
      relatedArticles: relatedArticles.filter(article => article !== articleToRemove) 
    });
  };

  const handleRelatedArticleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRelatedArticle();
    }
  };
  
  const generateExcerpt = () => {
    const contentText = formData.content as string || '';
    if (contentText.length > 0) {
      // Extract first 150 characters and end at last complete word
      let newExcerpt = contentText.substring(0, 150);
      const lastSpace = newExcerpt.lastIndexOf(' ');
      if (lastSpace > 0) {
        newExcerpt = newExcerpt.substring(0, lastSpace);
      }
      onFormDataChange({ excerpt: newExcerpt + '...' });
    }
  };

  return (
    <div className="space-y-6">
      {/* News Type Selection */}
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޚަބަރުގެ ބާވަތް' : 'News Type'}
        </label>        <select
          value={newsType}
          onChange={(e) => handleChange('newsType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={language === 'dv' ? 'ޚަބަރުގެ ބާވަތް' : 'News Type'}
        >
          <option value="">{language === 'dv' ? 'ބާވަތެއް ހޮވާ' : 'Select type'}</option>
          <option value="update">{language === 'dv' ? 'އަޕްޑޭޓް' : 'Update'}</option>
          <option value="breaking">{language === 'dv' ? 'ބްރޭކިންގ' : 'Breaking'}</option>
          <option value="feature">{language === 'dv' ? 'ފީޗަރ' : 'Feature'}</option>
          <option value="opinion">{language === 'dv' ? 'ޚިޔާލު' : 'Opinion'}</option>
          <option value="interview">{language === 'dv' ? 'އިންޓަވިއު' : 'Interview'}</option>
        </select>
      </div>

      {/* News Priority */}
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އިސްކަން ދިނުމުގެ މިންވަރު' : 'Priority'}
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => handleChange('newsPriority', priority)}
              className={`flex-1 py-2 border ${
                newsPriority === priority 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } rounded-md focus:outline-none`}
            >
              {priority}
            </button>
          ))}
        </div>
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? '1 އެންމެ މުހިންމު، 5 އެންމެ މަދުން މުހިންމު' 
            : '1 is highest priority, 5 is lowest'}
        </p>
      </div>

      {/* News Source */}
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މަސްދަރު' : 'Source'}
        </label>        <CollaborativeInput
          fieldId="newsSource"
          value={newsSource}
          onChange={(value) => handleChange('newsSource', value)}
          collaborative={collaborative}
          placeholder={language === 'dv' ? 'ޚަބަރުގެ މަސްދަރު' : 'Article source'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          currentUser={''}
        />
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޓެގްތައް' : 'Tags'}
        </label>
        
        {/* Existing Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label={language === 'dv' ? `${tag} ޓެގް ނައްތާލާ` : `Remove tag ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'dv' ? 'ޓެގް އިތުރުކުރާ...' : 'Add a tag...'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />          <button
            onClick={addTag}
            disabled={!newTag.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            aria-label={language === 'dv' ? 'ޓެގް އިތުރުކުރާ' : 'Add tag'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? 'ޓެގް އިތުރުކުރުމަށް Enter ކީ އަތުލާ ނުވަތަ + ކްލިކް ކުރޭ' 
            : 'Press Enter or click + to add tags'}
        </p>
      </div>

      {/* Related Articles */}
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ގުޅުންހުރި ލިޔުންތައް' : 'Related Articles'}
        </label>
        
        {/* Existing Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {relatedArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
              >
                <span className="text-sm truncate">{article}</span>
                <button
                  onClick={() => removeRelatedArticle(article)}
                  className="ml-2 text-red-600 hover:text-red-800"
                  aria-label={language === 'dv' ? 'ނައްތާލާ' : 'Remove'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Related Article */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newRelatedArticle}
            onChange={(e) => setNewRelatedArticle(e.target.value)}
            onKeyPress={handleRelatedArticleKeyPress}
            placeholder={language === 'dv' ? 'ލިޔުމެއްގެ އައިޑީ ނުވަތަ ސުރުޚީ' : 'Article ID or title'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />          <button
            onClick={addRelatedArticle}
            disabled={!newRelatedArticle.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            aria-label={language === 'dv' ? 'ގުޅުންހުރި ލިޔުމެއް އިތުރުކުރާ' : 'Add related article'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? 'ގުޅުންހުރި ލިޔުމެއް އިތުރުކުރުމަށް ލިޔުމުގެ އައިޑީ ނުވަތަ ސުރުޚީ ލިޔާފައި Enter ކީ އަތުލާ' 
            : 'Enter article ID or title to add related articles'}
        </p>
      </div>

      {/* Excerpt */}
      <div className="form-group">
        <div className="flex items-center justify-between mb-2">
          <label className={`block text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ޚުލާޞާ' : 'Excerpt'}
          </label>
          <button
            onClick={generateExcerpt}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {language === 'dv' ? 'އަމިއްލައަށް އުފައްދާ' : 'Auto-generate'}
          </button>
        </div>        <CollaborativeTextArea
          fieldId="excerpt"
          value={excerpt}
          onChange={(value) => handleChange('excerpt', value)}
          collaborative={collaborative}
          placeholder={language === 'dv' ? 'ލިޔުމުގެ ކުރު ޚުލާޞާއެއް...' : 'Brief excerpt of the article...'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          currentUser={''}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          rows={3}
        />
        <div className="mt-1 flex justify-between">
          <p className={`text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' 
              ? 'މި ޚުލާޞާ ލިޔުމުގެ ތަޢާރަފުގައި އަދި ސާރޗް ނަތީޖާތަކުގައި ދައްކާނެ' 
              : 'This excerpt will appear in previews and search results'}
          </p>
          <p className={`text-xs ${excerpt.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
            {excerpt.length}/200
          </p>
        </div>
      </div>

      {/* Warning when primary fields are missing */}
      {(!newsType || !newsPriority) && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className={`text-sm text-yellow-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' 
              ? 'ލިޔުމުގެ ބާވަތް އަދި އިސްކަންދޭ މިންވަރު ފުރިހަމަކުރުމުން ލިޔުން އިތުރަށް ފުރިހަމަވާނެ' 
              : 'Adding news type and priority will enhance the metadata of your article'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MetadataStep;
