# Image Upload Troubleshooting Guide

## Issue: Broken Images in Gallery

If you're seeing broken images in the admin panel or gallery after uploading, here's how to fix it:

### Understanding the System

The image upload system works in two modes:

1. **Mock Mode** (No R2 Credentials)
   - Images are compressed and converted to WebP format
   - Images are stored as base64 data URLs in localStorage
   - Perfect for development and testing
   - No external storage needed

2. **Production Mode** (With R2 Credentials)
   - Images are uploaded to Cloudflare R2 storage
   - Only metadata is stored in Supabase
   - Requires proper R2 configuration

### Current Fix Applied

We've implemented the following fixes to resolve broken images:

#### 1. Gallery Page (GalleryVideo.tsx)
- **"All" Tab**: Shows only videos
- **Kitchen/Living/Bedroom/Bathroom Tabs**: Show only images
- **Full Home/Office Tabs**: Show only videos
- Uses `ImageWithFallback` component for robust image loading

#### 2. Admin Panel (AdminVideo.tsx)
- Replaced plain `<img>` tags with `ImageWithFallback` component
- Added fallback for broken/missing images
- Better error handling

#### 3. Upload Service (r2Upload.ts)
- Added comprehensive console logging
- Mock mode returns proper base64 data URLs
- Images are compressed client-side before upload

#### 4. Image API (imageApi.ts)
- Stores base64 URLs correctly in localStorage (mock mode)
- Logs upload details for debugging
- Validates data before saving

### How to Use

#### For Development (Mock Mode - No Setup Required)

1. Upload images through the Admin Panel
2. Images will be:
   - Compressed (60% size reduction)
   - Converted to WebP format
   - Stored as base64 in browser localStorage
3. View images in the Gallery under the appropriate category tabs

#### For Production (R2 Mode - Requires Configuration)

Create a `.env.local` file with:

```env
# Cloudflare R2 Configuration
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_R2_BUCKET_NAME=theurbann-gallery
VITE_R2_ACCESS_KEY_ID=your_access_key_id
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### Debugging Tips

Open browser console (F12) and look for these log messages:

#### When Uploading:
```
📤 Starting upload: filename.jpg (2.5MB)
📦 Compressed: 2.50MB → 0.95MB
🧪 Mock mode: Simulating upload...
✅ Mock upload complete - Base64 length: 125000
💾 Creating image record: { category, title, ... }
✅ Image saved to localStorage: img-1234567890
```

#### When Viewing Gallery:
```
🧪 Mock mode: Getting images from localStorage
Found X images in category: Kitchen
```

### If Images Are Still Broken

1. **Clear Browser Cache**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

2. **Check LocalStorage**
   - Open DevTools (F12) → Application → Local Storage
   - Look for key: `urbann_images`
   - Should contain an array of image objects

3. **Re-upload Images**
   - Delete old broken images from admin panel
   - Upload fresh images
   - Check console logs for any errors

4. **Verify Image Format**
   - Only upload JPG, PNG, or WebP images
   - Maximum size: 10MB before compression
   - Images are auto-compressed to ~1MB

### Known Limitations

- **Mock Mode**: Images stored in browser localStorage (5-10MB limit)
- **Base64 Images**: Larger data size in localStorage compared to URLs
- **Browser Storage**: Images are lost if localStorage is cleared
- **Production**: Requires Cloudflare R2 account for permanent storage

### Migration to Production

When ready to move from mock mode to production:

1. Set up Cloudflare R2 bucket
2. Configure `.env.local` with R2 credentials
3. Restart development server
4. Re-upload images (old base64 images won't transfer automatically)

## Support

If issues persist, check:
- Browser console for detailed error messages
- Network tab to see failed requests
- localStorage content to verify data is saving
