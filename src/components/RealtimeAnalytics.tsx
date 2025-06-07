import React, { useState, useEffect, useMemo } from 'react';
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  Activity,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  WifiOff,
  MapPin,
  Radio
} from 'lucide-react';

interface RealTimeData {
  timestamp: string;
  activeUsers: number;
  pageViews: number;
  newSessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
    users: number;
  }>;
  trafficSources: Array<{
    source: string;
    users: number;
    percentage: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geographicData: Array<{
    country: string;
    users: number;
    sessions: number;
  }>;
  socialMediaTraffic: Array<{
    platform: string;
    clicks: number;
    shares: number;
  }>;
}

interface RealtimeAnalyticsProps {
  isLive?: boolean;
  updateInterval?: number;
}

const RealtimeAnalytics: React.FC<RealtimeAnalyticsProps> = ({ 
  isLive = true, 
  updateInterval = 5000 
}) => {
  const [data, setData] = useState<RealTimeData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'views' | 'sessions'>('users');

  // Simulate real-time data
  const generateRealtimeData = (): RealTimeData => {
    const now = new Date();
    const baseUsers = 1200;
    const variance = Math.sin(now.getTime() / 60000) * 200; // Simulate daily patterns
    const noise = (Math.random() - 0.5) * 100;
    
    return {
      timestamp: now.toISOString(),
      activeUsers: Math.max(0, Math.floor(baseUsers + variance + noise)),
      pageViews: Math.floor(Math.random() * 500) + 300,
      newSessions: Math.floor(Math.random() * 150) + 50,
      bounceRate: Math.floor(Math.random() * 30) + 35,
      avgSessionDuration: Math.floor(Math.random() * 180) + 120,
      topPages: [
        { path: '/news/latest', views: Math.floor(Math.random() * 200) + 100, users: Math.floor(Math.random() * 150) + 75 },
        { path: '/breaking-news', views: Math.floor(Math.random() * 180) + 80, users: Math.floor(Math.random() * 120) + 60 },
        { path: '/sports', views: Math.floor(Math.random() * 160) + 70, users: Math.floor(Math.random() * 100) + 50 },
        { path: '/politics', views: Math.floor(Math.random() * 140) + 60, users: Math.floor(Math.random() * 90) + 45 },
        { path: '/weather', views: Math.floor(Math.random() * 120) + 50, users: Math.floor(Math.random() * 80) + 40 }
      ],
      trafficSources: [
        { source: 'Direct', users: Math.floor(Math.random() * 400) + 300, percentage: 0 },
        { source: 'Social Media', users: Math.floor(Math.random() * 250) + 200, percentage: 0 },
        { source: 'Search', users: Math.floor(Math.random() * 300) + 250, percentage: 0 },
        { source: 'Referral', users: Math.floor(Math.random() * 100) + 50, percentage: 0 }
      ],
      deviceBreakdown: {
        mobile: Math.floor(Math.random() * 400) + 500,
        desktop: Math.floor(Math.random() * 200) + 250,
        tablet: Math.floor(Math.random() * 80) + 40
      },
      geographicData: [
        { country: 'Maldives', users: Math.floor(Math.random() * 300) + 400, sessions: Math.floor(Math.random() * 400) + 500 },
        { country: 'India', users: Math.floor(Math.random() * 200) + 150, sessions: Math.floor(Math.random() * 250) + 200 },
        { country: 'Sri Lanka', users: Math.floor(Math.random() * 100) + 80, sessions: Math.floor(Math.random() * 120) + 100 },
        { country: 'Singapore', users: Math.floor(Math.random() * 80) + 50, sessions: Math.floor(Math.random() * 100) + 70 },
        { country: 'UAE', users: Math.floor(Math.random() * 60) + 40, sessions: Math.floor(Math.random() * 80) + 50 }
      ],
      socialMediaTraffic: [
        { platform: 'Facebook', clicks: Math.floor(Math.random() * 150) + 100, shares: Math.floor(Math.random() * 80) + 50 },
        { platform: 'Twitter', clicks: Math.floor(Math.random() * 120) + 80, shares: Math.floor(Math.random() * 60) + 40 },
        { platform: 'Instagram', clicks: Math.floor(Math.random() * 100) + 70, shares: Math.floor(Math.random() * 50) + 30 },
        { platform: 'WhatsApp', clicks: Math.floor(Math.random() * 200) + 150, shares: Math.floor(Math.random() * 100) + 80 }
      ]
    };
  };
  // Initialize and update data
  useEffect(() => {
    if (!isLive) return;

    // Initialize with some historical data
    const initialData = [];
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(Date.now() - i * updateInterval);
      initialData.push({
        ...generateRealtimeData(),
        timestamp: timestamp.toISOString()
      });
    }
    setData(initialData);
    setIsConnected(true);

    const interval = setInterval(() => {
      const newDataPoint = generateRealtimeData();
      setData(prev => {
        const updated = [...prev.slice(-29), newDataPoint]; // Keep last 30 data points
        return updated;
      });
      setLastUpdate(new Date());
    }, updateInterval);    return () => clearInterval(interval);
  }, [isLive, updateInterval]);

  const currentData = data[data.length - 1];
  const previousData = data[data.length - 2];

  // Update progress bars
  useEffect(() => {
    if (currentData) {
      const progressBars = document.querySelectorAll('.device-progress-fill');
      progressBars.forEach((bar) => {
        const percentage = bar.getAttribute('data-percentage');
        if (percentage) {
          (bar as HTMLElement).style.width = `${percentage}%`;
        }
      });
    }
  }, [currentData]);

  const calculateChange = (current: number, previous: number): number => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    format?: 'number' | 'percentage' | 'duration';
    suffix?: string;
  }> = ({ title, value, change, icon, color, format = 'number', suffix = '' }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'percentage':
          return `${val.toFixed(1)}%`;
        case 'duration':
          return `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, '0')}`;
        default:
          return val.toLocaleString() + suffix;
      }
    };

    return (
      <div className="glass-metric-card p-6 relative overflow-hidden group animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`metric-icon ${color}`}>
              {icon}
            </div>
            {change !== undefined && (
              <div className={`trend-indicator ${change >= 0 ? 'trend-up' : 'trend-down'}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
            <p className={`text-3xl font-bold ${color} transition-all duration-300`}>
              {formatValue(value)}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    );
  };

  const chartData = useMemo(() => {
    return data.map(d => ({
      time: formatTime(d.timestamp),
      users: d.activeUsers,
      views: d.pageViews,
      sessions: d.newSessions,
      bounceRate: d.bounceRate
    }));
  }, [data]);

  if (!currentData) {
    return (
      <div className="dashboard-bg min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="loading-pulse w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to real-time analytics...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="dashboard-container space-y-6 relative z-10">
        {/* Status Header */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Real-time Analytics</h1>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isConnected ? <Radio className="w-4 h-4 animate-pulse" /> : <WifiOff className="w-4 h-4" />}
                  <span>{isConnected ? 'Live' : 'Offline'}</span>
                </div>
              </div>
              <p className="text-gray-600">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="glass-nav-tabs">
                {[
                  { key: 'users', label: 'Active Users', icon: Users },
                  { key: 'views', label: 'Page Views', icon: Eye },
                  { key: 'sessions', label: 'Sessions', icon: Activity }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key as 'users' | 'views' | 'sessions')}
                    className={`glass-nav-tab ${selectedMetric === key ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Users"
            value={currentData.activeUsers}
            change={previousData ? calculateChange(currentData.activeUsers, previousData.activeUsers) : undefined}
            icon={<Users className="w-6 h-6" />}
            color="text-blue-600"
          />
          <MetricCard
            title="Page Views"
            value={currentData.pageViews}
            change={previousData ? calculateChange(currentData.pageViews, previousData.pageViews) : undefined}
            icon={<Eye className="w-6 h-6" />}
            color="text-green-600"
          />
          <MetricCard
            title="Bounce Rate"
            value={currentData.bounceRate}
            change={previousData ? calculateChange(currentData.bounceRate, previousData.bounceRate) : undefined}
            icon={<TrendingDown className="w-6 h-6" />}
            color="text-red-600"
            format="percentage"
          />
          <MetricCard
            title="Avg. Session"
            value={currentData.avgSessionDuration}
            change={previousData ? calculateChange(currentData.avgSessionDuration, previousData.avgSessionDuration) : undefined}
            icon={<Clock className="w-6 h-6" />}
            color="text-purple-600"
            format="duration"
          />
        </div>

        {/* Real-time Chart */}
        <div className="glass-chart-container p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Live Activity Stream</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Updating every {updateInterval / 1000}s</span>
            </div>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="time" 
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
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(20px)'
                  }}
                />
                <Legend />
                
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey={selectedMetric}
                  fill="url(#colorGradient)"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={0.3}
                  name={selectedMetric === 'users' ? 'Active Users' : selectedMetric === 'views' ? 'Page Views' : 'Sessions'}
                />
                
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bounceRate"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Bounce Rate (%)"
                />
                
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="glass-chart-container p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Pages Right Now</h3>
            <div className="space-y-4">
              {currentData.topPages.map((page, index) => (
                <div key={page.path} className="content-performance-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{page.path}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {page.views} views
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {page.users} users
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="glass-chart-container p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Usage</h3>
            <div className="space-y-6">
              {[
                { name: 'Mobile', value: currentData.deviceBreakdown.mobile, icon: Smartphone, color: 'bg-blue-500' },
                { name: 'Desktop', value: currentData.deviceBreakdown.desktop, icon: Monitor, color: 'bg-green-500' },
                { name: 'Tablet', value: currentData.deviceBreakdown.tablet, icon: Tablet, color: 'bg-purple-500' }
              ].map(({ name, value, icon: Icon, color }) => {
                const total = Object.values(currentData.deviceBreakdown).reduce((a, b) => a + b, 0);
                const percentage = (value / total) * 100;
                
                return (
                  <div key={name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{value.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>                    <div className="device-progress-bar">
                      <div 
                        className={`device-progress-fill ${color.replace('bg-', 'bg-')}`}
                        data-percentage={percentage}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Geographic Data */}
        <div className="glass-chart-container p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {currentData.geographicData.map((country) => (
              <div key={country.country} className="content-performance-card text-center">
                <div className="mb-3">
                  <MapPin className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">{country.country}</h4>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{country.users}</div>
                  <div className="text-xs text-gray-600">users</div>
                  <div className="text-sm text-gray-600">{country.sessions} sessions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeAnalytics;
