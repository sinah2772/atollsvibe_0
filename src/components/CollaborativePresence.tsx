import React from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { CollaborativeUser } from '../hooks/useCollaborativeArticle';

interface CollaborativePresenceProps {
  activeUsers: CollaborativeUser[];
  isConnected: boolean;
}

export const CollaborativePresence: React.FC<CollaborativePresenceProps> = ({
  activeUsers,
  isConnected,
}) => {
  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getRandomColor = (email: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    
    const hash = email.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Wifi size={16} className="text-green-500" />
        ) : (
          <WifiOff size={16} className="text-red-500" />
        )}
        <span className="text-sm text-gray-600">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Active users */}
      {activeUsers.length > 0 && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* User avatars */}
          <div className="flex -space-x-1">
            {activeUsers.slice(0, 5).map((user) => (
              <div
                key={user.user_id}
                className={`relative w-8 h-8 rounded-full ${getRandomColor(user.user_email)} flex items-center justify-center text-xs font-medium text-white border-2 border-white shadow-sm`}
                title={`${user.user_email}${user.current_field ? ` - editing ${user.current_field}` : ''}`}
              >
                {getInitials(user.user_email)}
                
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
            ))}
            
            {activeUsers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs font-medium text-white border-2 border-white shadow-sm">
                +{activeUsers.length - 5}
              </div>
            )}
          </div>
        </>
      )}

      {/* Field activity indicator */}
      {activeUsers.some(user => user.current_field) && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(activeUsers.filter(user => user.current_field).map(user => user.current_field))).map(field => (
              <div
                key={field}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                title={`Being edited by: ${activeUsers.filter(user => user.current_field === field).map(user => user.user_email).join(', ')}`}
              >
                {field}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
