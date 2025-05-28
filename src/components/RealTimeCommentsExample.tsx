import React from 'react';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { dbService } from '../services/dbService';

interface Comment {
  id: number;
  content: string;
  article_id: number;
  user_id: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

const RealTimeCommentsExample: React.FC<{ articleId: number }> = ({ articleId }) => {
  const { data: comments, loading, error } = useRealtimeSubscription<Comment>('comments', {
    filter: 'article_id',
    filterValue: articleId,
    event: '*' // Listen for all events (INSERT, UPDATE, DELETE)
  });
  
  const [newComment, setNewComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    
    try {
      const userId = '12345'; // In a real app, get this from authentication context
      
      await dbService.comments.create({
        article_id: articleId,
        user_id: userId,
        content: newComment.trim(),
        status: 'pending'
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (error) {
    return <div className="text-red-500">Error loading comments: {error.message}</div>;
  }
  
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Real-time Comments</h2>
      
      <div className="mb-6 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {comment.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="ml-2">
                    <p className="font-medium">{comment.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmitComment} className="mt-4">
        <div className="flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RealTimeCommentsExample;
