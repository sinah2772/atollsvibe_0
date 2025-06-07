import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import './ArticleMultiStepForm.css';
import { useUser } from '../hooks/useUser';
import { useCategories } from '../hooks/useCategories';
import { useAtolls } from '../hooks/useAtolls';
import { useGovernment } from '../hooks/useGovernment';
import { useArticles, Article } from '../hooks/useArticles';
import { useCollaborativeArticle } from '../hooks/useCollaborativeArticle';
import { useCollaborators } from '../hooks/useCollaborators';
import { StepProps } from '../types/editor';
import { ChevronLeft, ChevronRight, Check, Clock, FileText, Sparkles, Users, X } from 'lucide-react';
import AuthorCollab from './AuthorCollab';
import { CollaboratorSelector } from './CollaboratorSelector';
import './ArticleMultiStepForm.css';

// Import StepProps from types/editor.ts instead of defining locally

// Define the form data structure
interface FormDataType {
  articleIdentity: {
    title: string;
    headingThaana: string;
    socialHeading: string;
  };
  mediaVisuals: {
    coverImage: File | string | null;
    imageCaption: string;
  };
  classification: {
    categories: string[];
    subcategories: string[];
    atoll: string;
    ministry: string;
  };
  articleOptions: {
    breakingNews: boolean;
    featured: boolean;
    developingStory: boolean;
    exclusive: boolean;
    sponsored: boolean;
    sponsoredBy: string;
    sponsoredUrl: string;
    developingUntil: string;
    sponsoredImage: string;
  };
  metadata: {
    newsType: string;
    newsPriority: number;
    newsSource: string;
    tags: string[];
    tagsInput: string;
    relatedArticles: string[];
  };
  seoNotes: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    authorNotes: string;
    editorNotes: string;
  };
  translation: {
    originalSourceUrl: string;
    translationSourceUrl: string;
    translationSourceLanguage: string;
    translationNotes: string;
  };
  content: {
    mainContent: string;
    submissionStatus: string;
  };
  [key: string]: unknown;
}

// Type for step configuration
interface StepType {
  id: string;
  title: string;
  description: string;
  component: React.LazyExoticComponent<React.ComponentType<StepProps>>;
}

// Step Components
const ArticleIdentityStep = React.lazy(() => import('./steps/ArticleIdentityStep'));
const MediaVisualsStep = React.lazy(() => import('./steps/MediaVisualsStep'));
const ClassificationStep = React.lazy(() => import('./steps/ClassificationStep'));
const ArticleOptionsStep = React.lazy(() => import('./steps/ArticleOptionsStep'));
const MetadataStep = React.lazy(() => import('./steps/MetadataStep'));
const SeoNotesStep = React.lazy(() => import('./steps/SeoNotesStep'));
const TranslationStep = React.lazy(() => import('./steps/TranslationStep'));
const ContentSubmissionStep = React.lazy(() => import('./steps/ContentSubmissionStep'));
const ArticleReviewStep = React.lazy(() => import('./steps/ArticleReviewStep'));

// Define Steps
const steps: StepType[] = [
  {
    id: 'identity',
    title: 'Article Identity',
    description: 'Basic information about the article',
    component: ArticleIdentityStep
  },
  {
    id: 'media',
    title: 'Media & Visuals',
    description: 'Upload images and add captions',
    component: MediaVisualsStep
  },
  {
    id: 'classification',
    title: 'Classification',
    description: 'Categorize the article',
    component: ClassificationStep
  },
  {
    id: 'options',
    title: 'Article Options',
    description: 'Set article attributes',
    component: ArticleOptionsStep
  },
  {
    id: 'metadata',
    title: 'Metadata',
    description: 'Add additional information',
    component: MetadataStep
  },
  {
    id: 'seo',
    title: 'SEO & Notes',
    description: 'Search engine optimization',
    component: SeoNotesStep
  },
  {
    id: 'translation',
    title: 'Translation',
    description: 'Translation information',
    component: TranslationStep
  },
  {
    id: 'content',
    title: 'Content & Submission',
    description: 'Write your article and submit',
    component: ContentSubmissionStep
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review and finalize',
    component: ArticleReviewStep
  }
];

const ArticleMultiStepForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { createArticle } = useArticles();
  const { categories } = useCategories();
  const { atolls } = useAtolls();
  const { government } = useGovernment();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId] = useState(() => `new_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Collaboration hooks
  const collaboratorHook = useCollaborators(sessionId);
  const collaborative = useCollaborativeArticle({
    sessionId,
    articleId: undefined, // No article ID for new articles
  });
  
  const [formData, setFormData] = useState<FormDataType>({
    articleIdentity: {
      title: '',
      headingThaana: '',
      socialHeading: ''
    },
    mediaVisuals: {
      coverImage: null,
      imageCaption: ''
    },
    classification: {
      categories: [] as string[],
      subcategories: [] as string[],
      atoll: '',
      ministry: ''
    },
    articleOptions: {
      breakingNews: false,
      featured: false,
      developingStory: false,
      exclusive: false,
      sponsored: false,
      sponsoredBy: '',
      sponsoredUrl: '',
      developingUntil: '',
      sponsoredImage: ''
    },
    metadata: {
      newsType: '',
      newsPriority: 3,
      newsSource: '',
      tags: [] as string[],
      tagsInput: '',
      relatedArticles: [] as string[]
    },
    seoNotes: {
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      authorNotes: '',
      editorNotes: ''
    },
    translation: {
      originalSourceUrl: '',
      translationSourceUrl: '',
      translationSourceLanguage: '',
      translationNotes: ''
    },
    content: {
      mainContent: '',
      submissionStatus: ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en'|'dv'>('dv');
  const [showCollaborationPopup, setShowCollaborationPopup] = useState<boolean>(false);
  
  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
    ],
    content: formData.content.mainContent,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[300px] ${language === 'dv' ? 'thaana-waheed' : ''}`,
      },
    }
  });  const updateFormData = (section: string, data: Record<string, unknown>): void => {
    const stepId = steps[currentStep].id;
    
    setFormData(prev => {
      // Map flat data from step components back to nested structure
      switch (stepId) {
        case 'identity': {
          return {
            ...prev,
            articleIdentity: {
              ...prev.articleIdentity,
              title: (data.title as string) || prev.articleIdentity.title,
              headingThaana: (data.heading as string) || prev.articleIdentity.headingThaana,
              socialHeading: (data.socialHeading as string) || prev.articleIdentity.socialHeading
            }
          };
        }
        case 'media': {
          return {
            ...prev,
            mediaVisuals: {
              ...prev.mediaVisuals,
              coverImage: data.coverImage !== undefined ? (data.coverImage as string | File | null) : prev.mediaVisuals.coverImage,
              imageCaption: (data.imageCaption as string) || prev.mediaVisuals.imageCaption
            }
          };
        }
        case 'classification': {
          return {
            ...prev,
            classification: {
              ...prev.classification,
              categories: (data.categories as string[]) || prev.classification.categories,
              subcategories: (data.subcategories as string[]) || prev.classification.subcategories,
              atoll: (data.atoll as string) || prev.classification.atoll,
              ministry: (data.ministry as string) || prev.classification.ministry
            }
          };
        }
        case 'options': {
          return {
            ...prev,
            articleOptions: {
              ...prev.articleOptions,
              ...data
            }
          };
        }
        case 'metadata': {
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              ...data
            }
          };
        }
        case 'seo': {
          return {
            ...prev,
            seoNotes: {
              ...prev.seoNotes,
              ...data
            }
          };
        }
        case 'translation': {
          return {
            ...prev,
            translation: {
              ...prev.translation,
              ...data
            }
          };
        }
        case 'content': {
          return {
            ...prev,
            content: {
              ...prev.content,
              ...data
            }
          };
        }
        default: {
          // Fallback to original behavior for unknown steps
          const sectionData = prev[section as keyof FormDataType];
          return {
            ...prev,
            [section]: {
              ...(sectionData as Record<string, unknown>),
              ...data
            }
          };
        }
      }
    });
    
    // Clear section errors when user updates data
    const sectionErrors = Object.keys(errors).filter(key => key.startsWith(section));
    if (sectionErrors.length > 0) {
      const newErrors = { ...errors };
      sectionErrors.forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };const validateStep = (stepIndex: number): boolean => {
    const stepErrors: Record<string, string> = {};
    
    switch (stepIndex) {
      case 0: // Article Identity
        if (!formData.articleIdentity.title.trim()) {
          stepErrors['articleIdentity.title'] = 'Title is required';
        }
        if (!formData.articleIdentity.headingThaana.trim()) {
          stepErrors['articleIdentity.headingThaana'] = 'Heading in Thaana is required';
        }
        break;
        
      case 1: // Media Visuals
        if (!formData.mediaVisuals.coverImage) {
          stepErrors['mediaVisuals.coverImage'] = 'Cover image is required';
        }
        break;
        
      case 2: // Classification
        if (!formData.classification.categories || formData.classification.categories.length === 0) {
          stepErrors['classification.categories'] = 'Please select at least one category';
        }
        break;
        
      case 7: // Content Submission
        if (!formData.content.mainContent.trim() && !editor?.getHTML()) {
          stepErrors['content.mainContent'] = 'Article content is required';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Function to get flattened data for current step
  const getCurrentStepData = () => {
    const stepId = steps[currentStep].id;
    
    switch (stepId) {
      case 'identity':
        return {
          title: formData.articleIdentity.title,
          heading: formData.articleIdentity.headingThaana,
          socialHeading: formData.articleIdentity.socialHeading
        };
      case 'media':
        return {
          coverImage: formData.mediaVisuals.coverImage,
          imageCaption: formData.mediaVisuals.imageCaption
        };
      case 'classification':
        return {
          categories: formData.classification.categories,
          subcategories: formData.classification.subcategories,
          atoll: formData.classification.atoll,
          ministry: formData.classification.ministry
        };
      case 'options':
        return formData.articleOptions;
      case 'metadata':
        return formData.metadata;
      case 'seo':
        return formData.seoNotes;
      case 'translation':
        return formData.translation;
      case 'content':
        return formData.content;
      case 'review':
        return formData; // Review step needs access to all data
      default:
        return {};
    }
  };
  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex: number): void => {
    // Only allow going to completed steps or the next step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const onEdit = (stepIndex: number): void => {
    setCurrentStep(stepIndex);
  };
  const handleSubmit = async (): Promise<void> => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      // Prepare data for API submission
      const submissionStatus = formData.content.submissionStatus || 'draft';
      
      // Format the form data for submission
      const newArticle = {
        title: formData.articleIdentity.title,
        heading: formData.articleIdentity.headingThaana,
        social_heading: formData.articleIdentity.socialHeading,
        content: editor ? editor.getJSON() : { content: formData.content.mainContent },
        category_id: formData.classification.categories.length > 0 ? 
          parseInt(formData.classification.categories[0]) : null,
        subcategory_id: formData.classification.subcategories.length > 0 ? 
          parseInt(formData.classification.subcategories[0]) : null,
        atoll_ids: formData.classification.atoll ? [parseInt(formData.classification.atoll)] : [],
        government_ids: formData.classification.ministry ? [formData.classification.ministry] : [],
        cover_image: formData.mediaVisuals.coverImage,
        image_caption: formData.mediaVisuals.imageCaption,
        status: submissionStatus === 'publish' ? 'published' : 
                submissionStatus === 'review' ? 'review' : 'draft',
        publish_date: submissionStatus === 'publish' ? new Date().toISOString() : null,
        user_id: user.id,
        
        // Article flag fields
        is_breaking: formData.articleOptions.breakingNews,
        is_featured: formData.articleOptions.featured,
        is_developing: formData.articleOptions.developingStory,
        is_exclusive: formData.articleOptions.exclusive,
        is_sponsored: formData.articleOptions.sponsored,
        sponsored_by: formData.articleOptions.sponsored ? formData.articleOptions.sponsoredBy : null,
        sponsored_url: formData.articleOptions.sponsored ? formData.articleOptions.sponsoredUrl : null,
        
        // Additional metadata fields
        news_type: formData.metadata.newsType || null,
        news_priority: formData.metadata.newsPriority,
        news_source: formData.metadata.newsSource || null,
        tags: formData.metadata.tags,
        author_notes: formData.seoNotes.authorNotes || null,
        editor_notes: formData.seoNotes.editorNotes || null,
        
        // Translation fields
        original_source_url: formData.translation.originalSourceUrl || null,
        translation_source_url: formData.translation.translationSourceUrl || null,
        translation_source_lang: formData.translation.translationSourceLanguage || null,
        translation_notes: formData.translation.translationNotes || null,
        
        // Enhanced features
        developing_until: formData.articleOptions.developingStory && formData.articleOptions.developingUntil ? 
          new Date(formData.articleOptions.developingUntil).toISOString() : null,
        sponsored_image: formData.articleOptions.sponsored ? formData.articleOptions.sponsoredImage : null,
        collaborators: collaboratorHook.getCollaboratorsString() || null,
        meta_title: formData.seoNotes.seoTitle || null,
        meta_description: formData.seoNotes.seoDescription || null,
        seo_keywords: formData.seoNotes.seoKeywords || null,
      };      // Submit to API
      if (createArticle) {
        // Add required missing properties to meet the API requirements
        const completeArticle = {
          ...newArticle,
          island_ids: [], // Required array property
          island_category: null, // Required property
          ideas: null, // Required property
          next_event_date: null, // Required property
          keywords: formData.seoNotes.seoKeywords ? formData.seoNotes.seoKeywords.split(',').map(k => k.trim()) : [],
          meta_keywords: formData.seoNotes.seoKeywords ? formData.seoNotes.seoKeywords.split(',').map(k => k.trim()) : [],
          publish_location: null,
          video_url: null,
          related_articles: formData.metadata.relatedArticles || [],
          live_stream_url: null,
          appointment_date: null,
          event_location: null,
          event_details: null,
          work_scope: null,
          budget: null,
          live: submissionStatus === 'publish',
          // Required Article properties from the API type
          collaboration_notes: null,
          fact_checked: false,
          fact_checker_id: null,
          fact_checked_at: null,
          approved_by_id: null,
          approved_at: null,
          published_by_id: null,
          last_updated_by_id: null,
          revision_history: null,
          scheduled_notifications: null,
          notification_sent: false,
          notification_sent_at: null,
          moderation_notes: null,
          moderation_status: 'pending',
          pinned: false,
          contributor_type: 'staff'
        } as Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments'>;
        
        await createArticle(completeArticle);
      } else {
        console.error("createArticle function is not available");
        throw new Error("Article creation functionality is not available");
      }
      
      let message;
      switch (submissionStatus) {
        case 'publish':
          message = language === 'dv' ? 'ލިޔުން ޝާޢިއުކުރެވިއްޖެ!' : 'Article has been published successfully!';
          break;
        case 'review':
          message = language === 'dv' ? 'ލިޔުން ރިވިއުއަށް ފޮނުވިއްޖެ!' : 'Article has been sent for review!';
          break;
        default:
          message = language === 'dv' ? 'ލިޔުން ޑްރާފްޓް ކުރެވިއްޖެ!' : 'Article has been saved as draft!';
      }
      
      alert(message);
      navigate('/articles');
      
    } catch (error) {
      console.error('Error submitting article:', error);
      const errorMessage = language === 'dv' 
        ? 'ލިޔުން ޝާއިއުކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ. އަލުން މަސައްކަތްކުރޭ.'
        : 'Error submitting article. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const isStepCompleted = (stepIndex: number): boolean => {
    return stepIndex < currentStep;
  };

  const isStepActive = (stepIndex: number): boolean => {
    return stepIndex === currentStep;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const CurrentStepComponent = steps[currentStep].component;
  
  // Handle different footer buttons based on which step we're on
  const isLastStep = currentStep === steps.length - 1;
  const isContentStep = currentStep === 7; // Content & Submission step
  
  // Show both next button and submission buttons on the content step
  const showNextOnContentStep = formData.content?.submissionStatus && currentStep === 7;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-150"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg mb-6">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އާ ލިޔުމެއް އުފައްދާ' : 'Create New Article'}
            </h1>
          </div>
          
          <p className={`text-gray-600 text-lg max-w-2xl mx-auto ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ފޯމް ފުރިހަމަކޮށް ލިޔުން ހުށަހަޅާ' : 'Complete the form to publish your story to the world'}
          </p>

          {/* Options Bar - Language and Collaboration */}
          <div className="flex justify-center items-center gap-3 mt-6">            {/* Collaborators Button */}
            <button
              type="button"
              onClick={() => setShowCollaborationPopup(true)}
              className="collaboration-button flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors shadow-md relative"
              title={language === 'dv' ? 'އެއްބަސްވުން' : 'Collaboration'}
            >
              <Users size={20} />
              {collaborative.activeUsers.length > 0 && (
                <span className="collaboration-badge absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {collaborative.activeUsers.length}
                </span>
              )}
            </button>
            
            {/* Language Selector - Modern floating style */}
            <div className="inline-flex items-center p-1 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('dv')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 thaana-waheed ${
                  language === 'dv'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                ދިވެހި
              </button>
            </div>
          </div>
        </div>

        {/* Modern Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />              <span className={`text-sm font-medium text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' 
                  ? `ފިޔަވަހި ${getArabicNumerals(currentStep + 1)} / ${getArabicNumerals(steps.length)}` 
                  : `Step ${currentStep + 1} of ${steps.length}`}
              </span>
            </div>            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden progress-bar">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out progress-fill"
                  data-progress={Math.round(progress)}
                ></div>
              </div>
              <span className="text-sm font-semibold text-blue-600 min-w-[3rem]">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Step Navigation - Modern floating pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const isCompleted = isStepCompleted(index);
              const isActive = isStepActive(index);
              const isClickable = index <= currentStep + 1;
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => isClickable && goToStep(index)}
                    disabled={!isClickable}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border backdrop-blur-sm min-w-max ${
                      isCompleted
                        ? 'bg-green-500/20 border-green-400/30 text-green-700 hover:bg-green-500/30'
                        : isActive
                        ? 'bg-blue-500/20 border-blue-400/30 text-blue-700 shadow-lg hover:bg-blue-500/30'
                        : isClickable
                        ? 'bg-white/20 border-white/30 text-gray-600 hover:bg-white/40'
                        : 'bg-gray-100/20 border-gray-200/30 text-gray-400 cursor-not-allowed'
                    }`}
                    title={step.title}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 text-white scale-110'
                        : 'bg-white/50 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                        {language === 'dv' ? translateStepTitle(step.title) : step.title}
                      </p>
                      <p className={`text-xs opacity-75 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                        {language === 'dv' ? translateStepDescription(step.description) : step.description}
                      </p>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Modern Form Card with Glassmorphism */}
        <div className="bg-white/40 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl p-8 md:p-12">
          {/* Step Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full mb-4">
              <FileText className="w-5 h-5 text-blue-600" />              <h2 className={`text-xl font-bold text-gray-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' 
                  ? translateStepTitle(steps[currentStep].title) 
                  : steps[currentStep].title}
              </h2>
            </div>            <p className={`text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' 
                ? translateStepDescription(steps[currentStep].description)
                : steps[currentStep].description}
            </p>
          </div>

          {/* Step Content with smooth transitions */}
          <div className="mb-10 min-h-[400px]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading step...</span>
                </div>
              </div>
            }>
              <div className="animate-fade-in">
                <CurrentStepComponent
                  formData={getCurrentStepData()}
                  onFormDataChange={(data: Partial<Record<string, unknown>>) => {
                    const section = steps[currentStep].id;
                    updateFormData(section, data as Record<string, unknown>);
                  }}
                  errors={errors}
                  onEdit={currentStep === steps.length - 1 ? onEdit : undefined}
                  language={language}
                  editor={editor}
                  categories={categories as unknown as Array<Record<string, unknown>>}
                  atolls={atolls as unknown as Array<Record<string, unknown>>}
                  government={government as unknown as Array<Record<string, unknown>>}
                  collaborative={collaborative}
                  updateFormData={updateFormData}
                />
              </div>
            </Suspense>
          </div>

          {/* Modern Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-white/20">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                  : 'bg-white/30 text-gray-700 hover:bg-white/50 backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl hover:scale-105'
              } ${language === 'dv' ? 'thaana-waheed' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'dv' ? 'ފަހަތަށް' : 'Previous'}</span>
            </button>

            <div className="flex items-center gap-4">
              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{language === 'dv' ? 'ހުށަހަޅަނީ...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{language === 'dv' ? 'ހުށަހަޅާ' : 'Publish Article'}</span>
                    </>
                  )}
                </button>
              ) : showNextOnContentStep ? (
                <button
                  onClick={nextStep}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  <span>{language === 'dv' ? 'ކުރިއަށް' : 'Continue'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : !isContentStep ? (
                <button
                  onClick={nextStep}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  <span>{language === 'dv' ? 'ކުރިއަށް' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>        {/* Modern Footer */}        <div className="text-center mt-12 p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
          <p className={`text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' 
              ? 'ޝާއިޢުކުރުމުގެ ޝަރުތުތަކާ އެއްގޮތްވާ ގޮތަށް ލިޔުން ރިވިއުކުރެވޭނެއެވެ.'
              : 'Your article will be reviewed before publication according to our publishing guidelines.'}
          </p>
        </div>
      </div>
      
      {/* Collaboration Popup */}
      {showCollaborationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className={`text-lg font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އެއްބަސްވުން' : 'Collaboration'}
              </h3>
              <button
                onClick={() => setShowCollaborationPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title={language === 'dv' ? 'ބަންދުކުރާ' : 'Close'}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Article Collaborators */}
            <div className="mb-4">
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އެއްބަސްވުމުގެ ބައިވެރިން' : 'Collaborators'}
              </label>
              <div className="mb-3">
                <CollaboratorSelector
                  collaborators={collaboratorHook.selectedUserIds}
                  onChange={collaboratorHook.handleCollaboratorsChange}
                  language={language}
                  placeholder={language === 'dv' ? 'އީމެއިލް އިތުރުކުރައްވާ' : 'Add collaborator email'}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {language === 'dv' ? 'އެއްބަސްވުމުގެ ބައިވެރިންގެ އީމެއިލް އެޑްރެސް އިތުރުކުރައްވާ' : 'Enter email addresses of collaborators'}
                </p>
              </div>
              <AuthorCollab 
                activeUsers={collaborative.activeUsers}
                collaboratorEmails={collaboratorHook.selectedUserIds}
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCollaborationPopup(false)}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${language === 'dv' ? 'thaana-waheed' : ''}`}
              >
                {language === 'dv' ? 'ނިމުނީ' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to convert English numerals to Arabic numerals for Dhivehi language
function getArabicNumerals(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map((digit: string) => arabicNumerals[parseInt(digit)]).join('');
}

// Helper function to translate step titles to Dhivehi
function translateStepTitle(title: string): string {
  const translations: Record<string, string> = {
    'Article Identity': 'ލިޔުމުގެ މަޢުލޫމާތު',
    'Media & Visuals': 'މީޑިއާ އަދި ފޮޓޯތައް',
    'Classification': 'ގިންތިކުރުން',
    'Article Options': 'ލިޔުމުގެ އޮޕްޝަންތައް',
    'Metadata': 'މެޓަޑޭޓާ',
    'SEO & Notes': 'އެސްއީއޯ އަދި ނޯޓްތައް',
    'Translation': 'ތަރުޖަމާ',
    'Content & Submission': 'ލިޔުން އަދި ހުށަހެޅުން',
    'Review & Submit': 'ރިވިއުކޮށް ހުށަހެޅުން'
  };
  return translations[title] || title;
}

// Helper function to translate step descriptions to Dhivehi
function translateStepDescription(description: string): string {
  const translations: Record<string, string> = {
    'Basic information about the article': 'ލިޔުމުގެ އަސާސީ މަޢުލޫމާތު',
    'Upload images and add captions': 'ފޮޓޯ އަޕްލޯޑްކޮށް ކެޕްޝަން އިތުރުކުރޭ',
    'Categorize the article': 'ލިޔުން ގިންތިކުރޭ',
    'Set article attributes': 'ލިޔުމުގެ ސިފަތައް ކަނޑައަޅާ',
    'Add additional information': 'އިތުރު މަޢުލޫމާތު އިތުރުކުރޭ',
    'Search engine optimization': 'ސާޗް އިންޖިން އޮޕްޓިމައިޒޭޝަން',
    'Translation information': 'ތަރުޖަމާގެ މަޢުލޫމާތު',
    'Write your article and submit': 'ލިޔުން ލިޔެ ހުށަހަޅާ',
    'Review and finalize': 'ރިވިއުކޮށް ނިންމާ'
  };
  return translations[description] || description;
}

export default ArticleMultiStepForm;
