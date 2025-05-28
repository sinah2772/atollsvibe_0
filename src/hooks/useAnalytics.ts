import { useState, useEffect } from 'react';
import { articlesByStatus, topCategories } from '../data/mockData';

// Define types for our analytics data
export interface AnalyticsData {
  articlesByStatus: Array<{ name: string; value: number }>;
  topCategories: Array<{ name: string; value: number }>;
}

/**
 * Custom hook to fetch and manage analytics data
 * Currently uses mock data, but can be expanded to fetch from an API
 */
export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    articlesByStatus: [],
    topCategories: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call with setTimeout
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be replaced with an API call
        // const response = await fetch('/api/analytics');
        // const data = await response.json();
        
        // Simulating API delay
        setTimeout(() => {
          setAnalyticsData({
            articlesByStatus,
            topCategories
          });
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to refresh data - could be called after updates or on user request
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API delay
      setTimeout(() => {
        setAnalyticsData({
          articlesByStatus,
          topCategories
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh analytics data'));
      setLoading(false);
    }
  };

  return { 
    analyticsData, 
    loading, 
    error, 
    refreshData 
  };
};

export default useAnalytics;
