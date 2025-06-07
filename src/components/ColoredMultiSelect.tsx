import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { getCategoryColor, getSubcategoryColor } from '../utils/categoryColors';

interface ColoredOption {
  id: number | string;
  name: string;
  name_en: string;
  type: 'category' | 'subcategory';
  parentCategoryName?: string;
  parentCategoryNameEn?: string;
  categoryId?: number;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

interface ColoredMultiSelectProps {
  options: ColoredOption[];
  value: (number | string)[];
  onChange: (values: (number | string)[]) => void;
  language: 'en' | 'dv';
  placeholder?: string;
  showColors?: boolean;
}

export const ColoredMultiSelect: React.FC<ColoredMultiSelectProps> = ({
  options,
  value,
  onChange,
  language,
  placeholder,
  showColors = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (language === 'dv' ? option.name : option.name_en)
      ?.toLowerCase()
      ?.includes(searchLower);
    const altNameMatch = (language === 'dv' ? option.name_en : option.name)
      ?.toLowerCase()
      ?.includes(searchLower);
    const parentCategoryMatch = option.parentCategoryName && (
      (language === 'dv' ? option.parentCategoryName : option.parentCategoryNameEn)
        ?.toLowerCase()
        ?.includes(searchLower)
    );
    return !value.includes(option.id) && (nameMatch || altNameMatch || parentCategoryMatch);
  });

  const handleSelect = (optionId: number | string) => {
    onChange([...value, optionId]);
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRemove = (optionId: number | string) => {
    onChange(value.filter(id => id !== optionId));
  };  const getOptionColors = (option: ColoredOption) => {
    if (!showColors) return { bg: '', text: '', border: '' };
    
    let colors;
    if (option.type === 'category') {
      colors = getCategoryColor(Number(option.id));
    } else if (option.type === 'subcategory' && option.categoryId) {
      colors = getSubcategoryColor(option.categoryId);
    } else {
      colors = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
    
    // Debug log to see what colors are being generated
    console.log(`Option ${option.id} (${option.type}):`, colors);
    
    return colors;
  };
  const getDisplayName = (option: ColoredOption) => {
    const name = language === 'dv' ? option.name : option.name_en;
    if (option.type === 'subcategory' && option.parentCategoryName) {
      const parentName = language === 'dv' ? option.parentCategoryName : option.parentCategoryNameEn;
      return `→ ${name} (${parentName})`;
    }
    return option.type === 'category' ? `🏷️ ${name}` : `→ ${name}`;
  };

  const getSelectedOption = (optionId: number | string) => {
    return options.find(opt => opt.id === optionId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== 'Backspace') {
      setIsOpen(true);
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'Backspace':
        if (searchTerm === '' && value.length > 0) {
          handleRemove(value[value.length - 1]);
        }
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);  return (
    <div ref={wrapperRef} className="relative">
      <div 
        className={`glass-input min-h-[38px] w-full ${
          isOpen ? 'ring-2 ring-blue-500/20 border-blue-400' : ''
        }`}
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        <div className={`flex flex-wrap gap-2 p-2 ${language === 'dv' ? 'flex-row-reverse' : ''}`}>
          {/* Selected items */}
          {value.map((selectedId) => {
            const option = getSelectedOption(selectedId);
            if (!option) return null;
            
            const colors = getOptionColors(option);
            const displayName = getDisplayName(option);
            
            return (              <div 
                key={selectedId}
                className={`inline-flex items-center glass-button ${
                  showColors ? `${colors.text}` : 'text-blue-700'
                } px-3 py-1 text-sm ${
                  language === 'dv' ? 'flex-row-reverse' : ''
                }`}
              >
                <span className={language === 'dv' ? 'thaana-waheed' : ''}>{displayName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(selectedId);
                  }}
                  className={`hover:text-opacity-80 ${language === 'dv' ? 'ml-0 mr-2' : 'ml-2'}`}                  aria-label={language === 'dv' ? `${displayName} އުނިކުރައްވާ` : `Remove ${displayName}`}
                  title={language === 'dv' ? `${displayName} އުނިކުރައްވާ` : `Remove ${displayName}`}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
          
          {/* Search input with icon */}
          <div className={`flex-1 flex items-center min-w-[60px] ${
            language === 'dv' ? 'flex-row-reverse' : ''
          }`}>
            <Search size={16} className={`text-gray-400 ${
              language === 'dv' ? 'mr-0 ml-2' : 'ml-0 mr-2'
            }`} />
            <input
              ref={inputRef}
              type="text"
              className={`w-full border-none focus:ring-0 p-0 text-sm ${
                language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed text-right' : ''
              }`}
              placeholder={value.length === 0 ? placeholder : ''}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>        </div>
      </div>      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={listRef}
          className="glass-dropdown absolute z-10 w-full mt-1 max-h-60 overflow-auto"
        >
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((option, index) => {
                const colors = getOptionColors(option);
                const displayName = getDisplayName(option);
                
                return (                  <button
                    key={option.id}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                      index === highlightedIndex 
                        ? 'bg-blue-500/10 text-blue-700' 
                        : 'hover:bg-gray-100/10'
                    } ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}
                    onClick={() => handleSelect(option.id)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    dir={language === 'dv' ? 'rtl' : 'ltr'}
                  >
                    <span className={showColors ? colors.text : 'text-gray-900'}>
                      {displayName}
                      {showColors && (
                        <span className={`${language === 'dv' ? 'mr-2 ml-0' : 'ml-2'} px-2 py-0.5 rounded text-xs ${colors.bg} ${colors.border} border`}>
                          {option.type === 'category' ? '🏷️' : '→'}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={`p-4 text-sm text-gray-500 text-center ${
              language === 'dv' ? 'thaana-waheed' : ''
            }`}>
              {language === 'dv' ? 'ނަތީޖާއެއް ނުލިބުނު' : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColoredMultiSelect;
