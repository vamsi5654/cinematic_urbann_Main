/**
 * ================================================================
 * CLOUDFLARE R2 UPLOAD SERVICE
 * ================================================================
 * Uploads images via the Cloudflare Worker (/api/upload-image)
 * which stores the file in R2 and returns a public URL.
 *
 * The Worker URL comes from VITE_WORKER_URL in .env.local
 * ================================================================
 */

import { v4 as uuidv4 } from 'uuid';

// ================================================================
// CONFIGURATION
// ================================================================
const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL as string;

if (!WORKER_URL) {
  console.warn('⚠️ VITE_WORKER_URL not set in .env.local — uploads will fail.');
}

// ================================================================
// IMAGE COMPRESSION SETTINGS
// ================================================================
const COMPRESSION_SETTINGS = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.85,
  format: 'image/webp' as const,
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
// IMAGE COMPRESSION
// ================================================================
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
      let { width, height } = img;

      if (width > COMPRESSION_SETTINGS.maxWidth) {
        height = (height * COMPRESSION_SETTINGS.maxWidth) / width;
        width = COMPRESSION_SETTINGS.maxWidth;
      }
      if (height > COMPRESSION_SETTINGS.maxHeight) {
        width = (width * COMPRESSION_SETTINGS.maxHeight) / height;
        height = COMPRESSION_SETTINGS.maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(
              `📦 Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(blob.size / 1024 / 1024).toFixed(2)}MB`
            );
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        COMPRESSION_SETTINGS.format,
        COMPRESSION_SETTINGS.quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// ================================================================
// MAIN UPLOAD FUNCTION
// ================================================================
export async function uploadImageToR2(
  file: File,
  category: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    console.log(`📤 Starting upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    if (!WORKER_URL) {
      throw new Error('VITE_WORKER_URL is not set in your .env.local file.');
    }

    // Step 1: Compress image
    if (onProgress) onProgress({ percent: 10, loaded: 10, total: 100 });
    const compressedBlob = await compressImage(file);
    const uniqueFileName = `${category}/${uuidv4()}.webp`;
    const compressedFile = new File([compressedBlob], uniqueFileName, {
      type: COMPRESSION_SETTINGS.format,
    });

    console.log(`📁 Category: ${category}`);
    console.log(`📄 File: ${uniqueFileName} (${(compressedFile.size / 1024).toFixed(0)} KB)`);

    if (onProgress) onProgress({ percent: 30, loaded: 30, total: 100 });

    // Step 2: Build FormData for the Worker
    const formData = new FormData();
    formData.append('file', compressedFile, uniqueFileName);
    formData.append('category', category);
    formData.append('key', uniqueFileName);

    if (onProgress) onProgress({ percent: 50, loaded: 50, total: 100 });

    // Step 3: POST to Cloudflare Worker
    console.log(`🚀 Uploading to Cloudflare Worker: ${WORKER_URL}/api/upload-image`);
    const response = await fetch(`${WORKER_URL}/api/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (onProgress) onProgress({ percent: 90, loaded: 90, total: 100 });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker upload failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    // Step 4: Build the public URL
    const imageUrl =
      result.imageUrl ||
      result.url ||
      (R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${uniqueFileName}` : '');

    if (!imageUrl) {
      throw new Error('No image URL returned from Worker and VITE_R2_PUBLIC_URL is not set.');
    }

    if (onProgress) onProgress({ percent: 100, loaded: 100, total: 100 });

    console.log(`✅ Upload successful → ${imageUrl}`);

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
// DELETE FROM R2
// ================================================================
export async function deleteImageFromR2(fileName: string): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting image: ${fileName}`);

    if (!WORKER_URL) {
      console.warn('⚠️ VITE_WORKER_URL not set — cannot delete from R2.');
      return false;
    }

    const response = await fetch(`${WORKER_URL}/api/delete-image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: fileName }),
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
// GET PUBLIC IMAGE URL
// ================================================================
export function getImageUrl(fileName: string): string {
  if (!R2_PUBLIC_URL) return '';
  return `${R2_PUBLIC_URL}/${fileName}`;
}

// ================================================================
// VALIDATE IMAGE FILE
// ================================================================
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP images.' };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  return { valid: true };
}
