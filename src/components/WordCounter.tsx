import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

interface WordCounterProps {
  editor: Editor | null;
  language: 'en' | 'dv';
}

const WordCounter: React.FC<WordCounterProps> = ({ editor, language }) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateStats = () => {
      // Get plain text content from editor
      const text = editor.getText();
      
      // Count characters (including spaces)
      setCharCount(text.length);
      
      // Count words (split by whitespace)
      // For Dhivehi, this is approximate as word boundaries work differently
      const words = text.trim().split(/\s+/);
      setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length);
    };

    // Update on editor changes
    editor.on('update', updateStats);
    
    // Initial update
    updateStats();
    
    // Cleanup
    return () => {
      editor.off('update', updateStats);
    };
  }, [editor]);

  return (
    <div className="text-xs text-gray-500 flex items-center space-x-3">
      <div className={language === 'dv' ? 'thaana-waheed' : ''}>
        {language === 'dv' ? `${wordCount} ބަސް` : `${wordCount} words`}
      </div>
      <div className={language === 'dv' ? 'thaana-waheed' : ''}>
        {language === 'dv' ? `${charCount} އަކުރު` : `${charCount} characters`}
      </div>
    </div>
  );
};

export default WordCounter;
