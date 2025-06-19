# 🚀 TBS GROUP Website - Deploy Instructions

## 📋 Quick Deploy Steps

### Step 1: GitHub Repository
1. Create new repository on GitHub: `tbs-group-website`
2. Update remote URL with your GitHub username:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/tbs-group-website.git
git push -u origin main
```

### Step 2: Netlify Deploy
1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from GitHub"
3. Select `tbs-group-website` repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Step 3: Environment Variables
Add these in Netlify Site Settings → Environment Variables:
```
NEXT_PUBLIC_GA_ID=G-HQYS776HWJ
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SITE_URL=https://YOUR_SITE.netlify.app
NODE_ENV=production
```

### Step 4: Enable Netlify CMS
1. Site Settings → Identity → Enable Identity
2. Registration: "Invite only"
3. Services → Git Gateway → Enable
4. Invite admin users via email

## ✅ After Deploy

- **Website**: `https://YOUR_SITE.netlify.app`
- **Admin**: `https://YOUR_SITE.netlify.app/admin`
- **CMS**: `https://YOUR_SITE.netlify.app/admin/cms`
- **Analytics**: Check Google Analytics for G-HQYS776HWJ

## 🔧 Need Help?
- Email: tech@tbs-group.vn
- Phone: 0363 212 333 