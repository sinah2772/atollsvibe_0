import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  Activity,
  Radio,
  RefreshCw
} from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import RealtimeAnalytics from '../components/RealtimeAnalytics';
import '../components/AdvancedAnalytics.css';

type AnalyticsView = 'overview' | 'advanced' | 'realtime';

const Analytics: React.FC = () => {
  const { analyticsData, loading, error, refreshData } = useAnalytics();
  const { articlesByStatus, topCategories } = analyticsData;
  const [activeView, setActiveView] = useState<AnalyticsView>('overview');
  const COLORS = ['#1E40AF', '#60A5FA', '#F59E0B', '#10B981', '#EF4444'];

  // Mock articles data for advanced analytics (in real app, this would come from your data source)
  const mockArticles = Array.from({ length: 50 }, (_, i) => ({
    id: `article-${i}`,
    title: `Sample Article ${i + 1}`,
    status: ['published', 'draft', 'scheduled'][Math.floor(Math.random() * 3)],
    views: Math.floor(Math.random() * 5000) + 100,
    likes: Math.floor(Math.random() * 200) + 10,
    comments: Math.floor(Math.random() * 50) + 2,
    shares: Math.floor(Math.random() * 100) + 5,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    publish_date: new Date().toISOString(),
    is_breaking: Math.random() > 0.8,
    is_featured: Math.random() > 0.7,
    is_developing: false,
    is_exclusive: Math.random() > 0.9,
    is_sponsored: false,
    category_id: Math.floor(Math.random() * 5) + 1,
    news_type: 'general',
    news_priority: Math.floor(Math.random() * 3) + 1,
    fact_checked: Math.random() > 0.3,
    approved_by_id: Math.random() > 0.5 ? 'user-1' : null,
    reading_time: Math.floor(Math.random() * 8) + 2,
    bounce_rate: Math.floor(Math.random() * 40) + 20,
    engagement_duration: Math.floor(Math.random() * 300) + 60
  }));

  const renderContent = () => {
    switch (activeView) {
      case 'advanced':
        return <AdvancedAnalytics articles={mockArticles} />;
      case 'realtime':
        return <RealtimeAnalytics isLive={true} updateInterval={3000} />;
      default:
        return (
          <div className="space-y-6">
            {error && (
              <div className="glass-card border-red-200 bg-red-50 text-red-700 p-4 rounded-xl">
                <p className="font-medium">Error loading analytics data</p>
                <p>{error.message}</p>
              </div>
            )}
            
            {loading && !error ? (
              <div className="flex items-center justify-center h-64">
                <div className="glass-skeleton rounded-full h-12 w-12"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="glass-chart-container p-6 rounded-xl h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles by Status</h3>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie
                          data={articlesByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {articlesByStatus?.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} articles`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(20px)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="glass-chart-container p-6 rounded-xl h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart
                        data={topCategories}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 80,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" horizontal={false} />
                        <XAxis 
                          type="number"
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                          tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                          tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value} articles`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(20px)'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#1E40AF" 
                          radius={[0, 8, 8, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="glass-chart-container p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-metric-card p-6 text-center">
                      <div className="metric-icon text-blue-600 mx-auto mb-4">
                        <BarChart3 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Total Articles</h4>
                      <p className="text-3xl font-bold text-blue-600">
                        {articlesByStatus?.reduce((acc, item) => acc + (item.value || 0), 0) || 0}
                      </p>
                    </div>
                    <div className="glass-metric-card p-6 text-center">
                      <div className="metric-icon text-green-600 mx-auto mb-4">
                        <Activity className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Categories</h4>
                      <p className="text-3xl font-bold text-green-600">{topCategories?.length || 0}</p>
                    </div>
                    <div className="glass-metric-card p-6 text-center">
                      <div className="metric-icon text-purple-600 mx-auto mb-4">
                        <Radio className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Data</h4>
                      <p className="text-3xl font-bold text-purple-600">Active</p>
                    </div>
                    <div className="glass-metric-card p-6 text-center">
                      <div className="metric-icon text-orange-600 mx-auto mb-4">
                        <RefreshCw className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Last Update</h4>
                      <p className="text-sm font-medium text-orange-600">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="dashboard-container space-y-6 relative z-10">
        {/* Header with Navigation */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights into your content performance</p>
            </div>
            
            {/* View Toggle */}
            <div className="glass-nav-tabs">
              <button
                onClick={() => setActiveView('overview')}
                className={`glass-nav-tab ${activeView === 'overview' ? 'active' : ''}`}
              >
                <BarChart3 className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveView('advanced')}
                className={`glass-nav-tab ${activeView === 'advanced' ? 'active' : ''}`}
              >
                <Activity className="w-4 h-4" />
                Advanced
              </button>
              <button
                onClick={() => setActiveView('realtime')}
                className={`glass-nav-tab ${activeView === 'realtime' ? 'active' : ''}`}
              >
                <Radio className="w-4 h-4" />
                Real-time
              </button>
            </div>
            
            {activeView === 'overview' && (
              <button 
                onClick={refreshData}
                className="glass-button-primary px-6 py-3 text-white rounded-xl flex items-center gap-2 font-medium"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Analytics;