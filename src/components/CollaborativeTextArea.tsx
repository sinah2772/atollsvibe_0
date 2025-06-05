import React, { useState, useEffect, useRef } from 'react';
import { Lock, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { debounce } from 'lodash';

interface CollaborativeTextAreaProps {
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
  className?: string;
  dir?: 'ltr' | 'rtl';
  rows?: number;
}

export const CollaborativeTextArea: React.FC<CollaborativeTextAreaProps> = ({
  fieldId,
  value,
  onChange,
  collaborative,
  currentUser,
  placeholder,
  className = '',
  dir = 'ltr',
  rows = 3,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [pendingRemoteValue, setPendingRemoteValue] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isLocked = collaborative.isFieldLocked(fieldId);
  const locker = collaborative.getFieldLocker(fieldId);
  const isLockedByMe = locker === currentUser;
  const hasPendingUpdate = fieldId in collaborative.pendingUpdates;

  // Debounced broadcast function
  const debouncedBroadcast = debounce((fieldId: string, value: string) => {
    collaborative.broadcastFieldUpdate(fieldId, value);
  }, 500);

  // Update local value when external value changes
  useEffect(() => {
    if (!isFocused && value !== localValue) {
      setLocalValue(value);
    }
  }, [value, isFocused, localValue]);

  // Handle pending updates from other users
  useEffect(() => {
    if (hasPendingUpdate && !isFocused) {
      const remoteValue = collaborative.pendingUpdates[fieldId];
      if (remoteValue !== localValue && remoteValue !== value) {
        setPendingRemoteValue(remoteValue);
        setShowConflictDialog(true);
      }
    }
  }, [collaborative.pendingUpdates, fieldId, isFocused, localValue, value, hasPendingUpdate]);

  const handleFocus = () => {
    if (!isLocked || isLockedByMe) {
      setIsFocused(true);
      collaborative.lockField(fieldId);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isLockedByMe) {
      collaborative.unlockField(fieldId);
    }
    // Sync any final changes
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    debouncedBroadcast(fieldId, newValue);
  };

  const handleAcceptRemote = () => {
    if (pendingRemoteValue !== null) {
      setLocalValue(pendingRemoteValue);
      onChange(pendingRemoteValue);
      setShowConflictDialog(false);
      setPendingRemoteValue(null);
    }
  };

  const handleKeepLocal = () => {
    setShowConflictDialog(false);
    setPendingRemoteValue(null);
    // Broadcast our local version
    debouncedBroadcast(fieldId, localValue);
  };

  const canEdit = !isLocked || isLockedByMe;

  return (
    <div className="relative">
      <textarea
        ref={textAreaRef}
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`${className} ${
          !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${
          isLocked && !isLockedByMe ? 'border-red-300' : ''
        } ${
          isLockedByMe ? 'border-blue-300 ring-1 ring-blue-200' : ''
        }`}
        disabled={!canEdit}
        dir={dir}
        rows={rows}
      />

      {/* Field status indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isLocked && !isLockedByMe && (
          <div className="flex items-center gap-1 text-red-600">
            <Lock size={14} />
            <span className="text-xs">{locker}</span>
          </div>
        )}
        {isLockedByMe && (
          <div className="flex items-center gap-1 text-blue-600">
            <CheckCircle size={14} />
            <span className="text-xs">Editing</span>
          </div>
        )}
        {hasPendingUpdate && !showConflictDialog && (
          <div className="flex items-center gap-1 text-amber-600">
            <Clock size={14} />
            <span className="text-xs">Update pending</span>
          </div>
        )}
      </div>

      {/* Conflict resolution dialog */}
      {showConflictDialog && pendingRemoteValue !== null && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-white border border-amber-300 rounded-lg shadow-lg">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle size={16} className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                Conflicting Changes Detected
              </h4>
              <p className="text-xs text-amber-700">
                Another user has made changes to this field while you were editing.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Your version:</label>
              <div className="text-xs p-2 bg-blue-50 border border-blue-200 rounded max-h-20 overflow-y-auto">
                {localValue || <em>Empty</em>}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Their version:</label>
              <div className="text-xs p-2 bg-green-50 border border-green-200 rounded max-h-20 overflow-y-auto">
                {pendingRemoteValue || <em>Empty</em>}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">            <button
              onClick={handleKeepLocal}
              className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              aria-label="Keep your version of the text"
              title="Keep your version of the text"
            >
              Keep Mine
            </button>
            <button
              onClick={handleAcceptRemote}
              className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              aria-label="Accept other user's version of the text"
              title="Accept other user's version of the text"
            >
              Accept Theirs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
