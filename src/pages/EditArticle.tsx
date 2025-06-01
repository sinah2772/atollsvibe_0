import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
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
import { IslandsSelect } from '../components/IslandsSelect';
import { CollaborativeInput } from '../components/CollaborativeInput';
import { CollaborativeTextArea } from '../components/CollaborativeTextArea';
import { CollaborativePresence } from '../components/CollaborativePresence';
import { AutoSaveStatus } from '../components/AutoSaveStatus';
import ImageBrowser from '../components/ImageBrowser';
import { supabase } from '../lib/supabase';
import { 
  Image as ImageIcon,
  Save,
  Send,
  Eye,
  Languages,
  Loader2,
  ArrowLeft,
  X
} from 'lucide-react';

const EditArticle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { articles, updateArticle } = useArticles();
  const { categories } = useCategories();
  const { atolls } = useAtolls();
  const { user, loading: userLoading } = useUser();
  const { government, error: governmentError, useFallbackData: useGovernmentFallbackData } = useGovernment();
  
  // Generate session ID for collaborative editing
  const [sessionId] = useState(() => `edit_session_${id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Collaboration hooks
  const collaboratorHook = useCollaborators(sessionId);
  const collaborative = useCollaborativeArticle({
    sessionId,
    articleId: id,
  });
  
  // Basic article fields
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Article flag states
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsoredBy, setSponsoredBy] = useState('');
  const [sponsoredUrl, setSponsoredUrl] = useState('');
  
  // Enhanced features from NewArticle
  const [islandCategory, setIslandCategory] = useState<string[]>([]);
  const [developingUntil, setDevelopingUntil] = useState<string>('');
  const [sponsoredImage, setSponsoredImage] = useState<string>('');
  const [selectedIslandCategory, setSelectedIslandCategory] = useState<string[]>([]);
  const [newsPriority, setNewsPriority] = useState<number>(3);
  const [relatedArticles, setRelatedArticles] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [authorNotes, setAuthorNotes] = useState<string>('');
  const [editorNotes, setEditorNotes] = useState<string>('');
  const [collaborationNotes, setCollaborationNotes] = useState<string>('');
  const [newsType, setNewsType] = useState<string>('');
  const [newsSource, setNewsSource] = useState<string>('');
  const [originalSourceUrl, setOriginalSourceUrl] = useState<string>('');
  const [translationSourceUrl, setTranslationSourceUrl] = useState<string>('');
  const [translationSourceLang, setTranslationSourceLang] = useState<string>('');
  const [translationNotes, setTranslationNotes] = useState<string>('');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
    ],
    content: {},
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[300px] ${language === 'dv' ? 'thaana-waheed' : ''}`,
      },
    },
  });

  // Prepare data for auto-save
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
    sponsoredUrl,
    islandCategory,
    developingUntil,
    sponsoredImage,
    selectedIslandCategory,
    newsPriority,
    relatedArticles,
    tags,
    authorNotes,
    editorNotes,
    collaborationNotes,
    newsType,
    newsSource,
    originalSourceUrl,
    translationSourceUrl,
    translationSourceLang,
    translationNotes,
    content: editor?.getHTML() || '',
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
    if (!id || !editor) return;

    const article = articles.find(a => a.id === id);
    if (article) {
      setTitle(article.title);
      setHeading(article.heading);
      setSocialHeading(article.social_heading || '');
      setCategory(article.category_id ? [article.category_id.toString()] : []);
      setSubcategory(article.subcategory_id ? [article.subcategory_id.toString()] : []);
      setSelectedAtolls(article.atoll_ids || []);
      setSelectedIslands(article.island_ids || []);
      setSelectedGovernmentIds(article.government_ids || []);
      setCoverImage(article.cover_image || '');
      setImageCaption(article.image_caption || '');
      
      // Set article flag states
      setIsBreaking(article.is_breaking || false);
      setIsFeatured(article.is_featured || false);
      setIsDeveloping(article.is_developing || false);
      setIsExclusive(article.is_exclusive || false);
      setIsSponsored(article.is_sponsored || false);
      setSponsoredBy(article.sponsored_by || '');
      setSponsoredUrl(article.sponsored_url || '');
        // Set enhanced features
      setIslandCategory(
        article.island_category 
          ? (typeof article.island_category === 'string' 
              ? article.island_category.split(',') 
              : Array.isArray(article.island_category) 
                ? article.island_category 
                : [])
          : []
      );
      setDevelopingUntil(article.developing_until ? new Date(article.developing_until).toISOString().slice(0, 16) : '');
      setSponsoredImage(article.sponsored_image || '');
      setNewsPriority(article.news_priority || 3);
      setRelatedArticles(article.related_articles ? article.related_articles.join(',') : '');
      setTags(article.tags ? article.tags.join(',') : '');
      setAuthorNotes(article.author_notes || '');
      setEditorNotes(article.editor_notes || '');
      setCollaborationNotes(article.collaboration_notes || '');
      setNewsType(article.news_type || '');
      setNewsSource(article.news_source || '');
      setOriginalSourceUrl(article.original_source_url || '');
      setTranslationSourceUrl(article.translation_source_url || '');
      setTranslationSourceLang(article.translation_source_lang || '');
      setTranslationNotes(article.translation_notes || '');
      
      editor.commands.setContent(article.content);
      setLoading(false);
    }
  }, [id, articles, editor]);
  const validateForm = () => {
    if (!user) {
      alert(language === 'dv' ? 'އެކައުންޓަށް ވަދެވަޑައިގަންނަވާ' : 'Please log in to continue');
      return false;
    }
    
    // Check field locks for collaboration
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
    if (selectedAtolls.length === 0) {
      alert(language === 'dv' ? 'އަތޮޅެއް އިޚްތިޔާރު ކުރައްވާ' : 'Please select at least one atoll');
      return false;
    }    
    if (!category || category.length === 0) {
      alert(language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Please select a category');
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

  const handleSaveDraft = async () => {
    if (!editor || !id) return;
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }      await updateArticle(id, {
        title,
        heading,
        social_heading: socialHeading,
        content: editor.getJSON(),
        category_id: parseInt(category[0]),
        subcategory_id: subcategory.length > 0 ? parseInt(subcategory[0]) : null,
        atoll_ids: selectedAtolls,
        island_ids: selectedIslands,
        government_ids: selectedGovernmentIds,
        cover_image: coverImage,
        image_caption: imageCaption,
        status: 'draft',
        user_id: user.id,
        // Include article flag fields
        is_breaking: isBreaking,
        is_featured: isFeatured,
        is_developing: isDeveloping,
        is_exclusive: isExclusive,
        is_sponsored: isSponsored,
        sponsored_by: isSponsored ? sponsoredBy : undefined,
        sponsored_url: isSponsored ? sponsoredUrl : undefined
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to save draft:', error);
      setError('Failed to save draft. Please try again.');
      alert('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!editor || !id) return;
    if (!validateForm()) return;
    
    try {
      setPublishing(true);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }      await updateArticle(id, {
        title,
        heading,
        social_heading: socialHeading,
        content: editor.getJSON(),
        category_id: parseInt(category[0]),
        subcategory_id: subcategory.length > 0 ? parseInt(subcategory[0]) : null,
        atoll_ids: selectedAtolls,
        island_ids: selectedIslands,
        government_ids: selectedGovernmentIds,
        cover_image: coverImage,
        image_caption: imageCaption,
        status: 'published',
        publish_date: new Date().toISOString(),
        user_id: user.id,
        // Include article flag fields
        is_breaking: isBreaking,
        is_featured: isFeatured,
        is_developing: isDeveloping,
        is_exclusive: isExclusive,
        is_sponsored: isSponsored,
        sponsored_by: isSponsored ? sponsoredBy : undefined,
        sponsored_url: isSponsored ? sponsoredUrl : undefined
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to publish:', error);
      setError('Failed to publish. Please try again.');
      alert('Failed to publish. Please try again.');    } finally {
      setPublishing(false);
    }
  };

  const handleSendToReview = async () => {
    if (!editor || !id) return;
    if (!validateForm()) return;
    
    try {
      setSendingToReview(true);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      await updateArticle(id, {
        title,
        heading,        social_heading: socialHeading,
        content: editor.getJSON(),
        category_id: parseInt(category[0]),
        subcategory_id: subcategory.length > 0 ? parseInt(subcategory[0]) : null,
        atoll_ids: selectedAtolls,
        island_ids: selectedIslands,
        government_ids: selectedGovernmentIds,
        cover_image: coverImage,
        image_caption: imageCaption,
        status: 'review',
        publish_date: null,
        user_id: user.id,
        // Include article flag fields
        is_breaking: isBreaking,
        is_featured: isFeatured,
        is_developing: isDeveloping,
        is_exclusive: isExclusive,
        is_sponsored: isSponsored,
        sponsored_by: isSponsored ? sponsoredBy : undefined,
        sponsored_url: isSponsored ? sponsoredUrl : undefined
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to send to review:', error);
      setError(language === 'dv' ? 'ރިވިއުއަށް ފޮނުވުމުގައި މަްސަލައެއް ދިމާވެއްޖެ' : 'Failed to send to review. Please try again.');
      alert(language === 'dv' ? 'ރިވިއުއަށް ފޮނުވުމުގައި މަްސަލައެއް ދިމާވެއްޖެ' : 'Failed to send to review. Please try again.');
    } finally {
      setSendingToReview(false);
    }  };

  const handleImageSelect = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageBrowser(false);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'dv' ? 'en' : 'dv');
    if (editor) {
      editor.setEditable(false);
      editor.setEditable(true);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'އަނބުރާ' : 'Back'}
            </span>
          </button>
          <div>
            <h1 className={`text-2xl font-bold text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ލިޔުން އެޑިޓްކުރައްވާ' : 'Edit Article'}
            </h1>
            <p className={`text-gray-600 mt-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ލިޔުމަށް ބޭނުންވާ ބަދަލުތައް ގެންނަވާ' : 'Make changes to your article'}
            </p>
          </div>
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
      </div>      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">        {/* Collaborative Presence Indicator */}
        <div className="mb-4">          <CollaborativePresence 
            activeUsers={collaborative.activeUsers}
            isConnected={collaborative.isConnected}
          />
          <AutoSaveStatus 
            lastSaveTime={lastAutoSave}
            isSaving={isAutoSaving}
            language={language}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސުރުޚީ (ލެޓިން)' : 'Title (Latin)'}
            </label>            <CollaborativeInput
              fieldId="title"
              value={title}
              onChange={setTitle}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ލެޓިން އަކުރުން ސުރުޚީ ލިޔުއްވާ' : 'Enter title in Latin'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސުރުޚީ (ދިވެހި)' : 'Heading (Thaana)'}
            </label>            <CollaborativeInput
              fieldId="heading"
              value={heading}
              onChange={setHeading}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ދިވެހިން ސުރުޚީ ލިޔުއްވާ' : 'Enter heading in Thaana'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ' : 'Social Heading'}
            </label>            <CollaborativeInput
              fieldId="socialHeading"
              value={socialHeading}
              onChange={setSocialHeading}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ ލިޔުއްވާ' : 'Enter social media heading'}
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
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އަތޮޅުތައް' : 'Atolls'}
            </label>
            <MultiSelect
              options={atolls || []}
              value={selectedAtolls}
              onChange={(values) => setSelectedAtolls(values.filter(id => typeof id === 'number') as number[])}
              language={language}
              placeholder={language === 'dv' ? 'އަތޮޅުތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select atolls'}
            />
          </div>          {selectedAtolls.length > 0 && (
            <>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ރަށުގެ ބަި ފިލްޓަރ' : 'Island Category Filter'}
                </label>
                <MultiSelect
                  options={[
                    { id: 'residential', name: language === 'dv' ? 'އާބާދީ' : 'Residential', name_en: 'Residential' },
                    { id: 'resort', name: language === 'dv' ? 'ރިސޯޓް' : 'Resort', name_en: 'Resort' },
                    { id: 'airport', name: language === 'dv' ? 'އެއަރޕޯޓް' : 'Airport', name_en: 'Airport' },
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
          )}

          {selectedIslands && selectedIslands.length > 0 && (
            <div className="md:col-span-2">              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ރަށުގެ ބައި' : 'Island Category'}
              </label>
              <MultiSelect
                options={[
                  { id: 'residential', name: language === 'dv' ? 'އާބާދީ' : 'Residential', name_en: 'Residential' },
                  { id: 'resort', name: language === 'dv' ? 'ރިސޯޓް' : 'Resort', name_en: 'Resort' },
                  { id: 'airport', name: language === 'dv' ? 'އެއަރޕޯޓް' : 'Airport', name_en: 'Airport' },
                  { id: 'industrial', name: language === 'dv' ? 'ސިނާޢީ' : 'Industrial', name_en: 'Industrial' },
                  { id: 'agricultural', name: language === 'dv' ? 'ދަނޑުވެރިކަން' : 'Agricultural', name_en: 'Agricultural' },
                  { id: 'uninhabited', name: language === 'dv' ? 'އާބާދީ ނެތް' : 'Uninhabited', name_en: 'Uninhabited' }
                ]}
                value={islandCategory || []}
                onChange={(values) => {
                  console.log('Selected island category changed:', values);
                  setIslandCategory((values || []).filter(id => typeof id === 'string') as string[]);                }}
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
                id: item.id, // Use original UUID string
                name: item.name,
                name_en: item.name_en
              }))}
              value={selectedGovernmentIds}
              onChange={(values) => {
                console.log('Selected ministries changed:', values);
                setSelectedGovernmentIds(values.filter(id => typeof id === 'string') as string[]);
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
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                aria-label={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image'}
                title={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image'}
              >
                <ImageIcon size={20} />
              </button>
              {coverImage && (
                <div className="flex-1 text-sm text-gray-500 py-1 px-2">
                  Image selected
                </div>
              )}
            </div>            <CollaborativeInput
              fieldId="imageCaption"
              value={imageCaption}
              onChange={setImageCaption}
              collaborative={collaborative}
              currentUser={user?.email || ''}
              className={`mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ފޮޓޯގެ ތަފްޞީލް' : 'Image caption'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {coverImage && (
          <div className="mb-6 relative h-[200px] rounded-lg overflow-hidden group">
            <img
              src={coverImage}
              alt={imageCaption}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={language === 'dv' ? 'ފޮޓޯ ނައްތާލާ' : 'Remove image'}
              title={language === 'dv' ? 'ފޮޓޯ ނައްތާލާ' : 'Remove image'}
            >
              <X size={16} />
            </button>
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
                {language === 'dv' ? 'ސްޕޮންސަރޑް' : 'Sponsored'}
              </span>
            </label>
          </div>
            {/* Sponsored content fields - only show if sponsored is checked */}
          {isSponsored && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Sponsored By'}
                </label>                <CollaborativeInput
                  fieldId="sponsoredBy"
                  value={sponsoredBy}
                  onChange={setSponsoredBy}
                  collaborative={collaborative}
                  currentUser={user?.email || ''}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Sponsor name'}
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
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>          )}
          
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
        </div>        {/* Island Category Filter Section */}
        {selectedAtolls.length > 0 && (
          <>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ރަށުގެ ބަި ފިލްޓަރ' : 'Island Category Filter'}
              </label>
              <MultiSelect
                options={[
                  { id: 'residential', name: language === 'dv' ? 'އާބާދީ' : 'Residential', name_en: 'Residential' },
                  { id: 'resort', name: language === 'dv' ? 'ރިސޯޓް' : 'Resort', name_en: 'Resort' },
                  { id: 'airport', name: language === 'dv' ? 'އެއަރޕޯޓް' : 'Airport', name_en: 'Airport' },
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
                {language === 'dv' ? 'ރަށްައްތައް' : 'Islands'}
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
        )}        {selectedIslands && selectedIslands.length > 0 && (
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ރަށުގެ ބައި' : 'Island Category'}
            </label>
            <MultiSelect
              options={[
                { id: 'residential', name: language === 'dv' ? 'އާބާދީ' : 'Residential', name_en: 'Residential' },
                { id: 'resort', name: language === 'dv' ? 'ރިސޯޓް' : 'Resort', name_en: 'Resort' },
                { id: 'airport', name: language === 'dv' ? 'އެއަރޕޯޓް' : 'Airport', name_en: 'Airport' },
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
        
        {/* Article Metadata Section */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ލިޔުމުގެ މަޢުލޫމާތު' : 'Article Metadata'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނިއުސް ބައި' : 'News Type'}
              </label>              <select
                value={newsType}
                onChange={(e) => setNewsType(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
                title={language === 'dv' ? 'ނިއުސް ބައި އިޚްތިޔާރު ކުރައްވާ' : 'Select news type'}
              >
                <option value="">{language === 'dv' ? 'ނިއުސް ބައި އިޚްތިޔާރު ކުރައްވާ' : 'Select news type'}</option>
                <option value="update">{language === 'dv' ? 'އަޕްޑޭޓް' : 'Update'}</option>
                <option value="breaking">{language === 'dv' ? 'ބްރޭކިންގ' : 'Breaking'}</option>
                <option value="feature">{language === 'dv' ? 'ފީޗަރ' : 'Feature'}</option>
                <option value="opinion">{language === 'dv' ? 'ރައުޔު' : 'Opinion'}</option>
                <option value="interview">{language === 'dv' ? 'އިންޓަވިއު' : 'Interview'}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނިއުސް އިސްކަން' : 'News Priority'}
              </label>              <select
                value={newsPriority}
                onChange={(e) => setNewsPriority(parseInt(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
                title={language === 'dv' ? 'ނިއުސް އިސްކަން އިޚްތިޔާރު ކުރައްވާ' : 'Select news priority'}
              >
                <option value={1}>{language === 'dv' ? '1 - އެންމެ މުހިންމު' : '1 - Critical'}</option>
                <option value={2}>{language === 'dv' ? '2 - މުހިންމު' : '2 - High'}</option>
                <option value={3}>{language === 'dv' ? '3 - މެދު' : '3 - Medium'}</option>
                <option value={4}>{language === 'dv' ? '4 - ދެން' : '4 - Low'}</option>
                <option value={5}>{language === 'dv' ? '5 - އާދައިގެ' : '5 - Normal'}</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
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
          
          <div className="grid grid-cols-1 gap-4">
            <div>
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
            </div>
          </div>
        </div>

        {/* SEO Information Section */}
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
              />
            </div>
          </div>
        </div>

        {/* Collaboration Section */}
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އެއްބަސްވުން' : 'Collaboration'}
          </h3>
          
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އެއްބަސްވުމުގެ ނޯޓް' : 'Collaboration Notes'}
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

        {/* Translation Information Section */}
        <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ތަރުޖަމާ މަޢުލޫމާތު' : 'Translation Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އަސްލު ސޯސް URL' : 'Original Source URL'}
              </label>
              <CollaborativeInput
                fieldId="originalSourceUrl"
                value={originalSourceUrl}
                onChange={setOriginalSourceUrl}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder="https://..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ތަރުޖަމާ ސޯސް URL' : 'Translation Source URL'}
              </label>
              <CollaborativeInput
                fieldId="translationSourceUrl"
                value={translationSourceUrl}
                onChange={setTranslationSourceUrl}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder="https://..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ތަރުޖަމާ ސޯސް ބަސް' : 'Translation Source Language'}
              </label>
              <CollaborativeInput
                fieldId="translationSourceLang"
                value={translationSourceLang}
                onChange={setTranslationSourceLang}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'މިސާލު: en, ar, hi' : 'e.g., en, ar, hi'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ތަރުޖަމާ ނޯޓް' : 'Translation Notes'}
              </label>
              <CollaborativeInput
                fieldId="translationNotes"
                value={translationNotes}
                onChange={setTranslationNotes}
                collaborative={collaborative}
                currentUser={user?.email || ''}
                placeholder={language === 'dv' ? 'ތަރުޖަމާ ނޯޓް' : 'Translation notes'}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className={`text-lg font-medium mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މަޟްމޫން' : 'Content'}
        </h3>
        <div className="relative">
          {collaborative.isFieldLocked('content') && (
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center rounded-lg">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">
                  Content is being edited by {collaborative.getFieldLocker('content')}
                </p>
              </div>
            </div>
          )}
          <EditorContent
            editor={editor}
            className="prose prose-lg max-w-none min-h-96 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EditArticle;