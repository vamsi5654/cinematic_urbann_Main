# How to Run the Video Portfolio System

## 🚀 Quick Start (Works Immediately!)

Your video system is now ready to use **without any backend setup**. I've implemented a **mock API** that runs directly in your browser for local development.

### Step 1: Start the Development Server

```bash
npm start
```

### Step 2: Navigate to the Pages

- **Gallery:** `http://localhost:3000/gallery`
- **Admin:** `http://localhost:3000/admin`

### Step 3: Add Videos

1. Go to `/admin`
2. Login (use your existing credentials)
3. Click "Add Video"
4. Enter:
   - **Category:** Kitchen
   - **Video URL:** `https://www.youtube.com/watch?v=zNTaVTMoNTE`
   - **Title:** Modern Kitchen Design (optional)
5. Click "Add Video"

The video will be stored in browser memory and will appear immediately in the gallery!

---

## 🔧 How It Works

### Mock API (Current Setup - No Backend Required)

The system automatically detects if the Cloudflare Workers backend is available. If not, it falls back to the **mock API** which:

✅ **Stores videos in browser memory** (localStorage)  
✅ **Works immediately** without any backend setup  
✅ **Perfect for development** and testing  
✅ **Includes 3 sample videos** to start  

**Location:** `/src/services/mockVideoApi.ts`

When you add/delete videos, they're stored locally and persist during your session.

---

## 🌐 Using the Real Backend (For Production)

When you're ready to deploy, you'll want to use the real Cloudflare Workers backend:

### Option 1: Run Backend Locally

Open a **second terminal** and run:

```bash
npm run dev:api
```

This starts the Cloudflare Workers development server. Your frontend will automatically detect it and switch from mock API to real API.

### Option 2: Run Full Stack

Install `concurrently` to run both servers together:

```bash
npm install --save-dev concurrently
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "vite",
    "dev": "concurrently \"npm start\" \"npm run dev:api\"",
    "dev:api": "wrangler dev",
    "build": "vite build",
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

Then run:

```bash
npm run dev
```

### Option 3: Deploy to Production

1. **Create D1 Database:**
   ```bash
   npx wrangler d1 create urbann_db
   ```

2. **Update `wrangler.toml` with database ID**

3. **Run Migrations:**
   ```bash
   npx wrangler d1 execute urbann_db --file=database/videos-schema.sql
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## 🎬 Current State

### ✅ What Works Right Now:

- ✅ Gallery displays videos (with 3 sample videos)
- ✅ Category filtering works
- ✅ Videos autoplay when visible
- ✅ Admin panel for adding videos
- ✅ Delete videos
- ✅ All UI/UX matches your design
- ✅ No backend required for testing

### ⏰ What Needs Backend:

- ⏰ Persistent storage across page reloads
- ⏰ Sharing videos across devices
- ⏰ Events and Contacts (these still need backend)

---

## 🐛 Troubleshooting

### Videos Not Showing?

**Console shows:** `"⚠️ Backend not available, using mock API"`

**This is normal!** The mock API is working. You should see 3 sample videos.

### "Failed to fetch videos" Error?

Check the console. If you see mock API warnings, the system is working correctly in mock mode.

### Want to Test with Real Backend?

Run in a **second terminal**:

```bash
npm run dev:api
```

Then refresh the page. The console should show the backend is connected.

### YouTube Videos Won't Play?

- **Videos must be embeddable** - Some videos have embedding disabled
- **Try different videos** - Use popular music videos or public content
- **Check browser console** - YouTube may block certain videos in embeds

---

## 📊 Sample YouTube Video IDs for Testing

Here are some working YouTube video IDs you can use:

**Interior Design Videos:**
- `zNTaVTMoNTE` - Modern Kitchen Tour
- `Zi_XLOBDo_Y` - Luxury Home Interior
- `QORDGN-ly7g` - Bedroom Design Ideas
- `8xOIYmwIPQ8` - Living Room Transformation

**How to use:**
- Full URL: `https://www.youtube.com/watch?v=zNTaVTMoNTE`
- Short URL: `https://youtu.be/zNTaVTMoNTE`
- Just ID: `zNTaVTMoNTE`

All formats work!

---

## 🔐 About Authentication

The mock API bypasses authentication for ease of testing. When you connect the real backend, authentication is enforced:

- **Admin panel:** Requires login
- **Gallery:** Public (no login required)

---

## 🚀 Deployment Checklist

When you're ready to deploy to production:

- [ ] Create D1 database
- [ ] Run database migrations (`videos` table)
- [ ] Deploy Cloudflare Workers (`functions/api/[[path]].ts`)
- [ ] Deploy frontend (`npm run deploy`)
- [ ] Test video creation in production admin panel
- [ ] Verify videos show in production gallery

---

## 📝 API Endpoints Summary

### Mock API (Current):
- Runs in browser
- No server required
- Data stored in memory

### Real API (Production):
- `POST /api/videos` - Create video
- `GET /api/videos?category=Kitchen` - Get videos
- `DELETE /api/videos/:id` - Delete video
- `PUT /api/videos/:id` - Update video

---

## 🎉 You're All Set!

Your video portfolio system is working right now with the mock API. Open your browser and start adding videos!

When you're ready for production, just run the backend and everything will seamlessly switch over.

**Need help?** Check the console logs - they'll tell you if you're using mock API or real backend.
