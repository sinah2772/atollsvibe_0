import { AuthError, Session } from '@supabase/supabase-js';

export interface User {
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

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
}
