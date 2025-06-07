import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { useUser } from '../hooks/useUser';
import { useCategories } from '../hooks/useCategories';
import { useAtolls } from '../hooks/useAtolls';
import { useGovernment } from '../hooks/useGovernment';
import { useArticles } from '../hooks/useArticles';
import { useCollaborativeArticle } from '../hooks/useCollaborativeArticle';
import { useCollaborators } from '../hooks/useCollaborators';
import { StepProps } from '../types/editor';

// Define the form data structure
interface FormDataType {
  articleIdentity: {
    title: string;
    headingThaana: string;
    socialHeading: string;
  };
  mediaVisuals: {
    coverImage: File | null;
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
}

// Type for step configuration
interface StepType {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<StepProps>;
}

// Step Components
import ArticleIdentityStep from './steps/ArticleIdentityStep';
import MediaVisualsStep from './steps/MediaVisualsStep';
import ClassificationStep from './steps/ClassificationStep';
import ArticleOptionsStep from './steps/ArticleOptionsStep';
import MetadataStep from './steps/MetadataStep';
import SeoNotesStep from './steps/SeoNotesStep';
import TranslationStep from './steps/TranslationStep';
import ContentSubmissionStep from './steps/ContentSubmissionStep';
import ArticleReviewStep from './steps/ArticleReviewStep';

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
  });
  const updateFormData = (section: string, data: Record<string, unknown>): void => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormDataType],
        ...data
      }
    }));
    
    // Clear section errors when user updates data
    const sectionErrors = Object.keys(errors).filter(key => key.startsWith(section));
    if (sectionErrors.length > 0) {
      const newErrors = { ...errors };
      sectionErrors.forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const validateStep = (stepIndex: number): boolean => {
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
        content: editor ? editor.getJSON() : { content: formData.content.mainContent },        category_id: formData.classification.categories.length > 0 ? 
          parseInt(formData.classification.categories[0]) : 1, // Default to category 1 if none selected
        subcategory_id: formData.classification.subcategories.length > 0 ? 
          parseInt(formData.classification.subcategories[0]) : null,
        atoll_ids: formData.classification.atoll ? [parseInt(formData.classification.atoll)] : [],
        island_ids: [], // Default empty array - to be populated if needed
        government_ids: formData.classification.ministry ? [formData.classification.ministry] : [],
        cover_image: formData.mediaVisuals.coverImage ? 
          (typeof formData.mediaVisuals.coverImage === 'string' ? 
            formData.mediaVisuals.coverImage : null) : null,
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
        
        // Additional required fields from Article interface
        island_category: null,
        developing_until: formData.articleOptions.developingStory && formData.articleOptions.developingUntil ? 
          new Date(formData.articleOptions.developingUntil).toISOString() : null,
        ideas: null,
        sponsored_image: formData.articleOptions.sponsored ? formData.articleOptions.sponsoredImage : null,
        next_event_date: null,
        collaborators: collaboratorHook.getCollaboratorsString() || null,
        collaboration_notes: null,
        
        // Metadata fields
        news_type: formData.metadata.newsType || null,
        news_priority: formData.metadata.newsPriority,
        news_source: formData.metadata.newsSource || null,
        meta_title: formData.seoNotes.seoTitle || null,
        meta_description: formData.seoNotes.seoDescription || null,
        meta_keywords: formData.seoNotes.seoKeywords ? [formData.seoNotes.seoKeywords] : null,
        related_articles: formData.metadata.relatedArticles || null,
        tags: formData.metadata.tags || null,
        
        // Editorial workflow fields
        author_notes: formData.seoNotes.authorNotes || null,
        editor_notes: formData.seoNotes.editorNotes || null,
        fact_checked: null,
        fact_checker_id: null,
        fact_checked_at: null,
        approved_by_id: null,
        approved_at: null,
        published_by_id: null,
        last_updated_by_id: null,
        
        // Translation fields
        original_source_url: formData.translation.originalSourceUrl || null,
        translation_source_url: formData.translation.translationSourceUrl || null,
        translation_source_lang: formData.translation.translationSourceLanguage || null,
        translation_notes: formData.translation.translationNotes || null,
        
        // System fields
        revision_history: null,
        scheduled_notifications: null,
        notification_sent: null,
        notification_sent_at: null,
      };

      // Submit to API
      if (createArticle) {
        await createArticle(newArticle);
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
    <div className="form-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <h1 className={`form-title ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އާ ލިޔުމެއް އުފައްދާ' : 'Article Submission Form'}
          </h1>
          <p className={`form-subtitle ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ފޯމް ފުރިހަމަކޮށް ލިޔުން ހުށަހަޅާ' : 'Complete the form to submit your article'}
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-4 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                language === 'en'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('dv')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg thaana-waheed ${
                language === 'dv'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              ދިވެހި
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-info">
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' 
                ? `ފިޔަވަހި ${currentStep + 1} / ${steps.length}` 
                : `Step ${currentStep + 1} of ${steps.length}`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>          <div className="progress-bar">
            <div 
              className="progress-fill"
              data-progress={Math.round(progress)}
            ></div>
          </div>
        </div>

        {/* Step Navigation for larger screens */}
        <div className="step-nav hidden md:flex">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className="step-connector">
                <button
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep + 1}
                  className={`step-button ${
                    isStepCompleted(index)
                      ? 'completed'
                      : isStepActive(index)
                      ? 'active'
                      : index <= currentStep + 1
                      ? 'inactive'
                      : 'disabled'
                  }`}
                  aria-label={step.title}
                >
                  {isStepCompleted(index) ? (
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`step-line ${isStepCompleted(index) ? 'completed' : ''}`} />
                )}
              </div>
              <div className={`step-title ${isStepActive(index) ? 'active' : ''} ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? getArabicNumerals(index + 1) : (index + 1)}. {step.title}
              </div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="form-card">
          {/* Step Header */}
          <div className="step-header">
            <h2 className={`step-title-main ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' 
                ? translateStepTitle(steps[currentStep].title) 
                : steps[currentStep].title}
            </h2>
            <p className={`step-description ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' 
                ? translateStepDescription(steps[currentStep].description)
                : steps[currentStep].description}
            </p>
          </div>          {/* Step Content */}
          <div className="mb-8">
            <CurrentStepComponent
              formData={formData as unknown as Record<string, unknown>}
              onFormDataChange={(data) => {
                const section = steps[currentStep].id;
                updateFormData(section, data);
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

          {/* Navigation Buttons */}
          <div className="btn-nav">            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`btn ${currentStep === 0 ? 'btn-secondary opacity-50' : 'btn-secondary'}`}
            >
              <svg className="icon mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? 'ފަހަތަށް' : 'Previous'}
              </span>
            </button>

            {isLastStep ? (              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`btn btn-primary ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner mr-2"></div>
                    <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                      {language === 'dv' ? 'ހުށަހަޅަނީ...' : 'Submitting...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                      {language === 'dv' ? 'ހުށަހަޅާ' : 'Submit'}
                    </span>
                    <svg className="icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            ) : showNextOnContentStep ? (
              <button
                onClick={nextStep}
                className="btn btn-primary"
              >
                <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                  {language === 'dv' ? 'ކުރިއަށް' : 'Next'}
                </span>
                <svg className="icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : !isContentStep ? (
              <button
                onClick={nextStep}
                className="btn btn-primary"
              >
                <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                  {language === 'dv' ? 'ކުރިއަށް' : 'Next'}
                </span>
                <svg className="icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' 
              ? 'ޝާއިޢުކުރުމުގެ ޝަރުތުތަކާ އެއްގޮތްވާ ގޮތަށް ލިޔުން ރިވިއުކުރެވޭނެއެވެ.' 
              : 'Your article will be reviewed for compliance with our publishing guidelines before it goes live.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert English numerals to Arabic numerals for Dhivehi language
function getArabicNumerals(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map((digit) => arabicNumerals[parseInt(digit)]).join('');
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
