import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from './useUser';
import { debounce } from 'lodash';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface FieldLock {
  field_name: string;
  user_id: string;
  user_email: string;
  locked_at: string;
  expires_at: string;
}

export interface CollaborativeUser {
  user_id: string;
  user_email: string;
  last_seen: string;
  current_field?: string;
}

export interface ArticleFieldUpdate {
  field_name: string;
  field_value: string;
  user_id: string;
  updated_at: string;
}

interface UseCollaborativeArticleProps {
  articleId?: string;
  sessionId: string;
}

export const useCollaborativeArticle = ({ articleId, sessionId }: UseCollaborativeArticleProps) => {
  const { user } = useUser();
  const [fieldLocks, setFieldLocks] = useState<Record<string, FieldLock>>({});
  const [activeUsers, setActiveUsers] = useState<CollaborativeUser[]>([]);
  const [fieldUpdates, setFieldUpdates] = useState<Record<string, ArticleFieldUpdate>>({});
  const [isConnected, setIsConnected] = useState(false);
    const presenceChannel = useRef<RealtimeChannel | null>(null);
  const locksChannel = useRef<RealtimeChannel | null>(null);
  const updatesChannel = useRef<RealtimeChannel | null>(null);
  const lockTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  // Initialize real-time channels
  useEffect(() => {
    if (!user || !sessionId) return;

    // Copy ref value to avoid stale closure in cleanup
    const timeouts = lockTimeouts.current;

    const channelName = articleId ? `article_${articleId}` : `new_article_${sessionId}`;

    // Presence channel for active users
    presenceChannel.current = supabase.channel(`presence_${channelName}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Field locks channel
    locksChannel.current = supabase.channel(`locks_${channelName}`);

    // Field updates channel
    updatesChannel.current = supabase.channel(`updates_${channelName}`);

    // Set up presence tracking
    presenceChannel.current      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.current?.presenceState() || {};
        const users: CollaborativeUser[] = [];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(state).forEach(([userId, presences]: [string, any]) => {
          const presenceArray = Array.isArray(presences) ? presences : [];
          if (presenceArray.length > 0) {
            const presence = presenceArray[0];
            users.push({
              user_id: userId,
              user_email: presence.user_email,
              last_seen: presence.last_seen,
              current_field: presence.current_field,
            });
          }
        });
        
        setActiveUsers(users.filter(u => u.user_id !== user.id));
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('presence', { event: 'join' }, (payload: any) => {
        console.log('User joined:', payload.key, payload.newPresences);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('presence', { event: 'leave' }, (payload: any) => {
        console.log('User left:', payload.key, payload.leftPresences);
      });    // Set up field locks listening
    locksChannel.current
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('broadcast', { event: 'field_locked' }, (payload: any) => {
        const lock: FieldLock = payload.lock;
        setFieldLocks(prev => ({
          ...prev,
          [lock.field_name]: lock
        }));
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('broadcast', { event: 'field_unlocked' }, (payload: any) => {
        const { field_name } = payload;
        if (field_name) {
          setFieldLocks(prev => {
            const newLocks = { ...prev };
            delete newLocks[field_name];
            return newLocks;
          });
        }
      });    // Set up field updates listening
    updatesChannel.current
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('broadcast', { event: 'field_updated' }, (payload: any) => {
        const update: ArticleFieldUpdate = payload.update;
        if (update.user_id !== user.id) {
          setFieldUpdates(prev => ({
            ...prev,
            [update.field_name]: update
          }));
        }
      });

    // Subscribe to all channels
    Promise.all([
      presenceChannel.current.subscribe(),
      locksChannel.current.subscribe(),
      updatesChannel.current.subscribe(),    ]).then(() => {
      setIsConnected(true);
      // Track initial presence directly to avoid dependency issues
      if (presenceChannel.current && user) {
        presenceChannel.current.track({
          user_id: user.id,
          user_email: user.email,
          last_seen: new Date().toISOString(),
        });
      }
    });    return () => {
      presenceChannel.current?.unsubscribe();
      locksChannel.current?.unsubscribe();
      updatesChannel.current?.unsubscribe();
      
      // Clear all lock timeouts using the copied value
      Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [user, sessionId, articleId]);  // Debounced presence update - using useRef to avoid complex dependencies
  const debouncedUpdatePresence = useRef(
    debounce((currentField?: string) => {
      if (presenceChannel.current && user) {
        presenceChannel.current.track({
          user_id: user.id,
          user_email: user.email,
          last_seen: new Date().toISOString(),
          current_field: currentField,
        });
      }
    }, 1000)
  ).current;
  // Lock a field
  const lockField = useCallback(async (fieldName: string): Promise<boolean> => {
    if (!user || !locksChannel.current) return false;

    // Check if field is already locked by someone else
    const existingLock = fieldLocks[fieldName];
    if (existingLock && existingLock.user_id !== user.id) {
      const now = new Date();
      const expiresAt = new Date(existingLock.expires_at);
      if (now < expiresAt) {
        return false; // Field is locked by another user
      }
    }

    const lock: FieldLock = {
      field_name: fieldName,
      user_id: user.id,
      user_email: user.email || '',
      locked_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30000).toISOString(), // 30 seconds
    };

    // Broadcast the lock
    await locksChannel.current.send({
      type: 'broadcast',
      event: 'field_locked',
      payload: { lock },
    });

    // Set local state
    setFieldLocks(prev => ({ ...prev, [fieldName]: lock }));

    // Auto-unlock after timeout
    if (lockTimeouts.current[fieldName]) {
      clearTimeout(lockTimeouts.current[fieldName]);
    }
    
    lockTimeouts.current[fieldName] = setTimeout(() => {
      // Direct unlock call to avoid dependency issues
      if (locksChannel.current) {
        locksChannel.current.send({
          type: 'broadcast',
          event: 'field_unlocked',
          payload: { field_name: fieldName },
        });
        setFieldLocks(prev => {
          const newLocks = { ...prev };
          delete newLocks[fieldName];
          return newLocks;
        });
        if (lockTimeouts.current[fieldName]) {
          clearTimeout(lockTimeouts.current[fieldName]);
          delete lockTimeouts.current[fieldName];
        }
      }
    }, 30000);

    // Update presence to show current field
    debouncedUpdatePresence(fieldName);

    return true;
  }, [user, fieldLocks, debouncedUpdatePresence]);
  // Unlock a field  
  const unlockField = useCallback(async (fieldName: string) => {
    if (!user || !locksChannel.current) return;

    const lock = fieldLocks[fieldName];
    if (!lock || lock.user_id !== user.id) return;

    // Broadcast the unlock
    await locksChannel.current.send({
      type: 'broadcast',
      event: 'field_unlocked',
      payload: { field_name: fieldName },
    });

    // Clear local state
    setFieldLocks(prev => {
      const newLocks = { ...prev };
      delete newLocks[fieldName];
      return newLocks;
    });

    // Clear timeout
    if (lockTimeouts.current[fieldName]) {
      clearTimeout(lockTimeouts.current[fieldName]);
      delete lockTimeouts.current[fieldName];
    }

    // Update presence to clear current field
    debouncedUpdatePresence();
  }, [user, fieldLocks, debouncedUpdatePresence]);
  // Broadcast field update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const broadcastFieldUpdate = useCallback(async (fieldName: string, fieldValue: any) => {
    if (!user || !updatesChannel.current) return;

    const update: ArticleFieldUpdate = {
      field_name: fieldName,
      field_value: fieldValue,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    await updatesChannel.current.send({
      type: 'broadcast',
      event: 'field_updated',
      payload: { update },
    });
  }, [user]);  // Simple debounced field update without complex callback typing
  const debouncedBroadcastUpdate = useRef(
    debounce((fieldName: string, fieldValue: string) => {
      if (user && updatesChannel.current) {
        const update: ArticleFieldUpdate = {
          field_name: fieldName,
          field_value: fieldValue,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        };

        updatesChannel.current.send({
          type: 'broadcast',
          event: 'field_updated',
          payload: { update },
        });
      }
    }, 500)
  ).current;

  // Check if field is locked by another user
  const isFieldLocked = useCallback((fieldName: string): boolean => {
    const lock = fieldLocks[fieldName];
    if (!lock || !user) return false;
    
    if (lock.user_id === user.id) return false; // Own lock
    
    const now = new Date();
    const expiresAt = new Date(lock.expires_at);
    return now < expiresAt;
  }, [fieldLocks, user]);
  // Get field lock info
  const getFieldLock = useCallback((fieldName: string): FieldLock | null => {
    return fieldLocks[fieldName] || null;
  }, [fieldLocks]);

  // Get field locker (simplified for components)
  const getFieldLocker = useCallback((fieldId: string): string | null => {
    const lock = fieldLocks[fieldId];
    return lock ? lock.user_email : null;
  }, [fieldLocks]);

  // Get field update info
  const getFieldUpdate = useCallback((fieldName: string): ArticleFieldUpdate | null => {
    return fieldUpdates[fieldName] || null;
  }, [fieldUpdates]);

  // Clear field update (when user acknowledges the update)
  const clearFieldUpdate = useCallback((fieldName: string) => {
    setFieldUpdates(prev => {
      const newUpdates = { ...prev };
      delete newUpdates[fieldName];
      return newUpdates;
    });
  }, []);

  // Convert field updates to pending updates format expected by components
  const pendingUpdates = Object.keys(fieldUpdates).reduce((acc, key) => {
    acc[key] = fieldUpdates[key].field_value;
    return acc;
  }, {} as Record<string, string>);

  return {
    isConnected,
    activeUsers,
    fieldLocks,
    fieldUpdates,
    lockField,
    unlockField,
    isFieldLocked,
    getFieldLock,
    getFieldLocker,
    getFieldUpdate,
    clearFieldUpdate,
    broadcastFieldUpdate,
    pendingUpdates,
    debouncedBroadcastUpdate,
    updatePresence: debouncedUpdatePresence,
  };
};
