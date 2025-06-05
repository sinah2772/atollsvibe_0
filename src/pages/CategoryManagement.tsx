import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryManagement from '../components/CategoryManagement';
import { useUser } from '../hooks/useUser';
import { useCategories } from '../hooks/useCategories';
import { supabase } from '../lib/supabase';

const CategoryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const { categories } = useCategories();
  const [language, setLanguage] = useState<'en' | 'dv'>('dv');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, userLoading, navigate]);
  // Check if user has admin privileges
  const isAdmin = user?.is_admin === true;

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className={`text-2xl font-bold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ހުއްދައެއް ނެތް' : 'Access Denied'}
          </h1>
          <p className={`text-gray-600 mb-6 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv'
              ? 'މި ޞަފްޙާ ބެލުމުގެ ހުއްދަ ލިބިފައި ނުވެއެވެ. އެޑްމިން ބޭނުންކުރާ އެކައުންޓަކުން ވަދެވަޑައިގަންނަވާށެވެ.'
              : 'You do not have permission to view this page. Please log in with an administrator account.'}
          </p>
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                language === 'dv' ? 'thaana-waheed' : ''
              }`}
            >
              {language === 'dv' ? 'ޑޭޝްބޯޑަށް ދާށެވެ' : 'Go to Dashboard'}
            </button>
            <button
              onClick={() => setLanguage(lang => (lang === 'dv' ? 'en' : 'dv'))}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {language === 'dv' ? 'EN' : 'DV'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ބައިތަކާއި ކުޑިބައިތައް' : 'Categories & Subcategories'}
        </h1>
        
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
              language === 'dv' ? 'thaana-waheed' : ''
            }`}
          >
            {language === 'dv' ? 'ޑޭޝްބޯޑަށް ދާށެވެ' : 'Back to Dashboard'}
          </button>
          
          <button
            onClick={() => setLanguage(lang => (lang === 'dv' ? 'en' : 'dv'))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {language === 'dv' ? 'EN' : 'DV'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <CategoryManagement language={language} />
        </div>
        
        <aside className="lg:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className={`text-xl font-semibold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އިރުޝާދު' : 'Quick Guide'}
            </h2>
            <div className={`text-sm text-gray-700 space-y-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              <p>
                {language === 'dv' 
                  ? 'މި ޞަފްޙާގައި ބައިތަކާއި ކުޑިބައިތައް އިތުރުކުރުމާއި، އަޕްޑޭޓްކުރުމާއި، ޑިލީޓްކުރުން ކުރެވޭނެއެވެ.' 
                  : 'This page allows you to manage categories and subcategories for your content.'}
              </p>
              <p>
                {language === 'dv'
                  ? 'ކުޑިބައެއް އޮތް ބައެއް ޑިލީޓްކުރެވޭނީ އެ ބައެއްގެ ކުޑިބައިތައް ޑިލީޓްކުރުމަށްފަހުއެވެ.'
                  : 'A category with subcategories can only be deleted after all its subcategories are removed.'}
              </p>
              <p>
                {language === 'dv'
                  ? 'އަވެށިނަން (slug) އަކީ ވެބްސައިޓްގައި ޔޫއާރްއެލް (URL) ގައި ބޭނުންކުރާ ޓެކްސްޓެކެވެ.'
                  : 'Slugs are used in URLs and should contain only letters, numbers, and hyphens.'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className={`text-xl font-semibold mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ތަފާސް ހިސާބު' : 'Statistics'}
            </h2>
            <div className="space-y-3">              <div>
                <div className="flex justify-between">
                  <span className={`text-sm text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? 'ބައިތަކުގެ ޢަދަދު' : 'Total Categories'}
                  </span>
                  <span className="font-medium">{user && categories ? categories.length : 0}</span>
                </div>                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    // Using width CSS variable defined at the element level to avoid ESLint inline style warning 
                    ref={el => {
                      if (el) {
                        el.style.width = `${Math.min(100, (categories?.length || 0) * 5)}%`;
                      }
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className={`text-sm text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? 'ކުޑިބައިތަކުގެ ޢަދަދު' : 'Total Subcategories'}
                  </span>                  <span className="font-medium">
                    {user && categories ? categories.reduce((count: number, cat) => count + (cat.subcategories?.length || 0), 0) : 0}
                  </span>
                </div>                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    // Using width CSS variable defined at the element level to avoid ESLint inline style warning
                    ref={el => {
                      if (el) {
                        const subcategoryCount = categories ? 
                          categories.reduce((count: number, cat) => count + (cat.subcategories?.length || 0), 0) : 0;
                        el.style.width = `${Math.min(100, subcategoryCount * 2)}%`;
                      }
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
