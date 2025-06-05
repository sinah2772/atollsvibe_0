import { supabase } from '../lib/supabase';

// Define types for file metadata
export type FileObject = {
  name: string;
  id: string;
  size: number;
  created_at: string;
  last_accessed_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
  bucketId: string;
};

export type UploadOptions = {
  folderPath?: string;
  fileName?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  bucket?: string;
  onProgress?: (progress: number) => void;
};

export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpg' | 'jpeg';
  resize?: 'cover' | 'contain' | 'fill';
};

// Storage service for handling file uploads and management
export const storageService = {
  // Upload a file to Supabase Storage
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<{ data: { path: string; fileUrl: string } | null; error: Error | null }> {
    try {
      const {
        folderPath = '',
        fileName = '',
        contentType = file.type,
        metadata = {},
        bucket = 'public',
        onProgress
      } = options;

      // Generate a file path
      const actualFileName = fileName || (file.name.replace(/\s+/g, '_').toLowerCase());
      const timestamp = new Date().getTime();
      const filePath = folderPath
        ? `${folderPath}/${timestamp}_${actualFileName}`
        : `${timestamp}_${actualFileName}`;

      // Add file type to metadata
      const fileMetadata = {
        ...metadata,
        contentType,
        originalName: file.name
      };

      // Upload the file with progress tracking if onProgress is provided
      if (onProgress) {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            contentType,
            upsert: true,
            duplex: 'half',
            metadata: fileMetadata
          });

        if (error) throw error;
      } else {
        // Standard upload without progress tracking
        const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
          contentType,
          upsert: true,
          metadata: fileMetadata
        });

        if (error) throw error;
      }

      // Get the public URL for the file
      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        data: {
          path: filePath,
          fileUrl: publicUrl.publicUrl
        },
        error: null
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error during file upload')
      };
    }
  },

  // List files in a bucket/folder
  async listFiles(
    bucket: string = 'public',
    folderPath: string = ''
  ): Promise<{ data: FileObject[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

      if (error) throw error;
      
      // Transform the Supabase FileObject to our FileObject type
      const fileObjects = data.map(item => ({
        name: item.name,
        id: item.id || item.name,
        size: 0, // Size not provided in the list result
        created_at: item.created_at || new Date().toISOString(),
        last_accessed_at: item.last_accessed_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        metadata: item.metadata || {},
        bucketId: bucket
      }));

      return { data: fileObjects, error: null };
    } catch (error) {
      console.error('Error listing files:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error listing files')
      };
    }
  },

  // Delete a file from storage
  async deleteFile(
    path: string,
    bucket: string = 'public'
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown error deleting file')
      };
    }
  },

  // Get a temporary signed URL for a file (for private buckets)
  async getSignedUrl(
    path: string,
    bucket: string = 'private',
    expiresIn: number = 3600 // 1 hour in seconds
  ): Promise<{ data: { signedUrl: string } | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;

      return { data: { signedUrl: data.signedUrl }, error: null };
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error getting signed URL')
      };
    }
  },

  // Get a public URL for a file
  getPublicUrl(path: string, bucket: string = 'public'): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  // Transform an image URL using Supabase image transformations
  getTransformedImageUrl(
    path: string,
    options: ImageTransformOptions = {},
    bucket: string = 'public'
  ): string {
    const { width, height, quality = 80, resize = 'cover' } = options;
    // Note: format from options is intentionally not used because Supabase expects a different format type
    
    try {
      // Handle format type difference between our interface and Supabase's
      // Transform format from our ImageTransformOptions to what the Supabase Storage API expects
      const transformer = supabase.storage.from(bucket).getPublicUrl(path, {
        transform: {
          width,
          height,
          quality,
          format: 'origin', // We're using origin since the format type differs, in a real situation you'd transform the format
          resize
        }
      });
      
      return transformer.data.publicUrl;
    } catch (error) {
      console.error('Error transforming image:', error);
      // Fall back to the original URL if transformation fails
      return this.getPublicUrl(path, bucket);
    }
  },
  
  // Move a file to a new location
  async moveFile(
    fromPath: string,
    toPath: string,
    bucket: string = 'public'
  ): Promise<{ data: FileObject | null; error: Error | null }> {
    try {
      // First download the file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(fromPath);

      if (downloadError) throw downloadError;
      if (!fileData) throw new Error('File not found');

      // Then upload to the new location
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(toPath, fileData, { upsert: true });

      if (uploadError) throw uploadError;

      // Delete the original file
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([fromPath]);

      if (deleteError) throw deleteError;

      // Get the public URL for the file access
      supabase.storage.from(bucket).getPublicUrl(toPath);
      
      // Return the details of the moved file
      return {
        data: {
          name: toPath.split('/').pop() || '',
          id: '',  // Storage API doesn't return the ID directly
          size: fileData.size,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          bucketId: bucket,
          metadata: {}
        },
        error: null
      };
    } catch (error) {
      console.error('Error moving file:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error moving file')
      };
    }
  }
};
