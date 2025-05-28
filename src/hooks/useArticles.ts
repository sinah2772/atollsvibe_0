import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type ArticleTable = 'articles';

export interface Article {
  id: string;
  title: string;
  heading: string;
  social_heading: string | null;
  content: Record<string, unknown>;
  category_id: number;
  subcategory_id: number | null;
  atoll_ids: number[];
  island_ids: number[];
  government_ids?: string[];
  cover_image: string | null;
  image_caption: string | null;
  status: string;
  publish_date: string | null;
  views: number;
  likes: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Flag fields
  is_breaking: boolean;
  is_featured: boolean;
  is_developing: boolean;
  is_exclusive: boolean;
  is_sponsored: boolean;
  sponsored_by: string | null;
  sponsored_url: string | null;
  // Related entities
  category?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
  subcategory?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
  // Referenced entities
  atolls?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  }[];
  islands?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  }[];
  government?: {
    id: string;
    name: string;
    name_en: string;
    slug: string;
  }[];
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export function useArticles(articleTable: ArticleTable = 'articles', id?: string, paginationOptions?: PaginationOptions) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  // Default pagination values
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: paginationOptions?.page || 1,
    pageSize: paginationOptions?.pageSize || 10,
  });

  useEffect(() => {
    if (id) {
      // Check if we already have this article in our state to avoid unnecessary fetching
      const cachedArticle = articles.find(a => a.id === id);
      if (cachedArticle) {
        setArticle(cachedArticle);
        setIsLoading(false);
      } else {
        fetchArticleById(id);
      }
    } else {
      // Always fetch articles when pagination changes or on first load
      fetchArticles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, paginationOptions?.page, paginationOptions?.pageSize, articleTable]);

  async function fetchArticles() {
    try {
      setLoading(true);
      setError(null);

      // Add a timeout to prevent infinite loading state
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError('Request timed out. Please try again.');
      }, 15000); // 15 second timeout for potential complex joins
      
      // Calculate pagination ranges
      const { page = 1, pageSize = 10 } = paginationOptions || {};
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Build query for getting count
      const countQuery = supabase.from(articleTable).select('id', { count: 'exact' });
      
      // Get the count of all articles including all statuses
      const { count: totalArticles, error: countError } = await countQuery;
        
      if (countError) throw countError;
      
      // Update total count
      if (totalArticles !== null) {
        setTotalCount(totalArticles);
      }

      // Fetch articles with their category and subcategory data
      const query = supabase
        .from(articleTable)
        .select(`
          *,
          category:category_id(id, name, name_en, slug),
          subcategory:subcategory_id(id, name, name_en, slug)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);
        
      // Get the data
      const { data, error } = await query;
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (error) throw error;

      // Get all the unique atoll IDs from all articles
      const allAtollIds = Array.from(
        new Set(
          data?.flatMap(article => article.atoll_ids || []) || []
        )
      );

      // Get all the unique island IDs from all articles
      const allIslandIds = Array.from(
        new Set(
          data?.flatMap(article => article.island_ids || []) || []
        )
      );

      // Get all the unique government IDs from all articles
      const allGovernmentIds = Array.from(
        new Set(
          data?.flatMap(article => article.government_ids || []) || []
        )
      );

      interface AtollData {
        id: number;
        name: string;
        name_en: string;
        slug: string;
      }

      interface IslandData {
        id: number;
        name: string;
        name_en: string;
        slug: string;
      }

      // Fetch all relevant atolls in a single query if there are any atoll IDs
      let atollsData: AtollData[] = [];
      if (allAtollIds.length > 0) {
        const { data: atollsResult } = await supabase
          .from('atolls')
          .select('id, name, name_en, slug')
          .in('id', allAtollIds);
        
        atollsData = atollsResult || [];
      }

      // Fetch all relevant islands in a single query if there are any island IDs
      let islandsData: IslandData[] = [];
      if (allIslandIds.length > 0) {
        const { data: islandsResult } = await supabase
          .from('islands')
          .select('id, name, name_en, slug')
          .in('id', allIslandIds);
        
        islandsData = islandsResult || [];
      }

      // Fetch all relevant government ministries in a single query if there are any government IDs
      let governmentData: { id: string; name: string; name_en: string; slug: string; }[] = [];
      if (allGovernmentIds.length > 0) {
        const { data: governmentResult } = await supabase
          .from('government')
          .select('id, name, name_en, slug')
          .in('id', allGovernmentIds);
        
        governmentData = governmentResult || [];
      }

      // Process each article to include its related data
      const articlesWithDefaults = (data || []).map(item => {
        // Map atoll IDs to full atoll objects
        const articleAtolls = item.atoll_ids?.map((atollId: number) => 
          atollsData.find(atoll => atoll.id === atollId)
        ).filter(Boolean) || [];

        // Map island IDs to full island objects
        const articleIslands = item.island_ids?.map((islandId: number) => 
          islandsData.find(island => island.id === islandId)
        ).filter(Boolean) || [];

        // Map government IDs to full government objects
        const articleGovernment = item.government_ids?.map((govId: string) => 
          governmentData.find(gov => gov.id === govId)
        ).filter(Boolean) || [];

        // Return article with all related data
        return {
          ...item,
          atolls: articleAtolls,
          islands: articleIslands,
          government: articleGovernment
        };
      });
      
      setArticles(articlesWithDefaults);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function fetchArticleById(articleId: string) {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(articleTable)
        .select(`
          *,
          category:category_id(id, name, name_en, slug),
          subcategory:subcategory_id(id, name, name_en, slug)
        `)
        .eq('id', articleId)
        .single();

      if (error) throw error;

      interface AtollData {
        id: number;
        name: string;
        name_en: string;
        slug: string;
      }

      interface IslandData {
        id: number;
        name: string;
        name_en: string;
        slug: string;
      }

      // Fetch related atolls if there are atoll_ids
      let atolls: AtollData[] = [];
      if (data.atoll_ids && data.atoll_ids.length > 0) {
        const { data: atollsData } = await supabase
          .from('atolls')
          .select('id, name, name_en, slug')
          .in('id', data.atoll_ids);
          
        atolls = atollsData || [];
      }

      // Fetch related islands if there are island_ids
      let islands: IslandData[] = [];
      if (data.island_ids && data.island_ids.length > 0) {
        const { data: islandsData } = await supabase
          .from('islands')
          .select('id, name, name_en, slug')
          .in('id', data.island_ids);
          
        islands = islandsData || [];
      }
      
      // Fetch related government ministries if there are government_ids
      let government: { id: string; name: string; name_en: string; slug: string; }[] = [];
      if (data.government_ids && data.government_ids.length > 0) {
        const { data: governmentData } = await supabase
          .from('government')
          .select('id, name, name_en, slug')
          .in('id', data.government_ids);
          
        government = governmentData || [];
      }
      
      // Ensure the article data has all required fields with defaults
      const processedArticle = {
        ...data,
        content: data.content || {},
        atoll_ids: data.atoll_ids || [],
        island_ids: data.island_ids || [],
        government_ids: data.government_ids || [],
        image_caption: data.image_caption || null,
        cover_image: data.cover_image || null,
        social_heading: data.social_heading || null,
        views: data.views || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
        // Add the flag fields with default values
        is_breaking: data.is_breaking || false,
        is_featured: data.is_featured || false,
        is_developing: data.is_developing || false,
        is_exclusive: data.is_exclusive || false,
        is_sponsored: data.is_sponsored || false,
        sponsored_by: data.sponsored_by || null,
        sponsored_url: data.sponsored_url || null,
        // Ensure category and subcategory are properly formatted
        category: Array.isArray(data.category) ? data.category[0] : data.category,
        subcategory: Array.isArray(data.subcategory) ? data.subcategory[0] : data.subcategory,
        // Add related entities
        atolls,
        islands,
        government
      };

      setArticle(processedArticle);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function createArticle(newArticle: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments'>) {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(articleTable)
        .insert([newArticle])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateArticle(articleId: string, updatedArticle: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(articleTable)
        .update(updatedArticle)
        .eq('id', articleId)
        .select()
        .single();

      if (error) throw error;
      
      // Update the articles list with the updated article
      setArticles((prevArticles: Article[]) => 
        prevArticles.map((article: Article) => 
          article.id === articleId ? { ...article, ...data } : article
        )
      );
      
      return data;
    } catch (err) {
      console.error('Error updating article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(articleId: string) {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from(articleTable)
        .delete()
        .eq('id', articleId);

      if (error) throw error;
      
      // Update the articles list by removing the deleted article
      setArticles((prevArticles: Article[]) => 
        prevArticles.filter((article: Article) => article.id !== articleId)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Memoize fetchArticles to prevent it from changing on every render
  const refresh = useCallback(() => {
    fetchArticles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    articles,
    article,
    loading,
    isLoading,
    error,
    totalCount,
    pagination,
    setPagination,
    refresh,
    createArticle,
    updateArticle,
    deleteArticle
  };
}