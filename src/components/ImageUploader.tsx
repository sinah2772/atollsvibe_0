import React, { useState, useRef } from 'react';
import { Upload, Loader2, Check, X, Image } from 'lucide-react';
import { storageService } from '../services/storageService';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  language?: 'en' | 'dv';
  bucketName?: string;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUpload, 
  language = 'en',
  bucketName = 'images',
  maxSizeMB = 5,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  multiple = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        setError(language === 'dv' 
          ? 'ފައިލްގެ ބާވަތް ބަލައެއް ނުގަނެވޭނެ' 
          : `File type ${file.type} not allowed. Please use ${allowedFileTypes.join(', ')}`);
        setUploadStatus('error');
        return;
      }
      
      // Validate file size
      if (file.size > maxSizeBytes) {
        setError(language === 'dv' 
          ? `ފައިލްގެ ސައިޒް ${maxSizeMB}MB އަށްވުރެ ބޮޑުވެގެންނުވާނެ` 
          : `File size exceeds the ${maxSizeMB}MB limit`);
        setUploadStatus('error');
        return;
      }

      // Use the storageService for upload
      const { data, error: uploadError } = await storageService.uploadFile(file, {
        bucket: bucketName,
        fileName: file.name,
        contentType: file.type,
        metadata: {
          originalName: file.name,
          size: file.size.toString()
        }
      });
      
      if (uploadError) throw uploadError;
      
      if (data) {
        onUpload(data.fileUrl);
        setUploadStatus('success');
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error uploading file');
      setUploadStatus('error');
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Get first file or all files based on multiple prop
    const filesToProcess = multiple ? Array.from(files) : [files[0]];
    
    for (const file of filesToProcess) {
      await uploadImage(file);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    if (!files || files.length === 0) return;
    
    // Get first file or all files based on multiple prop
    const filesToProcess = multiple ? Array.from(files) : [files[0]];
    
    for (const file of filesToProcess) {
      uploadImage(file);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedFileTypes.join(',')}
        className="hidden"
        multiple={multiple}
        aria-label={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image file'}
        title={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image file'}
      />

      {error && (
        <div className="text-red-600 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="text-center p-4">
        {uploading ? (
          <Loader2 size={40} className="mx-auto text-blue-500 animate-spin" />
        ) : uploadStatus === 'success' ? (
          <Check size={40} className="mx-auto text-green-500" />
        ) : uploadStatus === 'error' ? (
          <X size={40} className="mx-auto text-red-500" />
        ) : (
          <Image size={40} className="mx-auto text-gray-400" />
        )}
        
        <p className={`mt-4 text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? 'ފޮޓޯ މިތަނަށް ދަމާލާ ނުވަތަ ބްރައުޒް ކުރާ' 
            : 'Drag and drop image here, or browse'}
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'ފޮޓޯ އަޕްލޯޑް ކުރައްވާ' : 'Browse Files'}
          </span>
        </button>
      
        <p className={`mt-2 text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? `ގިނަވެގެން ${maxSizeMB}MB` 
            : `Supports ${allowedFileTypes.map(type => type.replace('image/', '.')).join(', ')} up to ${maxSizeMB}MB`}
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;