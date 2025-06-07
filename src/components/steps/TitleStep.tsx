import React from 'react';
import { FileText, Lightbulb } from 'lucide-react';
import { StepProps } from '../../types/editor';

export const TitleStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {
  const title = formData.title as string || '';

  const suggestions = {
    en: [
      "How to...",
      "The Ultimate Guide to...",
      "5 Tips for...",
      "Why You Should...",
      "The Complete Story of..."
    ],
    dv: [
      "ކޮންމެ ދަރާގެ...",
      "އަޅޭ ޙާލް...",
      "5 ޙަރުކަ ތަކެއް...",
      "އެކަށީގެންވާ...",
      "ފުރުދުވަހު ޚަބަރު..."
    ]
  };

  return (    <div className="max-w-2xl mx-auto">
      <div className="glass-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'What\'s your article about?' : 'ތިޔަ ލިޔުން ކޮން ތަކެއްޗަށް؟'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Give your article a clear, engaging title that captures the reader\'s attention'
              : 'ކިޔާ ފަރާތްގެ ފޯރުކޮށްދޭ ސާފު، ހޯއްވާ ނަމެއް ތިޔަ ލިޔުމަށް ދެއްވާ'
            }
          </p>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {language === 'en' ? 'Article Title' : 'ލިޔުމުގެ ނަން'}
            <span className="text-red-500 ml-1">*</span>
          </label>          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => onFormDataChange({ title: e.target.value })}
            placeholder={language === 'en' 
              ? 'Enter your article title...' 
              : 'ތިޔަ ލިޔުމުގެ ނަން ލިޔެލާ...'
            }
            className="glass-input text-lg"
            autoFocus
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className={`${title.length >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
              {title.length} {language === 'en' ? 'characters' : 'އަކުރު'}
              {title.length >= 3 && ' ✓'}
            </span>
            <span className="text-gray-500">
              {language === 'en' ? 'Minimum 3 characters' : 'ވަންސާފައި 3 އަކުރު'}
            </span>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                {language === 'en' ? 'Title Writing Tips' : 'ނަން ލިޔުމުގެ ޙަރުކަތައް'}
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  {language === 'en' 
                    ? '• Make it clear and specific' 
                    : '• ސާފުވެ ތަފްޞީލުވެ ލިޔޭ'
                  }
                </li>
                <li>
                  {language === 'en' 
                    ? '• Include keywords your audience might search for' 
                    : '• ކިޔާ ފަރާތްތަކާ ހޯދާނެ ވާހަކަތައް ހިމަނާ'
                  }
                </li>
                <li>
                  {language === 'en' 
                    ? '• Keep it concise but descriptive' 
                    : '• ކުރަކަށް ދިއޭ ވަނެ ވިސްނާ މުޚްދާ ހުއްޓަވާ'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Title Suggestions */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'en' ? 'Popular title formats:' : 'މަޤުބޫލު ނަމުގެ ބޭނުން:'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">            {suggestions[language].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onFormDataChange({ title: suggestion })}
                className="glass-button text-left text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Character count and next step hint */}
        {title.length >= 3 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              {language === 'en' 
                ? '✓ Great! You can now move to the next step to add your content.'
                : '✓ މޮޅުދޭ! މިތަނުން ކޮންޓެންޓް ޚާފުކުރުމަށް ކުއުދާއަކާ ހޯއްޓާދެ!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
