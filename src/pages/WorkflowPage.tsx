import React from 'react';
import ArticleWorkflowDashboard from '../components/ArticleWorkflowDashboard';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';

const WorkflowPage: React.FC = () => {
  const { articles, loading: articlesLoading, error: articlesError } = useArticles();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const loading = articlesLoading || categoriesLoading;
    const handleArticleSelect = (articleId: string) => {
    // Navigate to edit article or show article details
    console.log('Selected article:', articleId);
  };
  
  const handleFactCheck = (articleId: string) => {
    // Handle fact checking
    console.log('Fact check:', articleId);
  };
    const handleApprove = (articleId: string) => {
    // Handle approval
    console.log('Approve article:', articleId);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (articlesError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <p className="font-medium">Error loading data</p>
          <p>{articlesError}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">      <ArticleWorkflowDashboard 
        articles={articles}
        categories={categories}
        onArticleSelect={handleArticleSelect}
        onFactCheck={handleFactCheck}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default WorkflowPage;
