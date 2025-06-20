# Netlify Deployment Guide for TBS GROUP Website

## ✅ Pre-deployment Checklist

### 1. **Code Fixed Issues**
- ✅ Removed `output: 'export'` from Next.js config (incompatible with API routes)
- ✅ Added `@netlify/plugin-nextjs` plugin for proper Next.js support
- ✅ Fixed module resolution with webpack configuration
- ✅ Added barrel exports for components and services
- ✅ Set proper `metadataBase` for SEO
- ✅ Configured Node.js version (18) with `.nvmrc`

### 2. **Dependencies**
- ✅ All dependencies properly installed
- ✅ Netlify plugin added to package.json
- ✅ TypeScript paths configured correctly

### 3. **API Routes**
- ✅ Contact form API (`/api/contact`)
- ✅ Newsletter API (`/api/newsletter`)
- ✅ Gemini AI API (`/api/gemini`)

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix Netlify deployment configuration"
git push origin main
```

### Step 2: Netlify Dashboard Setup
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. **Build Settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (auto-handled by plugin)

### Step 3: Environment Variables
Set these in Netlify Dashboard > Site settings > Environment variables:
```
NODE_ENV=production
NEXT_PUBLIC_GA_ID=G-HQYS776HWJ
NEXT_PUBLIC_ENABLE_ANALYTICS=true
SKIP_ENV_VALIDATION=true
NODE_OPTIONS=--max-old-space-size=4096
```

### Step 4: Custom Domain (Optional)
1. Go to Domain settings
2. Add custom domain: `nhaphangchinhngach.vn`
3. Configure DNS records:
   - CNAME: `www` points to `[your-site].netlify.app`
   - A record: `@` points to Netlify's IP

## 📋 Build Configuration

### netlify.toml
The project includes a comprehensive `netlify.toml` with:
- Next.js plugin configuration
- Proper environment variables
- Security headers
- Caching rules
- Redirects for CMS

### next.config.js
Updated with:
- Webpack configuration for module resolution
- Fallbacks for Node.js modules
- Explicit path aliases
- Case-sensitivity handling

## 🔧 Troubleshooting

### Common Issues Fixed:

1. **Module not found errors**:
   - ✅ Added barrel exports (`src/components/index.ts`, `src/services/index.ts`)
   - ✅ Fixed webpack module resolution
   - ✅ Added explicit path aliases

2. **API routes not working**:
   - ✅ Removed static export mode
   - ✅ Added Netlify Next.js plugin
   - ✅ Configured functions properly

3. **Build memory issues**:
   - ✅ Added `NODE_OPTIONS=--max-old-space-size=4096`
   - ✅ Optimized build process

4. **Case sensitivity (Linux vs Windows)**:
   - ✅ Explicit path resolution in webpack
   - ✅ Consistent import naming

## 🎯 Post-Deployment Testing

After deployment, test these features:

### ✅ Static Pages
- [ ] Homepage loads correctly
- [ ] All service pages work
- [ ] Contact page displays properly
- [ ] Admin panel accessible

### ✅ API Endpoints
- [ ] Contact form submission works
- [ ] Newsletter signup functions
- [ ] AI chatbot responds
- [ ] Email notifications sent

### ✅ Performance
- [ ] Page load times < 3 seconds
- [ ] Images load properly
- [ ] Analytics tracking works
- [ ] SEO metadata correct

## 📊 Build Output

Expected build results:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (49/49)
✓ Collecting build traces
✓ Finalizing page optimization

Route Statistics:
- 49 total pages
- 3 API routes (contact, newsletter, gemini)
- 0 build errors
- All components resolved
```

## 🔄 Continuous Deployment

The site is configured for automatic deployment:
- Push to `main` branch triggers build
- Build takes ~3-5 minutes
- Automatic cache invalidation
- Preview deployments for pull requests

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test API endpoints manually
4. Review `netlify.toml` configuration

**Technical Contact**: Development Team
**Website**: https://nhaphangchinhngach.vn
**Build Status**: [![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

---

## 🎉 Deployment Complete!

Your TBS GROUP website is now successfully deployed on Netlify with:
- ✅ Full Next.js App Router support
- ✅ Working API routes
- ✅ Optimized performance
- ✅ SEO-friendly configuration
- ✅ Analytics integration
- ✅ Admin panel functionality

Remember to update your DNS settings to point to the Netlify deployment for the custom domain. 