import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SimpleImageUploaderProps {
  bucketName?: string;
  folderPath?: string;
  onUpload: (url: string) => void;
  maxSizeMB?: number;
}

const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
  bucketName = 'images',
  folderPath = '',
  onUpload,
  maxSizeMB = 2
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const selectedFile = event.target.files[0];
    
    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPEG, PNG, GIF and WebP images are allowed');
      return;
    }
    
    setFile(selectedFile);
  };
  
  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Create a unique file name using timestamp
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = folderPath 
        ? `${folderPath}/${timestamp}.${fileExt}` 
        : `${timestamp}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      setFile(null);
      onUpload(data.publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file size
      if (droppedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds the ${maxSizeMB}MB limit`);
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(droppedFile.type)) {
        setError('Only JPEG, PNG, GIF and WebP images are allowed');
        return;
      }
      
      setFile(droppedFile);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : file 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center">
            <Check className="w-12 h-12 text-green-500 mb-2" />
            <p className="text-sm font-medium mb-1">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm font-medium mb-1">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG, GIF or WebP • Max {maxSizeMB}MB
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Upload button */}
      <div className="flex justify-end">
        <button
          onClick={uploadFile}
          disabled={!file || uploading}
          className={`px-4 py-2 rounded-lg flex items-center ${
            !file 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SimpleImageUploader;