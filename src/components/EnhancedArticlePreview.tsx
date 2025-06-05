import React, { useState } from 'react';
import { JSONContent } from '@tiptap/core';

// Define types for nodes in the article JSON structure
interface MarkType {
  type: string;
  attrs?: Record<string, unknown>;
}

interface NodeType {
  type: string;
  content?: NodeType[];
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: MarkType[];
}

interface TipTapDocument {
  type?: string;
  content?: NodeType[];
}

// Convert JSONContent to TipTapDocument
const convertToTipTapDocument = (content: JSONContent | undefined): TipTapDocument => {
  if (!content) {
    return { type: 'doc', content: [] };
  }
  
  return {
    type: content.type || 'doc',
    content: content.content as NodeType[] || []
  };
};

interface ArticlePreviewProps {
  title: string;
  heading: string;
  coverImage: string;
  imageCaption: string;
  content: TipTapDocument | JSONContent; // Accept both TipTapDocument and JSONContent
  isBreaking: boolean;
  isFeatured: boolean;
  isDeveloping: boolean;
  isExclusive: boolean;
  isSponsored: boolean;
  sponsoredBy?: string;
  newsType: string;
  newsSource?: string;
  tags: string[];
  language: 'en' | 'dv';
  onClose: () => void;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  heading,
  coverImage,
  imageCaption,
  content: rawContent,
  isBreaking,
  // isFeatured is unused but kept in props for compatibility
  isDeveloping,
  isExclusive,
  isSponsored,
  sponsoredBy,
  newsType,
  newsSource,
  tags,
  language,
  onClose
}) => {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>('');
  const [imageTitle, setImageTitle] = useState<string>('');

  // Helper function to render the content with proper formatting
  const renderContent = () => {
  // Convert content to TipTapDocument format if it's JSONContent
    const content = convertToTipTapDocument(rawContent as JSONContent | TipTapDocument);
    if (!content) return null;
    
    // Recursive function to render node and its children with proper formatting
    const renderNode = (node: NodeType, index: number | string): JSX.Element | null => {
      if (!node) return null;
      
      // Create a string key if index is a number
      const nodeKey = typeof index === 'string' ? index : index.toString();
      
      switch (node.type) {
        case 'paragraph': {
          return (
            <p key={nodeKey} className={language === 'dv' ? 'thaana-waheed text-right mb-4' : 'mb-4'}>
              {node.content?.map((child, childIndex) => renderInlineNode(child, `${nodeKey}-${childIndex}`))}
            </p>
          );
        }
          
        case 'heading': {
          const level = Number(node.attrs?.level) || 2;
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag key={nodeKey} className={language === 'dv' ? 'thaana-waheed text-right mb-3 font-bold' : 'mb-3 font-bold'}>
              {node.content?.map((child, childIndex) => renderInlineNode(child, `${nodeKey}-${childIndex}`))}
            </HeadingTag>
          );
        }
          
        case 'bulletList': {
          return (
            <ul key={nodeKey} className="list-disc pl-6 mb-4">
              {node.content?.map((child, childIndex) => renderNode(child, `${nodeKey}-${childIndex}`))}
            </ul>
          );
        }
          
        case 'orderedList': {
          return (
            <ol key={nodeKey} className="list-decimal pl-6 mb-4">
              {node.content?.map((child, childIndex) => renderNode(child, `${nodeKey}-${childIndex}`))}
            </ol>
          );
        }
          
        case 'listItem': {
          return (
            <li key={nodeKey} className={language === 'dv' ? 'thaana-waheed mb-1' : 'mb-1'}>
              {node.content?.map((child, childIndex) => renderNode(child, `${nodeKey}-${childIndex}`))}
            </li>
          );
        }
          
        case 'blockquote': {
          return (
            <blockquote key={nodeKey} className="pl-4 border-l-4 border-gray-300 italic my-4">
              {node.content?.map((child, childIndex) => renderNode(child, `${nodeKey}-${childIndex}`))}
            </blockquote>
          );
        }
          
        case 'image': {
          const src = String(node.attrs?.src || '');
          const alt = String(node.attrs?.alt || '');
          const title = String(node.attrs?.title || '');
          
          return (
            <div key={nodeKey} className="my-4">
              <img 
                src={src} 
                alt={alt}
                title={title}
                className="mx-auto rounded-lg max-h-[400px] object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                onClick={() => {
                  setEnlargedImage(src);
                  setImageAlt(alt);
                  setImageTitle(title);
                }}
              />
              {title && (
                <p className="text-center text-sm text-gray-600 mt-2">{title}</p>
              )}
            </div>
          );
        }
        
        default:
          return null;
      }
    };
    
    // Helper function to render inline elements
    const renderInlineNode = (node: NodeType, key: string): React.ReactNode => {
      if (!node) return null;
      
      // Handle text nodes
      if (node.text) {
        const result = node.text;
        
        // Apply marks (formatting)
        if (node.marks && node.marks.length > 0) {
          return node.marks.reduce<React.ReactNode>((content, mark) => {
            const contentElement = content;
            const href = String(mark.attrs?.href || '#');
            
            switch (mark.type) {
              case 'bold':
                return <strong key={key}>{contentElement}</strong>;
              case 'italic':
                return <em key={key}>{contentElement}</em>;
              case 'link':
                return <a key={key} href={href} className="text-blue-600 hover:underline">{contentElement}</a>;
              case 'highlight':
                return <mark key={key} className="bg-yellow-200">{contentElement}</mark>;
              case 'code':
                return <code key={key} className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">{contentElement}</code>;
              default:
                return contentElement;
            }
          }, result);
        }
        
        return result;
      }
      
      return null;
    };

    return (
      <div className="prose prose-lg max-w-none">
        {content.content?.map((node, index) => renderNode(node, index))}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl overflow-auto">
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className={`text-xl font-bold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'މަޟްމޫން ޕްރިވިއު' : 'Article Preview'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {/* Article Flags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {isBreaking && (
                <span className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium">
                  {language === 'dv' ? 'ބްރޭކިންގ' : 'Breaking'}
                </span>
              )}
              {isDeveloping && (
                <span className="px-2 py-1 rounded-md bg-amber-600 text-white text-xs font-medium">
                  {language === 'dv' ? 'ޑިވެލޮޕިންގ' : 'Developing'}
                </span>
              )}
              {isExclusive && (
                <span className="px-2 py-1 rounded-md bg-purple-600 text-white text-xs font-medium">
                  {language === 'dv' ? 'އެކްސްކްލޫސިވް' : 'Exclusive'}
                </span>
              )}
              {isSponsored && (
                <span className="px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-medium">
                  {language === 'dv' ? `ސްޕޮންސަރ: ${sponsoredBy}` : `Sponsored by ${sponsoredBy}`}
                </span>
              )}
            </div>
            
            {/* Article Type and Source */}
            <div className="text-sm text-gray-500 mb-3">
              <span className="font-medium">
                {language === 'dv' ? newsType : newsType.charAt(0).toUpperCase() + newsType.slice(1)}
              </span>
              {newsSource && (
                <span>
                  {' '}{language === 'dv' ? 'މަޞްދަރު:' : 'Source:'} {newsSource}
                </span>
              )}
            </div>
            
            {/* Title and Heading */}
            <h1 className={`text-3xl font-bold mb-3 ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}>
              {language === 'dv' ? heading : title}
            </h1>
              {/* Cover Image */}
            {coverImage && (
              <div className="mb-6">
                <div className="relative group aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 cursor-zoom-in">
                  <img
                    src={coverImage}
                    alt={imageCaption}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setEnlargedImage(coverImage);
                      setImageAlt(imageCaption || '');
                      setImageTitle('');
                    }}
                  />
                </div>
                {imageCaption && (
                  <p className={`text-sm text-gray-500 mt-2 ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}>
                    {imageCaption}
                  </p>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="mb-8">
              {renderContent()}
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                  {language === 'dv' ? 'ޓެގްތައް:' : 'Tags:'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enlarged Image Overlay */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setEnlargedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-[70]"
            onClick={(e) => { 
              e.stopPropagation();
              setEnlargedImage(null);
            }}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img 
              src={enlargedImage} 
              alt={imageAlt}
              className="max-w-full max-h-[85vh] object-contain"
            />
            {imageTitle && (
              <p className="text-sm text-gray-300 mt-2 text-center">{imageTitle}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlePreview;
