/**
 * Utilities for working with Supabase storage
 */
import { supabase } from '../lib/supabase';

/**
 * Get a list of all available storage buckets
 * @returns A list of bucket names
 */
export const getStorageBuckets = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Error fetching storage buckets:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Failed to fetch storage buckets:', err);
    throw err;
  }
};

/**
 * Fetch all images from a specific Supabase storage bucket
 * @param bucketName The name of the bucket to fetch images from (defaults to 'images')
 * @returns A list of image objects with their URLs and metadata
 */
export const getStorageImages = async (bucketName = 'images') => {
  try {
    // List all files in the specified bucket
    const { data: files, error } = await supabase
      .storage
      .from(bucketName)
      .list();
    
    if (error) {
      console.error(`Error fetching images from ${bucketName} bucket:`, error);
      throw error;
    }
    
    // For each file, generate a public URL
    const imagesWithUrls = files.map(file => {
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(file.name);
        
      return {
        ...file,
        url: publicUrl
      };
    });
    
    return imagesWithUrls;
  } catch (err) {
    console.error('Failed to fetch storage images:', err);
    throw err;
  }
};

/**
 * Get a specific image from the Supabase storage by its name
 * @param imageName The name of the image file in storage
 * @param bucketName The bucket to get the image from (defaults to 'images')
 * @returns The public URL of the image
 */
export const getStorageImage = (imageName: string, bucketName = 'images') => {
  const { data: { publicUrl } } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(imageName);
    
  return publicUrl;
};

/**
 * Delete an image from Supabase storage
 * @param imagePath The path of the image to delete
 * @param bucketName The bucket to delete from (defaults to 'images')
 * @returns Boolean indicating success
 */
export const deleteStorageImage = async (imagePath: string, bucketName = 'images') => {
  try {
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([imagePath]);
      
    if (error) {
      console.error(`Error deleting image from ${bucketName}:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Failed to delete image from ${bucketName}:`, err);
    return false;
  }
};

/**
 * Upload an image to Supabase storage
 * @param file The file to upload
 * @param bucketName The bucket to upload to (defaults to 'images')
 * @param path Optional path within the bucket
 * @returns Object with the upload result including the public URL of the uploaded image
 */
export const uploadStorageImage = async (
  file: File,
  bucketName = 'images',
  path?: string
) => {
  try {
    // Generate a unique file name to avoid conflicts
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fullPath = path ? `${path}/${uniqueFileName}` : uniqueFileName;
    
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error(`Error uploading image to ${bucketName}:`, error);
      throw error;
    }
    
    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path);
      
    return {
      success: true,
      path: data.path,
      url: publicUrl
    };
  } catch (err) {
    console.error(`Failed to upload image to ${bucketName}:`, err);
    throw err;
  }
};
