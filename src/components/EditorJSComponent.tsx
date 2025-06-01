import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import LinkTool from '@editorjs/link';
import { supabase } from '../lib/supabase';

interface EditorJSComponentProps {
  placeholder?: string;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  onReady?: () => void;
  className?: string;
  collaborative?: {
    isFieldLocked: (fieldId: string) => boolean;
    lockField: (fieldId: string) => void;
    unlockField: (fieldId: string) => void;
    broadcastFieldUpdate: (fieldId: string, value: string) => void;
    getFieldLocker: (fieldId: string) => string | null;
    pendingUpdates: Record<string, string>;
    isConnected: boolean;
  };
}

export const EditorJSComponent: React.FC<EditorJSComponentProps> = ({
  placeholder = 'Start writing your article...',
  data,
  onChange,
  onReady,
  className = '',
  collaborative
}) => {  const ejInstance = useRef<EditorJS | null>(null);
  const editorContainer = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const lastDataRef = useRef<string>('');

  // Image upload function for Editor.js
  const uploadByFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      return {
        success: 1,
        file: {
          url: publicUrl,
        }
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: 0,
        error: 'Failed to upload image'
      };
    }
  };
  // Link fetcher for link tool
  const fetchUrl = async (url: string) => {
    try {
      // For now, return basic meta data
      // In production, you might want to implement a backend endpoint for this
      return {
        success: 1,
        meta: {
          title: url,
          description: '',
          image: {
            url: ''
          }
        }
      };
    } catch {
      return {
        success: 0
      };
    }
  };  // Debounced onChange handler for collaborative editing
  const debouncedOnChange = useCallback(
    async () => {
      if (ejInstance.current) {
        try {
          const outputData = await ejInstance.current.save();
          const dataString = JSON.stringify(outputData);
          
          if (dataString !== lastDataRef.current) {
            lastDataRef.current = dataString;
            onChange?.(outputData);
            
            // Broadcast changes for collaborative editing
            if (collaborative) {
              collaborative.broadcastFieldUpdate('content', dataString);
            }
          }
        } catch (error) {
          console.error('Error saving editor data:', error);
        }
      }
    },
    [onChange, collaborative]
  );

  // Create debounced version using useRef to store timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedHandler = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(debouncedOnChange, 1000);
  }, [debouncedOnChange]);
  // Initialize Editor.js
  const initEditor = useCallback(() => {
    if (isInitialized.current || !editorContainer.current) return;

    const tools = {
      header: {
        class: Header,
        config: {
          placeholder: 'Enter a heading...',
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 2
        }
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        config: {
          placeholder: placeholder
        }
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
      },
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile: uploadByFile
          },
          captionPlaceholder: 'Enter image caption...'
        }
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        }
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        }
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: fetchUrl
        }
      }
    };    ejInstance.current = new EditorJS({
      holder: editorContainer.current,
      placeholder: placeholder,
      tools: tools,
      onChange: debouncedHandler,
      i18n: {
        direction: 'ltr'
      },
      ...(data && { data })
    });

    // Wait for editor to be ready
    setTimeout(() => {
      isInitialized.current = true;
      onReady?.();
    }, 100);
  }, [data, placeholder, debouncedHandler, onReady]);
  // Update editor content when data prop changes
  useEffect(() => {
    if (ejInstance.current && data && isInitialized.current) {
      if (typeof ejInstance.current.destroy === 'function') {
        try {
          ejInstance.current.destroy();
        } catch (error) {
          console.warn('Error destroying editor:', error);
        }
      }
      
      const newEditor = new EditorJS({
            holder: editorContainer.current!,
            placeholder: placeholder,
            tools: {
              header: { class: Header },
              paragraph: { class: Paragraph },
              list: { class: List },
              image: { class: Image },
              quote: { class: Quote },
              table: { class: Table },
              linkTool: { class: LinkTool }
            },
            onChange: debouncedHandler
          });
      ejInstance.current = newEditor;
    }
  }, [data, placeholder, debouncedHandler]);
  // Handle collaborative updates
  useEffect(() => {
    if (collaborative?.pendingUpdates?.content && ejInstance.current && isInitialized.current) {
      try {
        const newData = JSON.parse(collaborative.pendingUpdates.content);
        const currentDataString = lastDataRef.current;
        
        if (JSON.stringify(newData) !== currentDataString) {          // Recreate editor with new data
          if (typeof ejInstance.current.destroy === 'function') {
            try {
              ejInstance.current.destroy();
            } catch (error) {
              console.warn('Error destroying editor:', error);
            }
          }
          const newEditor = new EditorJS({
            holder: editorContainer.current!,
            placeholder: placeholder,
            tools: {
              header: { class: Header },
              paragraph: { class: Paragraph },
              list: { class: List },
              image: { class: Image },
              quote: { class: Quote },
              table: { class: Table },
              linkTool: { class: LinkTool }
            },            onChange: debouncedHandler
          });
          ejInstance.current = newEditor;
          lastDataRef.current = JSON.stringify(newData);
        }
      } catch (error) {
        console.error('Error applying collaborative update:', error);
      }
    }
  }, [collaborative?.pendingUpdates?.content, placeholder, debouncedHandler]);

  // Initialize editor on mount
  useEffect(() => {
    initEditor();    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
        try {
          ejInstance.current.destroy();
        } catch (error) {
          console.warn('Error destroying editor:', error);
        }
        ejInstance.current = null;
        isInitialized.current = false;
      }
    };}, [initEditor]);

  const isLocked = collaborative?.isFieldLocked('content');
  const locker = collaborative?.getFieldLocker('content');

  return (
    <div className={`relative ${className}`}>
      {isLocked && locker && (
        <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-600">
              Content is being edited by {locker}
            </p>
          </div>
        </div>
      )}
        <div 
        ref={editorContainer}
        className={`prose prose-lg max-w-none min-h-96 ${isLocked ? 'pointer-events-none' : ''}`}
      />
      
      {!collaborative?.isConnected && (
        <div className="absolute top-2 right-2 text-yellow-500">
          <span className="text-xs">Offline</span>
        </div>
      )}
    </div>
  );
};

export default EditorJSComponent;
