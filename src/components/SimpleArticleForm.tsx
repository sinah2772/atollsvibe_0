import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useUser } from '../hooks/useUser';
// import MultiStepForm from './MultiStepForm';
// import { simpleArticleSteps, SimpleStep } from './simpleArticleStepConfig';
import { 
  ArrowLeft,
  Save,
  Send,
  Eye
} from 'lucide-react';

interface SimpleArticleFormData extends Record<string, unknown> {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
}

const SimpleArticleForm: React.FC = () => {
  const navigate = useNavigate();
  const { createArticle } = useArticles();
  const { user } = useUser();
  
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [language, setLanguage] = useState<'en' | 'dv'>('en');
  
  const [formData, setFormData] = useState<SimpleArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft'
  });

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Create a complete article object
      const articleData = {
        title: formData.title,
        heading: formData.title, // Use title as heading for simple form
        social_heading: null,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: formData.content }] }] },
        category_id: 1, // Default category
        subcategory_id: null,
        atoll_ids: [],
        island_ids: [],
        government_ids: [],
        cover_image: null,
        image_caption: null,
        status: 'draft',
        publish_date: null,
        user_id: user.id,
        is_breaking: false,
        is_featured: false,
        is_developing: false,
        is_exclusive: false,
        is_sponsored: false,
        sponsored_by: null,
        sponsored_url: null,
        island_category: null,
        developing_until: null,
        ideas: null,
        sponsored_image: null,
        next_event_date: null,
        collaborators: null,
        collaboration_notes: null,
        news_type: null,
        news_priority: null,
        news_source: null,
        meta_title: null,
        meta_description: null,
        meta_keywords: null,
        related_articles: null,
        tags: formData.tags && Array.isArray(formData.tags) ? formData.tags : [],
        author_notes: null,
        editor_notes: null,
        fact_checked: null,
        fact_checker_id: null,
        fact_checked_at: null,
        approved_by_id: null,
        approved_at: null,
        published_by_id: null,
        last_updated_by_id: null,
        original_source_url: null,
        translation_source_url: null,
        translation_source_lang: null,
        translation_notes: null,
        revision_history: null,
        scheduled_notifications: null,
        notification_sent: null,
        notification_sent_at: null
      };
      
      await createArticle(articleData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setSaving(false);
    }
  };
  const handlePublish = async () => {
    if (!user) return;
    
    setPublishing(true);
    try {
      // Create a complete article object
      const articleData = {
        title: formData.title,
        heading: formData.title, // Use title as heading for simple form
        social_heading: null,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: formData.content }] }] },
        category_id: 1, // Default category
        subcategory_id: null,
        atoll_ids: [],
        island_ids: [],
        government_ids: [],
        cover_image: null,
        image_caption: null,
        status: 'published',
        publish_date: new Date().toISOString(),
        user_id: user.id,
        is_breaking: false,
        is_featured: false,
        is_developing: false,
        is_exclusive: false,
        is_sponsored: false,
        sponsored_by: null,
        sponsored_url: null,
        island_category: null,
        developing_until: null,
        ideas: null,
        sponsored_image: null,
        next_event_date: null,
        collaborators: null,
        collaboration_notes: null,
        news_type: null,
        news_priority: null,
        news_source: null,
        meta_title: null,
        meta_description: null,
        meta_keywords: null,
        related_articles: null,
        tags: formData.tags && Array.isArray(formData.tags) ? formData.tags : [],
        author_notes: null,
        editor_notes: null,
        fact_checked: null,
        fact_checker_id: null,
        fact_checked_at: null,
        approved_by_id: null,
        approved_at: null,
        published_by_id: null,
        last_updated_by_id: null,
        original_source_url: null,
        translation_source_url: null,
        translation_source_lang: null,
        translation_notes: null,
        revision_history: null,
        scheduled_notifications: null,
        notification_sent: null,
        notification_sent_at: null
      };
      
      await createArticle(articleData);
      navigate('/articles');
    } catch (error) {
      console.error('Error publishing article:', error);
    } finally {
      setPublishing(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab or modal
    console.log('Preview article:', formData);
  };
  const renderCurrentStep = () => {
    return (
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Article Title' : 'ލިޔުމުގެ ނަން'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'en' ? 'Enter article title...' : 'ލިޔުމުގެ ނަން ލިޔުއްވާ...'}
            dir={language === 'dv' ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Content Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Article Content' : 'ލިޔުމުގެ ކޮންޓެންޓް'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => updateFormData('content', e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'en' ? 'Write your article content...' : 'ތިޔަ ލިޔުމުގެ ކޮންޓެންޓް ލިޔުއްވާ...'}
            dir={language === 'dv' ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Category' : 'ކެޓަގަރީ'}
          </label>          <select
            value={formData.category}
            onChange={(e) => updateFormData('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={language === 'en' ? 'Select article category' : 'ލިޔުމުގެ ކެޓަގަރީ ޙައްސަވާ'}
          >
            <option value="">{language === 'en' ? 'Select a category' : 'ކެޓަގަރީއެއް ޙައްސަވާ'}</option>
            <option value="news">{language === 'en' ? 'News' : 'ހަބަރު'}</option>
            <option value="sports">{language === 'en' ? 'Sports' : 'ކުޅަދު'}</option>
            <option value="politics">{language === 'en' ? 'Politics' : 'ސިޔާސާތު'}</option>
          </select>
        </div>

        {/* Excerpt Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Excerpt (Optional)' : 'ރާދަކުރުމާ (އޮޕްޝަނަލް)'}
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => updateFormData('excerpt', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'en' ? 'Brief description of the article...' : 'ލިޔުމުގެ ކުރު ތަޢާރަފެއް...'}
            dir={language === 'dv' ? 'rtl' : 'ltr'}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title={language === 'en' ? 'Go back' : 'އަނބުރާ'}
              aria-label={language === 'en' ? 'Go back' : 'އަނބުރާ'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {language === 'en' ? 'Create New Article' : 'އާޅުކުރައްވާ ލިޔުން'}
              </h1>
              <p className="text-sm text-gray-500">
                {language === 'en' 
                  ? 'Simple article creation' 
                  : 'ސާދަ ލިޔުން ހެދުން'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(prev => prev === 'en' ? 'dv' : 'en')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {language === 'en' ? 'ދވ' : 'EN'}
            </button>
            
            {/* Action Buttons */}
            <button
              onClick={handlePreview}
              disabled={!formData.title}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              {language === 'en' ? 'Preview' : 'ކުރިން ބައްލަވާ'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving || !formData.title}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              {saving 
                ? (language === 'en' ? 'Saving...' : 'ސޭވްކުރަނީ...')
                : (language === 'en' ? 'Save Draft' : 'ޑްރާފްޓް ސޭވްކުރޭ')
              }
            </button>
            
            <button
              onClick={handlePublish}
              disabled={publishing || !formData.title || !formData.content}
              className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-1" />
              {publishing 
                ? (language === 'en' ? 'Publishing...' : 'ޝޭޔަރުކުރަނީ...')
                : (language === 'en' ? 'Publish' : 'ޝޭޔަރުކުރޭ')
              }
            </button>
          </div>
        </div>
      </div>      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderCurrentStep()}
          
          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="mt-6 text-sm text-gray-500">
              {language === 'en' ? 'Last saved' : 'ފަހުން ސޭވްވީ'}: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleArticleForm;
