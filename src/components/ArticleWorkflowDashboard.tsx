import React, { useState, useMemo } from 'react';
import { Calendar, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  heading: string;
  status: string;
  created_at: string;
  updated_at: string;
  publish_date: string | null;
  user_id: string;
  category_id: number;
  is_breaking: boolean;
  is_featured: boolean;
  is_developing: boolean;
  is_exclusive: boolean;
  is_sponsored: boolean;
  news_type: string | null;
  news_priority: number | null;
  news_source: string | null;
  views: number;
  likes: number;
  comments: number;
  fact_checked: boolean | null;
  approved_by_id: string | null;
  editor_notes: string | null;
  author_notes: string | null;
}

interface Category {
  id: number;
  name: string;
  name_en: string;
}

interface ArticleWorkflowDashboardProps {
  articles: Article[];
  categories: Category[];
  onArticleSelect: (articleId: string) => void;
  onApprove: (articleId: string) => void;
  onFactCheck: (articleId: string, isFactChecked: boolean) => void;
}

type WorkflowStatus = 'draft' | 'review' | 'fact-check' | 'approved' | 'published';
type Priority = 'urgent' | 'high' | 'normal' | 'low';

const ArticleWorkflowDashboard: React.FC<ArticleWorkflowDashboardProps> = ({
  articles,
  categories,
  onArticleSelect,
  onApprove,
  onFactCheck
}) => {
  const [selectedStatus, setSelectedStatus] = useState<WorkflowStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  // Categorize articles by workflow status (excluding archived articles)
  const workflowArticles = useMemo(() => {
    const categorized = {
      draft: [] as Article[],
      review: [] as Article[],
      'fact-check': [] as Article[],
      approved: [] as Article[],
      published: [] as Article[]
    };

    articles.forEach(article => {
      // Skip archived articles entirely
      if (article.status === 'archived') {
        return;
      }
      
      if (article.status === 'published') {
        categorized.published.push(article);
      } else if (article.approved_by_id) {
        categorized.approved.push(article);
      } else if (article.fact_checked === false || article.fact_checked === null) {
        categorized['fact-check'].push(article);
      } else if (article.fact_checked === true && !article.approved_by_id) {
        categorized.review.push(article);
      } else {
        categorized.draft.push(article);
      }
    });

    return categorized;
  }, [articles]);
  // Filter articles based on selected filters
  const filteredArticles = useMemo(() => {
    // First exclude archived articles from all filtering
    const nonArchivedArticles = articles.filter(article => article.status !== 'archived');
    
    let filtered = selectedStatus === 'all' 
      ? nonArchivedArticles 
      : workflowArticles[selectedStatus] || [];

    if (selectedPriority !== 'all') {
      const priorityMap: { [key in Priority]: number } = {
        urgent: 1,
        high: 2, 
        normal: 3,
        low: 4
      };
      filtered = filtered.filter((article: Article) => 
        article.news_priority === priorityMap[selectedPriority]
      );
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((article: Article) =>
        article.title.toLowerCase().includes(search) ||
        article.heading.toLowerCase().includes(search) ||
        (article.news_source && article.news_source.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [articles, workflowArticles, selectedStatus, selectedPriority, searchTerm]);
  const getStatusColor = (status: string, article: Article): string => {
    if (status === 'published') return 'bg-green-100 text-green-800 border-green-200';
    if (article.approved_by_id) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (article.fact_checked === true) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (article.fact_checked === false) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (article: Article): string => {
    if (article.status === 'published') return 'Published';
    if (article.approved_by_id) return 'Approved';
    if (article.fact_checked === true && !article.approved_by_id) return 'In Review';
    if (article.fact_checked === false || article.fact_checked === null) return 'Needs Fact Check';
    return 'Draft';
  };

  const getPriorityColor = (priority: number | null): string => {
    if (!priority) return 'bg-gray-100 text-gray-600';
    if (priority === 1) return 'bg-red-100 text-red-800';
    if (priority === 2) return 'bg-orange-100 text-orange-800';
    if (priority === 3) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-600';
  };

  const getPriorityText = (priority: number | null): string => {
    if (!priority) return 'Normal';
    const priorityMap: { [key: number]: string } = {
      1: 'Urgent',
      2: 'High',
      3: 'Normal',
      4: 'Low',
      5: 'Lowest'
    };
    return priorityMap[priority] || 'Normal';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const category = categories.find(c => c.id === article.category_id);
    
    return (
      <div 
        className="dashboard-card p-4 rounded-lg cursor-pointer"
        onClick={() => onArticleSelect(article.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
              {article.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-1">
              {article.heading}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1 ml-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(article.status, article)}`}>
              {getStatusText(article)}
            </span>
            {article.news_priority && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(article.news_priority)}`}>
                {getPriorityText(article.news_priority)}
              </span>
            )}
          </div>
        </div>

        {/* Article Flags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {article.is_breaking && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Breaking</span>
          )}
          {article.is_featured && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">Featured</span>
          )}
          {article.is_developing && (
            <span className="px-2 py-1 bg-amber-600 text-white text-xs rounded-full">Developing</span>
          )}
          {article.is_exclusive && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Exclusive</span>
          )}
          {article.is_sponsored && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Sponsored</span>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{article.views}</span>
              </div>
            </div>
          </div>
          
          {category && (
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>{category.name}</span>
            </div>
          )}

          {article.news_source && (
            <div className="flex items-center space-x-1">
              <span>Source: {article.news_source}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {article.fact_checked === null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFactCheck(article.id, true);
                }}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
              >
                Fact Check
              </button>
            )}
            
            {article.fact_checked === true && !article.approved_by_id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(article.id);
                }}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
              >
                Approve
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {article.fact_checked === true && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {article.fact_checked === false && (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            {article.approved_by_id && (
              <CheckCircle className="w-4 h-4 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Editorial Workflow</h2>
        <div className="text-sm text-gray-500">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(workflowArticles).map(([status, articles]) => (
          <div 
            key={status}
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-colors ${
              selectedStatus === status ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status as WorkflowStatus)}
          >
            <div className="text-2xl font-bold text-gray-900">{articles.length}</div>
            <div className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</div>
          </div>
        ))}
      </div>      {/* Filters */}
      <div className="dashboard-section p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as WorkflowStatus | 'all')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              aria-label="Filter articles by status"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="fact-check">Needs Fact Check</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              id="priority-filter"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              aria-label="Filter articles by priority"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredArticles.map((article: Article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default ArticleWorkflowDashboard;
