import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import { Upload, Trash2, Edit, Search, Filter, BarChart2 } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  target_audience: string;
  budget: number;
  status: 'active' | 'paused' | 'deleted';
  media_url: string;
  created_at: string;
  updated_at: string;
}

const BusinessDashboard: React.FC = () => {
  const { user } = useUser();
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [loading, setLoading] = useState(false);

  // Fetch ads on component mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAds(data || []);
      } catch (err) {
        console.error('Error fetching ads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ads')
        .getPublicUrl(uploadData.path);

      // Save ad details to database
      const { data: ad, error: dbError } = await supabase
        .from('ads')
        .insert({
          title: file.name,
          media_url: publicUrl,
          user_id: user?.id,
          status: 'active',
          description: '',
          target_audience: '',
          budget: 0
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setAds(prev => [ad, ...prev]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      setLoading(true);

      // Soft delete - update status to deleted
      const { error } = await supabase
        .from('ads')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-bg min-h-screen">
      <div className="dashboard-container">
        <div className="mb-8 glass-card p-6 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your advertisements and media content
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-stat-card p-6">
            <div className="flex items-center">
              <div className="glass-icon text-blue-600">
                <BarChart2 className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Active Ads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {ads.filter(ad => ad.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-stat-card p-6">
            <div className="flex items-center">
              <div className="glass-icon text-green-600">
                <Upload className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Total Uploads</p>
                <p className="text-2xl font-semibold text-gray-900">{ads.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-stat-card p-6">
            <div className="flex items-center">
              <div className="glass-icon text-purple-600">
                <Filter className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900">2.4 GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload and Search */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <input
                type="text"
                placeholder="Search ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2"
                disabled={loading}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="flex items-center gap-4">
              <label htmlFor="ad-filter" className="sr-only">Filter ads</label>
              <select
                id="ad-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="glass-select rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter advertisements"
                disabled={loading}
              >
                <option value="all">All Ads</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>

              <label className={`glass-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                <Upload size={20} className="mr-2" />
                {loading ? 'Uploading...' : 'Upload New'}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !loading) handleUpload(file);
                  }}
                  accept="image/*,video/*"
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Ads List */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loading && (
          <div className="flex justify-center my-8">
            <div className="glass-shimmer rounded-full h-12 w-12"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="glass-table min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={ad.media_url}
                        alt={ad.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {ad.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ad.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ad.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ad.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="glass-button p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600"
                        aria-label="Edit advertisement"
                        title="Edit advertisement"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="glass-button p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600"
                        aria-label="Delete advertisement"
                        title="Delete advertisement"
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;