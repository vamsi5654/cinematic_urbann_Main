# Customer-Centric Upload System Implementation Summary

## Overview
This document outlines the complete restructuring of the admin panel and database to implement a simplified, customer-centric media upload system.

## Changes Made

### 1. Database Schema (`/database/schema.sql`)

**Added New Tables:**

```sql
-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_number TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK(category IN ('Kitchen', 'Living', 'Bedroom', 'Full Home', 'Bathroom', 'Office')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    customer_number TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('image', 'video')),
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_number) REFERENCES customers(customer_number) ON DELETE CASCADE
);
```

**Added Indexes:**
- `idx_customers_category`
- `idx_media_customer_number`
- `idx_media_type`

**Note:** Legacy `images` table is kept for backward compatibility.

---

### 2. TypeScript Types (`/types/index.ts`)

**Added New Interfaces:**

```typescript
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  createdAt: Date;
}

export interface Customer {
  customerNumber: string; // Document ID
  category: 'Kitchen' | 'Living' | 'Bedroom' | 'Full Home' | 'Bathroom' | 'Office';
  media: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 3. API Service Layer (`/src/services/api.ts`)

**Added New Customer API Functions:**

1. **`uploadCustomerMedia(data)`**
   - Uploads multiple images and/or video URL for a customer
   - Auto-creates customer if doesn't exist
   - Appends media to existing customer if already exists
   - Returns updated Customer object

2. **`getCustomers(filters?)`**
   - Retrieves all customers with their media
   - Optional category filter
   - Returns array of Customer objects

3. **`getCustomerByNumber(customerNumber)`**
   - Gets a single customer with all their media
   - Returns Customer object

4. **`deleteCustomer(customerNumber)`**
   - Deletes customer and all associated media
   - Cascading delete via foreign key

---

### 4. New Simplified Admin Panel (`/pages/AdminSimple.tsx`)

**Features:**

- **Minimal Upload Form** with only:
  - Customer Number (required)
  - Category dropdown (required)
  - Multiple image upload (drag & drop supported)
  - Video URL input (optional)

- **Customer Cards Display:**
  - Shows customer number and category
  - Displays all media (images and videos) in a grid
  - Delete button to remove entire customer

- **Key Behaviors:**
  - If customer number exists → appends new media
  - If customer number is new → creates new customer
  - No overwrites - media accumulates over time

**Upload Logic:**
```typescript
// Checks if customer exists on backend
// Backend handles create vs append logic
await api.uploadCustomerMedia({
  customerNumber: uploadForm.customerNumber,
  category: uploadForm.category,
  images: selectedImages,
  videoUrl: uploadForm.videoUrl || undefined
});
```

---

### 5. Gallery Page Updates (`/pages/Gallery.tsx`)

**Dual API Support:**

The gallery now tries the new customer API first, then falls back to legacy:

```typescript
// Try new customer API
const customers = await api.getCustomers({ category });
// Convert to projects format

// If fails, fallback to legacy images API
const images = await api.getImages({ status: 'published', category });
```

**Video Display:**
- Videos autoplay automatically (muted, looped)
- Play icon overlay indicates video content
- Clicking opens project detail page

---

### 6. CSS Styles (`/pages/Admin.module.css`)

**Added New Styles:**

- `.adminContainer` - Main container for simplified admin
- `.loginModal` & `.loginCard` - Login UI
- `.uploadForm` & `.formGroup` - Form styling
- `.customerGrid` - Grid layout for customer cards
- `.customerCard` - Individual customer card styling
- `.mediaGrid` & `.mediaItem` - Media display grid
- `.videoPlaceholder` - Video URL indicator
- `.dropZone` - Drag & drop upload area
- `.imagePreviewGrid` - Selected images preview
- `.progressBar` - Upload progress indicator

---

## Backend Requirements

The backend needs to implement these endpoints:

### POST `/api/customers/upload`
**Request:** FormData with:
- `customerNumber`: string
- `category`: string
- `images`: File[] (multiple files)
- `videoUrl`: string (optional)

**Response:**
```json
{
  "customer": {
    "customerNumber": "12345",
    "category": "Kitchen",
    "media": [
      {
        "id": "auto-generated-id",
        "type": "image",
        "url": "https://cloudflare-r2-url.com/image1.jpg",
        "createdAt": "2024-02-16T10:00:00Z"
      },
      {
        "id": "auto-generated-id",
        "type": "video",
        "url": "https://example.com/video.mp4",
        "createdAt": "2024-02-16T10:00:00Z"
      }
    ],
    "createdAt": "2024-02-16T09:00:00Z",
    "updatedAt": "2024-02-16T10:00:00Z"
  }
}
```

**Logic:**
1. Check if customer exists in `customers` table
2. If exists:
   - Upload new images to Cloudflare R2
   - Insert new media rows into `media` table
   - Update `updated_at` timestamp
3. If not exists:
   - Create customer in `customers` table
   - Upload images to Cloudflare R2
   - Insert media rows
4. Return full customer object with all media

### GET `/api/customers?category={category}`
**Response:**
```json
{
  "customers": [
    {
      "customerNumber": "12345",
      "category": "Kitchen",
      "media": [...],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET `/api/customers/{customerNumber}`
**Response:** Single customer object

### DELETE `/api/customers/{customerNumber}`
**Response:** `{ "success": true }`

---

## Usage Flow

1. **Admin logs in** → Sees list of existing customers
2. **Clicks "Upload Media"** → Opens upload modal
3. **Enters customer number** → "12345"
4. **Selects category** → "Kitchen"
5. **Drags images** → Multiple images selected
6. **Optionally adds video URL** → "https://example.com/tour.mp4"
7. **Clicks Upload** → 
   - Backend checks if customer 12345 exists
   - If exists: Appends new media to existing array
   - If new: Creates customer + media
8. **Upload completes** → Customer card updates with new media
9. **Gallery page** → Shows video (if provided) with autoplay
10. **Click on project** → Opens detail page with all images

---

## Key Benefits

✅ **Simple Upload Form** - Only 3-4 fields instead of 10+
✅ **Customer-Centric** - All media grouped by customer number
✅ **No Overwriting** - Media accumulates over time
✅ **Automatic Handling** - Backend decides create vs append
✅ **Video Support** - Store video URLs in same structure
✅ **Gallery Integration** - Videos autoplay in gallery
✅ **Backward Compatible** - Legacy images table still works

---

## Migration Path

To migrate existing data:

```sql
INSERT INTO customers (customer_number, category, created_at, updated_at)
SELECT DISTINCT customer_number, category, MIN(uploaded_at), MAX(updated_at)
FROM images
GROUP BY customer_number;

INSERT INTO media (id, customer_number, type, url, created_at)
SELECT id, customer_number, 'image', image_url, uploaded_at
FROM images;

-- For videos (if video_url exists)
INSERT INTO media (id, customer_number, type, url, created_at)
SELECT id || '-video', customer_number, 'video', video_url, uploaded_at
FROM images
WHERE video_url IS NOT NULL;
```

---

## Files Modified

1. `/database/schema.sql` - Added customers & media tables
2. `/types/index.ts` - Added MediaItem & Customer interfaces
3. `/src/services/api.ts` - Added customer API functions
4. `/pages/AdminSimple.tsx` - **New file** - Simplified admin panel
5. `/pages/Admin.module.css` - Added new styles
6. `/pages/Gallery.tsx` - Added customer API integration with fallback

---

## Next Steps

1. **Implement Backend APIs** - Create the 4 customer endpoints
2. **Test Upload Flow** - Verify create vs append logic
3. **Test Gallery** - Ensure videos autoplay correctly
4. **Update Routing** - Point `/admin` to `AdminSimple` if desired
5. **Deploy Schema** - Run migrations on production database
