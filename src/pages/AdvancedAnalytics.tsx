import React from 'react';
import ArticleAnalytics from '../components/ArticleAnalytics';
import { useArticles } from '../hooks/useArticles';

const AdvancedAnalyticsPage: React.FC = () => {
  const { articles, loading, error } = useArticles();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <p className="font-medium">Error loading articles</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <ArticleAnalytics articles={articles} />
    </div>
  );
};

export default AdvancedAnalyticsPage;
