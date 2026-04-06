# The Urbann - Premium Interior Design Studio

A stunning, cinematic website showcasing your interior design portfolio with video galleries, moody photography, and refined typography.

## ✨ Features

- 🎬 **Video Portfolio Gallery** - YouTube video embeds with autoplay
- 🎨 **Category Filtering** - Kitchen, Living, Bedroom, Full Home, Bathroom, Office
- 🔐 **Admin Panel** - Easy video management
- 📱 **Fully Responsive** - Beautiful on all devices
- ⚡ **Fast Performance** - Powered by Supabase
- 🎭 **Cinematic Design** - Moody aesthetic with spacious layouts

## 🚀 Quick Start

**Get your website online in 5 minutes:**

```bash
# 1. Install dependencies
npm install

# 2. Create Supabase project at https://supabase.com
# 3. Copy your API keys to .env file
# 4. Run database migration in Supabase SQL Editor
# 5. Create admin user in Supabase Auth

# 6. Start development
npm start

# 7. Deploy
npm run build
# Deploy to Vercel, Netlify, or Cloudflare Pages
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete detailed instructions
- **[.env.example](./.env.example)** - Environment variables template
- **[database/supabase-migration.sql](./database/supabase-migration.sql)** - Database schema

## 🗂️ Project Structure

```
the-urbann/
├── pages/              # Page components
│   ├── Gallery.tsx     # Video gallery with filters
│   ├── AdminVideo.tsx  # Admin management panel
│   └── ...
├── components/         # Reusable components
├── src/
│   ├── lib/           # Supabase client
│   └── services/      # API functions
├── styles/            # CSS modules
├── database/          # SQL migrations
└── public/            # Static assets
```

## 🎬 Usage

### Public Gallery

- Visit `/gallery` to see all project videos
- Filter by category using the filter bar
- Videos autoplay when scrolled into view
- Videos pause when scrolled out of view

### Admin Panel

1. Visit `/admin`
2. Login with Supabase credentials
3. Click "Add Video"
4. Enter:
   - Category (dropdown)
   - YouTube URL
   - Optional project title
5. Video appears in gallery immediately!

### Supported YouTube URL Formats

```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
VIDEO_ID
```

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** CSS Modules, Tailwind CSS
- **Animation:** Motion (Framer Motion)
- **Backend:** Supabase (PostgreSQL)
- **Hosting:** Vercel / Netlify / Cloudflare Pages

## 🔒 Security

- Row Level Security (RLS) enabled
- Admin authentication via Supabase Auth
- Public pages accessible without login
- Environment variables for sensitive data

## 📈 Performance

- ⚡ Lighthouse Score: 95+
- 🎯 Lazy loading for videos
- 📦 Optimized bundle size
- 🌐 CDN delivery via Supabase

## 🎨 Customization

### Change Categories

Edit `pages/AdminVideo.tsx` and `pages/Gallery.tsx`:

```typescript
const categories = ['Your', 'Custom', 'Categories'];
```

### Update Styles

Edit `styles/globals.css` for design tokens and theme colors.

### Add Pages

Create new components in `pages/` directory.

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Add environment variables
3. Deploy!

### Netlify

```bash
npm run build
# Upload dist/ folder
```

### Cloudflare Pages

```bash
npm run deploy
```

## 📝 Environment Variables

Create `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Database Schema

### Tables

- **videos** - YouTube video portfolio
- **contact_submissions** - Contact form entries
- **scheduled_events** - Event bookings
- **admin_users** - Admin credentials

See `database/supabase-migration.sql` for complete schema.

## 🆘 Troubleshooting

**"Using mock API" warning?**
- Check `.env` file has correct Supabase credentials

**Login fails?**
- Create user in Supabase Auth dashboard
- Check "Auto Confirm User" when creating

**Videos not showing?**
- Run database migration in Supabase SQL Editor
- Check console for errors

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Roadmap

- [ ] Video categories management
- [ ] Bulk video upload
- [ ] Analytics dashboard
- [ ] Client testimonials section
- [ ] Blog/articles feature

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

Built with modern web technologies for optimal performance and user experience.

---

**Ready to showcase your interior design work?** Follow the [Quick Start Guide](./QUICK_START.md)!

For detailed setup instructions, see [Setup Guide](./SETUP_GUIDE.md).
