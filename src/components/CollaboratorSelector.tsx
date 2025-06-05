import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';

interface CollaboratorSelectorProps {
  collaborators: string[];
  onChange: (collaborators: string[]) => void;
  language: 'en' | 'dv';
  allUsers?: { email: string; name?: string }[];
  placeholder?: string;
}

export const CollaboratorSelector: React.FC<CollaboratorSelectorProps> = ({
  collaborators,
  onChange,
  language,
  allUsers = [],
  placeholder = 'Add collaborator email'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [customEmail, setCustomEmail] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Reset highlighted index when search term changes
  useEffect(() => {
    setHighlightedIndex(-1);
    
    // If search term looks like an email and isn't in the list
    if (
      searchTerm.includes('@') &&
      searchTerm.includes('.') &&
      !allUsers.some(user => user.email.toLowerCase() === searchTerm.toLowerCase()) &&
      !collaborators.includes(searchTerm)
    ) {
      setCustomEmail(searchTerm);
    } else {
      setCustomEmail('');
    }
  }, [searchTerm, allUsers, collaborators]);

  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const emailMatch = user.email.toLowerCase().includes(searchLower);
    const nameMatch = user.name?.toLowerCase().includes(searchLower);
    return !collaborators.includes(user.email) && (emailMatch || nameMatch);
  });

  const handleSelect = (email: string) => {
    if (!collaborators.includes(email)) {
      onChange([...collaborators, email]);
    }
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRemove = (email: string) => {
    onChange(collaborators.filter(e => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      setIsOpen(true);
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const totalOptions = filteredUsers.length + (customEmail ? 1 : 0);
        setHighlightedIndex(prev => 
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const totalOptions2 = filteredUsers.length + (customEmail ? 1 : 0);
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : totalOptions2 - 1
        );
        break;
      }
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredUsers.length) {
          handleSelect(filteredUsers[highlightedIndex].email);
        } else if (customEmail && (highlightedIndex === filteredUsers.length || filteredUsers.length === 0)) {
          handleSelect(customEmail);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'Backspace':
        if (!searchTerm && collaborators.length > 0) {
          handleRemove(collaborators[collaborators.length - 1]);
        }
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Function to get name of a collaborator from email
  const getCollaboratorName = (email: string) => {
    const user = allUsers.find(u => u.email === email);
    if (user?.name) return user.name;
    return email.split('@')[0];
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div 
        className={`flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
          isOpen ? 'border-blue-400' : 'border-gray-300'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected collaborators */}
        {collaborators.map(email => (
          <div 
            key={email}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
          >
            <span>{getCollaboratorName(email)}</span>            <button 
              type="button" 
              title={`Remove ${getCollaboratorName(email)}`}
              aria-label={`Remove ${getCollaboratorName(email)}`}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(email);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Input for searching/adding new collaborators */}
        <div className="flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="w-full border-none focus:outline-none focus:ring-0 min-w-[120px] py-1"
            placeholder={collaborators.length === 0 ? placeholder : ''}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full max-h-60 overflow-y-auto mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-3 py-2 flex items-center border-b border-gray-200">
            <Search size={14} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {language === 'dv' ? 'ލިޔެ ހޯދާ' : 'Type to search'}
            </span>
          </div>

          {filteredUsers.length === 0 && !customEmail && (
            <div className="px-4 py-2 text-sm text-gray-500">
              {language === 'dv' ? 'ނެތް' : 'No results found'}
            </div>
          )}

          {filteredUsers.map((user, index) => (
            <div
              key={user.email}
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-blue-50 ${
                index === highlightedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelect(user.email)}
            >
              <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                {user.name && (
                  <div className="text-sm font-medium">{user.name}</div>
                )}
                <div className="text-xs text-gray-600">{user.email}</div>
              </div>
            </div>
          ))}

          {/* Custom email option */}
          {customEmail && (
            <div
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-blue-50 ${
                highlightedIndex === filteredUsers.length ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelect(customEmail)}
            >
              <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <Plus size={16} />
              </div>
              <div>
                <div className="text-sm">Add new collaborator:</div>
                <div className="text-xs text-gray-600">{customEmail}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
