import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Users,
  Filter,
  RefreshCw 
} from 'lucide-react';

// CSV Data Analysis Types
interface CSVArticle {
  id: string;
  title: string;
  heading: string;
  social_heading: string;
  content: string;
  category_id: number;
  cover_image: string;
  image_caption: string;
  status: string;
  publish_date: string;
  views: number;
  likes: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  atoll_ids: string;
  island_ids: string;
  subcategory_id: number;
  is_breaking: boolean;
  is_featured: boolean;
  is_developing: boolean;
  is_exclusive: boolean;
  is_sponsored: boolean;
  sponsored_by: string;
  sponsored_url: string;
  news_type: string;
  government_ids: string;
  news_priority: number;
  news_source: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  related_articles: string;
  tags: string;
  author_notes: string;
  fact_checked: boolean;
  approved_by_id: string;
  notification_sent: boolean;
}

interface DataAnalysisProps {
  csvData?: CSVArticle[];
}

interface AnalysisMetrics {
  totalArticles: number;
  statusDistribution: { [key: string]: number };
  categoryDistribution: { [key: number]: number };
  flagDistribution: {
    breaking: number;
    featured: number;
    developing: number;
    exclusive: number;
    sponsored: number;
  };
  engagementStats: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
  };
  contentAnalysis: {
    withImages: number;
    withTags: number;
    withMetadata: number;
    factChecked: number;
    approved: number;
  };
  temporalAnalysis: {
    publishedThisMonth: number;
    publishedLastMonth: number;
    draftArticles: number;
    scheduledArticles: number;
  };
}

const ArticleDataAnalysis: React.FC<DataAnalysisProps> = ({ csvData = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [showDetails, setShowDetails] = useState(false);

  // Sample CSV data from your file
  const sampleData: CSVArticle[] = [
    {
      id: '2da4e3c7-76b4-4785-80b8-2f46ee71785a',
      title: 'ggggggggggggggggggggggg',
      heading: 'gggggggggggg',
      social_heading: 'gggg',
      content: '{"type":"doc","content":[{"type":"paragraph","content":[{"text":"gggggggggggggg","type":"text"}]}]}',
      category_id: 23,
      cover_image: '',
      image_caption: '',
      status: 'published',
      publish_date: '2025-05-29 23:45:53.194+00',
      views: 0,
      likes: 0,
      comments: 0,
      user_id: '5389abfa-4ed7-469a-9f0e-a275bff8e5aa',
      created_at: '2025-05-25 16:45:07.305801+00',
      updated_at: '2025-05-25 16:45:07.305801+00',
      atoll_ids: '[11,1,2,3]',
      island_ids: '[]',
      subcategory_id: 1,
      is_breaking: false,
      is_featured: false,
      is_developing: true,
      is_exclusive: false,
      is_sponsored: false,
      sponsored_by: '',
      sponsored_url: '',
      news_type: '',
      government_ids: '[]',
      news_priority: 0,
      news_source: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      related_articles: '[]',
      tags: '[]',
      author_notes: '',
      fact_checked: false,
      approved_by_id: '',
      notification_sent: false
    },
    {
      id: '37e07139-9a8e-469a-8d50-b7c784e1f769',
      title: 'llll',
      heading: 'lllll',
      social_heading: 'lllllllllllllllll',
      content: '{"type":"doc","content":[{"type":"paragraph","content":[{"text":"lllllllllllllllllllllll","type":"text"}]},{"type":"image","attrs":{"alt":null,"src":"https://vtkxjgsnnslwjzfyvdqu.supabase.co/storage/v1/object/public/images/1748164688689-RAMADHAAN-SLIDES.00_00_13_00.Still001.jpg","title":null}}]}',
      category_id: 23,
      cover_image: 'https://vtkxjgsnnslwjzfyvdqu.supabase.co/storage/v1/object/public/images/qlnz3vmcbrk-1748087519010.jpg',
      image_caption: 'lllllllll',
      status: 'published',
      publish_date: '2025-05-29 23:47:48.822+00',
      views: 0,
      likes: 0,
      comments: 0,
      user_id: '5389abfa-4ed7-469a-9f0e-a275bff8e5aa',
      created_at: '2025-05-24 11:52:17.00278+00',
      updated_at: '2025-05-24 11:52:17.00278+00',
      atoll_ids: '[1,2]',
      island_ids: '[5,6,7]',
      subcategory_id: 2,
      is_breaking: false,
      is_featured: false,
      is_developing: false,
      is_exclusive: false,
      is_sponsored: false,
      sponsored_by: '',
      sponsored_url: '',
      news_type: '',
      government_ids: '["1","2","3","4"]',
      news_priority: 0,
      news_source: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      related_articles: '[]',
      tags: '[]',
      author_notes: '',
      fact_checked: false,
      approved_by_id: '',
      notification_sent: false
    },
    {
      id: '38e6eeac-b6a1-4969-9272-b670c5274438',
      title: 'fffffffffffffffffffffff',
      heading: 'fffffff',
      social_heading: 'ffffffffffff',
      content: '{"type":"doc","content":[{"type":"paragraph","content":[{"text":"gggggggggggggggggg","type":"text"}]}]}',
      category_id: 23,
      cover_image: 'https://vtkxjgsnnslwjzfyvdqu.supabase.co/storage/v1/object/public/images/55g9vg1mirs-1748145830614.jpg',
      image_caption: 'bbbbbbbb',
      status: 'draft',
      publish_date: '',
      views: 0,
      likes: 0,
      comments: 0,
      user_id: '5389abfa-4ed7-469a-9f0e-a275bff8e5aa',
      created_at: '2025-05-30 03:34:59.193451+00',
      updated_at: '2025-05-30 03:34:59.193451+00',
      atoll_ids: '[1,2,3]',
      island_ids: '[5,6,7,8]',
      subcategory_id: 2,
      is_breaking: false,
      is_featured: false,
      is_developing: false,
      is_exclusive: false,
      is_sponsored: false,
      sponsored_by: '',
      sponsored_url: '',
      news_type: 'breaking',
      government_ids: '[]',
      news_priority: 1,
      news_source: 'bbbbbbb',
      meta_title: 'ggggggggggggg',
      meta_description: 'ggggggg',
      meta_keywords: '["ggggggggggggggg"]',
      related_articles: '["867647e9-64db-4920-91e2-994824e0b65c"]',
      tags: '["bbb"]',
      author_notes: 'jjjjjjjjjjj',
      fact_checked: false,
      approved_by_id: '',
      notification_sent: false
    },
    {
      id: '867647e9-64db-4920-91e2-994824e0b65c',
      title: 'ddddddddddddddddd',
      heading: 'ddddddddddddddddddd',
      social_heading: 'ddddddddddddddd',
      content: '{"type":"doc","content":[{"type":"paragraph","content":[{"text":"hhhhhhhhhhhhhhhhhhhhhhhhhhhh","type":"text"}]},{"type":"image","attrs":{"alt":null,"src":"https://vtkxjgsnnslwjzfyvdqu.supabase.co/storage/v1/object/public/images/dvywjdljluu-1748161129469.jpg","title":null}}]}',
      category_id: 23,
      cover_image: 'https://vtkxjgsnnslwjzfyvdqu.supabase.co/storage/v1/object/public/images/xy3o4loy2mh-1748089140425.jpg',
      image_caption: 'ddddddddddd',
      status: 'published',
      publish_date: '2025-05-25 08:20:16.256+00',
      views: 0,
      likes: 0,
      comments: 0,
      user_id: '5389abfa-4ed7-469a-9f0e-a275bff8e5aa',
      created_at: '2025-05-24 12:19:13.663245+00',
      updated_at: '2025-05-24 12:19:13.663245+00',
      atoll_ids: '[1,3,5]',
      island_ids: '[]',
      subcategory_id: 1,
      is_breaking: true,
      is_featured: true,
      is_developing: false,
      is_exclusive: false,
      is_sponsored: false,
      sponsored_by: '',
      sponsored_url: '',
      news_type: '',
      government_ids: '[]',
      news_priority: 0,
      news_source: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      related_articles: '[]',
      tags: '[]',
      author_notes: '',
      fact_checked: false,
      approved_by_id: '',
      notification_sent: false
    }
  ];

  const dataToAnalyze = csvData.length > 0 ? csvData : sampleData;

  // Calculate comprehensive metrics
  const analysisMetrics: AnalysisMetrics = useMemo(() => {
    const metrics: AnalysisMetrics = {
      totalArticles: dataToAnalyze.length,
      statusDistribution: {},
      categoryDistribution: {},
      flagDistribution: {
        breaking: 0,
        featured: 0,
        developing: 0,
        exclusive: 0,
        sponsored: 0
      },
      engagementStats: {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        avgViews: 0,
        avgLikes: 0,
        avgComments: 0
      },
      contentAnalysis: {
        withImages: 0,
        withTags: 0,
        withMetadata: 0,
        factChecked: 0,
        approved: 0
      },
      temporalAnalysis: {
        publishedThisMonth: 0,
        publishedLastMonth: 0,
        draftArticles: 0,
        scheduledArticles: 0
      }
    };

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    dataToAnalyze.forEach(article => {
      // Status distribution
      metrics.statusDistribution[article.status] = (metrics.statusDistribution[article.status] || 0) + 1;
      
      // Category distribution
      metrics.categoryDistribution[article.category_id] = (metrics.categoryDistribution[article.category_id] || 0) + 1;
      
      // Flag distribution
      if (article.is_breaking) metrics.flagDistribution.breaking++;
      if (article.is_featured) metrics.flagDistribution.featured++;
      if (article.is_developing) metrics.flagDistribution.developing++;
      if (article.is_exclusive) metrics.flagDistribution.exclusive++;
      if (article.is_sponsored) metrics.flagDistribution.sponsored++;
      
      // Engagement stats
      metrics.engagementStats.totalViews += article.views || 0;
      metrics.engagementStats.totalLikes += article.likes || 0;
      metrics.engagementStats.totalComments += article.comments || 0;
      
      // Content analysis
      if (article.cover_image) metrics.contentAnalysis.withImages++;
      if (article.tags && article.tags !== '[]') metrics.contentAnalysis.withTags++;
      if (article.meta_title || article.meta_description) metrics.contentAnalysis.withMetadata++;
      if (article.fact_checked) metrics.contentAnalysis.factChecked++;
      if (article.approved_by_id) metrics.contentAnalysis.approved++;
      
      // Temporal analysis
      const publishDate = new Date(article.publish_date);
      if (article.status === 'published') {
        if (publishDate >= thisMonth) metrics.temporalAnalysis.publishedThisMonth++;
        else if (publishDate >= lastMonth) metrics.temporalAnalysis.publishedLastMonth++;
      }
      if (article.status === 'draft') metrics.temporalAnalysis.draftArticles++;
      if (article.status === 'scheduled') metrics.temporalAnalysis.scheduledArticles++;
    });

    // Calculate averages
    if (metrics.totalArticles > 0) {
      metrics.engagementStats.avgViews = Math.round(metrics.engagementStats.totalViews / metrics.totalArticles);
      metrics.engagementStats.avgLikes = Math.round(metrics.engagementStats.totalLikes / metrics.totalArticles);
      metrics.engagementStats.avgComments = Math.round(metrics.engagementStats.totalComments / metrics.totalArticles);
    }

    return metrics;
  }, [dataToAnalyze]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return dataToAnalyze.filter(article => {
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.heading.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || article.category_id === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [dataToAnalyze, searchTerm, selectedCategory, selectedStatus]);

  const exportData = () => {
    const csvContent = [
      // Header
      Object.keys(dataToAnalyze[0] || {}).join(','),
      // Data rows
      ...filteredData.map(article => 
        Object.values(article).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `articles-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${
          color.includes('blue') ? 'bg-blue-100' : 
          color.includes('green') ? 'bg-green-100' : 
          color.includes('yellow') ? 'bg-yellow-100' : 
          color.includes('red') ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Articles Data Analysis</h2>
          <p className="text-gray-600">Analysis of {dataToAnalyze.length} articles from CSV data</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>{showDetails ? 'Hide' : 'Show'} Details</span>
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Articles"
          value={analysisMetrics.totalArticles}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <MetricCard
          title="Published Articles"
          value={analysisMetrics.statusDistribution.published || 0}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          subtitle={`${Math.round(((analysisMetrics.statusDistribution.published || 0) / analysisMetrics.totalArticles) * 100)}% of total`}
        />
        <MetricCard
          title="Total Views"
          value={analysisMetrics.engagementStats.totalViews.toLocaleString()}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="text-purple-600"
          subtitle={`Avg: ${analysisMetrics.engagementStats.avgViews} per article`}
        />
        <MetricCard
          title="Draft Articles"
          value={analysisMetrics.statusDistribution.draft || 0}
          icon={<Calendar className="w-6 h-6 text-yellow-600" />}
          color="text-yellow-600"
        />
      </div>

      {/* Search and Filters */}
      {showDetails && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Filter articles by category"
              >
                <option value="all">All Categories</option>
                {Object.keys(analysisMetrics.categoryDistribution).map(categoryId => (
                  <option key={categoryId} value={categoryId}>
                    Category {categoryId} ({analysisMetrics.categoryDistribution[parseInt(categoryId)]})
                  </option>
                ))}
              </select>
            </div>            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Filter articles by status"
              >
                <option value="all">All Statuses</option>
                {Object.keys(analysisMetrics.statusDistribution).map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({analysisMetrics.statusDistribution[status]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Flags Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Types</h3>
          <div className="space-y-3">
            {Object.entries(analysisMetrics.flagDistribution).map(([flag, count]) => (
              <div key={flag} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    flag === 'breaking' ? 'bg-red-500' :
                    flag === 'featured' ? 'bg-yellow-500' :
                    flag === 'developing' ? 'bg-blue-500' :
                    flag === 'exclusive' ? 'bg-purple-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium capitalize">{flag}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{count}</span>
                  <span className="text-xs text-gray-400">
                    ({Math.round((count / analysisMetrics.totalArticles) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Quality Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Quality</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Articles with Images</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{analysisMetrics.contentAnalysis.withImages}</span>
                <span className="text-xs text-gray-400">
                  ({Math.round((analysisMetrics.contentAnalysis.withImages / analysisMetrics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Articles with Tags</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{analysisMetrics.contentAnalysis.withTags}</span>
                <span className="text-xs text-gray-400">
                  ({Math.round((analysisMetrics.contentAnalysis.withTags / analysisMetrics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Articles with SEO Metadata</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{analysisMetrics.contentAnalysis.withMetadata}</span>
                <span className="text-xs text-gray-400">
                  ({Math.round((analysisMetrics.contentAnalysis.withMetadata / analysisMetrics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fact-Checked Articles</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{analysisMetrics.contentAnalysis.factChecked}</span>
                <span className="text-xs text-gray-400">
                  ({Math.round((analysisMetrics.contentAnalysis.factChecked / analysisMetrics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Table Preview */}
      {showDetails && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Articles Preview ({filteredData.length} of {dataToAnalyze.length})
              </h3>              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Refresh data"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 10).map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {article.heading}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.category_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {article.is_breaking && <span className="px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded">B</span>}
                        {article.is_featured && <span className="px-1 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">F</span>}
                        {article.is_developing && <span className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">D</span>}
                        {article.is_exclusive && <span className="px-1 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">E</span>}
                        {article.is_sponsored && <span className="px-1 py-0.5 text-xs bg-green-100 text-green-800 rounded">S</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length > 10 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
              Showing first 10 of {filteredData.length} articles
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleDataAnalysis;
