import React from 'react';
import { StepProps } from '../../types/editor';
import { EditorContent } from '@tiptap/react';
import { Save, Eye, Send } from 'lucide-react';

const ContentSubmissionStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language,
  editor,
  collaborative
}) => {
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };
  
  const handleStatusChange = (status: string) => {
    handleChange('submissionStatus', status);
  };

  return (
    <div className="space-y-6">
      <div className="form-group">
        <label className={`block text-lg font-medium text-gray-800 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ލިޔުމުގެ މައިގަނޑު' : 'Article Content'}
        </label>
        
        <div className="relative">
          {collaborative?.isFieldLocked && collaborative.isFieldLocked('content') && (
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center rounded-lg">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p className={`text-sm text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' 
                    ? `މަޢުލޫމާތު ${collaborative.getFieldLocker('content')} ވަނީ އެޑިޓްކުރައްވަމުންނެވެ` 
                    : `Content is being edited by ${collaborative.getFieldLocker('content')}`}
                </p>
              </div>
            </div>
          )}
          
          <div className={`prose prose-lg max-w-none min-h-[400px] border border-gray-300 rounded-lg p-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {editor ? (
              <EditorContent editor={editor} className="min-h-[400px] focus:outline-none" />
            ) : (
              <textarea 
                value={formData.content as string || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full h-[400px] p-0 border-0 focus:outline-none focus:ring-0"
                placeholder={language === 'dv' ? 'ލިޔުމުގެ މައިގަނޑު ބައި މިތަނަށް ލިޔޭ...' : 'Write your article content here...'}
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            )}
          </div>
        </div>
        
        <p className={`mt-2 text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ލިޔުމުގެ މައިގަނޑު ބައި މިތަނަށް ލިޔޭ' : 'Write your article content here'}
        </p>
      </div>
      
      <div className="mt-8">
        <h3 className={`text-lg font-medium mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ލިޔުން ހުށަހަޅާ' : 'Submit Article'}
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleStatusChange('draft')}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Save size={18} />
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'ޑްރާފްޓްގެ ގޮތުގައި ރައްކާކުރޭ' : 'Save as Draft'}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => handleStatusChange('review')}
            className="px-4 py-2 rounded-md border border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2"
          >
            <Eye size={18} />
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'ރިވިއުއަށް ފޮނުވާ' : 'Send for Review'}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => handleStatusChange('publish')}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Send size={18} />
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'ޝާއިޢުކުރޭ' : 'Publish Now'}
            </span>
          </button>
        </div>
        
        <p className={`mt-3 text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? 'ޝާއިޢުކުރާ ބަޓަން ފިތާލައިފިނަމަ އެހާހިސާބުން އަރޓިކަލް ރަސްމީކޮށް ވެބްސައިޓަށް ލިބޭނެ' 
            : 'Publishing will make your article immediately available on the website.'}
        </p>
      </div>
    </div>
  );
};

export default ContentSubmissionStep;
