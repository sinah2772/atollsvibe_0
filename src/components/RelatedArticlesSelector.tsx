import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  heading: string;
  published_at: string;
}

interface RelatedArticlesSelectorProps {
  selectedArticleIds: string[];
  onChange: (articleIds: string[]) => void;
  language: 'en' | 'dv';
}

const RelatedArticlesSelector: React.FC<RelatedArticlesSelectorProps> = ({
  selectedArticleIds,
  onChange,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);

  // Fetch selected articles on initial load
  useEffect(() => {
    const fetchSelectedArticles = async () => {
      if (selectedArticleIds.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, heading, created_at as published_at')
          .in('id', selectedArticleIds);
          
        if (error) throw error;
        if (data) setSelectedArticles(data);
      } catch (error) {
        console.error('Error fetching selected articles:', error);
      }
    };
    
    fetchSelectedArticles();
  }, [selectedArticleIds]);

  // Search for articles when the search term changes
  useEffect(() => {
    const searchArticles = async () => {
      if (!searchTerm || searchTerm.length < 3) {
        setArticles([]);
        return;
      }
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, heading, created_at as published_at')
          .or(`title.ilike.%${searchTerm}%,heading.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        if (data) setArticles(data);
      } catch (error) {
        console.error('Error searching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(searchArticles, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelectArticle = (article: Article) => {
    if (!selectedArticleIds.includes(article.id)) {
      const newSelectedIds = [...selectedArticleIds, article.id];
      onChange(newSelectedIds);
      setSelectedArticles([...selectedArticles, article]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveArticle = (articleId: string) => {
    const newSelectedIds = selectedArticleIds.filter(id => id !== articleId);
    onChange(newSelectedIds);
    setSelectedArticles(selectedArticles.filter(article => article.id !== articleId));
  };

  return (
    <div className="w-full">
      <div className="relative mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
          placeholder={language === 'dv' ? 'މަޟްމޫނެއް ހޯދާ' : 'Search for articles'}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {showDropdown && searchTerm.length >= 3 && articles.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectArticle(article)}
              >
                <div className={`font-medium ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}>
                  {language === 'dv' ? article.heading : article.title}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(article.published_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {selectedArticles.map((article) => (
          <div key={article.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? article.heading : article.title}
            </span>
            <button
              onClick={() => handleRemoveArticle(article.id)}
              className="text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticlesSelector;
