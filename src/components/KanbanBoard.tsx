import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Clock, Eye, ThumbsUp, MessageSquare } from 'lucide-react';

// Define types for Kanban board usage
interface Article {
  id: string;
  title: string;
  heading: string;
  status: string;
  publish_date: string | null;
  created_at: string;
  views: number;
  likes: number;
  comments: number;
  is_breaking: boolean;
  is_featured: boolean;
  is_developing: boolean;
  is_exclusive: boolean;
  is_sponsored: boolean;
  sponsored_by: string | null;
  category?: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
}

interface KanbanBoardProps {
  articles: Array<{
    source: string;
    data: Article;
  }>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

const statuses = ['draft', 'in-review', 'scheduled', 'published'];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ articles, onDelete, onRefresh }) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, Article[]>>({
    draft: [],
    'in-review': [],
    scheduled: [],
    published: []
  });

  // Group articles by status for the Kanban board (excluding archived articles)
  useEffect(() => {
    const grouped = articles.reduce((acc, article) => {
      const status = article.data.status.toLowerCase();
      
      // Skip archived articles entirely
      if (status === 'archived') {
        return acc;
      }
      
      // Map the status to one of our defined statuses or use the first as default
      const mappedStatus = statuses.find(s => status.includes(s)) || statuses[0];
      
      if (!acc[mappedStatus]) {
        acc[mappedStatus] = [];
      }
      
      acc[mappedStatus].push(article.data);
      return acc;
    }, {} as Record<string, Article[]>);
    
    // Ensure all columns exist even if empty
    statuses.forEach(status => {
      if (!grouped[status]) {
        grouped[status] = [];
      }
    });
    
    setColumns(grouped);
  }, [articles]);

  // Capitalize first letter for display
  const formatStatus = (status: string): string => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleDelete = async (article: Article) => {
    if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      setDeleting(article.id);
      try {
        await onDelete(article.id);
        // Call the onRefresh function to update the board
        await onRefresh();
      } catch (error) {
        console.error('Error deleting article:', error);
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="kanban-board">
      {statuses.map(status => (
        <div key={status} className="kanban-column">
          <h2>{formatStatus(status)}</h2>
          <div>
            {columns[status]?.length > 0 ? (
              columns[status].map(article => (
                <div key={article.id} className="kanban-card">
                  <div className="flex justify-between items-start mb-2">
                    <Link 
                      to={`/dashboard/edit-article/${article.id}`}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {article.title}
                    </Link>
                    <div className="flex space-x-1">
                      <Link
                        to={`/dashboard/edit-article/${article.id}`}
                        className="text-gray-500 hover:text-blue-600 p-1"
                        title="Edit article"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="text-gray-500 hover:text-red-600 p-1"
                        onClick={() => handleDelete(article)}
                        disabled={deleting === article.id}
                        title="Delete article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {article.heading && (
                    <p className="text-sm text-gray-600 thaana-waheed text-right mb-2">
                      {article.heading}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 flex justify-between items-center">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(article.publish_date || article.created_at).toLocaleDateString()}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center" title="Views">
                        <Eye size={12} className="mr-1" />
                        {article.views || 0}
                      </span>
                      <span className="flex items-center" title="Likes">
                        <ThumbsUp size={12} className="mr-1" />
                        {article.likes || 0}
                      </span>
                      <span className="flex items-center" title="Comments">
                        <MessageSquare size={12} className="mr-1" />
                        {article.comments || 0}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tags section */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {article.is_breaking && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">Breaking</span>
                    )}
                    {article.is_featured && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">Featured</span>
                    )}
                    {article.is_developing && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">Developing</span>
                    )}
                    {article.category && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs thaana-waheed">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 text-center py-4">
                No articles
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
