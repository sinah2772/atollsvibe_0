// Post validation utilities

interface FormData {
  content?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  visibility?: string;
  tags?: string[];
  location?: string;
  mediaFiles?: File[];
  [key: string]: unknown;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validatePost = (formData: FormData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Content validation
  const content = formData.content || '';
  if (!content.trim()) {
    errors.push('Content is required');
  } else if (content.length < 10) {
    warnings.push('Content is quite short');
  } else if (content.length > 2000) {
    warnings.push('Content is very long and may be truncated');
  }

  // Scheduled post validation
  if (formData.scheduledDate) {
    const scheduledDate = new Date(`${formData.scheduledDate}T${formData.scheduledTime || '12:00'}`);
    const now = new Date();
    
    if (scheduledDate <= now) {
      errors.push('Scheduled time must be in the future');
    }
  }

  // Media validation
  if (formData.mediaFiles && formData.mediaFiles.length > 10) {
    warnings.push('Many media files selected - upload may take longer');
  }

  // Tags validation
  if (formData.tags && formData.tags.length > 10) {
    warnings.push('Many tags selected - consider reducing for better reach');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
