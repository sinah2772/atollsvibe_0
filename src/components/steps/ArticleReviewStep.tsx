import React from 'react';
import { StepProps } from '../../types/editor';
import { AlertCircle, Check, Tag } from 'lucide-react';

const ArticleReviewStep: React.FC<StepProps> = ({
  formData,
  language,
  onEdit
}) => {
  // Helper function to truncate long text
  const truncate = (text: string, length: number) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Check for missing required fields
  const requiredFields = [
    { key: 'title', label: language === 'dv' ? 'ސުރުޚީ' : 'Title' },
    { key: 'heading', label: language === 'dv' ? 'ހެޑިންގ' : 'Heading' },
    { key: 'coverImage', label: language === 'dv' ? 'ކަވަރ އިމޭޖް' : 'Cover Image' },
    { key: 'category', label: language === 'dv' ? 'ކެޓަގަރީ' : 'Category' },
    { key: 'content', label: language === 'dv' ? 'ލިޔުމުގެ މައިގަނޑު' : 'Content' }
  ];
  const missingFields = requiredFields.filter(field => {
    if (Array.isArray(formData[field.key])) {
      return !formData[field.key] || (formData[field.key] as unknown[]).length === 0;
    }
    return !formData[field.key];
  });

  // Function to handle editing a specific step
  const handleEditStep = (stepIndex: number) => {
    if (onEdit) {
      onEdit(stepIndex);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning for missing fields */}
      {missingFields.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertCircle className="text-yellow-600 mr-3" size={20} />
            <div>
              <h3 className={`text-sm font-medium text-yellow-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'މުހިންމު ފީލްޑްތައް މަދުވޭ' : 'Required fields missing'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {missingFields.map((field, index) => (
                    <li key={index} className={language === 'dv' ? 'thaana-waheed' : ''}>
                      {field.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className={`text-xl font-bold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ޕްރިވިއު' : 'Article Preview'}
          </h2>
        </div>
        
        <div className="p-6">
          {/* Article Info */}
          <div className="space-y-4">
            {/* Title & Heading */}            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {(formData.title as string) || (
                  <span className="text-gray-400 italic">
                    {language === 'dv' ? 'ސުރުޚީ ނެތް' : 'No title provided'}
                  </span>
                )}
              </h1>
              
              <h2 className={`text-xl font-semibold mt-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {(formData.heading as string) || (
                  <span className="text-gray-400 italic">
                    {language === 'dv' ? 'ހެޑިންގ ނެތް' : 'No heading provided'}
                  </span>
                )}
              </h2>
            </div>
              {/* Cover Image */}
            {formData.coverImage ? (              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={formData.coverImage as string}
                  alt={typeof formData.imageCaption === 'string' ? formData.imageCaption : ''}
                  className="w-full h-full object-cover"
                />
                {formData.imageCaption && typeof formData.imageCaption === 'string' ? (
                  <p className={`text-sm text-gray-500 mt-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {formData.imageCaption as string}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-lg">
                <p className={`text-gray-400 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ކަވަރ އިމޭޖް ނެތް' : 'No cover image provided'}
                </p>
              </div>
            )}
            
            {/* Article Flags */}
            <div className="flex flex-wrap gap-2">
              {(formData.isBreaking as boolean) && (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                  {language === 'dv' ? 'ބްރޭކިންގ' : 'Breaking'}
                </span>
              )}
              
              {(formData.isFeatured as boolean) && (
                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">
                  {language === 'dv' ? 'ފީޗަރޑް' : 'Featured'}
                </span>
              )}
              
              {(formData.isDeveloping as boolean) && (
                <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">
                  {language === 'dv' ? 'ޑިވެލޮޕިންގ ސްޓޯރީ' : 'Developing'}
                </span>
              )}
              
              {(formData.isExclusive as boolean) && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                  {language === 'dv' ? 'އެކްސްކްލޫސިވް' : 'Exclusive'}
                </span>
              )}
              
              {(formData.isSponsored as boolean) && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                  {language === 'dv' ? 'ސްޕޮންސަރޑް' : 'Sponsored'}
                </span>
              )}
            </div>
            
            {/* Tags */}
            {Array.isArray(formData.tags) && (formData.tags as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <Tag size={16} className="text-gray-500" />
                {(formData.tags as string[]).map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Content Preview */}
            <div>
              <h3 className={`font-medium text-gray-900 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ލިޔުމުގެ މައިގަނޑު' : 'Content Preview'}
              </h3>
                <div className={`prose prose-sm max-w-none ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {formData.content ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    {truncate(formData.content as string, 300)}
                    
                    <div className="mt-2">
                      <button 
                        onClick={() => handleEditStep(7)}
                        className={`text-sm text-blue-600 hover:text-blue-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                      >
                        {language === 'dv' ? 'މައިގަނޑު ބަދަލުކުރޭ' : 'Edit content'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-gray-400 italic">
                    {language === 'dv' ? 'ލިޔުމުގެ މައިގަނޑު ނެތް' : 'No content provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className={`text-lg font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ލިޔުމުގެ ޚުލާސާ' : 'Article Summary'}
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Identity */}
            <div>
              <h3 className={`text-sm font-medium text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އާޓިކަލް އައިޑެންޓިޓީ' : 'Article Identity'}
              </h3>
              <div className="mt-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                <button 
                  onClick={() => handleEditStep(0)}
                  className={`text-sm text-blue-600 hover:text-blue-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  {language === 'dv' ? 'ބަދަލުކުރޭ' : 'Edit'}
                </button>
              </div>
            </div>
            
            {/* Step 2: Media & Visuals */}
            <div>
              <h3 className={`text-sm font-medium text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'މީޑިއާ އަދި ވިޝުއަލް' : 'Media & Visuals'}
              </h3>
              <div className="mt-2 flex items-center">
                {formData.coverImage ? (
                  <Check size={16} className="text-green-500 mr-2" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-500 mr-2" />
                )}
                <button 
                  onClick={() => handleEditStep(1)}
                  className={`text-sm text-blue-600 hover:text-blue-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  {language === 'dv' ? 'ބަދަލުކުރޭ' : 'Edit'}
                </button>
              </div>
            </div>
              {/* Step 3: Classification */}
            <div>
              <h3 className={`text-sm font-medium text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ކްލެސިފިކޭޝަން' : 'Classification'}
              </h3>
              <div className="mt-2 flex items-center">
                {Array.isArray(formData.category) && (formData.category as unknown[]).length > 0 ? (
                  <Check size={16} className="text-green-500 mr-2" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-500 mr-2" />
                )}
                <button 
                  onClick={() => handleEditStep(2)}
                  className={`text-sm text-blue-600 hover:text-blue-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  {language === 'dv' ? 'ބަދަލުކުރޭ' : 'Edit'}
                </button>
              </div>
            </div>
            
            {/* Other steps... */}
            <div>
              <h3 className={`text-sm font-medium text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'އާޓިކަލް އޮޕްޝަންސް' : 'Article Options'}
              </h3>
              <div className="mt-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                <button 
                  onClick={() => handleEditStep(3)}
                  className={`text-sm text-blue-600 hover:text-blue-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                >
                  {language === 'dv' ? 'ބަދަލުކުރޭ' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleReviewStep;
