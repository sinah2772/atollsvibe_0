import React from 'react';
import { StepProps } from '../../types/editor';
import { CollaborativeInput } from '../CollaborativeInput';
import { CollaborativeTextArea } from '../CollaborativeTextArea';

interface CollaborativeInterface {
  isFieldLocked: (fieldId: string) => boolean;
  lockField: (fieldId: string) => void;
  unlockField: (fieldId: string) => void;
  broadcastFieldUpdate: (fieldId: string, value: string) => void;
  getFieldLocker: (fieldId: string) => string | null;
  pendingUpdates: Record<string, string>;
}

const SeoNotesStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language,
  collaborative
}) => {
  // Type guard and fallback for collaborative
  const collaborativeInterface = collaborative as CollaborativeInterface | undefined;
  const safeCollaborative: CollaborativeInterface = collaborativeInterface || {
    isFieldLocked: () => false,
    lockField: () => {},
    unlockField: () => {},
    broadcastFieldUpdate: () => {},
    getFieldLocker: () => null,
    pendingUpdates: {}
  };
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'SEO ސުރުޚީ' : 'SEO Title'}
        </label>        <CollaborativeInput
          fieldId="seoTitle"
          value={formData.seoTitle as string || ''}
          onChange={(value) => handleChange('seoTitle', value)}
          placeholder={language === 'dv' ? 'ސާރޗް އިންޖިންތަކަށް އޮޕްޓިމައިޒްކުރެވިފައިވާ ސުރުޚީ' : 'SEO-optimized title'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          collaborative={safeCollaborative}
          currentUser={''}
        />
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ހުސްކޮށް ބަހައްޓައިފިނަމަ މައި ސުރުޚީ ބޭނުންކުރެވޭނެ' : 'Leave blank to use the main title'}
        </p>
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'SEO ތަފްޞީލް' : 'SEO Description'}
        </label>        <CollaborativeTextArea
          fieldId="seoDescription"
          value={formData.seoDescription as string || ''}
          onChange={(value) => handleChange('seoDescription', value)}
          placeholder={language === 'dv' ? 'ސާރޗް ރިޒަލްޓްތަކުގައި ދައްކާނެ ކުރު ތަފްޞީލެއް' : 'Short description for search results'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          collaborative={safeCollaborative}
          currentUser={''}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          rows={3}
        />
        <p className={`mt-1 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އިންޑެކްސިންގއަށް އެންމެ އެކަށީގެންވާ ގޮތަށް ލިޔުމެއް ތައްޔާރުކުރޭ' : 'Write a description optimized for indexing'}
        </p>
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'SEO ކީވާޑްސް' : 'SEO Keywords'}
        </label>        <CollaborativeInput
          fieldId="seoKeywords"
          value={formData.seoKeywords as string || ''}
          onChange={(value) => handleChange('seoKeywords', value)}
          placeholder={language === 'dv' ? 'ކޮމާއިން ވަކިކޮށް ކީވާޑްތައް ލިޔޭ' : 'Keywords separated by commas'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          collaborative={safeCollaborative}
          currentUser={''}
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އޯތަރގެ ނޯޓްސް' : 'Author Notes'}
        </label>        <CollaborativeTextArea
          fieldId="authorNotes"
          value={formData.authorNotes as string || ''}
          onChange={(value) => handleChange('authorNotes', value)}
          placeholder={language === 'dv' ? 'ލިޔުއްވި ފަރާތުގެ އިތުރު ނޯޓްސް' : 'Additional notes from the author'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          collaborative={safeCollaborative}
          currentUser={''}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'އެޑިޓަރގެ ނޯޓްސް' : 'Editor Notes'}
        </label>        <CollaborativeTextArea
          fieldId="editorNotes"
          value={formData.editorNotes as string || ''}
          onChange={(value) => handleChange('editorNotes', value)}
          placeholder={language === 'dv' ? 'އެޑިޓަރުގެ އިތުރު ނޯޓްސް' : 'Additional notes for editors'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          collaborative={safeCollaborative}
          currentUser={''}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          rows={3}
        />
      </div>
    </div>
  );
};

export default SeoNotesStep;
