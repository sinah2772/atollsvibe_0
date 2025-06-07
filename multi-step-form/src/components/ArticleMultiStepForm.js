// ArticleMultiStepForm.js
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from './Icons';

// Import Step Components
import ArticleIdentityStep from '../steps/ArticleIdentityStep';
import MediaVisualsStep from '../steps/MediaVisualsStep';
import ClassificationStep from '../steps/ClassificationStep';
import ArticleOptionsStep from '../steps/ArticleOptionsStep';
import MetadataStep from '../steps/MetadataStep';
import SeoNotesStep from '../steps/SeoNotesStep';
import TranslationStep from '../steps/TranslationStep';
import ContentSubmissionStep from '../steps/ContentSubmissionStep';
import ArticleReviewStep from '../steps/ArticleReviewStep';

// Define Steps
const steps = [
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

const ArticleMultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
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
      categories: [],
      subcategories: [],
      atoll: '',
      ministry: ''
    },
    articleOptions: {
      breakingNews: false,
      featured: false,
      developingStory: false,
      exclusive: false,
      sponsored: false
    },
    metadata: {
      newsType: '',
      newsPriority: '',
      newsSource: '',
      tags: [],
      tagsInput: '',
      relatedArticles: []
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
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
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

  const validateStep = (stepIndex) => {
    const stepErrors = {};
    
    switch (stepIndex) {
      case 0: // Article Identity
        if (!formData.articleIdentity.title.trim()) {
          stepErrors.title = 'Title is required';
        }
        if (!formData.articleIdentity.headingThaana.trim()) {
          stepErrors.headingThaana = 'Heading in Thaana is required';
        }
        break;
        
      case 1: // Media Visuals
        if (!formData.mediaVisuals.coverImage) {
          stepErrors.coverImage = 'Cover image is required';
        }
        break;
        
      case 2: // Classification
        if (!formData.classification.categories || formData.classification.categories.length === 0) {
          stepErrors.categories = 'Please select at least one category';
        }
        break;
        
      case 7: // Content Submission
        if (!formData.content.mainContent.trim()) {
          stepErrors.mainContent = 'Article content is required';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex) => {
    // Only allow going to completed steps or the next step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const onEdit = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submissionStatus = formData.content.submissionStatus || 'draft';
      
      let message;
      switch (submissionStatus) {
        case 'publish':
          message = 'Article has been published successfully!';
          break;
        case 'review':
          message = 'Article has been sent for review!';
          break;
        default:
          message = 'Article has been saved as draft!';
      }
      
      alert(message);
      console.log('Form Data:', formData);
      
      // Reset form or redirect
      // setCurrentStep(0);
      // setFormData({...initialFormData});
      
    } catch (error) {
      alert('Error submitting article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepCompleted = (stepIndex) => {
    return stepIndex < currentStep;
  };

  const isStepActive = (stepIndex) => {
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
          <h1 className="form-title">Article Submission Form</h1>
          <p className="form-subtitle">Complete the form to submit your article</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-info">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="step-nav">
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
                >
                  {isStepCompleted(index) ? (
                    <CheckIcon className="icon-sm" />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`step-line ${isStepCompleted(index) ? 'completed' : ''}`} />
                )}
              </div>
              <div className={`step-title ${isStepActive(index) ? 'active' : ''}`}>
                {step.title}
              </div>
            </div>
          ))}
        </div>        {/* Form Card */}
        <div className="glass-card">
          {/* Step Header */}
          <div className="step-header">
            <h2 className="step-title-main">
              {steps[currentStep].title}
            </h2>
            <p className="step-description">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onEdit={currentStep === steps.length - 1 ? onEdit : undefined}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="btn-nav">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`glass-button ${currentStep === 0 ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
            >
              <ChevronLeftIcon className="icon mr-2" />
              Previous
            </button>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="glass-button btn-primary"
                style={{ opacity: isSubmitting ? 0.5 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <CheckIcon className="icon ml-2" />
                  </>
                )}
              </button>
            ) : showNextOnContentStep ? (
              <button
                onClick={nextStep}
                className="glass-button btn-primary"
              >
                Next
                <ChevronRightIcon className="icon ml-2" />
              </button>
            ) : !isContentStep ? (
              <button
                onClick={nextStep}
                className="glass-button btn-primary"
              >
                Next
                <ChevronRightIcon className="icon ml-2" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          <p>Your article will be reviewed for compliance with our publishing guidelines before it goes live.</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleMultiStepForm;
