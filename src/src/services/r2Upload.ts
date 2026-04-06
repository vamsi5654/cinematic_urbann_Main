/**
 * ================================================================
 * CLOUDFLARE R2 UPLOAD SERVICE
 * ================================================================
 * Handles image uploads to Cloudflare R2 Storage
 * 
 * Features:
 * - Client-side image compression before upload
 * - WebP conversion for smaller file sizes
 * - Image resizing (max 2000px width)
 * - Progress tracking
 * - Error handling
 * ================================================================
 */

import { v4 as uuidv4 } from 'uuid';

// ================================================================
// CONFIGURATION (from .env.local)
// ================================================================
const R2_CONFIG = {
  accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID,
  bucketName: import.meta.env.VITE_R2_BUCKET_NAME,
  accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  publicUrl: import.meta.env.VITE_R2_PUBLIC_URL,
};

// Validate configuration
if (!R2_CONFIG.accountId || !R2_CONFIG.bucketName || !R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey) {
  console.warn('⚠️ Cloudflare R2 credentials not found in .env.local. Using mock mode.');
}

// ================================================================
// IMAGE COMPRESSION SETTINGS
// ================================================================
const COMPRESSION_SETTINGS = {
  maxWidth: 2000,           // Maximum width in pixels
  maxHeight: 2000,          // Maximum height in pixels
  quality: 0.85,            // JPEG/WebP quality (0-1)
  format: 'image/webp',     // Convert to WebP for better compression
  maxSizeMB: 2,             // Maximum file size in MB
};

// ================================================================
// TYPES
// ================================================================
export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export interface UploadResult {
  success: boolean;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  error?: string;
}

// ================================================================
// IMAGE COMPRESSION FUNCTION
// ================================================================
/**
 * Compress and resize image before upload
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions (maintain aspect ratio)
      let { width, height } = img;
      
      if (width > COMPRESSION_SETTINGS.maxWidth) {
        height = (height * COMPRESSION_SETTINGS.maxWidth) / width;
        width = COMPRESSION_SETTINGS.maxWidth;
      }
      
      if (height > COMPRESSION_SETTINGS.maxHeight) {
        width = (width * COMPRESSION_SETTINGS.maxHeight) / height;
        height = COMPRESSION_SETTINGS.maxHeight;
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(`📦 Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        COMPRESSION_SETTINGS.format,
        COMPRESSION_SETTINGS.quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
}

// ================================================================
// UPLOAD TO R2 FUNCTION
// ================================================================
/**
 * Upload image to Cloudflare R2
 */
export async function uploadImageToR2(
  file: File,
  category: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    console.log(`📤 Starting upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Step 1: Compress image
    if (onProgress) onProgress({ percent: 10, loaded: 0, total: 100 });
    
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, { 
      type: COMPRESSION_SETTINGS.format 
    });

    if (onProgress) onProgress({ percent: 30, loaded: 30, total: 100 });

    // Step 2: Generate unique filename
    const fileExtension = 'webp'; // Always WebP after compression
    const uniqueFileName = `${category}/${uuidv4()}.${fileExtension}`;

    // Step 3: Check if credentials are available
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey) {
      // MOCK MODE: Simulate upload for development without credentials
      console.log('🧪 Mock mode: Simulating upload...');
      console.log('📁 Category:', category);
      console.log('📄 File:', file.name, '(', (file.size / 1024).toFixed(0), 'KB)');
      
      if (onProgress) {
        for (let i = 30; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          onProgress({ percent: i, loaded: i, total: 100 });
        }
      }

      // Return mock URL (using base64 for preview)
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          const base64Url = reader.result as string;
          console.log('✅ Mock upload complete - Base64 length:', base64Url.length);
          resolve({
            success: true,
            imageUrl: base64Url, // Base64 data URL for preview
            fileName: uniqueFileName,
            fileSize: compressedFile.size,
          });
        };
        reader.readAsDataURL(compressedFile);
      });
    }

    // Step 4: Upload to R2 (REAL MODE)
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('key', uniqueFileName);
    formData.append('bucket', R2_CONFIG.bucketName);

    if (onProgress) onProgress({ percent: 50, loaded: 50, total: 100 });

    // Upload via your backend API (we'll create this endpoint)
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'X-R2-Access-Key': R2_CONFIG.accessKeyId,
        'X-R2-Secret-Key': R2_CONFIG.secretAccessKey,
        'X-R2-Account-Id': R2_CONFIG.accountId,
      },
      body: formData,
    });

    if (onProgress) onProgress({ percent: 90, loaded: 90, total: 100 });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (onProgress) onProgress({ percent: 100, loaded: 100, total: 100 });

    // Step 5: Return success result
    const imageUrl = `${R2_CONFIG.publicUrl}/${uniqueFileName}`;

    console.log(`✅ Upload successful: ${imageUrl}`);

    return {
      success: true,
      imageUrl,
      fileName: uniqueFileName,
      fileSize: compressedFile.size,
    };

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    return {
      success: false,
      imageUrl: '',
      fileName: '',
      fileSize: 0,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// ================================================================
// DELETE FROM R2 FUNCTION
// ================================================================
/**
 * Delete image from Cloudflare R2
 */
export async function deleteImageFromR2(fileName: string): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting image: ${fileName}`);

    // Check if credentials are available
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey) {
      console.log('🧪 Mock mode: Simulating delete...');
      return true; // Mock success
    }

    // Delete via backend API
    const response = await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-R2-Access-Key': R2_CONFIG.accessKeyId,
        'X-R2-Secret-Key': R2_CONFIG.secretAccessKey,
        'X-R2-Account-Id': R2_CONFIG.accountId,
      },
      body: JSON.stringify({
        bucket: R2_CONFIG.bucketName,
        key: fileName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    console.log(`✅ Delete successful: ${fileName}`);
    return true;

  } catch (error) {
    console.error('❌ Delete error:', error);
    return false;
  }
}

// ================================================================
// GET IMAGE URL FUNCTION
// ================================================================
/**
 * Get full public URL for an image
 */
export function getImageUrl(fileName: string): string {
  if (!R2_CONFIG.publicUrl) {
    return ''; // No URL in mock mode
  }
  return `${R2_CONFIG.publicUrl}/${fileName}`;
}

// ================================================================
// VALIDATE IMAGE FILE FUNCTION
// ================================================================
/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPG, PNG, or WebP images.',
    };
  }

  // Check file size (10MB max before compression)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}