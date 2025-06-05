import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Database } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { getStorageImages, getStorageBuckets } from '../utils/storageUtils';

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

interface ImageBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  language?: 'en' | 'dv';
  initialImage?: string;
}

const ImageBrowser: React.FC<ImageBrowserProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  language = 'en',
  initialImage
}) => {
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>('images');
  const [loadingBuckets, setLoadingBuckets] = useState(false);

  const fetchBuckets = async () => {
    try {
      setLoadingBuckets(true);
      const bucketList = await getStorageBuckets();
      setBuckets(bucketList);
    } catch (err) {
      console.error('Failed to fetch buckets:', err);
      // Don't set error state - we'll just hide the bucket selector if this fails
    } finally {
      setLoadingBuckets(false);
    }
  };

  const fetchStorageImages = useCallback(async (bucketName = selectedBucket) => {
    try {
      setLoading(true);
      setError(null);
      // Pass the bucket name to getStorageImages
      const images = await getStorageImages(bucketName);
      setStorageImages(images);
    } catch (err) {
      console.error(`Failed to fetch images from bucket '${bucketName}':`, err);
      setError(err instanceof Error ? err.message : 'Failed to load images from storage');
    } finally {
      setLoading(false);
    }
  }, [selectedBucket]);

  useEffect(() => {
    if (isOpen) {
      fetchBuckets();
      fetchStorageImages(selectedBucket);
    }
  }, [isOpen, selectedBucket, fetchStorageImages]);

  const handleUploadComplete = (url: string) => {
    onSelect(url);
    onClose();
  };

  const handleBucketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBucket = e.target.value;
    setSelectedBucket(newBucket);
    fetchStorageImages(newBucket);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ފޮޓޯ އިޚްތިޔާރު ކުރައްވާ' : 'Select Image'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={language === 'dv' ? 'ލައްޕާލާ' : 'Close'}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              {/* Bucket selector */}
              <div className="relative">
                <select
                  value={selectedBucket}
                  onChange={handleBucketChange}
                  className="w-full py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-4 appearance-none"
                  disabled={loadingBuckets}
                  aria-label={language === 'dv' ? 'ސްޓޯރޭޖް ބަކެޓް' : 'Storage Bucket'}
                >
                  {buckets.map(bucket => (
                    <option key={bucket.id} value={bucket.name}>
                      {bucket.name}
                    </option>
                  ))}
                </select>
                <Database 
                  className="absolute top-2.5 left-3 text-gray-400" 
                  size={20} 
                />
                {loadingBuckets && (
                  <div className="absolute top-2.5 right-3 w-5 h-5 text-blue-600">Loading...</div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload size={18} />
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? 'އަޕްލޯޑް ކުރައްވާ' : 'Upload'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {showUploader ? (
            <ImageUploader 
              onUpload={handleUploadComplete} 
              language={language}
              bucketName={selectedBucket} 
            />
          ) : error ? (
            <div className="text-center py-4">
              <div className="text-red-600 mb-2">
                {language === 'dv' ? 'މަްސަލައެއް ދިމާވެއްޖެ' : error}
              </div>
              <p className={`text-gray-600 mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' 
                  ? 'ސަރވަރާއި ގުޅުން ބަދަހި ނުކުރެވޭ، އެހެންނަމަވެސް އަމިއްލަ ފޮޓޯއެއް އަޕްލޯޑް ކުރެއްވިދާނެ' 
                  : 'Could not connect to the storage service, but you can still upload your own image'}
              </p>
              <button
                onClick={() => setShowUploader(true)}
                className="flex items-center gap-2 px-4 py-2 mx-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload size={18} />
                <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                  {language === 'dv' ? 'އަޕްލޯޑް ކުރައްވާ' : 'Upload an image'}
                </span>
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div>Loading images...</div>
            </div>
          ) : (
            <>
              {initialImage && (
                <div className="mb-4">
                  <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? 'މިހާރުގެ ފޮޓޯ' : 'Current Image'}
                  </h3>
                  <div className="relative group aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
                    <img
                      src={initialImage}
                      alt="Current cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => onSelect(initialImage)}
                        className={`text-white opacity-0 group-hover:opacity-100 transition-opacity ${language === 'dv' ? 'thaana-waheed' : ''}`}
                        aria-label={language === 'dv' ? 'އަލުން އިޚްތިޔާރު ކުރައްވާ' : 'Use Again'}
                      >
                        {language === 'dv' ? 'އަލުން އިޚްތިޔާރު ކުރައްވާ' : 'Use Again'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {storageImages.length === 0 ? (
                <div className="text-center p-4">
                  <p className={`text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? 'ފޮޓޯއެއް ނެތް' : 'No images found in storage'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {storageImages.map((image) => (
                    <button
                      key={image.name}
                      onClick={() => onSelect(image.url)}
                      className="relative group aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Select image: ${image.name}`}
                      title={`Select image: ${image.name}`}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <span className={`text-white opacity-0 group-hover:opacity-100 transition-opacity ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                          {language === 'dv' ? 'އިޚްތިޔާރު ކުރައްވާ' : 'Select'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageBrowser;