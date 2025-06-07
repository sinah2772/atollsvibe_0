import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AUTH_TIMEOUTS } from '../utils/authTimeoutManager';

interface User {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
  preferred_language?: string;
  user_type?: string;
  role_id?: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      let timeoutId: number | undefined;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching current session');
        
        // Set a timeout using our enhanced timeout configuration
        timeoutId = window.setTimeout(() => {
          console.warn('Auth session fetch timeout - resetting loading state');
          setLoading(false);
          setError('Authentication session timed out. Please check your network connection and try again.');
        }, AUTH_TIMEOUTS.sessionFetch);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        // Clear timeout since we got a response
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        
        if (!session?.user?.id) {
          console.log('No active session found');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('Session found, fetching user data for ID:', session.user.id);

        const { data, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (dbError) {
          console.error('Database error fetching user:', dbError);
          throw dbError;
        }
        
        if (!data) {
          console.log('No user data found in database');
          // Create a user record if it doesn't exist but auth session exists
          if (session.user.email) {
            try {
              console.log('Creating user record for authenticated user');
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  is_admin: false
                })
                .select()
                .single();
                
              if (createError) {
                console.error('Error creating user record:', createError);
                throw createError;
              }
              
              setUser(newUser as User);
              console.log('New user record created');
              return;
            } catch (createErr) {
              console.error('Error in user creation fallback:', createErr);
            }
          }
          
          setUser(null);
          return;
        }

        console.log('User data retrieved successfully');
        setUser(data as User);
      } catch (err) {
        // Clear timeout if an error occurred
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        console.error('Error fetching user:', err);
        
        // More descriptive error handling with network troubleshooting hints
        if (err instanceof Error && err.message.includes('network')) {
          setError('Network error while fetching user data. Please check your internet connection and try again.');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred while fetching user data');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        
        // Set a timeout for auth state change operations
        let stateChangeTimeoutId: number | undefined;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(true);
          
          // Set a timeout for the auth state change operation (using enhanced timeout)
          stateChangeTimeoutId = window.setTimeout(() => {
            console.warn('Auth state change timeout - resetting loading state');
            setLoading(false);
          }, AUTH_TIMEOUTS.authStateChange);
          
          if (session?.user) {
            console.log('User signed in, fetching profile data');
            try {
              // Retry mechanism for fetching user data
              let retries = 0;
              const maxRetries = 2;
              let userData = null;
              let userError = null;
              
              while (retries <= maxRetries && !userData) {
                try {
                  const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                    
                  if (error) {
                    userError = error;
                    console.warn(`Attempt ${retries + 1}/${maxRetries + 1} failed:`, error);
                  } else {
                    userData = data;
                    break;
                  }
                } catch (e) {
                  console.warn(`Attempt ${retries + 1}/${maxRetries + 1} exception:`, e);
                }
                
                retries++;
                if (retries <= maxRetries) {
                  // Exponential backoff
                  await new Promise(r => setTimeout(r, 500 * Math.pow(2, retries)));
                }
              }
              
              // Clear the timeout since we got a response
              if (stateChangeTimeoutId) {
                clearTimeout(stateChangeTimeoutId);
                stateChangeTimeoutId = undefined;
              }
              
              if (userError && !userData) {
                console.error('Error fetching user after all retries:', userError);
                throw userError;
              }
              
              if (!userData) {
                console.log('No user record found, creating one');
                // Create user record if it doesn't exist
                if (session.user.email) {
                  const { data: newUser, error: createError } = await supabase
                    .from('users')
                    .insert({
                      id: session.user.id,
                      email: session.user.email,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      is_admin: false
                    })
                    .select()
                    .single();
                    
                  if (createError) {
                    console.error('Error creating user record:', createError);
                    throw createError;
                  }
                  
                  setUser(newUser as User);
                  console.log('Created new user record on auth change');
                }
              } else {
                console.log('User data found and set');
                setUser(userData as User);
              }
            } catch (err) {
              console.error('Error in auth state change handler:', err);
              setUser(null);
              setError('Authentication failed. Please try signing in again.');
            } finally {
              // Ensure we clear the timeout if it's still active
              if (stateChangeTimeoutId) {
                clearTimeout(stateChangeTimeoutId);
              }
              setLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Set a timeout for the sign-out operation
      const signOutPromise = async () => {
        // Always clear local storage first to ensure the user appears signed out client-side
        // even if the network request fails
        try {
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.expires_at');
          localStorage.removeItem('supabase.auth.refresh_token');
          sessionStorage.clear();
        } catch (storageErr) {
          console.warn('Error clearing storage during sign out:', storageErr);
        }
        
        // Attempt to sign out via Supabase
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
      };
      
      // Set up a timeout to prevent hanging on sign out
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timed out')), AUTH_TIMEOUTS.signOut);
      });
      
      // Race the sign-out and the timeout
      await Promise.race([signOutPromise(), timeoutPromise]);
      
      // Always set user to null regardless of the outcome
      setUser(null);
    } catch (err) {
      console.error('Error during sign out:', err);
      // Still set user to null to ensure the UI shows signed out state
      setUser(null);
      // Only throw if caller is expecting to handle the error
      throw err;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      setUser(data as User);
      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    updateUser
  };
}