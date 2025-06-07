import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ArticleMultiStepForm from '../components/ArticleMultiStepForm';

const NewArticleMultiStep: React.FC = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // The ProtectedRoute already handles authentication checks,
  // so we don't need to duplicate the logic here
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleMultiStepForm />
    </div>
  );
};

export default NewArticleMultiStep;
