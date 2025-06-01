import React from 'react';
import { OutputData } from '@editorjs/editorjs';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { EditorJSComponent } from './EditorJSComponent';

interface CollaborativeEditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  collaborative: {
    isFieldLocked: (fieldId: string) => boolean;
    lockField: (fieldId: string) => void;
    unlockField: (fieldId: string) => void;
    broadcastFieldUpdate: (fieldId: string, value: string) => void;
    getFieldLocker: (fieldId: string) => string | null;
    pendingUpdates: Record<string, string>;
    isConnected: boolean;
    activeUsers: Array<{ user_email: string; last_seen: string; current_field?: string }>;
  };
  className?: string;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  data,
  onChange,
  placeholder,
  collaborative,
  className = 'min-h-[300px]',
}) => {
  return (
    <div className="relative">
      {/* Editor status bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {collaborative.isConnected ? (
              <Wifi size={14} className="text-green-600" />
            ) : (
              <WifiOff size={14} className="text-red-600" />
            )}
            <span className={collaborative.isConnected ? 'text-green-600' : 'text-red-600'}>
              {collaborative.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {collaborative.activeUsers.length > 1 && (
            <div className="flex items-center gap-1">
              <Users size={14} className="text-blue-600" />
              <span className="text-blue-600">
                {collaborative.activeUsers.length - 1} other{collaborative.activeUsers.length === 2 ? '' : 's'} editing
              </span>
            </div>
          )}
        </div>
        
        {collaborative.pendingUpdates.content && (
          <div className="text-amber-600 text-xs">
            Content update pending...
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="relative border border-gray-200 rounded-lg">
        <EditorJSComponent
          data={data}
          onChange={onChange}
          placeholder={placeholder || 'Start writing your article...'}
          collaborative={collaborative}
          className={className}
        />
        
        {/* Collaborative overlay when disconnected */}
        {!collaborative.isConnected && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center rounded-lg">
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
              <div className="flex items-center gap-2 text-red-600">
                <WifiOff size={16} />
                <span className="text-sm font-medium">Collaboration Offline</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Your changes are being saved locally
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
