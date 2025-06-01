import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OutputData } from '@editorjs/editorjs';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';
import { useAtolls } from '../hooks/useAtolls';
import { useUser } from '../hooks/useUser';
import { useGovernment } from '../hooks/useGovernment';
import { useCollaborativeArticle } from '../hooks/useCollaborativeArticle';
import { useCollaborators } from '../hooks/useCollaborators';
import useAutoSave from '../hooks/useAutoSave';
import { MultiSelect } from '../components/MultiSelect';
import { ColoredMultiSelect } from '../components/ColoredMultiSelect';
import { UserSelector } from '../components/UserSelector';
import { IslandsSelect } from '../components/IslandsSelect';
import { CollaborativeInput } from '../components/CollaborativeInput';
import { CollaborativeTextArea } from '../components/CollaborativeTextArea';
import { EditorJSComponent } from '../components/EditorJSComponent';
import { CollaborativePresence } from '../components/CollaborativePresence';
import { AutoSaveStatus } from '../components/AutoSaveStatus';
import ImageBrowser from '../components/ImageBrowser';
import { supabase } from '../lib/supabase';
import { 
  Save,
  Send,
  Eye,
  Languages,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

const NewArticle: React.FC = () => {
  const navigate = useNavigate();
  const { createArticle } = useArticles();
  const { categories } = useCategories();
  const { atolls, error: atollsError, useFallbackData } = useAtolls();
  const { user, loading: userLoading } = useUser();
  const { government, error: governmentError, useFallbackData: useGovernmentFallbackData } = useGovernment();

  // Generate session ID first before using it
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Form state
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [socialHeading, setSocialHeading] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [subcategory, setSubcategory] = useState<string[]>([]);
  const [selectedAtolls, setSelectedAtolls] = useState<number[]>([]);
  const [selectedIslands, setSelectedIslands] = useState<number[]>([]);
  const [selectedGovernmentIds, setSelectedGovernmentIds] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [language, setLanguage] = useState<'en'|'dv'>('dv');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [sendingToReview, setSendingToReview] = useState(false);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Article flag states
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsoredBy, setSponsoredBy] = useState('');
  
  // New database fields
  const [islandCategory, setIslandCategory] = useState<string[]>([]);
  const [developingUntil, setDevelopingUntil] = useState<string>('');
  const [sponsoredImage, setSponsoredImage] = useState<string>('');
  
  // Collaboration fields - Now sessionId is available
  const collaboratorHook = useCollaborators(sessionId);
  
  // News priority field (exists in DB)
  const [newsPriority, setNewsPriority] = useState<number>(3);
  
  // Additional fields
  const [relatedArticles, setRelatedArticles] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [authorNotes, setAuthorNotes] = useState<string>('');
  const [editorNotes, setEditorNotes] = useState<string>('');
  
  // Island filtering states
  const [selectedIslandCategory, setSelectedIslandCategory] = useState<string[]>([]);
  
  // Translation fields (keeping original ones from database)
  const [originalSourceUrl] = useState<string>('');
  
  // Missing state variables for Article type compliance
  const [sponsoredUrl, setSponsoredUrl] = useState<string>('');
  const [newsSource, setNewsSource] = useState<string>('');  const [translationSourceUrl] = useState<string>('');
  const [translationSourceLang] = useState<string>('');
  const [translationNotes] = useState<string>('');
  const [collaborationNotes, setCollaborationNotes] = useState<string>('');
  const [newsType, setNewsType] = useState<string>('');

  // Enhanced collaborative features with proper typing
  const collaborative = useCollaborativeArticle({
    sessionId,
    articleId: undefined, // This is for new articles
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, userLoading, navigate]);

  // Clear island selections when atoll selection changes
  useEffect(() => {
    setSelectedIslands([]);
  }, [selectedAtolls]);
  // Clear island selections when island category changes
  useEffect(() => {
    setSelectedIslands([]);
  }, [selectedIslandCategory]);

  // Editor.js content state
  const [editorData, setEditorData] = useState<OutputData | null>(null);  // Prepare data for auto-save (defined after editor)
  const formData = {
    title,
    heading,
    socialHeading,
    category,
    subcategory,
    selectedAtolls,
    selectedIslands,
    selectedGovernmentIds,
    coverImage,
    imageCaption,
    language,
    isBreaking,
    isFeatured,
    isDeveloping,
    isExclusive,
    isSponsored,
    sponsoredBy,
    islandCategory,
    developingUntil,
    sponsoredImage,
    collaborators: collaboratorHook.getCollaboratorsString(),
    newsPriority,
    relatedArticles,
    tags,
    authorNotes,
    editorNotes,
    selectedIslandCategory,
    originalSourceUrl,
    sponsoredUrl,
    newsSource,
    translationSourceUrl,
    translationSourceLang,
    translationNotes,
    collaborationNotes,
    content: editorData || null,
  };

  // Enhanced auto-save with collaboration awareness
  useAutoSave({
    data: {
      ...formData,
      sessionId,
      collaborators: collaboratorHook.getCollaboratorsString(),
      lastEditedBy: user?.email || '',
      lastEditedAt: new Date().toISOString()
    },
    onSave: async () => {
      setIsAutoSaving(true);
      try {
        // Save draft to localStorage with collaboration metadata
        const key = `article_draft_${sessionId}`;
        const collaborativeData = {
          ...formData,
          sessionId,
          collaborators: collaboratorHook.getCollaboratorsString(),
          lastEditedBy: user?.email || '',
          lastEditedAt: new Date().toISOString(),
          version: Date.now() // Simple versioning
        };
        localStorage.setItem(key, JSON.stringify(collaborativeData));
        setLastAutoSave(new Date());
        
        console.log('Auto-saved at:', new Date().toLocaleTimeString());
      } finally {
        setIsAutoSaving(false);
      }
    },
    interval: 30000, // Auto-save every 30 seconds
    enabled: true,
  });
  // Enhanced form validation with collaboration awareness using existing properties
  const validateForm = () => {
    if (!user) {
      alert(language === 'dv' ? 'އެކައުންޓަށް ވަދެވަޑައިގަންނަވާ' : 'Please log in to continue');
      return false;
    }
    
    // Check field locks instead of non-existent properties
    const fieldLocks = collaborative.fieldLocks;
    if (fieldLocks && Object.keys(fieldLocks).length > 0) {
      const criticalFields = ['title', 'heading', 'category'];
      const lockedFields = criticalFields.filter(field => 
        fieldLocks[field] && fieldLocks[field].user_id !== user.email
      );
      
      if (lockedFields.length > 0) {
        const message = language === 'dv' 
          ? `މި ވަގުތު އަނެކް ބޭފުޅެއް މި ފީލްޑްތައް އެޑިޓް ކުރަނީ: ${lockedFields.join(', ')}`
          : `Another user is currently editing these fields: ${lockedFields.join(', ')}`;
        
        if (!confirm(`${message}\n\n${language === 'dv' ? 'ކުރިއަށް ގެންދަން ބޭނުންވޭތޯ؟' : 'Do you want to continue anyway?'}`)) {
          return false;
        }
      }
    }
    
    if (!title.trim()) {
      alert(language === 'dv' ? 'ސުރުޚީ ލިޔުއްވާ' : 'Please enter a title');
      return false;
    }
    if (!heading.trim()) {
      alert(language === 'dv' ? 'ހެޑިންގ ލިޔުއްވާ' : 'Please enter a heading');
      return false;
    }
    if (!selectedAtolls || selectedAtolls.length === 0) {
      alert(language === 'dv' ? 'އަތޮޅެއް އިޚްތިޔާރު ކުރައްވާ' : 'Please select at least one atoll');
      return false;
    }
    if (!category || category.length === 0) {
      alert(language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Please select a category');
      return false;
    }
    if (!editorData || !editorData.blocks || editorData.blocks.length === 0) {
      alert(language === 'dv' ? 'ލިޔުމުގެ ތުންތަކެއް ލިޔުއްވާ' : 'Please write some content');
      return false;
    }
    if (isSponsored && !sponsoredBy.trim()) {
      alert(language === 'dv' ? 'ސްޕޮންސަރ މަޢުލޫމާތު ފުރިހަމަ ކުރައްވާ' : 'Please provide sponsor details');
      return false;
    }
    if (isDeveloping && developingUntil && new Date(developingUntil) < new Date()) {
      alert(language === 'dv' ? 'ފަހުގެ އިވެންޓް ތާރީޚް ލޯ ކުރުވުން ނުޖެހޭ' : 'Next event date cannot be in the past');
      return false;
    }
    if (selectedIslands.length > 0 && (!islandCategory || islandCategory.length === 0)) {
      alert(language === 'dv' ? 'ރަށް ކެޓެގަރީ އިޚްތިޔާރު ކުރައްވާ' : 'Please select an island category when islands are selected');
      return false;
    }
    return true;
  };

  // Enhanced auto-save with collaboration awareness
  useAutoSave({
    data: {
      ...formData,
      sessionId,
      collaborators: collaboratorHook.getCollaboratorsString(),
      lastEditedBy: user?.email || '',
      lastEditedAt: new Date().toISOString()
    },
    onSave: async () => {
      setIsAutoSaving(true);
      try {
        // Save draft to localStorage with collaboration metadata
        const key = `article_draft_${sessionId}`;
        const collaborativeData = {
          ...formData,
          sessionId,
          collaborators: collaboratorHook.getCollaboratorsString(),
          lastEditedBy: user?.email || '',
          lastEditedAt: new Date().toISOString(),
          version: Date.now() // Simple versioning
        };
        localStorage.setItem(key, JSON.stringify(collaborativeData));
        setLastAutoSave(new Date());
        
        console.log('Auto-saved at:', new Date().toLocaleTimeString());
      } finally {
        setIsAutoSaving(false);
      }
    },
    interval: 30000, // Auto-save every 30 seconds
    enabled: true,
  });
  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      setError(null);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      await createArticle({
        title,
        heading,        social_heading: socialHeading,
        content: editorData || { time: Date.now(), blocks: [], version: "2.0.0" },
        category_id: parseInt(category[0]),
        subcategory_id: subcategory.length > 0 ? parseInt(subcategory[0]) : null,
        atoll_ids: selectedAtolls || [],
        island_ids: selectedIslands || [],
        government_ids: selectedGovernmentIds || [],
        cover_image: coverImage,
        image_caption: imageCaption,
        status: 'draft',
        publish_date: null,
        user_id: user.id,
        is_breaking: isBreaking,
        is_featured: isFeatured,
        is_developing: isDeveloping,
        is_exclusive: isExclusive,
        is_sponsored: isSponsored,
        sponsored_by: isSponsored ? sponsoredBy : null,
        sponsored_url: isSponsored ? sponsoredUrl : null,
        island_category: islandCategory.length > 0 ? islandCategory.join(',') : null,
        developing_until: developingUntil ? new Date(developingUntil).toISOString() : null,
        ideas: null,
        sponsored_image: sponsoredImage || null,
        next_event_date: null,
        // Enhanced collaboration fields
        collaborators: collaboratorHook.getCollaboratorsString() || null,
        collaboration_notes: `Created in collaboration session: ${sessionId}. Contributors: ${collaboratorHook.getCollaboratorsString()}`,
        news_type: newsType,
        news_priority: newsPriority,
        news_source: newsSource,
        meta_title: title,
        meta_description: heading.substring(0, 160),
        meta_keywords: [],
        related_articles: relatedArticles ? relatedArticles.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [],
        tags: tags ? tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
        author_notes: authorNotes,
        editor_notes: editorNotes,
        fact_checked: false,
        fact_checker_id: null,
        fact_checked_at: null,
        approved_by_id: null,
        approved_at: null,
        published_by_id: null,
        last_updated_by_id: user.id,
        original_source_url: originalSourceUrl,
        translation_source_url: translationSourceUrl,
        translation_source_lang: translationSourceLang,
        translation_notes: translationNotes,
        revision_history: null,
        scheduled_notifications: null,
        notification_sent: false,
        notification_sent_at: null
      });

      // Clean up collaboration session data
      localStorage.removeItem(`article_draft_${sessionId}`);
      
      navigate('/articles');
    } catch (error) {
      console.error('Failed to save draft:', error);
      setError(language === 'dv' ? 'ޑްރާފްޓް ކުރުމުގައި މަްސަލައެއް ދިމާވެއްޖެ' : 'Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };  const handlePublish = async () => {
    if (!validateForm()) return;
    
    try {
      setPublishing(true);
      setError(null);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }      await createArticle({
        title,
        heading,
        social_heading: socialHeading,        content: editorData || { time: Date.now(), blocks: [], version: "2.0.0" },
        category_id: parseInt(category[0]),
        subcategory_id: subcategory.length > 0 ? parseInt(subcategory[0]) : null,
        atoll_ids: selectedAtolls || [],
        island_ids: selectedIslands || [],
        government_ids: selectedGovernmentIds || [],
        cover_image: coverImage,
        image_caption: imageCaption,        status: 'published',
        publish_date: new Date().toISOString(),
        user_id: user.id,
        // Article flags
        is_breaking: isBreaking,
        is_featured: isFeatured,
        is_developing: isDeveloping,
        is_exclusive: isExclusive,
        is_sponsored: isSponsored,
        sponsored_by: isSponsored ? sponsoredBy : null,
        sponsored_url: isSponsored ? sponsoredUrl : null,
        // New database fields
        island_category: islandCategory.length > 0 ? islandCategory.join(',') : null,
        developing_until: developingUntil ? new Date(developingUntil).toISOString() : null,
        ideas: null,
        sponsored_image: sponsoredImage || null,
        next_event_date: null,
        collaborators: collaboratorHook.getCollaboratorsString() || null,
        collaboration_notes: collaborationNotes || null,
        // Metadata fields
        news_type: newsType,
        news_priority: newsPriority,
        news_source: newsSource,
        // SEO fields
        meta_title: title,
        meta_description: heading.substring(0, 160),
        meta_keywords: [],
        // Additional fields
        related_articles: relatedArticles ? relatedArticles.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [],
        tags: tags ? tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
        // Editorial workflow fields
        author_notes: authorNotes,
        editor_notes: editorNotes,
        fact_checked: false,
        fact_checker_id: null,
        fact_checked_at: null,
        approved_by_id: null,
        approved_at: null,
        published_by_id: null,
        last_updated_by_id: user.id,        // Translation fields
        original_source_url: originalSourceUrl,
        translation_source_url: translationSourceUrl,
        translation_source_lang: translationSourceLang,
        translation_notes: translationNotes,
        // System fields
        revision_history: null,
        scheduled_notifications: null,
        notification_sent: false,
        notification_sent_at: null
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to publish:', error);
      setError(language === 'dv' ? 'ޝާއިޢު ކުރުމުގައި މަްސަލައެއް ދިމާވެއްޖެ' : 'Failed to publish. Please try again.');    } finally {
      setPublishing(false);
    }
  };  const handleSendToReview = async () => {
    if (!validateForm()) return;
    
    try {
      setSendingToReview(true);
      setError(null);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }      await createArticle({
        title,
        heading,
        social_heading: socialHeading,        content: editorData || { time: Date.now(), blocks: [], version: "2.0.0" },
        category_id: parseInt(category[0]),
        subcategory_id: subcategory.length > 0 ? parseInt(subcategory[0]) : null,
        atoll_ids: selectedAtolls || [],
        island_ids: selectedIslands || [],
        government_ids: selectedGovernmentIds || [],
        cover_image: coverImage,
        image_caption: imageCaption,        status: 'review',
        publish_date: null,
        user_id: user.id,
        // Article flags
        is_breaking: isBreaking,
        is_featured: isFeatured,
        is_developing: isDeveloping,
        is_exclusive: isExclusive,        is_sponsored: isSponsored,
        sponsored_by: isSponsored ? sponsoredBy : null,
        sponsored_url: isSponsored ? sponsoredUrl : null,
        // New database fields
        island_category: islandCategory.length > 0 ? islandCategory.join(',') : null,
        developing_until: developingUntil ? new Date(developingUntil).toISOString() : null,
        ideas: null,
        sponsored_image: sponsoredImage || null,
        next_event_date: null,
        collaborators: collaboratorHook.getCollaboratorsString() || null,
        collaboration_notes: collaborationNotes || null,
        // Metadata fields
        news_type: newsType,
        news_priority: newsPriority,
        news_source: newsSource,
        // SEO fields
        meta_title: title,
        meta_description: heading.substring(0, 160),
        meta_keywords: [],
        // Additional fields
        related_articles: relatedArticles ? relatedArticles.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [],
        tags: tags ? tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
        // Editorial workflow fields
        author_notes: authorNotes,
        editor_notes: editorNotes,
        fact_checked: false,
        fact_checker_id: null,
        fact_checked_at: null,
        approved_by_id: null,
        approved_at: null,
        published_by_id: null,
        last_updated_by_id: user.id,
        // Translation fields
        original_source_url: originalSourceUrl,
        translation_source_url: translationSourceUrl,
        translation_source_lang: translationSourceLang,
        translation_notes: translationNotes,
        // System fields
        revision_history: null,
        scheduled_notifications: null,
        notification_sent: false,
        notification_sent_at: null
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to send to review:', error);
      setError(language === 'dv' ? 'ރިވިއުއަށް ފޮނުވުމުގައި މަްސަލައެއް ދިމާވެއްޖެ' : 'Failed to send to review. Please try again.');
    } finally {
      setSendingToReview(false);
    }
  };
  const handleImageSelect = (url: string) => {
    setCoverImage(url);
    setShowImageBrowser(false);
  };
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'dv' ? 'en' : 'dv');
    // Editor.js doesn't need to be re-enabled like TipTap
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އައު ލިޔުމެއް' : 'Create New Article'}
          </h1>
          <p className={`text-gray-600 mt-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ނައު ލިޔުމެއް ލިޔެ ޝާއިޢު ކުރައްވާ' : 'Write and publish your next story'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AutoSaveStatus
            lastSaveTime={lastAutoSave}
            isSaving={isAutoSaving}
            hasUnsavedChanges={false}
            language={language}
          />
          
          {/* Enhanced collaboration indicator */}
          <div className="flex items-center gap-2">
            {collaborative.activeUsers.length > 1 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700">
                  {language === 'dv' 
                    ? `${collaborative.activeUsers.length} ބޭފުޅުންއޮންލައިން` 
                    : `${collaborative.activeUsers.length} users online`}
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            dir={language === 'dv' ? 'rtl' : 'ltr'}
          >
            <Languages size={20} className={language === 'dv' ? 'ml-2' : 'mr-2'} />
            <span className={`text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'Switch to English' : 'ދިވެހި އަށް ބަދަލުކުރައްވާ'}
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced Collaborative Presence Indicator */}
      <div className="mb-6">
        <CollaborativePresence
          activeUsers={collaborative.activeUsers}
          isConnected={collaborative.isConnected}
        />
        
        {/* Add collaborator management */}
        {collaborative.activeUsers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className={`text-sm font-medium text-blue-900 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ހަމުޖެހޭ ލިޔުންތެރިން' : 'Collaborators'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {collaborative.activeUsers.map((collaborator, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-blue-300"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-blue-800">
                    {collaborator.user_id || `User ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Session info */}
            <div className="mt-2 text-xs text-blue-700">
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? 'ސެޝަން އައިޑީ: ' : 'Session ID: '}
              </span>
              <code className="bg-blue-100 px-1 rounded">{sessionId}</code>
            </div>
          </div>
        )}
      </div>

      {/* Rest of the form remains the same with enhanced collaborative components */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Show field locks instead of conflicts */}
        {collaborative.fieldLocks && Object.keys(collaborative.fieldLocks).length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg">
            <p className={`font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ލޮކް ކުރެވިފައިވާ ފީލްޑްތައް:' : 'Locked fields:'}
            </p>
            <ul className="mt-1 text-sm">
              {Object.keys(collaborative.fieldLocks).map(field => (
                <li key={field} className={language === 'dv' ? 'thaana-waheed' : ''}>
                  {field}: {language === 'dv' ? 'އަނެކް ބޭފުޅެއް އެޑިޓް ކުރަނީ' : `Being edited by ${collaborative.fieldLocks[field].user_id}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* All form fields remain the same with enhanced collaborative components */}
        {/* ...existing form code... */}
        {/* Basic Article Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސުރުޚީ (ލެޓިން)' : 'Title (Latin)'}
            </label>
            <CollaborativeInput
              fieldId="title"
              value={title}
              onChange={setTitle}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              placeholder={language === 'dv' ? 'ލެޓިން އަކުރުން ސުރުޚީ ލިޔުއްވާ' : 'Enter title in Latin'}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'placeholder:thaana-waheed' : ''}`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސުރުޚީ (ދިވެހި)' : 'Heading (Thaana)'}
            </label>
            <CollaborativeInput
              fieldId="heading"
              value={heading}
              onChange={setHeading}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              placeholder={language === 'dv' ? 'ދިވެހިން ސުރުޚީ ލިޔުއްވާ' : 'Enter heading in Thaana'}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ' : 'Social Heading'}
            </label>
            <CollaborativeInput
              fieldId="socialHeading"
              value={socialHeading}
              onChange={setSocialHeading}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ ލިޔުއްވާ' : 'Enter social media heading'}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div><div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Categories'}
            </label>
            <ColoredMultiSelect
              options={(categories || []).map(cat => ({
                id: cat.id,
                name: cat.name,
                name_en: cat.name_en,
                type: 'category' as const
              }))}
              value={category.map(id => parseInt(id))}
              onChange={(values) => setCategory((values || []).map(id => id.toString()))}
              language={language}
              placeholder={language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Select categories'}
              showColors={true}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބައިގެ ތަރުތީބު' : 'Subcategories'}
            </label>
            <ColoredMultiSelect
              options={(() => {
                const allSubcategories: Array<{id: number, name: string, name_en: string, type: 'subcategory', parentCategoryName?: string, parentCategoryNameEn?: string, categoryId?: number}> = [];
                (categories || []).forEach(cat => {
                  if (category.includes(cat.id.toString()) && cat.subcategories) {
                    cat.subcategories.forEach(sub => {
                      allSubcategories.push({
                        id: sub.id,
                        name: sub.name,
                        name_en: sub.name_en,
                        type: 'subcategory' as const,
                        parentCategoryName: cat.name,
                        parentCategoryNameEn: cat.name_en,
                        categoryId: cat.id
                      });
                    });
                  }
                });
                return allSubcategories;
              })()}
              value={subcategory.map(id => parseInt(id))}
              onChange={(values) => setSubcategory((values || []).map(id => id.toString()))}
              language={language}
              placeholder={language === 'dv' ? 'ބައިގެ ތަރުތީބު އިޚްތިޔާރު ކުރައްވާ' : 'Select subcategories'}
              showColors={true}
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className={`block text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އަތޮޅުތައް' : 'Atolls'}
              </label>
              {useFallbackData && (
                <div className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                  {language === 'dv' 
                    ? 'ވަގުތީ މަޢުލޫމާތު ބޭނުންކުރެވެނީ' 
                    : 'Using backup data - some features may be limited'}
                </div>
              )}
              {atollsError && (
                <div className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {language === 'dv' 
                    ? 'ޑޭޓާބޭސް އެރަރ' 
                    : `DB Error: ${atollsError}`}
                </div>
              )}
            </div>
            <MultiSelect
              options={atolls || []}
              value={selectedAtolls || []}
              onChange={(values) => {
                console.log('Selected atolls changed:', values);
                setSelectedAtolls((values || []).filter(id => typeof id === 'number') as number[]);
                setSelectedIslands([]);
              }}
              language={language}
              placeholder={language === 'dv' ? 'އަތޮޅުތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select atolls'}
            />
          </div>          {selectedAtolls && selectedAtolls.length > 0 && (
            <>              <div className="md:col-span-2">
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ރަށުގެ ބަި ފިލްޓަރ' : 'Island Category Filter'}
                </label>
                <MultiSelect
                  options={[
                    { id: 'residential', name: language === 'dv' ? 'އާބާދީ' : 'Residential', name_en: 'Residential' },
                    { id: 'resort', name: language === 'dv' ? 'ރިސޯޓް' : 'Resort', name_en: 'Resort' },
                    { id: 'industrial', name: language === 'dv' ? 'ސިނާޢީ' : 'Industrial', name_en: 'Industrial' },
                    { id: 'agricultural', name: language === 'dv' ? 'ދަނޑުވެރިކަން' : 'Agricultural', name_en: 'Agricultural' },
                    { id: 'uninhabited', name: language === 'dv' ? 'އާބާދީ ނެތް' : 'Uninhabited', name_en: 'Uninhabited' }
                  ]}
                  value={selectedIslandCategory || []}
                  onChange={(values) => {
                    console.log('Selected island category filter changed:', values);
                    setSelectedIslandCategory((values || []).filter(id => typeof id === 'string') as string[]);
                    setSelectedIslands([]);
                  }}
                  language={language}
                  placeholder={language === 'dv' ? 'ރަށުގެ ބައި ފިލްޓަރ' : 'Filter by island category'}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ރަށްތައް' : 'Islands'}
                </label>
                <IslandsSelect
                  atollIds={selectedAtolls}
                  islandCategory={selectedIslandCategory}
                  value={selectedIslands || []}
                  onChange={(values) => {
                    console.log('Selected islands changed:', values);
                    setSelectedIslands((values || []).filter(id => typeof id === 'number') as number[]);
                  }}
                  language={language}
                />
              </div>
            </>
          )}          {selectedIslands && selectedIslands.length > 0 && (
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ރަށުގެ ބައި' : 'Island Category'}
              </label>
              <MultiSelect
                options={[
                  { id: 'residential', name: language === 'dv' ? 'އާބާދީ' : 'Residential', name_en: 'Residential' },
                  { id: 'resort', name: language === 'dv' ? 'ރިސޯޓް' : 'Resort', name_en: 'Resort' },
                  { id: 'industrial', name: language === 'dv' ? 'ސިނާޢީ' : 'Industrial', name_en: 'Industrial' },
                  { id: 'agricultural', name: language === 'dv' ? 'ދަނޑުވެރިކަން' : 'Agricultural', name_en: 'Agricultural' },
                  { id: 'uninhabited', name: language === 'dv' ? 'އާބާދީ ނެތް' : 'Uninhabited', name_en: 'Uninhabited' }
                ]}
                value={islandCategory || []}
                onChange={(values) => {
                  console.log('Selected island category changed:', values);
                  setIslandCategory((values || []).filter(id => typeof id === 'string') as string[]);
                }}
                language={language}
                placeholder={language === 'dv' ? 'ރަށުގެ ބައި އިޚްތިޔާރު ކުރައްވާ' : 'Select island categories'}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className={`block text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'މިނިސްޓްރީތައް' : 'Government Ministries'}
              </label>
              {useGovernmentFallbackData && (
                <div className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                  {language === 'dv' 
                    ? 'ވަގުތީ މަޢުލޫމާތު ބޭނުންކުރެވެނީ' 
                    : 'Using backup data - some features may be limited'}
                </div>
              )}
              {governmentError && (
                <div className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {language === 'dv' 
                    ? 'ޑޭޓާބޭސް އެރަރ' 
                    : `DB Error: ${governmentError}`}
                </div>
              )}
            </div>
            <MultiSelect
              options={government.map(item => ({
                id: item.id,
                name: item.name,
                name_en: item.name_en
              }))}
              value={selectedGovernmentIds}
              onChange={(values) => {
                console.log('Selected ministries changed:', values);
                setSelectedGovernmentIds((values || []).filter(id => typeof id === 'string') as string[]);
              }}
              language={language}
              placeholder={language === 'dv' ? 'މިނިސްޓްރީތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select ministries'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'މައި ފޮޓޯ' : 'Cover Image'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImageBrowser(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-l hover:bg-blue-700"
                aria-label={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image'}
                title={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image'}
              >
                <ImageIcon size={20} />
              </button>
              <input
                type="text"
                value={coverImage}
                readOnly
                className="flex-1 rounded-r-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 cursor-not-allowed"
                placeholder="Select an image..."
              />
            </div>            <CollaborativeInput
              fieldId="imageCaption"
              value={imageCaption}
              onChange={setImageCaption}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              placeholder={language === 'dv' ? 'ފޮޓޯގެ ތަފްޞީލް' : 'Image caption'}
              className={`mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {coverImage && (
          <div className="mb-6 relative h-[200px] rounded-lg overflow-hidden">
            <img
              src={coverImage}
              alt={imageCaption}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Flags Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އާޓިކަލް އޮޕްޝަންސް' : 'Article Options'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isBreaking} 
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
                {language === 'dv' ? 'ބްރޭކިންގ ނިއުސް' : 'Breaking News'}
              </span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isFeatured} 
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
                {language === 'dv' ? 'ފީޗަރކުރޭ' : 'Featured'}
              </span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDeveloping} 
                onChange={(e) => setIsDeveloping(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
                {language === 'dv' ? 'ޑިވެލޮޕިންގް ސްޓޯރީ' : 'Developing Story'}
              </span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isExclusive} 
                onChange={(e) => setIsExclusive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
                {language === 'dv' ? 'އެކްސްކްލޫސިވް' : 'Exclusive'}
              </span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isSponsored} 
                onChange={(e) => setIsSponsored(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
                {language === 'dv' ? 'ސްޕޮންަރޑް' : 'Sponsored'}
              </span>            </label>
          </div>
            {/* Developing story date field */}
          {isDeveloping && (
            <div className="md:col-span-3">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ފަހުގެ އިވެންޓް ތާރީޚް' : 'Next Event Date'}
              </label>
              <input
                type="datetime-local"
                value={developingUntil}
                onChange={(e) => setDevelopingUntil(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                title={language === 'dv' ? 'ފަހުގެ އިވެންޓް ތާރީޚް' : 'Next Event Date'}
              />
            </div>
          )}
            {/* Sponsored content fields */}
          {isSponsored && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Sponsored By'}
                </label>                <CollaborativeInput
                  fieldId="sponsoredBy"
                  value={sponsoredBy}
                  onChange={setSponsoredBy}
                  collaborative={collaborative}
                  currentUser={user?.email || ''}
                  placeholder={language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Sponsor name'}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  dir={language === 'dv' ? 'rtl' : 'ltr'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ސްޕޮންސަރ ލިންކް' : 'Sponsor URL'}
                </label>                <CollaborativeInput
                  fieldId="sponsoredUrl"
                  value={sponsoredUrl}
                  onChange={setSponsoredUrl}
                  collaborative={collaborative}
                  currentUser={user?.email || ''}
                  placeholder="https://..."
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  type="url"
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ސްޕޮންސަރ ފޮޓޯ' : 'Sponsor Image'}
                </label>                <CollaborativeInput
                  fieldId="sponsoredImage"
                  value={sponsoredImage}
                  onChange={setSponsoredImage}
                  collaborative={collaborative}
                  currentUser={user?.email || ''}
                  placeholder={language === 'dv' ? 'ސްޕޮންސަރ ފޮޓޯ URL' : 'Sponsor image URL'}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>        {/* Article Metadata Section */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ލިޔުމުގެ މަޢުލޫމާތު' : 'Article Metadata'}
          </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނިއުސް ޢަމިއްޔަތް' : 'News Priority'}
              </label>
              <select
                value={newsPriority}
                onChange={(e) => setNewsPriority(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                title={language === 'dv' ? 'ނިއުސް ޢަމިއްޔަތް' : 'News Priority'}
              >
                <option value={1}>{language === 'dv' ? 'އެންމެ މުހިންމު' : 'High Priority'}</option>
                <option value={2}>{language === 'dv' ? 'މުހިންމު' : 'Medium Priority'}</option>
                <option value={3}>{language === 'dv' ? 'ސާދާ' : 'Normal Priority'}</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނިއުސް ސްރަޮތް' : 'News Type'}
              </label>              <select
                value={newsType}
                onChange={(e) => setNewsType(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                title={language === 'dv' ? 'ނިއުސް ސްރަޮތް' : 'News Type'}
              >
                <option value="">{language === 'dv' ? 'ސެލެކްޓް ކުރައްވާ' : 'Select type'}</option>
                <option value="news">{language === 'dv' ? 'ނިއުސް' : 'News'}</option>
                <option value="feature">{language === 'dv' ? 'ފީޗަރ' : 'Feature'}</option>
                <option value="opinion">{language === 'dv' ? 'ރޭ' : 'Opinion'}</option>
                <option value="analysis">{language === 'dv' ? 'ތަޙުލީލް' : 'Analysis'}</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނިއުސް ސޯސް' : 'News Source'}
              </label>
              <CollaborativeInput
                fieldId="newsSource"
                value={newsSource}
                onChange={setNewsSource}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'ނިއުސް ސޯސް' : 'News source'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ޓެގްސް' : 'Tags'}
              </label>
              <CollaborativeInput
                fieldId="tags"
                value={tags}
                onChange={setTags}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'ޓެގްސް ކޮމާ ބޭނުންކޮށް ވެއްގަނޑުކުރައްވާ' : 'Tags separated by commas'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
              <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ގުޅުންހުރި ލިޔުންތައް' : 'Related Articles'}
              </label>
              <CollaborativeInput
                fieldId="relatedArticles"
                value={relatedArticles}
                onChange={setRelatedArticles}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'ގުޅުންހުރި ލިޔުންތަކުގެ އައިޑީ ކޮމާ ބޭނުންކޮށް ވެއްގަނޑުކުރައްވާ' : 'Related article IDs separated by commas'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div></div>
        </div>

        {/* SEO Section */}
        <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'SEO މަޢުލޫމާތު' : 'SEO Information'}
          </h3>
          
          <div className="text-sm text-gray-600 mb-2">
            <p className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' 
                ? 'SEO މަޢުލޫމާތު އޮޓޯމެޓިކް ޖެނެރޭޓް ކުރެވޭ ލިޔުމުގެ ސުރުޚީ އަދި ހެޑިންގ އިން' 
                : 'SEO information will be automatically generated from the article title and heading'}
            </p>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އިތުރު މަޢުލޫމާތު' : 'Additional Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ލިޔުންތެރިގެ ނޯޓް' : 'Author Notes'}
              </label>
              <CollaborativeTextArea
                fieldId="authorNotes"
                value={authorNotes}
                onChange={setAuthorNotes}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'ލިޔުންތެރިގެ ނޯޓް' : 'Author notes'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
                rows={3}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އެޑިޓަރގެ ނޯޓް' : 'Editor Notes'}
              </label>
              <CollaborativeTextArea
                fieldId="editorNotes"
                value={editorNotes}
                onChange={setEditorNotes}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'އެޑިޓަރގެ ނޯޓް' : 'Editor notes'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
                rows={3}
              />            </div>
          </div>
        </div>

        {/* Collaboration Section */}
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އެކުގައި މަސައްކަތް ކުރުން' : 'Collaboration'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އެކުގައި މަސައްކަތް ކުރާ މީހުން' : 'Collaborators'}
              </label>
              <UserSelector
                selectedUserIds={collaboratorHook.selectedUserIds}
                onChange={collaboratorHook.handleCollaboratorsChange}
                language={language}
                placeholder={language === 'dv' ? 'މީހުން އިޚްތިޔާރު ކުރައްވާ' : 'Select collaborators'}
                currentUserId={user?.id}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އެކުގައި މަސައްކަތް ކުރުމުގެ ނޯޓް' : 'Collaboration Notes'}
              </label>
              <CollaborativeTextArea
                fieldId="collaborationNotes"
                value={collaborationNotes}
                onChange={setCollaborationNotes}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'އެކުގައި މަސައްކަތް ކުރުމުގެ ނޯޓް' : 'Collaboration notes'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
                rows={3}
              />
            </div>
          </div>
        </div>        {/* Editor Content */}        <EditorJSComponent
          data={editorData || undefined}
          onChange={setEditorData}
          placeholder="Start writing your article..."
        />
      </div><div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSaveDraft}
          disabled={saving || (collaborative.fieldLocks && Object.keys(collaborative.fieldLocks).length > 0)}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title={collaborative.fieldLocks && Object.keys(collaborative.fieldLocks).length > 0 
            ? (language === 'dv' ? 'ފީލްޑް ލޮކް ވެފައިވާތީ ސޭވް ކުރެވޭނެ ނޫން' : 'Cannot save due to locked fields')
            : undefined
          }
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'ޑްރާފްޓް ކުރައްވާ' : 'Save as Draft'}
          </span>
        </button>
        
        <button
          onClick={handleSendToReview}
          disabled={sendingToReview}
          className="px-6 py-2 rounded-lg border border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendingToReview ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Eye size={18} />
          )}
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'ރިވިއުއަށް ފޮނުވާ' : 'Send to Review'}
          </span>
        </button>
        
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="px-6 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'ޝާއިޢު ކުރައްވާ' : 'Publish'}
          </span>
        </button>
      </div>

      <ImageBrowser
        isOpen={showImageBrowser}
        onClose={() => setShowImageBrowser(false)}
        onSelect={handleImageSelect}
        language={language}
      />
    </div>
  );
};

export default NewArticle;
