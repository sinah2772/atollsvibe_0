import React, { useState, useEffect } from 'react';
import StorageImageGallery from '../components/StorageImageGallery';
import ImageUploader from '../components/ImageUploader';
import { storageService } from '../services/storageService';
import { supabase } from '../lib/supabase';
import { Loader2, FileCode, Database } from 'lucide-react';

interface StorageBucket {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

const StorageImages: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<string>('images');
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [refreshGallery, setRefreshGallery] = useState(0); // Used to trigger gallery refresh after upload

  // Fetch available buckets
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

  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
  };

  const handleImageUpload = (url: string) => {
    setSelectedImage(url);
    setUploadSuccess(true);
    setRefreshGallery(prev => prev + 1); // Trigger gallery refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };
  
  const handleBucketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBucket(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Supabase Storage and Real-time Features</h1>
      
      <div className="mt-4 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold mb-2">About Supabase Features</h2>
        <p className="mb-2">This page demonstrates several Supabase features:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Storage:</strong> Upload and manage files in Supabase Storage buckets</li>
          <li><strong>Authentication:</strong> Secured access using Supabase Auth (already set up)</li>
          <li><strong>Database:</strong> Structured data storage with RLS policies</li>
          <li><strong>Real-time:</strong> Live updates using Supabase's real-time subscriptions</li>
          <li><strong>Edge Functions:</strong> Serverless functions for image processing</li>
        </ul>
        <div className="mt-3">
          <a 
            href="/dashboard/supabase-demo" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <Database size={16} className="mr-1" />
            Visit our comprehensive Supabase Demo page
          </a>
        </div>
      </div>
      
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
                {bucket.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      
      {/* Upload section */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Upload New Image</h2>
        <ImageUploader 
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
          key={`gallery-${selectedBucket}-${refreshGallery}`} // Force refresh when bucket changes or after upload
          onSelect={handleImageSelect} 
          allowDelete={true}
          defaultBucket={selectedBucket}
        />
      </div>
        {/* Usage instructions */}      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">
          <FileCode className="inline mr-2 text-blue-600" size={20} />
          Usage Instructions
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-2">To use a selected image in your code:</p>
          
          {/* Example of how to use storageService with sample filename */}
          {(() => {
            // Use storageService to generate an example
            const sampleFilename = 'sample-image.jpg';
            const exampleUrl = storageService.getPublicUrl(sampleFilename, selectedBucket);
            
            return (
              <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto">
                {`import { storageService } from '../services/storageService';

// Get image URL by name
const imageUrl = storageService.getPublicUrl('${sampleFilename}', '${selectedBucket}');
// Result: "${exampleUrl}"

// Transform image (resize, format conversion)
const transformedUrl = storageService.getTransformedImageUrl('${sampleFilename}', {
  width: 400,
  height: 300,
  format: 'webp',
  quality: 80
}, '${selectedBucket}');

// Use in your component
<img src="${selectedImage || '[selected image URL will appear here]'}" alt="My image" />`}
              </pre>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default StorageImages;
