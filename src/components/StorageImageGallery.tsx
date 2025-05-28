import React, { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { supabase } from '../lib/supabase';

interface StorageImage {
  name: string;
  url: string;
  id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
}

interface StorageBucket {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

interface StorageImageGalleryProps {
  onSelect?: (url: string) => void;
  language?: 'en' | 'dv';
  allowDelete?: boolean;
  defaultBucket?: string;
}

const StorageImageGallery: React.FC<StorageImageGalleryProps> = ({ 
  onSelect, 
  language = 'en',
  allowDelete = false,
  defaultBucket = 'images'
}) => {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>(defaultBucket);
  const [loadingBuckets, setLoadingBuckets] = useState(false);

  const fetchBuckets = async () => {
    try {
      setLoadingBuckets(true);
      const { data } = await supabase.storage.listBuckets();
      setBuckets(data || []);
    } catch (err) {
      console.error('Failed to fetch buckets:', err);
      // Don't set error state - we'll just hide the bucket selector if this fails
    } finally {
      setLoadingBuckets(false);
    }
  };

  const fetchImages = async (bucketName = selectedBucket) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await storageService.listFiles(bucketName);
      
      if (error) throw error;
      
      if (data) {
        // Convert FileObject to StorageImage format
        const storageImages = data.map(file => {
          // Skip folders
          if (file.name.endsWith('/')) {
            return null;
          }
          
          const url = storageService.getPublicUrl(file.name, bucketName);
          
          return {
            name: file.name,
            url,
            id: file.id,
            metadata: file.metadata,
            created_at: file.created_at,
            updated_at: file.updated_at,
            last_accessed_at: file.last_accessed_at
          };
        }).filter(Boolean) as StorageImage[];
        
        setImages(storageImages);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError('Failed to load images. Please try again later.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    fetchBuckets();
    fetchImages(selectedBucket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fetch images when selected bucket changes or when defaultBucket prop changes
  useEffect(() => {
    if (defaultBucket !== selectedBucket) {
      setSelectedBucket(defaultBucket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBucket]);
  
  // Fetch images when selected bucket changes
  useEffect(() => {
    fetchImages(selectedBucket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBucket]);
  const handleDelete = async (imageName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmDelete = window.confirm(language === 'dv' 
      ? 'ކަށަވަރުތޯ މި ފޮޓޯ ފޮހެލަން ބޭނުން؟' 
      : 'Are you sure you want to delete this image?');
      
    if (confirmDelete) {
      try {
        const { error } = await storageService.deleteFile(imageName, selectedBucket);
        
        if (error) throw error;
        
        // Remove the image from the state
        setImages(currentImages => currentImages.filter(img => img.name !== imageName));
      } catch (err) {
        console.error('Failed to delete image:', err);
        alert(language === 'dv' 
          ? 'ފޮޓޯ ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ' 
          : 'An error occurred while deleting the image');
      }
    }
  };
  
  const handleBucketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBucket(e.target.value);
  };
  // Handle retry button click
  const handleRetry = () => {
    fetchImages(selectedBucket);
  };
    // Render bucket selector if buckets are available
  const renderBucketSelector = () => {
    if (buckets.length > 0) {
      return (
        <div className="mb-4">
          <label 
            htmlFor="bucket-select" 
            className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}
          >
            {language === 'dv' ? 'ސްޓޯރޭޖް ބަކެޓް' : 'Storage Bucket'}
            {loadingBuckets && <span className="ml-2 text-blue-600"><Loader2 className="w-4 h-4 inline animate-spin" /></span>}
          </label>
          <select
            id="bucket-select"
            value={selectedBucket}
            onChange={handleBucketChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loadingBuckets}
          >{buckets.map(bucket => (
              <option key={bucket.id} value={bucket.name}>
                {bucket.name}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">
          {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : error}
        </p>
        <button 
          onClick={handleRetry}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {language === 'dv' ? 'އަލުން މަސައްކަތްކުރޭ' : 'Try Again'}
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-4">
        <p className={`text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ފޮޓޯއެއް ނެތް' : 'No images found in storage'}
        </p>
      </div>
    );
  }
  return (
    <div>
      {/* Use the bucket selector */}
      {renderBucketSelector()}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div 
            key={image.name}
            className="relative group aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 cursor-pointer"
            onClick={() => onSelect && onSelect(image.url)}
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
              {allowDelete && (
                <button
                  onClick={(e) => handleDelete(image.name, e)}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 p-2 rounded-full"
                  aria-label={language === 'dv' ? 'ފޮހެލާ' : 'Delete'}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorageImageGallery;
