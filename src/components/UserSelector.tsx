import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, User, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface UserSelectorProps {
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  placeholder?: string;
  className?: string;
  language?: 'en' | 'dv';
  disabled?: boolean;
  currentUserId?: string; // To exclude current user from selection
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUserIds,
  onChange,
  placeholder,
  className = '',
  language = 'en',
  disabled = false,
  currentUserId
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users.filter(user => user.id !== currentUserId));
    } else {
      const filtered = users.filter(user => {
        if (user.id === currentUserId) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const email = user.email.toLowerCase();
        const name = user.name?.toLowerCase() || '';
        
        return email.includes(searchLower) || name.includes(searchLower);
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, currentUserId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('email', { ascending: true });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter(id => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  const handleUserRemove = (userId: string) => {
    onChange(selectedUserIds.filter(id => id !== userId));
  };

  const getSelectedUsers = () => {
    return users.filter(user => selectedUserIds.includes(user.id));
  };

  const getUserDisplayName = (user: User) => {
    return user.name || user.email.split('@')[0];
  };

  const getUserInitials = (user: User) => {
    if (user.name) {
      return user.name.split(' ').map(n => n.charAt(0).toUpperCase()).slice(0, 2).join('');
    }
    return user.email.charAt(0).toUpperCase();
  };

  const selectedUsers = getSelectedUsers();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected users display */}
      <div 
        className={`min-h-[42px] w-full px-3 py-2 border rounded-lg bg-white cursor-pointer flex items-center gap-2 flex-wrap ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'
        } ${isOpen ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedUsers.length === 0 ? (
          <span className="text-gray-500 flex-1">
            {placeholder || (language === 'dv' ? 'ޔޫޒަރ އައޭ' : 'Select users')}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedUsers.map(user => (
              <div
                key={user.id}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {getUserInitials(user)}
                </div>
                <span className="max-w-24 truncate">{getUserDisplayName(user)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserRemove(user.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                  disabled={disabled}
                  title={`Remove ${getUserDisplayName(user)}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <span className="text-xs text-gray-500">
              {selectedUsers.length} {language === 'dv' ? 'ހޮވާފައި' : 'selected'}
            </span>
          )}
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={inputRef}
              type="text"
              placeholder={language === 'dv' ? 'ފާޚަކަށް ނުވަތަ އީމެއިލް' : 'Search by name or email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* User list */}
          <div className="max-h-40 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                {language === 'dv' ? 'ލޯޑްވަނީ...' : 'Loading...'}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 text-sm">
                {error}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {language === 'dv' ? 'ޔޫޒަރ ނުފެނުނު' : 'No users found'}
              </div>
            ) : (
              filteredUsers.map(user => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={getUserDisplayName(user)}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                            <User size={16} />
                          </div>
                        )}
                        {user.is_admin && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">A</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName(user)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <Check size={16} className="text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
