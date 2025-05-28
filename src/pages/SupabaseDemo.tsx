import React, { useState, useEffect, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader2, Database, Key, Upload, Radio, Code } from 'lucide-react';
import StorageImageGallery from '../components/StorageImageGallery';
import SimpleImageUploader from '../components/SimpleImageUploader';
import RealTimeCommentsExample from '../components/RealTimeCommentsExample';
import { dbService } from '../services/dbService';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';

// Mock article ID for the comments demo
const DEMO_ARTICLE_ID = 1;

// Define a demo profile entry for database operations
interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  bio?: string;
  updated_at?: string;
}

const SupabaseDemo: React.FC = () => {
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const user = authContext?.user;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<string>('images');
  const [buckets, setBuckets] = useState<any[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [edgeFunctionResult, setEdgeFunctionResult] = useState<string | null>(null);
  const [loadingEdgeFunction, setLoadingEdgeFunction] = useState(false);
  const [slug, setSlug] = useState('');
  
  // Fetch available storage buckets
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        setLoadingBuckets(true);
        const { data: bucketList } = await supabase.storage.listBuckets();
        setBuckets(bucketList || []);
      } catch (err) {
        console.error('Failed to fetch buckets:', err);
      } finally {
        setLoadingBuckets(false);
      }
    };
    
    fetchBuckets();
  }, []);
  
  // Fetch user profile if user is logged in
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user]);
  
  // Fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    setLoadingProfile(true);
    try {
      const { data, error } = await dbService.profiles.getById(userId);
      
      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If profile doesn't exist, create a basic profile from user data
      try {
        const { data: userData } = await dbService.users.getById(userId);
        if (userData) {
          setProfile({
            id: userData.id,
            username: userData.name,
            full_name: userData.name,
            avatar_url: userData.avatar_url,
            website: '',
            bio: '',
          });
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
      }
    } finally {
      setLoadingProfile(false);
    }
  };
  
  // Handle image selection from gallery
  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
  };

  // Handle successful image upload
  const handleImageUpload = (url: string) => {
    setSelectedImage(url);
    setUploadSuccess(true);
    setRefreshGallery(prev => prev + 1); // Trigger gallery refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };
  
  // Handle bucket selection change
  const handleBucketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBucket(e.target.value);
  };
  
  // Update user profile
  const updateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const updates = {
        username: (document.getElementById('username') as HTMLInputElement).value,
        full_name: (document.getElementById('fullName') as HTMLInputElement).value,
        bio: (document.getElementById('bio') as HTMLTextAreaElement).value,
        website: (document.getElementById('website') as HTMLInputElement).value,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await dbService.profiles.update(user.id, updates);
      
      if (error) throw error;
      
      // Update local state and show success message
      setProfile(prev => prev ? { ...prev, ...updates } : updates as Profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  
  // Call the generate-slug edge function
  const callGenerateSlugFunction = async () => {
    setLoadingEdgeFunction(true);
    try {
      const title = (document.getElementById('slugTitle') as HTMLInputElement).value;
      
      if (!title) {
        alert('Please enter a title');
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('generate-slug', {
        body: { title, table: 'articles' }
      });
      
      if (error) throw error;
      
      setEdgeFunctionResult(JSON.stringify(data, null, 2));
      setSlug(data.slug);
    } catch (error) {
      console.error('Error calling edge function:', error);
      setEdgeFunctionResult(JSON.stringify({ error: 'Failed to generate slug' }, null, 2));
    } finally {
      setLoadingEdgeFunction(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Features Demo</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-2">Supabase Integration Demo</h2>
        <p className="mb-3">
          This page demonstrates the core Supabase features integrated in this project:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <li className="flex items-start p-2 bg-white rounded-md border border-blue-100">
            <Key size={20} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <strong className="text-blue-800">Authentication</strong>
              <p className="text-sm text-gray-600">User authentication with email, OAuth providers, and session management</p>
            </div>
          </li>
          <li className="flex items-start p-2 bg-white rounded-md border border-blue-100">
            <Database size={20} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <strong className="text-blue-800">Database</strong>
              <p className="text-sm text-gray-600">PostgreSQL database with Row Level Security and real-time subscriptions</p>
            </div>
          </li>
          <li className="flex items-start p-2 bg-white rounded-md border border-blue-100">
            <Upload size={20} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <strong className="text-blue-800">Storage</strong>
              <p className="text-sm text-gray-600">File storage with permissions and transformations</p>
            </div>
          </li>
          <li className="flex items-start p-2 bg-white rounded-md border border-blue-100">
            <Radio size={20} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <strong className="text-blue-800">Real-time</strong>
              <p className="text-sm text-gray-600">Live updates via WebSockets and server-sent events</p>
            </div>
          </li>
          <li className="flex items-start p-2 bg-white rounded-md border border-blue-100">
            <Code size={20} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <strong className="text-blue-800">Edge Functions</strong>
              <p className="text-sm text-gray-600">Serverless functions for backend operations</p>
            </div>
          </li>
        </ul>
      </div>
      
      <Tabs defaultValue="storage" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="edge">Edge Functions</TabsTrigger>
        </TabsList>
        
        {/* Storage Tab */}
        <TabsContent value="storage" className="p-4 border rounded-lg mt-2">
          <h2 className="text-xl font-bold mb-4">Storage Management</h2>
          <p className="mb-4">
            Supabase Storage lets you manage user-uploaded files with security rules and transformations.
          </p>
          
          {/* Bucket selector */}
          {loadingBuckets ? (
            <div className="flex items-center mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading storage buckets...</span>
            </div>
          ) : buckets.length > 0 ? (
            <div className="mb-6">
              <label htmlFor="bucket-selector" className="block text-sm font-medium text-gray-700 mb-1">
                Select Storage Bucket
              </label>
              <select
                id="bucket-selector"
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
                value={selectedBucket}
                onChange={handleBucketChange}
              >
                {buckets.map(bucket => (
                  <option key={bucket.id} value={bucket.name}>
                    {bucket.name} {bucket.public ? '(public)' : '(private)'}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          
          {/* Upload section */}
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Upload New Image</h2>
            <SimpleImageUploader 
              onUpload={handleImageUpload} 
              bucketName={selectedBucket}
              maxSizeMB={5}
            />
            
            {uploadSuccess && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                Image was uploaded successfully! You can see it in the gallery below.
              </div>
            )}
          </div>
          
          {/* Selected image display */}
          {selectedImage && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Selected Image</h2>
              <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Selected image"
                  className="w-full h-full object-contain bg-gray-100"
                />
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Clear Selection
                </button>
              </div>
              <div className="mt-3 p-3 bg-gray-100 rounded break-all">
                <p className="text-sm font-mono">{selectedImage}</p>
              </div>
            </div>
          )}
          
          {/* Image gallery */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Your Uploaded Images</h2>
            <p className="mb-4 text-gray-600">
              These images are stored in your Supabase Storage '{selectedBucket}' bucket. Click on an image to select it.
            </p>
            <StorageImageGallery 
              key={`gallery-${selectedBucket}-${refreshGallery}`}
              onSelect={handleImageSelect} 
              allowDelete={true}
              defaultBucket={selectedBucket}
            />
          </div>
        </TabsContent>
        
        {/* Auth Tab */}
        <TabsContent value="auth" className="p-4 border rounded-lg mt-2">
          <h2 className="text-xl font-bold mb-4">Authentication</h2>
          <p className="mb-4">
            Supabase Auth provides secure authentication with multiple providers.
          </p>
          
          {session ? (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Authentication Status</h3>
                <p className="text-green-600">✓ You are authenticated</p>
              </div>
              
              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">{user?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Sign In</p>
                    <p>{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">Not Authenticated</h3>
              <p className="mb-4">Please sign in to see authentication details.</p>
              <a 
                href="/login" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Login
              </a>
            </div>
          )}
        </TabsContent>
        
        {/* Database Tab */}
        <TabsContent value="database" className="p-4 border rounded-lg mt-2">
          <h2 className="text-xl font-bold mb-4">Database Operations</h2>
          <p className="mb-4">
            Supabase provides a powerful PostgreSQL database with Row Level Security.
          </p>
          
          {user ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">User Profile Management</h3>
              <p className="text-gray-600 mb-4">
                This demonstrates database operations with the profiles table, which has RLS policies applied.
              </p>
              
              {loadingProfile ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                  <span>Loading profile data...</span>
                </div>
              ) : (
                <form onSubmit={updateUserProfile} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        defaultValue={profile?.username || ''}
                      />
                    </div>
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        defaultValue={profile?.full_name || ''}
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <input
                        type="text"
                        id="website"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        defaultValue={profile?.website || ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        defaultValue={profile?.bio || ''}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Profile
                  </button>
                </form>
              )}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-md font-medium mb-2">Database Row Level Security</h3>
                <p className="text-sm text-gray-600">
                  RLS policies are enforced server-side ensuring users can only access and modify their own data.
                  The profile data above is protected by the following policy:
                </p>
                <pre className="mt-2 bg-gray-800 text-white p-3 rounded overflow-x-auto text-sm">
{`CREATE POLICY "Users can only view their own profiles" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profiles" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">Authentication Required</h3>
              <p className="mb-4">Please sign in to see database operations.</p>
              <a 
                href="/login" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Login
              </a>
            </div>
          )}
        </TabsContent>
        
        {/* Real-time Tab */}
        <TabsContent value="realtime" className="p-4 border rounded-lg mt-2">
          <h2 className="text-xl font-bold mb-4">Real-time Subscriptions</h2>
          <p className="mb-4">
            Supabase provides real-time capabilities to subscribe to database changes.
          </p>
          
          <div className="mt-2 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium mb-2">About Real-time Features</h3>
              <p>
                The comments below use Supabase's real-time subscriptions to update instantly across 
                all connected clients. Try opening this page in multiple browsers to see it in action.
              </p>
            </div>
          </div>
          
          <RealTimeCommentsExample articleId={DEMO_ARTICLE_ID} />
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-md font-medium mb-2">How It Works</h3>
            <p className="text-sm text-gray-600 mb-2">
              The real-time functionality is implemented using the custom <code className="bg-gray-200 px-1 rounded">useRealtimeSubscription</code> hook
              which leverages Supabase's real-time channels.
            </p>
            <pre className="mt-2 bg-gray-800 text-white p-3 rounded overflow-x-auto text-sm">
{`// Example usage of the useRealtimeSubscription hook
const { data: comments, loading, error } = useRealtimeSubscription('comments', {
  filter: 'article_id',
  filterValue: articleId,
  event: '*' // Listen for all events (INSERT, UPDATE, DELETE)
});`}
            </pre>
          </div>
        </TabsContent>
        
        {/* Edge Functions Tab */}
        <TabsContent value="edge" className="p-4 border rounded-lg mt-2">
          <h2 className="text-xl font-bold mb-4">Edge Functions</h2>
          <p className="mb-4">
            Supabase Edge Functions are serverless functions that run close to your users.
          </p>
          
          <div className="mt-2 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium mb-2">About Edge Functions</h3>
              <p>
                This demo uses the <code className="bg-gray-200 px-1 rounded">generate-slug</code> edge function
                which creates a URL-friendly slug from a title string while ensuring it's unique in the database.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Generate Article Slug</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="slugTitle" className="block text-sm font-medium text-gray-700">
                    Article Title
                  </label>
                  <input
                    type="text"
                    id="slugTitle"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter an article title"
                  />
                </div>
                <button
                  onClick={callGenerateSlugFunction}
                  disabled={loadingEdgeFunction}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loadingEdgeFunction ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Generating...
                    </>
                  ) : (
                    'Generate Slug'
                  )}
                </button>
                
                {slug && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                    <p><strong>Generated Slug:</strong></p>
                    <p className="font-mono bg-white p-2 mt-1 rounded border border-green-200">
                      {slug}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Edge Function Response</h3>
              {edgeFunctionResult ? (
                <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto h-64 overflow-y-auto">
                  {edgeFunctionResult}
                </pre>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg border h-64 flex items-center justify-center">
                  <p className="text-gray-500">No function result yet. Click "Generate Slug" to see the response.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-md font-medium mb-2">Edge Function Code</h3>
            <p className="text-sm text-gray-600 mb-2">
              Here's a simplified view of the <code className="bg-gray-200 px-1 rounded">generate-slug</code> edge function:
            </p>
            <pre className="mt-2 bg-gray-800 text-white p-3 rounded overflow-x-auto text-sm">
{`import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
import slugify from 'https://esm.sh/slugify@1.6.6';

serve(async (req) => {
  // Initialize Supabase client with service role
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  
  try {
    const { title, table = 'articles' } = await req.json();
    
    // Generate base slug
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 0;
    
    // Check for uniqueness and add counter if needed
    while (true) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) break; // Slug is unique
      
      counter++;
      slug = \`\${baseSlug}-\${counter}\`;
    }
    
    return new Response(
      JSON.stringify({ slug, original: baseSlug }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});`}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupabaseDemo;
