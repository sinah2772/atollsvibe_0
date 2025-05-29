import React, { useState, KeyboardEvent, useRef } from 'react';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  language: 'en' | 'dv';
  placeholder?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onChange,
  language,
  placeholder
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (inputValue.trim() === '') return;
    
    const newTag = inputValue.trim();
    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  // Focus the input when clicking anywhere in the container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Handle pasting
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const newTags = paste
      .split(/,|\n/)
      .map(tag => tag.trim())
      .filter(tag => tag !== '' && !tags.includes(tag));
    
    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 min-h-[42px]"
    >
      {tags.map((tag, index) => (
        <div 
          key={index} 
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        >
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {tag}
          </span>
          <button
            type="button"
            onClick={() => handleRemoveTag(tag)}
            className="text-blue-800 hover:text-blue-900 font-medium"
            aria-label={language === 'dv' ? `${tag} ފޮހެލާ` : `Remove ${tag}`}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleAddTag}
        className={`flex-grow outline-none border-none focus:ring-0 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed text-right' : ''}`}
        placeholder={placeholder || (language === 'dv' ? 'ޓެގް ލިޔެ އެންޓަރ ފިތައްވާ' : 'Type a tag and press enter')}
        dir={language === 'dv' ? 'rtl' : 'ltr'}
      />
    </div>
  );
};

export default TagsInput;