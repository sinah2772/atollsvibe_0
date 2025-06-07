import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface CollaborativeInputProps {
  fieldId: string;
  value: string;
  onChange: (value: string) => void;
  collaborative: {
    isFieldLocked: (fieldId: string) => boolean;
    lockField: (fieldId: string) => void;
    unlockField: (fieldId: string) => void;
    broadcastFieldUpdate: (fieldId: string, value: string) => void;
    getFieldLocker: (fieldId: string) => string | null;
    pendingUpdates: Record<string, string>;
  };
  currentUser: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
  dir?: string;
}

export const CollaborativeInput: React.FC<CollaborativeInputProps> = ({
  fieldId,
  value,
  onChange,
  collaborative,
  currentUser,
  placeholder,
  disabled = false,
  className = '',
  type = 'text',
  dir = 'ltr',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasUnseenUpdate, setHasUnseenUpdate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const lastBroadcastValue = useRef(value);

  // Check if field is locked
  const isFieldLocked = collaborative.isFieldLocked(fieldId);
  const fieldLocker = collaborative.getFieldLocker(fieldId);
  const isLockedByOther = isFieldLocked && fieldLocker !== currentUser;
  const pendingUpdate = collaborative.pendingUpdates[fieldId];

  // Update local value when prop value changes (from external updates)
  useEffect(() => {
    if (value !== localValue && !isFocused) {
      setLocalValue(value);
      setHasUnseenUpdate(true);
    }
  }, [value, localValue, isFocused]);

  // Clear unseen update flag when user sees the change
  useEffect(() => {
    if (pendingUpdate && pendingUpdate !== localValue) {
      setHasUnseenUpdate(true);
    }
  }, [pendingUpdate, localValue]);

  const handleFocus = useCallback(() => {
    if (isLockedByOther) return;
    
    setIsFocused(true);
    setHasUnseenUpdate(false);
    collaborative.lockField(fieldId);
  }, [fieldId, isLockedByOther, collaborative]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    collaborative.unlockField(fieldId);
    
    // Sync final value if it changed
    if (localValue !== value) {
      onChange(localValue);
    }
  }, [fieldId, localValue, value, onChange, collaborative]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
    
    // Broadcast the change if it's significantly different from last broadcast
    if (Math.abs(newValue.length - lastBroadcastValue.current.length) > 2 || 
        newValue !== lastBroadcastValue.current) {
      collaborative.broadcastFieldUpdate(fieldId, newValue);
      lastBroadcastValue.current = newValue;
    }
  }, [fieldId, collaborative]);

  const acceptUpdate = useCallback(() => {
    if (pendingUpdate) {
      setLocalValue(pendingUpdate);
      onChange(pendingUpdate);
      setHasUnseenUpdate(false);
    }
  }, [pendingUpdate, onChange]);
  // Determine input styling based on state
  const getInputClassName = () => {
    const baseClasses = 'glass-input w-full transition-colors duration-200';
    
    if (isLockedByOther) {
      return `${baseClasses} border-red-400/50 text-red-600 cursor-not-allowed ${className}`;
    }
    
    if (hasUnseenUpdate) {
      return `${baseClasses} border-blue-400 ring-2 ring-blue-500/20 ${className}`;
    }
    
    if (isFocused) {
      return `${baseClasses} border-blue-400 ring-2 ring-blue-500/20 ${className}`;
    }
    
    return `${baseClasses} hover:border-blue-400/50 ${className}`;
  };

  const inputProps = {
    ref: inputRef,
    value: localValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder,
    disabled: disabled || isLockedByOther,
    className: getInputClassName(),
    type,
    dir,
  };

  return (
    <div className="relative">
      <input {...inputProps} />
      
      {/* Status indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        {isLockedByOther && (
          <div className="flex items-center text-red-500" title={`Locked by ${fieldLocker}`}>
            <Lock size={16} />
          </div>
        )}
          {hasUnseenUpdate && (
          <button
            onClick={acceptUpdate}
            className="flex items-center text-blue-500 hover:text-blue-700"
            title="Accept update"
            aria-label="Accept update"
          >
            <AlertCircle size={16} />
          </button>
        )}
        
        {isFocused && (
          <div className="flex items-center text-green-500" title="You are editing">
            <CheckCircle size={16} />
          </div>
        )}
      </div>
    </div>
  );
};
