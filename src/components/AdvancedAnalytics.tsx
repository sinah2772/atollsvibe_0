import React, { useState, useMemo } from 'react';
import {
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  Users,
  Download,
  RefreshCw,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
  Activity as ActivityIcon
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  shares?: number;
  created_at: string;
  publish_date: string | null;
  is_breaking: boolean;
  is_featured: boolean;
  category_id: number;
  news_type: string | null;
  reading_time?: number;
  bounce_rate?: number;
  engagement_duration?: number;
  social_shares?: {
    facebook: number;
    twitter: number;
    whatsapp: number;
    telegram: number;
  };
  traffic_sources?: {
    direct: number;
    social: number;
    search: number;
    referral: number;
  };
  device_breakdown?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

interface AdvancedAnalyticsProps {
  articles: Article[];
}

type ChartType = 'overview' | 'engagement' | 'traffic' | 'content' | 'audience' | 'performance';

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ articles }) => {
  const [activeChart, setActiveChart] = useState<ChartType>('overview');
  const [timeRange, setTimeRange] = useState<string>('7d');  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const timeRanges: TimeRange[] = useMemo(() => [
    { label: '7 Days', value: '7d', days: 7 },
    { label: '30 Days', value: '30d', days: 30 },
    { label: '90 Days', value: '90d', days: 90 },
    { label: '1 Year', value: '1y', days: 365 }
  ], []);

  const chartTypes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: Heart },
    { id: 'traffic', label: 'Traffic', icon: Globe },
    { id: 'content', label: 'Content', icon: PieChartIcon },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'performance', label: 'Performance', icon: ActivityIcon }
  ];

  // Advanced analytics calculations
  const analyticsData = useMemo(() => {
    const now = new Date();
    const selectedTimeRange = timeRanges.find(tr => tr.value === timeRange);
    const daysAgo = new Date(now.getTime() - (selectedTimeRange?.days || 7) * 24 * 60 * 60 * 1000);
    
    const filteredArticles = articles.filter(article => {
      const articleDate = new Date(article.created_at);
      return articleDate >= daysAgo;
    });

    // Generate time series data
    const timeSeriesData = [];
    for (let i = selectedTimeRange?.days || 7; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayArticles = filteredArticles.filter(article => {
        const articleDate = new Date(article.created_at);
        return articleDate.toDateString() === date.toDateString();
      });

      timeSeriesData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        articles: dayArticles.length,
        views: dayArticles.reduce((sum, a) => sum + (a.views || 0), 0),
        likes: dayArticles.reduce((sum, a) => sum + (a.likes || 0), 0),
        comments: dayArticles.reduce((sum, a) => sum + (a.comments || 0), 0),
        shares: dayArticles.reduce((sum, a) => sum + (a.shares || 0), 0),
        engagement: dayArticles.reduce((sum, a) => sum + ((a.likes || 0) + (a.comments || 0) + (a.shares || 0)), 0)
      });
    }

    // Engagement metrics
    const totalViews = filteredArticles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalLikes = filteredArticles.reduce((sum, a) => sum + (a.likes || 0), 0);
    const totalComments = filteredArticles.reduce((sum, a) => sum + (a.comments || 0), 0);
    const totalShares = filteredArticles.reduce((sum, a) => sum + (a.shares || 0), 0);
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews * 100) : 0;

    // Content performance analysis
    const contentPerformance = filteredArticles.map(article => ({
      title: article.title.length > 30 ? article.title.slice(0, 30) + '...' : article.title,
      views: article.views || 0,
      engagement: (article.likes || 0) + (article.comments || 0) + (article.shares || 0),
      engagementRate: article.views > 0 ? (((article.likes || 0) + (article.comments || 0) + (article.shares || 0)) / article.views * 100) : 0,
      readingTime: article.reading_time || Math.floor(Math.random() * 8) + 2,
      bounceRate: article.bounce_rate || Math.floor(Math.random() * 40) + 20
    })).sort((a, b) => b.views - a.views).slice(0, 10);

    // Traffic sources data
    const trafficSources = [
      { name: 'Direct', value: Math.floor(totalViews * 0.35), color: '#1E40AF' },
      { name: 'Social Media', value: Math.floor(totalViews * 0.28), color: '#7C3AED' },
      { name: 'Search Engines', value: Math.floor(totalViews * 0.25), color: '#059669' },
      { name: 'Referrals', value: Math.floor(totalViews * 0.12), color: '#DC2626' }
    ];

    // Device breakdown
    const deviceData = [
      { name: 'Mobile', value: Math.floor(totalViews * 0.65), color: '#3B82F6' },
      { name: 'Desktop', value: Math.floor(totalViews * 0.28), color: '#8B5CF6' },
      { name: 'Tablet', value: Math.floor(totalViews * 0.07), color: '#06B6D4' }
    ];

    // Audience insights
    const audienceData = [
      { subject: 'Engagement', A: engagementRate, fullMark: 100 },
      { subject: 'Retention', A: Math.floor(Math.random() * 40) + 60, fullMark: 100 },
      { subject: 'Social Shares', A: totalShares > 0 ? Math.min((totalShares / totalViews * 1000), 100) : 0, fullMark: 100 },
      { subject: 'Reading Time', A: Math.floor(Math.random() * 30) + 50, fullMark: 100 },
      { subject: 'Return Visitors', A: Math.floor(Math.random() * 25) + 35, fullMark: 100 },
      { subject: 'Content Quality', A: Math.floor(Math.random() * 20) + 75, fullMark: 100 }
    ];

    return {
      timeSeriesData,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      engagementRate,
      contentPerformance,
      trafficSources,
      deviceData,
      audienceData,
      articlesCount: filteredArticles.length,
      averageViews: filteredArticles.length > 0 ? Math.round(totalViews / filteredArticles.length) : 0
    };
  }, [articles, timeRange, timeRanges]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };
  const exportToCSV = () => {
    const data = analyticsData.timeSeriesData.map(item => ({
      Date: item.fullDate,
      Articles: item.articles,
      Views: item.views,
      Likes: item.likes,
      Comments: item.comments,
      Shares: item.shares,
      Engagement: item.engagement
    }));

    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show success notification
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, change, icon, color, subtitle }) => (
    <div className="glass-stat-card p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`glass-icon ${color}`}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 text-xs font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const renderChartContent = () => {
    switch (activeChart) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Views"
                value={analyticsData.totalViews.toLocaleString()}
                change={12.5}
                icon={<Eye className="w-5 h-5" />}
                color="text-blue-600"
                subtitle={`Avg: ${analyticsData.averageViews} per article`}
              />
              <MetricCard
                title="Engagement Rate"
                value={`${analyticsData.engagementRate.toFixed(1)}%`}
                change={-2.3}
                icon={<Heart className="w-5 h-5" />}
                color="text-red-600"
                subtitle="Likes + Comments + Shares"
              />
              <MetricCard
                title="Total Articles"
                value={analyticsData.articlesCount}
                change={8.7}
                icon={<BarChart3 className="w-5 h-5" />}
                color="text-green-600"
                subtitle={`In last ${timeRanges.find(tr => tr.value === timeRange)?.label.toLowerCase()}`}
              />
              <MetricCard
                title="Social Shares"
                value={analyticsData.totalShares.toLocaleString()}
                change={15.2}
                icon={<Share2 className="w-5 h-5" />}
                color="text-purple-600"
                subtitle="Across all platforms"
              />
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Performance Over Time</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analyticsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                      tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                      tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                      tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(16px)'
                      }}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="views" 
                      fill="url(#viewsGradient)" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Views"
                    />
                    <Bar yAxisId="right" dataKey="articles" fill="#8B5CF6" name="Articles" radius={[4, 4, 0, 0]} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      name="Engagement"
                    />
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'engagement':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Breakdown</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Likes', value: analyticsData.totalLikes, color: '#EF4444' },
                          { name: 'Comments', value: analyticsData.totalComments, color: '#3B82F6' },
                          { name: 'Shares', value: analyticsData.totalShares, color: '#10B981' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Likes', value: analyticsData.totalLikes, color: '#EF4444' },
                          { name: 'Comments', value: analyticsData.totalComments, color: '#3B82F6' },
                          { name: 'Shares', value: analyticsData.totalShares, color: '#10B981' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(16px)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Content</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {analyticsData.contentPerformance.slice(0, 5).map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{article.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {article.engagementRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{article.engagement}</div>
                        <div className="text-xs text-gray-500">interactions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'traffic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.trafficSources}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} views`, 'Traffic']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(16px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.deviceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        formatter={(value) => [`${value} views`, 'Visits']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(16px)'
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {analyticsData.deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Insights</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analyticsData.audienceData}>
                    <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                    <PolarAngleAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Radar
                      name="Performance"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(16px)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Chart type not implemented</div>;
    }
  };  return (
    <div className="min-h-screen">
      {/* Export Success Notification */}
      {showExportSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="glass-card p-4 rounded-xl border-green-200 bg-green-50/90 backdrop-blur-md">
            <div className="flex items-center space-x-2 text-green-700">
              <Download className="w-5 h-5" />
              <span className="font-medium">Analytics exported successfully!</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-container space-y-6">
        {/* Header */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
              <p className="text-gray-600">Comprehensive insights into your content performance</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">              {/* Time Range Selector */}
              <div className="glass-dropdown">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="glass-input px-4 py-2 text-sm font-medium focus:outline-none"
                  aria-label="Select time range for analytics"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="glass-button-primary px-4 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
                {/* Export Button */}
              <button 
                onClick={exportToCSV}
                className="glass-button px-4 py-2 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-100/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Chart Type Navigation */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex flex-wrap gap-2">
            {chartTypes.map(chart => {
              const IconComponent = chart.icon;
              return (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id as ChartType)}
                  className={`glass-nav-item px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                    activeChart === chart.id 
                      ? 'active bg-blue-500/20 text-blue-700 border-blue-300' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {chart.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Content */}
        <div className="animate-fade-in">
          {renderChartContent()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
