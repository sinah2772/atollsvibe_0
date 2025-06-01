import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export type Article = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  category_id?: number;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: User;
  category?: Category;
  tags?: string[];
};

export type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  bio?: string;
  updated_at?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  is_admin: boolean;
  onboarding_completed?: boolean;
  preferred_language?: string;
  user_type?: string;
  role_id?: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
};

export type Category = {
  id: number;
  name: string;
  name_en?: string;
  slug: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  content: string;
  article_id: number;
  user_id: string;
  parent_id?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: User;
};

export type Like = {
  id: number;
  article_id: number;
  user_id: string;
  created_at: string;
};

// Database service for data operations
export const dbService = {
  // User operations
  users: {
    async getAll(): Promise<{ data: User[] | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('email', { ascending: true });
      
      return { data, error };
    },

    async getById(userId: string): Promise<{ data: User | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('users')
        .select('*, profile:profiles(*)')
        .eq('id', userId)
        .single();
      
      return { data, error };
    },
    
    async update(userId: string, updates: Partial<User>): Promise<{ data: User | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      return { data, error };
    },
    
    async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      return { data, error };
    }
  },
  
  // Article operations
  articles: {
    async getAll({ page = 1, pageSize = 10, status = 'published', categoryId = null }: {
      page?: number;
      pageSize?: number;
      status?: string;
      categoryId?: number | null;
    } = {}): Promise<{ data: Article[] | null; count: number | null; error: PostgrestError | null }> {
      let query = supabase
        .from('articles')
        .select('*, author:users(id, name, avatar_url), category:categories(id, name, slug)', { count: 'exact' })
        .eq('status', status)
        .order('published_at', { ascending: false });
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error, count } = await query
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      return { data, count, error };
    },
    
    async getBySlug(slug: string): Promise<{ data: Article | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('articles')
        .select('*, author:users(id, name, avatar_url), category:categories(id, name, slug)')
        .eq('slug', slug)
        .single();
      
      if (data) {
        // Fetch tags for the article
        const { data: tagsData } = await supabase
          .from('article_tags')
          .select('tag_name')
          .eq('article_id', data.id);
        
        if (tagsData) {
          data.tags = tagsData.map(t => t.tag_name);
        }
      }
      
      return { data, error };
    },
    
    async create(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Article | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...article,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      return { data, error };
    },
    
    async update(id: number, updates: Partial<Article>): Promise<{ data: Article | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    },
    
    async updateTags(articleId: number, tags: string[]): Promise<{ error: PostgrestError | null }> {
      // First delete all existing tags for this article
      const { error: deleteError } = await supabase
        .from('article_tags')
        .delete()
        .eq('article_id', articleId);
      
      if (deleteError) {
        return { error: deleteError };
      }
      
      if (tags.length === 0) {
        return { error: null };
      }
      
      // Then insert new tags
      const tagsToInsert = tags.map(tag => ({
        article_id: articleId,
        tag_name: tag.trim()
      }));
      
      const { error } = await supabase
        .from('article_tags')
        .insert(tagsToInsert);
      
      return { error };
    }
  },
  
  // Category operations
  categories: {
    async getAll(): Promise<{ data: Category[] | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      return { data, error };
    },
    
    async getBySlug(slug: string): Promise<{ data: Category | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      return { data, error };
    },
    
    async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Category | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      return { data, error };
    }
  },
  
  // Comment operations
  comments: {
    async getByArticle(articleId: number): Promise<{ data: Comment[] | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user:users(id, name, avatar_url)')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });
      
      return { data, error };
    },
    
    async create(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Comment | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          ...comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      return { data, error };
    },
    
    async update(id: number, updates: Partial<Comment>): Promise<{ data: Comment | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('comments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    },
    
    async delete(id: number): Promise<{ error: PostgrestError | null }> {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);
      
      return { error };
    }
  },
  
  // Profile operations
  profiles: {
    async getById(userId: string): Promise<{ data: Profile | null; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      return { data, error };
    },
    
    async update(userId: string, updates: Partial<Profile>): Promise<{ error: PostgrestError | null }> {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      return { error };
    }
  },
  
  // Like operations
  likes: {
    async getByArticle(articleId: number): Promise<{ data: { count: number } | null; error: PostgrestError | null }> {
      const { error, count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('article_id', articleId);
      
      return { data: count !== null ? { count } : null, error };
    },
    
    async hasUserLiked(articleId: number, userId: string): Promise<{ data: boolean; error: PostgrestError | null }> {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single();
      
      return { data: !!data, error };
    },
    
    async toggleLike(articleId: number, userId: string): Promise<{ action: 'added' | 'removed'; error: PostgrestError | null }> {
      // Check if like already exists
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single();
      
      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', userId);
        
        return { action: 'removed', error };
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({
            article_id: articleId,
            user_id: userId,
            created_at: new Date().toISOString()
          });
        
        return { action: 'added', error };
      }
    }
  }
};
