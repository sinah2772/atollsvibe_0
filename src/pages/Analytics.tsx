import React from 'react';
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
import useAnalytics from '../hooks/useAnalytics';

const Analytics: React.FC = () => {
  const { analyticsData, loading, error, refreshData } = useAnalytics();
  const { articlesByStatus, topCategories } = analyticsData;
  const COLORS = ['#1E40AF', '#60A5FA', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div className="dashboard-bg min-h-screen">
      <div className="dashboard-container">
        <div className="mb-6 flex justify-between items-center glass-card p-6 rounded-xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Analytics</h1>
            <p className="text-gray-600 mt-1">Detailed metrics about your content performance</p>
          </div>
          <button 
            onClick={refreshData}
            className="glass-button-primary px-4 py-2 text-white rounded-lg flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="glass-shimmer w-4 h-4 rounded-full"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="glass-card border-red-200 bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            <p className="font-medium">Error loading analytics data</p>
            <p>{error.message}</p>
          </div>
        )}
        
        {loading && !error ? (
          <div className="flex items-center justify-center h-64">
            <div className="glass-shimmer rounded-full h-12 w-12"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl h-[400px]">
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
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="glass-card p-6 rounded-xl h-[400px]">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis 
                      type="number"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} articles`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#1E40AF" 
                      radius={[0, 4, 4, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Detailed audience data coming soon</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;