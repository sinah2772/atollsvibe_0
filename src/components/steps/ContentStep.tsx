import React, { useState } from 'react';
import { Edit3, Eye, Type } from 'lucide-react';
import { StepProps } from '../../types/editor';

export const ContentStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {
  const content = formData.content as string || '';
  const title = formData.title as string || '';
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const formatText = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        formattedText = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'List item'}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText || 'Quote'}`;
        break;
      default:
        return;
    }    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onFormDataChange({ content: newContent });

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const renderPreview = () => {
    // Simple markdown-like rendering for preview
    const lines = content.split('\n');
    return (
      <div className="prose max-w-none">
        {lines.map((line, index) => {
          if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
          }
          if (line.startsWith('> ')) {
            return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-2">{line.substring(2)}</blockquote>;
          }          if (line.startsWith('- ')) {
            return <ul key={`list-${index}`}><li className="ml-4">{line.substring(2)}</li></ul>;
          }
          if (line.trim() === '') {
            return <br key={index} />;
          }          // Handle bold and italic
          const processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

          return (
            <p 
              key={index} 
              className="mb-2" 
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'en' ? 'Write Your Content' : 'ތިޔަ ކޮންޓެންޓް ލިޔެލާ'}
              </h2>
              <p className="text-gray-600 mt-1">
                {language === 'en' 
                  ? `Article: "${title}"` 
                  : `ލިޔުން: "${title}"`
                }
              </p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeTab === 'edit' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Edit' : 'އިޞްލާޙު'}
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeTab === 'preview' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Preview' : 'ކުރިން ބައްލަވާ'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'edit' ? (
            <div>
              {/* Formatting Toolbar */}
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                <button
                  onClick={() => formatText('bold')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title={language === 'en' ? 'Bold' : 'ބޯއަރަލް'}
                >
                  <strong>B</strong>
                </button>
                <button
                  onClick={() => formatText('italic')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title={language === 'en' ? 'Italic' : 'އިޓެލިކް'}
                >
                  <em>I</em>
                </button>
                <button
                  onClick={() => formatText('heading')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title={language === 'en' ? 'Heading' : 'ހެޑިންވ'}
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('list')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title={language === 'en' ? 'List' : 'ލިސްޓް'}
                >
                  ≡
                </button>
                <button
                  onClick={() => formatText('quote')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title={language === 'en' ? 'Quote' : 'ކޯޓް'}
                >
                  "
                </button>
              </div>

              {/* Content Textarea */}
              <div className="mb-4">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => onFormDataChange({ content: e.target.value })}
                  placeholder={language === 'en' 
                    ? 'Start writing your article content here...\n\nTips:\n- Use ## for headings\n- Use **text** for bold\n- Use *text* for italic\n- Use > for quotes\n- Use - for lists'
                    : 'ތިޔަ ލިޔުމުގެ ކޮންޓެންޓް މިތަނުން ފަށާލާ...\n\nޙަރުކަތައް:\n- ## ބޭނުންކޮށް ހެޑިންގަށް\n- **ޓެކްސްޓް** ބޭނުންކޮށް ބޯލްޑަށް\n- *ޓެކްސްޓް* ބޭނުންކޮށް އިޓެލިކަށް\n- > ބޭނުންކޮށް ކޯޓަށް\n- - ބޭނުންކޮށް ލިސްޓަށް'
                  }
                  className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className={`${content.length >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                    {content.length} {language === 'en' ? 'characters' : 'އަކުރު'}
                    {content.length >= 10 && ' ✓'}
                  </span>
                  <span className="text-gray-500">
                    {language === 'en' ? 'Minimum 10 characters' : 'ވަންސާފައި 10 އަކުރު'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Preview' : 'ކުރިން ބައްލަވާ'}
              </h3>
              <div className="min-h-96 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {content ? (
                  renderPreview()
                ) : (
                  <p className="text-gray-500 italic">
                    {language === 'en' 
                      ? 'No content to preview yet. Switch to Edit tab to start writing.'
                      : 'ޕީރިވިއުކުރުމަށް ކޮންޓެންޓެއް ނޯންނާ. ލިޔުން ފެށުމަށް އެޑިޓް ޓެބް އަށް ބަދަލުވާ.'
                    }
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {content.length >= 10 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                {language === 'en' 
                  ? '✓ Excellent! Your content is ready. You can now add metadata to complete your article.'
                  : '✓ ހެޔޮ! ތިޔަ ކޮންޓެންޓް ތައްޔާރު! މިތަނުން މެޓަޑޭޓާ ޞާފުކޮށް ތިޔަ ލިޔުން ކަމެއްލާ!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
