import { BasicInfoStepNew } from './steps/BasicInfoStepNew';
import { LocationAndFlagsStepNew } from './steps/LocationAndFlagsStepNew';
import { SEOAndMetadataStepNew } from './steps/SEOAndMetadataStepNew';
import { AdditionalInfoStepNew } from './steps/AdditionalInfoStepNew';
import { CollaborationStepNew } from './steps/CollaborationStepNew';
import { ReviewAndPublishStepNew } from './steps/ReviewAndPublishStepNew';
import { 
  validateBasicInfo,
  validateLocationAndFlags,
  validateSEOAndMetadata,
  validateAdditionalInfo,
  validateCollaboration,
  validateReviewAndPublish
} from './steps/stepValidations';
import { ValidationField, StepProps } from '../types/editor';

export interface Step {
  id: string;
  component: React.ComponentType<StepProps>;
  validate: (formData: Record<string, unknown>) => ValidationField[];
  title: {
    en: string;
    dv: string;
  };
  description: {
    en: string;
    dv: string;
  };
  icon?: string;
  optional?: boolean;
}

export const steps: Step[] = [
  {
    id: 'basic-info',
    component: BasicInfoStepNew,
    validate: validateBasicInfo,
    title: {
      en: 'Basic Information',
      dv: 'އާދައިގެ މައުލޫމާތު'
    },
    description: {
      en: 'Enter article title, content, and basic details',
      dv: 'ލިޔުމުގެ ނަން، ކޮންޓެންޓް، އަދި އާދައިގެ ތަފްސީލު'
    },
    icon: 'FileText'
  },
  {
    id: 'location-flags',
    component: LocationAndFlagsStepNew,
    validate: validateLocationAndFlags,
    title: {
      en: 'Location & Flags',
      dv: 'ތަން އަދި ފްލެގްތައް'
    },
    description: {
      en: 'Set location, article flags, and priority',
      dv: 'ތަން، ލިޔުމުގެ ފްލެގްތައް، އަދި އިސްކަން ތަކުން'
    },
    icon: 'MapPin'
  },
  {
    id: 'seo-metadata',
    component: SEOAndMetadataStepNew,
    validate: validateSEOAndMetadata,
    title: {
      en: 'SEO & Metadata',
      dv: 'ސީއީއޯ އަދި މެޓާޑޭޓާ'
    },
    description: {
      en: 'Optimize for search engines and social media',
      dv: 'ސަރޗް އިންޖިނާއި ސޯޝަލް މީޑިއާއަށް އޮޕްޓިމައިޒް ކުރުން'
    },
    icon: 'Globe'
  },
  {
    id: 'additional-info',
    component: AdditionalInfoStepNew,
    validate: validateAdditionalInfo,
    title: {
      en: 'Additional Information',
      dv: 'އިތުރު މައުލޫމާތު'
    },
    description: {
      en: 'Add sources, notes, and supplementary information',
      dv: 'ސޯސް، ނޯޓްސް، އަދި އިތުރު މައުލޫމާތު'
    },
    icon: 'Info',
    optional: true
  },
  {
    id: 'collaboration',
    component: CollaborationStepNew,
    validate: validateCollaboration,
    title: {
      en: 'Collaboration & Workflow',
      dv: 'ކޮލަބޮރޭޝަން އަދި ވޯކްފްލޯ'
    },
    description: {
      en: 'Manage team collaboration and publishing schedule',
      dv: 'ޓީމް ކޮލަބޮރޭޝަން އަދި ޕަބްލިޝް ޝެޑިއުލް'
    },
    icon: 'Users',
    optional: true
  },
  {
    id: 'review-publish',
    component: ReviewAndPublishStepNew,
    validate: validateReviewAndPublish,
    title: {
      en: 'Review & Publish',
      dv: 'ރިވިއު އަދި ޕަބްލިޝް'
    },
    description: {
      en: 'Review your article and publish',
      dv: 'ލިޔުން ރިވިއު ކޮށް ޕަބްލިޝް ކުރުން'
    },
    icon: 'Send'
  }
];

// Helper function to get step by ID
export const getStepById = (stepId: string): Step | undefined => {
  return steps.find(step => step.id === stepId);
};

// Helper function to get next step
export const getNextStep = (currentStepId: string): Step | undefined => {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  if (currentIndex >= 0 && currentIndex < steps.length - 1) {
    return steps[currentIndex + 1];
  }
  return undefined;
};

// Helper function to get previous step
export const getPreviousStep = (currentStepId: string): Step | undefined => {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  if (currentIndex > 0) {
    return steps[currentIndex - 1];
  }
  return undefined;
};

// Helper function to check if step is completed
export const isStepCompleted = (stepId: string, formData: Record<string, unknown>): boolean => {
  const step = getStepById(stepId);
  if (!step) return false;
  
  const errors = step.validate(formData);
  return errors.length === 0;
};

// Helper function to get completion status for all steps
export const getStepsCompletionStatus = (formData: Record<string, unknown>): Record<string, boolean> => {
  const status: Record<string, boolean> = {};
  
  steps.forEach(step => {
    status[step.id] = isStepCompleted(step.id, formData);
  });
  
  return status;
};

// Helper function to calculate overall progress
export const calculateProgress = (formData: Record<string, unknown>): number => {
  const completionStatus = getStepsCompletionStatus(formData);
  const completedCount = Object.values(completionStatus).filter(Boolean).length;
  const totalCount = steps.length;
  
  return Math.round((completedCount / totalCount) * 100);
};

// Helper function to get validation errors for all steps
export const getAllValidationErrors = (formData: Record<string, unknown>): Record<string, ValidationField[]> => {
  const errors: Record<string, ValidationField[]> = {};
  
  steps.forEach(step => {
    const stepErrors = step.validate(formData);
    if (stepErrors.length > 0) {
      errors[step.id] = stepErrors;
    }
  });
  
  return errors;
};

// Helper function to check if form is ready for publishing
export const isReadyForPublishing = (formData: Record<string, unknown>): boolean => {
  const requiredSteps = steps.filter(step => !step.optional);
  return requiredSteps.every(step => isStepCompleted(step.id, formData));
};
