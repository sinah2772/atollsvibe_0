import { Editor } from '@tiptap/react';
import { ValidationField } from '../../types/editor';

export const validateBasicInfo = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];
  // Title validation
  validationFields.push({
    field: 'title',
    valid: Boolean(data.title && typeof data.title === 'string' && data.title.trim() !== ''),
    message: (data.language === 'dv' ? 'ސުރުޚީ ލާޒިމް' : 'Title is required')
  });

  // Heading validation
  validationFields.push({
    field: 'heading',
    valid: Boolean(data.heading && typeof data.heading === 'string' && data.heading.trim() !== ''),
    message: (data.language === 'dv' ? 'ސުރުޚި ލާޒިމް' : 'Heading is required')
  });

  // Category validation
  validationFields.push({
    field: 'category',
    valid: Boolean(data.category && Array.isArray(data.category) && data.category.length > 0),
    message: (data.language === 'dv' ? 'ބައެއް ހޮއްވަވާ' : 'At least one category is required')
  });

  // Content validation
  const editor = data.editor as Editor | undefined;
  const hasContent = Boolean(editor && editor.getHTML() !== '<p></p>' && editor.getText().trim() !== '');
  validationFields.push({
    field: 'content',
    valid: hasContent,
    message: (data.language === 'dv' ? 'ލިޔުން ލާޒިމް' : 'Content is required')
  });

  return validationFields;
};
