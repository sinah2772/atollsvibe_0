import { Link } from 'react-router-dom';
import { Clock, Eye, ThumbsUp, MessageSquare, Edit, Trash2, Filter as FilterIcon, Columns, List } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import ArticleFilters, { ArticleFilters as ArticleFiltersType } from '../components/ArticleFilters';
import { supabase } from '../lib/supabase';
import KanbanBoard from '../components/KanbanBoard';

// Define types that were previously imported from useArticles
interface Article {
  id: string;
  title: string;
  heading: string;
  social_heading: string | null;
  content: Record<string, unknown>;
  category_id: number;
  subcategory_id: number | null;
  atoll_ids: number[];
  island_ids: number[];
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
  is_breaking: boolean;
  is_featured: boolean;
  is_developing: boolean;
  is_exclusive: boolean;
  is_sponsored: boolean;
  sponsored_by: string | null;
  sponsored_url: string | null;
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
}

// Define CombinedArticle type
interface CombinedArticle {
  source: 'articles'; // 'news_articles' table has been removed
  data: Article;
}

const Articles = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ArticleFiltersType>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);  
  const [articles, setArticles] = useState<CombinedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    // Function to fetch articles from Supabase - wrapped with useCallback
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate start and end for pagination
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize - 1;
        // Debugging the Supabase query
      console.log('Fetching articles with range:', { start, end });
        // Updated query to match the actual database structure - using only correct relationships
      const { data, error, count } = await supabase
        .from('articles')
        .select(`
          *,
          category:category_id(*),
          subcategory:subcategory_id(*)
        `, { count: 'exact' })
        .range(start, end);
        
      if (error) throw error;
      
      // Transform the data to match CombinedArticle format
      const transformedData = data.map(item => ({
        source: 'articles' as const,
        data: item as unknown as Article
      }));
      
      setArticles(transformedData);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);
    // Function to delete an article
  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Return a resolved promise to maintain compatibility with the previous hook
      return Promise.resolve();
    } catch (err) {
      console.error('Error deleting article:', err);
      return Promise.reject(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  // Function to refresh articles - wrapped with useCallback
  const refresh = useCallback(() => {
    fetchArticles();
    return Promise.resolve();
  }, [fetchArticles]);
    // Function to update pagination - wrapped with useCallback
  const setPagination = useCallback((options: { page: number, pageSize: number }) => {
    setCurrentPage(options.page);
    setPageSize(options.pageSize);
  }, []);
  
  const [deleting, setDeleting] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Handle optimistic updates for article deletions
  const [deletingArticles, setDeletingArticles] = useState<string[]>([]);
  

  // Auto hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initial fetch on component mount
  useEffect(() => {
    void refresh();
  }, [refresh]);
  
  // Update filtering status and reset pagination when filters change
  useEffect(() => {
    const hasActiveFilters = Object.keys(activeFilters).length > 0;
    const hasSearchTerm = searchTerm.trim() !== '';
    
    // Update filtering status
    setIsFiltered(hasActiveFilters || hasSearchTerm);
    
    // When filters change, we should reset to page 1
    if (hasActiveFilters || hasSearchTerm) {
      setCurrentPage(1);
      setPagination({ page: 1, pageSize });
    }
  }, [activeFilters, searchTerm, pageSize, setPagination]);
  
  // Get the actual article data from the combined article object
  const getArticleData = (combinedArticle: CombinedArticle) => {
    return combinedArticle.data;
  };
  

  // Filter articles based on selected filters and search term
  const filteredArticles = useMemo(() => {
    if (!articles || articles.length === 0) return [];

    // First filter out any articles that are being deleted
    const availableArticles = articles.filter(article => {
      const articleData = getArticleData(article);
      return !deletingArticles.includes(articleData.id);
    });
    
    return availableArticles.filter(article => {
      const articleData = getArticleData(article);
      
      // Filter by text search
      if (searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        const title = String(articleData.title || '').toLowerCase();
        const heading = String(articleData.heading || '').toLowerCase();
        const socialHeading = articleData.social_heading ? String(articleData.social_heading).toLowerCase() : '';
        
        // Check if any of the article text fields match the search term
        if (!(title.includes(search) || heading.includes(search) || socialHeading.includes(search))) {
          return false;
        }
      }
      
      // Filter by category
      if (activeFilters.categoryId && articleData.category_id !== activeFilters.categoryId) {
        return false;
      }

      // Filter by subcategory - only for regular articles
      if (activeFilters.subcategoryId && article.source === 'articles') {
        const regularArticle = article.data;
        // Check if the property exists and matches the filter
        if ('subcategory_id' in regularArticle && 
            regularArticle.subcategory_id !== activeFilters.subcategoryId) {
          return false;
        }
      }

      // Filter by status
      if (activeFilters.status && articleData.status !== activeFilters.status) {
        return false;
      }      // Filter by atolls - only for regular articles
      if (activeFilters.atollIds && activeFilters.atollIds.length > 0 && article.source === 'articles') {
        const articleData = article.data;
        // Check if the property exists and if any atoll matches
        if (articleData.atoll_ids && Array.isArray(articleData.atoll_ids) &&
            !articleData.atoll_ids.some((id: number) => activeFilters.atollIds?.includes(id))) {
          return false;
        }
      }

      // Filter by islands - only for regular articles
      if (activeFilters.islandIds && activeFilters.islandIds.length > 0 && article.source === 'articles') {
        const articleData = article.data;
        // Check if the property exists and if any island matches
        if (articleData.island_ids && Array.isArray(articleData.island_ids) &&
            !articleData.island_ids.some((id: number) => activeFilters.islandIds?.includes(id))) {
          return false;
        }
      }

      // Filter by flags
      const flags = activeFilters.flags || {};
      if (flags.isBreaking && !articleData.is_breaking) return false;
      if (flags.isFeatured && !articleData.is_featured) return false;
      if (flags.isDeveloping && !articleData.is_developing) return false;
      if (flags.isExclusive && !articleData.is_exclusive) return false;
      if (flags.isSponsored && !articleData.is_sponsored) return false;

      // If it passes all filters, include it
      return true;
    });
  }, [articles, activeFilters, searchTerm, deletingArticles]);

  const displayedArticles = isFiltered ? filteredArticles : articles.filter(article => {
    const articleData = getArticleData(article);
    return !deletingArticles.includes(articleData.id);
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="font-bold mb-1">Error loading articles</div>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {notification && (
        <div className={`flex items-center justify-between mb-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {notification.message}
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close notification"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <div className="flex space-x-3">
          {/* View toggle buttons */}
          <div className="flex bg-gray-100 rounded-lg mr-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-3 py-2 rounded-l-lg ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              title="List view"
            >
              <List size={18} className="mr-1" />
              <span className="text-sm">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center px-3 py-2 rounded-r-lg ${
                viewMode === 'kanban'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              title="Kanban board view"
            >
              <Columns size={18} className="mr-1" />
              <span className="text-sm">Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            title="Filter articles"
          >
            <FilterIcon size={18} className="mr-2" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          <Link
            to="/dashboard/new-article"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Article
          </Link>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search articles by title or heading..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <ArticleFilters 
          onFilterChange={setActiveFilters} 
          initialFilters={activeFilters}
        />
      )}
      
      {isFiltered && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
          <span className="text-sm text-blue-700">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found with your filters
          </span>
          <button 
            className="text-sm text-blue-700 hover:text-blue-900 underline"
            onClick={() => {
              setSearchTerm('');
              setActiveFilters({});
            }}
            title="Clear all applied filters"
          >
            Clear all filters
          </button>
        </div>
      )}

      {displayedArticles.length === 0 && !isLoading ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm && Object.keys(activeFilters).length > 0 
              ? "Try adjusting your search term or filters to find what you're looking for."
              : searchTerm 
                ? "Try a different search term." 
                : Object.keys(activeFilters).length > 0 
                  ? "Try adjusting or clearing your filters."
                  : "There are no articles to display. Create your first article!"
            }
          </p>
          <div className="flex justify-center space-x-4">
            {(searchTerm || Object.keys(activeFilters).length > 0) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilters({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                title="Clear all filters and search terms"
              >
                Clear All
              </button>
            )}
            <Link
              to="/dashboard/new-article"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              Create Article
            </Link>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard 
          articles={displayedArticles}
          onDelete={deleteArticle}
          onRefresh={refresh}
        />
      ) : (
        <div className="space-y-4">
          {displayedArticles.map((combinedArticle) => {
            const article = getArticleData(combinedArticle);
            const source = combinedArticle.source;
            
            return (
              <div key={`${source}-${article.id}`} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>                    {/* Source Indicator - removed condition that was causing type errors */}
                    {/* Indicator removed as it's not needed with single article source */}<h2 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link 
                        to={`/dashboard/edit-article/${article.id}`} 
                        className="hover:text-blue-600"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 thaana-waheed text-right">{article.heading}</p>
                  </div>
                  <div className="flex space-x-2">                    <Link
                      to={`/dashboard/edit-article/${article.id}`}
                      className="text-gray-600 hover:text-blue-600 p-2"
                      title="Edit article"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      className="text-gray-600 hover:text-red-600 p-2"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this article?')) {
                          try {
                            // Set the article as being deleted
                            setDeleting(article.id);
                            
                            // Add to deletingArticles list for optimistic UI update
                            setDeletingArticles(prev => [...prev, article.id]);
                            
                            // Show temporary success notification for optimistic update
                            setNotification({
                              type: 'success',
                              message: `Deleting article "${article.title}"...`
                            });                            // Actually delete the article
                            deleteArticle(article.id)
                              .then(() => {
                                setNotification({
                                  type: 'success',
                                  message: `Article "${article.title}" was successfully deleted.`
                                });
                              })
                              .catch((error) => {
                                console.error('Error deleting article:', error);
                                setNotification({
                                  type: 'error',
                                  message: 'Failed to delete article. Please try again.'
                                });
                                
                                // Remove from deletingArticles list since deletion failed
                                setDeletingArticles(prev => prev.filter(id => id !== article.id));
                                
                                // Refresh the list to restore the article if deletion failed
                                refresh();
                              })
                              .finally(() => {
                                setDeleting(null);
                              });
                          } catch (error) {
                            console.error('Error handling delete:', error);
                            setDeleting(null);
                            // Remove from deletingArticles list
                            setDeletingArticles(prev => prev.filter(id => id !== article.id));
                            setNotification({
                              type: 'error',
                              message: 'Failed to process delete request.'
                            });
                          }
                        }
                      }}
                      disabled={deleting === article.id}
                      aria-label="Delete article"
                      title="Delete article"
                    >
                      {deleting === article.id ? (
                        <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></span>
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {new Date(article.publish_date || article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {article.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {article.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      {article.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={16} />
                      {article.comments || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Article flags */}
                  <div className="mb-2 w-full flex flex-wrap gap-2">
                    {article.is_breaking && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Breaking
                      </span>
                    )}
                    {article.is_featured && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Featured
                      </span>
                    )}
                    {article.is_developing && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Developing
                      </span>
                    )}
                    {article.is_exclusive && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Exclusive
                      </span>
                    )}
                    {article.is_sponsored && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Sponsored {article.sponsored_by && `by ${article.sponsored_by}`}
                      </span>
                    )}
                  </div>                  {/* Category and subcategory */}
                  {article.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm thaana-waheed">
                      {article.category.name}
                    </span>
                  )}
                  
                  {/* Subcategory - only for regular articles */}
                  {source === 'articles' && 'subcategory' in article && article.subcategory && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm thaana-waheed">
                      {article.subcategory.name}
                    </span>
                  )}
                    {/* Atolls - only for regular articles - using atoll_ids array */}
                  {source === 'articles' && article.atoll_ids && article.atoll_ids.length > 0 && (
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm thaana-waheed">
                      {article.atoll_ids.length} {article.atoll_ids.length === 1 ? 'Atoll' : 'Atolls'}
                    </span>
                  )}
                  
                  {/* Islands - only for regular articles - using island_ids array */}
                  {source === 'articles' && article.island_ids && article.island_ids.length > 0 && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm thaana-waheed">
                      {article.island_ids.length} {article.island_ids.length === 1 ? 'Island' : 'Islands'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {/* Pagination Controls */}
        {!isFiltered && displayedArticles.length > 0 && totalCount > pageSize && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700 mr-4">
                  Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalCount)}
                  </span>{" "}
                  of <span className="font-medium">{totalCount}</span> results
                </p>
                <div className="flex items-center">
                  <label htmlFor="pageSize" className="mr-2 text-sm text-gray-700">
                    Per page:
                  </label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      setPageSize(newSize);
                      // When changing page size, reset to page 1
                      setCurrentPage(1);
                      setPagination({ page: 1, pageSize: newSize });
                    }}
                    className="block w-20 rounded-md border border-gray-300 bg-white py-1.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      setPagination({ page: newPage, pageSize });
                    }}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Previous page"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, i) => {
                    const pageNum = i + 1;
                    // Only show some page numbers to avoid cluttering
                    if (
                      pageNum === 1 ||
                      pageNum === Math.ceil(totalCount / pageSize) ||
                      Math.abs(pageNum - currentPage) <= 2
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            setPagination({ page: pageNum, pageSize });
                          }}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                          aria-label={`Page ${pageNum}`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 3 && pageNum > 1) || 
                      (pageNum === currentPage + 3 && pageNum < Math.ceil(totalCount / pageSize))
                    ) {
                      // Show ellipsis
                      return <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => {
                      const newPage = Math.min(Math.ceil(totalCount / pageSize), currentPage + 1);
                      setCurrentPage(newPage);
                      setPagination({ page: newPage, pageSize });
                    }}
                    disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage >= Math.ceil(totalCount / pageSize) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Next page"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
      
      {/* Only show pagination in list view */}
      {viewMode === 'list' && !isFiltered && displayedArticles.length > 0 && totalCount > pageSize && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          {/* Existing pagination controls remain here */}
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700 mr-4">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-medium">{totalCount}</span> results
              </p>
              {/* Rest of pagination controls */}
            </div>
            {/* Rest of pagination controls */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
