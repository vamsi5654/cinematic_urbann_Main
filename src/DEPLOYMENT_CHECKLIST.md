# ✅ Deployment Checklist - Get Your Website Online

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Deployment

### Local Setup

- [ ] Run `npm install` (installs Supabase package)
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy Supabase URL and anon key
- [ ] Create `.env` file with credentials
- [ ] Run database migration in Supabase SQL Editor
- [ ] Create admin user in Supabase Auth
- [ ] Test locally with `npm start`
- [ ] Login to `/admin` works
- [ ] Add a test video successfully
- [ ] Video appears in `/gallery`
- [ ] Category filters work

## 🗄️ Supabase Setup

### Database

- [ ] Created Supabase project
- [ ] Ran `/database/supabase-migration.sql` in SQL Editor
- [ ] Verified tables exist (videos, contact_submissions, scheduled_events)
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Sample videos inserted (should see 3 videos)

### Authentication

- [ ] Created admin user in **Authentication → Users**
- [ ] Checked "Auto Confirm User" when creating
- [ ] Saved email and password
- [ ] Tested login on local site

### API Keys

- [ ] Copied Project URL from Settings → API
- [ ] Copied anon/public key from Settings → API
- [ ] Added both to `.env` file
- [ ] **NEVER** committed `.env` to Git (check `.gitignore`)

## 🚀 Deployment

### Build

- [ ] Run `npm run build`
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] `dist/` folder created

### Hosting Platform

Choose one:

#### Vercel (Recommended)
- [ ] Connected GitHub repository
- [ ] Added environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Deployed successfully
- [ ] Custom domain configured (optional)

#### Netlify
- [ ] Uploaded `dist/` folder OR connected GitHub
- [ ] Added environment variables in Site Settings
- [ ] Deployed successfully

#### Cloudflare Pages
- [ ] Run `npm run deploy`
- [ ] Added environment variables in dashboard
- [ ] Deployed successfully

## 🧪 Post-Deployment Testing

### Public Pages (No Login)

- [ ] Home page loads
- [ ] Gallery page shows videos
- [ ] Videos autoplay when scrolled into view
- [ ] Category filter works
- [ ] All 3 sample videos visible
- [ ] Videos play smoothly
- [ ] Responsive on mobile
- [ ] Contact form works
- [ ] Services page loads
- [ ] About page loads

### Admin Panel (Login Required)

- [ ] Can access `/admin` page
- [ ] Login with Supabase credentials works
- [ ] Dashboard loads
- [ ] Can add new video:
  - [ ] Select category
  - [ ] Enter YouTube URL
  - [ ] Add optional title
  - [ ] Preview shows
  - [ ] Click "Add Video" succeeds
- [ ] New video appears in admin list
- [ ] New video appears in gallery immediately
- [ ] Can delete video
- [ ] Logout works

### Performance

- [ ] Page loads in < 3 seconds
- [ ] Videos start playing quickly
- [ ] No console errors
- [ ] No 404 errors
- [ ] Images load properly
- [ ] Animations smooth

### Mobile Testing

- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Navigation works
- [ ] Videos play on mobile
- [ ] Touch interactions work
- [ ] Forms work on mobile

## 🔒 Security

- [ ] `.env` file in `.gitignore`
- [ ] Not exposing sensitive keys in code
- [ ] RLS policies enabled in Supabase
- [ ] Admin login requires authentication
- [ ] Public pages accessible without login

## 📊 Analytics (Optional)

- [ ] Google Analytics added (optional)
- [ ] Vercel Analytics enabled (if using Vercel)
- [ ] Error tracking setup (Sentry, etc.)

## 🎨 Content

- [ ] Replace sample videos with real projects
- [ ] Add 10-20 portfolio videos
- [ ] Update About page with your story
- [ ] Add contact information
- [ ] Update service descriptions
- [ ] Add client testimonials (if available)

## 📱 SEO & Metadata

- [ ] Page titles are descriptive
- [ ] Meta descriptions added
- [ ] Open Graph images set
- [ ] Favicon present
- [ ] Sitemap generated
- [ ] robots.txt configured

## 🌐 Domain (Optional)

- [ ] Custom domain purchased
- [ ] DNS configured
- [ ] HTTPS/SSL certificate active
- [ ] www redirect works
- [ ] Domain propagated

## 📞 Final Checks

### Functionality

- [ ] All navigation links work
- [ ] All buttons work
- [ ] Forms submit successfully
- [ ] No broken links
- [ ] No broken images
- [ ] Videos all play

### Design

- [ ] Colors match brand
- [ ] Typography consistent
- [ ] Spacing looks good
- [ ] Responsive breakpoints work
- [ ] Animations smooth
- [ ] Loading states present

### Content

- [ ] No placeholder text
- [ ] No "Lorem ipsum"
- [ ] Contact email correct
- [ ] Phone number correct
- [ ] Address correct (if shown)
- [ ] Social media links work

## 🎉 Launch!

Once all boxes are checked:

- [ ] Share URL with team
- [ ] Announce on social media
- [ ] Add to portfolio
- [ ] Update business cards
- [ ] Add to email signature
- [ ] Submit to Google Search Console
- [ ] Monitor analytics

## 📝 Post-Launch

### Week 1
- [ ] Monitor for errors
- [ ] Check analytics
- [ ] Gather feedback
- [ ] Add more videos

### Month 1
- [ ] Review performance
- [ ] Optimize images/videos
- [ ] Update content
- [ ] Check SEO rankings

### Ongoing
- [ ] Regular video updates
- [ ] Backup database
- [ ] Monitor Supabase usage
- [ ] Update contact submissions
- [ ] Review scheduled events

## 🆘 Troubleshooting

If something doesn't work:

1. Check browser console (F12 → Console)
2. Check Supabase logs (Dashboard → Logs)
3. Verify environment variables
4. Test locally first
5. Check this checklist again

## 📚 Resources

- **Quick Setup:** `/QUICK_START.md`
- **Detailed Guide:** `/SETUP_GUIDE.md`
- **What Changed:** `/WHAT_CHANGED.md`
- **Project Info:** `/README.md`

---

## ✅ Ready to Launch?

If all boxes are checked above, your website is ready! 🚀

**Your beautiful interior design portfolio is now live for the world to see!**

Share your URL and start getting clients! 💼
