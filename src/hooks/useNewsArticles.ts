/**
 * @deprecated This hook is deprecated. Use useArticles from './useArticles' instead.
 */
import { useArticles } from './useArticles';
import { useEffect } from 'react';

/**
 * A wrapper for the useArticles hook that provides backward compatibility
 * with code that was using the old useNewsArticles hook.
 */
export function useNewsArticles() {
  // For compatibility, we re-export useArticles with the default 'articles' table
  const { 
    articles, 
    loading, 
    error, 
    totalCount,
    refresh,
    createArticle,
    updateArticle,
    deleteArticle
  } = useArticles('articles');

  useEffect(() => {
    console.warn('useNewsArticles is deprecated. Please use useArticles from "./useArticles" instead.');
  }, []);

  // We still expose the same API as before for backwards compatibility
  return { 
    articles, 
    loading, 
    error,
    totalCount,
    refresh,
    createArticle,
    updateArticle,
    deleteArticle
  };
}