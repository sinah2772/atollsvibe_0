import { ValidationField } from '../../types/editor';

export const validateBasicInfo = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  
  // Title validation
  if (!data.title || (typeof data.title === 'string' && data.title.trim() === '')) {
    validationFields.push({
      field: 'title',
      valid: false,
      message: 'Title is required'
    });
  } else {
    validationFields.push({
      field: 'title',
      valid: true,
      message: ''
    });
  }

  // Content validation
  if (!data.content || (typeof data.content === 'string' && data.content.trim() === '')) {
    validationFields.push({
      field: 'content',
      valid: false,
      message: 'Content is required'
    });
  } else {
    validationFields.push({
      field: 'content',
      valid: true,
      message: ''
    });
  }

  // Category validation
  if (!data.category) {
    validationFields.push({
      field: 'category',
      valid: false,
      message: 'Category is required'
    });
  } else {
    validationFields.push({
      field: 'category',
      valid: true,
      message: ''
    });
  }

  return validationFields;
};

export const validateLocationAndFlags = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  
  // Location validation (optional for this step)
  validationFields.push({
    field: 'location',
    valid: true,
    message: ''
  });

  // Priority validation
  if (!data.priority) {
    validationFields.push({
      field: 'priority',
      valid: false,
      message: 'Priority is required'
    });
  } else {
    validationFields.push({
      field: 'priority',
      valid: true,
      message: ''
    });
  }

  return validationFields;
};

export const validateSEOAndMetadata = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  
  // Meta title validation
  if (!data.metaTitle || (typeof data.metaTitle === 'string' && data.metaTitle.trim() === '')) {
    validationFields.push({
      field: 'metaTitle',
      valid: false,
      message: 'Meta title is required for SEO'
    });
  } else {
    validationFields.push({
      field: 'metaTitle',
      valid: true,
      message: ''
    });
  }

  // Meta description validation
  if (!data.metaDescription || (typeof data.metaDescription === 'string' && data.metaDescription.trim() === '')) {
    validationFields.push({
      field: 'metaDescription',
      valid: false,
      message: 'Meta description is required for SEO'
    });
  } else {
    validationFields.push({
      field: 'metaDescription',
      valid: true,
      message: ''
    });
  }

  // Slug validation
  if (!data.slug || (typeof data.slug === 'string' && data.slug.trim() === '')) {
    validationFields.push({
      field: 'slug',
      valid: false,
      message: 'URL slug is required'
    });
  } else {
    validationFields.push({
      field: 'slug',
      valid: true,
      message: ''
    });
  }

  return validationFields;
};

export const validateAdditionalInfo = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  
  // All fields in this step are optional - data parameter kept for interface consistency
  void data; // Explicitly mark parameter as intentionally unused
  
  validationFields.push({
    field: 'additionalInfo',
    valid: true,
    message: ''
  });

  return validationFields;
};

export const validateCollaboration = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  
  // All fields in this step are optional - data parameter kept for interface consistency
  void data; // Explicitly mark parameter as intentionally unused
  
  validationFields.push({
    field: 'collaboration',
    valid: true,
    message: ''
  });

  return validationFields;
};

export const validateReviewAndPublish = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  
  // Status validation
  if (!data.status) {
    validationFields.push({
      field: 'status',
      valid: false,
      message: 'Publication status is required'
    });
  } else {
    validationFields.push({
      field: 'status',
      valid: true,
      message: ''
    });
  }

  // Visibility validation
  if (!data.visibility) {
    validationFields.push({
      field: 'visibility',
      valid: false,
      message: 'Visibility setting is required'
    });
  } else {
    validationFields.push({
      field: 'visibility',
      valid: true,
      message: ''
    });
  }

  return validationFields;
};
