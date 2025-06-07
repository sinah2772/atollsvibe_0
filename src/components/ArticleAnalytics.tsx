import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Calendar, AlertCircle } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
  publish_date: string | null;
  is_breaking: boolean;
  is_featured: boolean;
  is_developing: boolean;
  is_exclusive: boolean;
  is_sponsored: boolean;
  category_id: number;
  news_type: string | null;
  news_priority: number | null;
  fact_checked: boolean | null;
  approved_by_id: string | null;
}

interface ArticleAnalyticsProps {
  articles: Article[];
}

interface AnalyticsData {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  breakingNews: number;
  featuredArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageViews: number;
  recentArticles: number;
  pendingApproval: number;
  factCheckedArticles: number;
  categoryDistribution: { [key: number]: number };
  statusDistribution: { [key: string]: number };
  priorityDistribution: { [key: number]: number };
  engagementRate: number;
}

const ArticleAnalytics: React.FC<ArticleAnalyticsProps> = ({ articles }) => {  const analytics: AnalyticsData = useMemo(() => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter out archived articles for analytics
    const nonArchivedArticles = articles.filter(article => article.status !== 'archived');
    
    const data: AnalyticsData = {
      totalArticles: nonArchivedArticles.length,
      publishedArticles: 0,
      draftArticles: 0,
      breakingNews: 0,
      featuredArticles: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      averageViews: 0,
      recentArticles: 0,
      pendingApproval: 0,
      factCheckedArticles: 0,
      categoryDistribution: {},
      statusDistribution: {},
      priorityDistribution: {},
      engagementRate: 0
    };    nonArchivedArticles.forEach(article => {
      // Status tracking (archived articles already filtered out)
      if (article.status === 'published') data.publishedArticles++;
      if (article.status === 'draft') data.draftArticles++;
      
      // Count status distribution (excluding archived)
      data.statusDistribution[article.status] = (data.statusDistribution[article.status] || 0) + 1;
      
      // Article flags
      if (article.is_breaking) data.breakingNews++;
      if (article.is_featured) data.featuredArticles++;
      
      // Engagement metrics
      data.totalViews += article.views || 0;
      data.totalLikes += article.likes || 0;
      data.totalComments += article.comments || 0;
      
      // Recent articles (last 7 days)
      const createdDate = new Date(article.created_at);
      if (createdDate >= lastWeek) data.recentArticles++;
      
      // Editorial workflow
      if (!article.approved_by_id && article.status === 'draft') data.pendingApproval++;
      if (article.fact_checked) data.factCheckedArticles++;
      
      // Category distribution
      if (article.category_id) {
        data.categoryDistribution[article.category_id] = (data.categoryDistribution[article.category_id] || 0) + 1;
      }
      
      // Priority distribution
      if (article.news_priority) {
        data.priorityDistribution[article.news_priority] = (data.priorityDistribution[article.news_priority] || 0) + 1;
      }
    });

    // Calculate averages
    data.averageViews = data.totalArticles > 0 ? Math.round(data.totalViews / data.totalArticles) : 0;
    data.engagementRate = data.totalViews > 0 ? Math.round(((data.totalLikes + data.totalComments) / data.totalViews) * 100) : 0;

    return data;
  }, [articles]);
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="glass-stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className={`glass-icon ${color.includes('blue') ? 'text-blue-600' : 
                                      color.includes('green') ? 'text-green-600' : 
                                      color.includes('yellow') ? 'text-yellow-600' : 
                                      color.includes('red') ? 'text-red-600' : 
                                      color.includes('purple') ? 'text-purple-600' :
                                      color.includes('orange') ? 'text-orange-600' : 
                                      'text-gray-600'}`}>
          {icon}
        </div>
      </div>
    </div>
  );  return (
    <div className="min-h-screen">
      <div className="dashboard-container space-y-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Article Analytics</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Articles"
          value={analytics.totalArticles}
          icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="Published"
          value={analytics.publishedArticles}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          subtitle={`${Math.round((analytics.publishedArticles / analytics.totalArticles) * 100)}% of total`}
        />
        <StatCard
          title="Total Views"
          value={analytics.totalViews.toLocaleString()}
          icon={<Eye className="w-6 h-6 text-purple-600" />}
          color="text-purple-600"
          subtitle={`Avg: ${analytics.averageViews} per article`}
        />
        <StatCard
          title="Engagement Rate"
          value={`${analytics.engagementRate}%`}
          icon={<Users className="w-6 h-6 text-orange-600" />}
          color="text-orange-600"
          subtitle="Likes + Comments / Views"
        />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Breaking News"
          value={analytics.breakingNews}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          color="text-red-600"
        />
        <StatCard
          title="Featured Articles"
          value={analytics.featuredArticles}
          icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
          color="text-yellow-600"
        />
        <StatCard
          title="Recent Articles"
          value={analytics.recentArticles}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
          subtitle="Last 7 days"
        />
        <StatCard
          title="Pending Approval"
          value={analytics.pendingApproval}
          icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
          color="text-orange-600"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        {/* Status Distribution */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => {
              const percentage = Math.round((count / analytics.totalArticles) * 100);
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'published' ? 'bg-green-500' :
                      status === 'draft' ? 'bg-yellow-500' :
                      status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">{count}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editorial Workflow Stats */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Editorial Workflow</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fact-Checked Articles</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-green-600">{analytics.factCheckedArticles}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((analytics.factCheckedArticles / analytics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Approval</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-orange-600">{analytics.pendingApproval}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((analytics.pendingApproval / analytics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Drafts</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-yellow-600">{analytics.draftArticles}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((analytics.draftArticles / analytics.totalArticles) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Engagement Metrics */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.totalLikes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{analytics.totalComments.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Comments</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ArticleAnalytics;
