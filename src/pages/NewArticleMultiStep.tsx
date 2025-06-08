import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Users, Languages, Globe, FileText, Edit3 } from 'lucide-react';
import ArticleMultiStepForm from '../components/ArticleMultiStepForm';
import './NewArticleMultiStep.css';

const NewArticleMultiStep: React.FC = () => {
  const { loading } = useAuth();
  const [language, setLanguage] = useState<'en' | 'dv'>('en');
    if (loading) {
    return (
      <div className="flex h-screen dashboard-bg items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-indigo-400 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 backdrop-blur-sm">        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-100/20 to-purple-100/20"></div>
          <div className="absolute inset-0 pattern-dots"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">            {/* Main Title with Glassmorphism */}
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 glass-card rounded-2xl border border-white/30 shadow-2xl mb-8 group hover:bg-white/25 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                  <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? 'އާ ލިޔުމެއް އުފައްދާ' : 'Create New Article'}
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Subtitle */}
            <p className={`text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' 
                ? 'ފޯމް ފުރިހަމަކޮށް އިޚްލާޞްތެރިކަމާއެކު ތިޔަ ވާހަކަ ދުނިޔެއަށް ހިއްސާކުރޭ' 
                : 'Complete the form to publish your story to the world'}
            </p>            {/* Feature Cards Row */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {/* English Language Card */}
              <div className="flex items-center gap-3 px-6 py-3 bg-white/30 glass-card rounded-full border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300 group">
                <Globe className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-800">English</span>
              </div>
              
              {/* Collaboration Card */}
              <div className="flex items-center gap-3 px-6 py-3 bg-white/30 glass-card rounded-full border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300 group cursor-pointer">
                <Users className="w-5 h-5 text-indigo-600 group-hover:bounce-gentle transition-transform" />
                <span className="font-medium text-gray-800">Collaboration</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Multi-step Process Card */}
              <div className="flex items-center gap-3 px-6 py-3 bg-white/30 glass-card rounded-full border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300 group">
                <FileText className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-800">Step-by-Step</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap justify-center items-center gap-4">              {/* Language Toggle */}
              <div className="inline-flex items-center p-1 bg-white/40 glass-card rounded-2xl border border-white/50 shadow-xl">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  English
                </button>
                <button
                  onClick={() => setLanguage('dv')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 thaana-waheed ${
                    language === 'dv'
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  ދިވެހި
                </button>
              </div>
                {/* Collaboration Status */}
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <Users className="w-5 h-5 group-hover:bounce-gentle" />
                <span className="font-medium">
                  {language === 'dv' ? 'އެއްބަސްވުން' : 'Collaboration Ready'}
                </span>
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleMultiStepForm />
      </div>
    </div>
  );
};

export default NewArticleMultiStep;
