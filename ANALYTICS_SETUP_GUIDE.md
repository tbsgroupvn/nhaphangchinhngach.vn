# 📊 Hướng dẫn Setup Analytics - TBS GROUP Website

## 🎯 Tổng quan

Hệ thống analytics được tích hợp bao gồm:
- ✅ **Google Analytics 4** - Thống kê chi tiết
- ✅ **Microsoft Clarity** - Heatmap & Session replay
- ✅ **Google Search Console** - SEO & Search performance
- ✅ **Cookie Consent** - GDPR compliant
- ✅ **Custom tracking** - Events & conversions

## 🔧 Environment Variables

Tạo file `.env.local` với các biến môi trường:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_ID=your_clarity_project_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://tbs-group.netlify.app
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Google Search Console
NEXT_PUBLIC_GSC_SITE_VERIFICATION=your_verification_code
```

## 🚀 Setup Google Analytics 4

### 1. Tạo GA4 Property
1. Vào [Google Analytics](https://analytics.google.com)
2. Tạo Account mới hoặc chọn account hiện có
3. Tạo Property mới:
   - **Property name**: TBS GROUP Website
   - **Country**: Vietnam
   - **Currency**: Vietnamese Dong (VND)
   - **Time zone**: (UTC+07:00) Asia/Ho_Chi_Minh

### 2. Cấu hình Data Stream
1. Chọn **Web** platform
2. **Website URL**: https://tbs-group.netlify.app
3. **Stream name**: TBS GROUP Main Website
4. Copy **Measurement ID** (dạng G-XXXXXXXXXX)

### 3. Enhanced Ecommerce Setup
```javascript
// Custom dimensions
Custom dimension 1: service_type
Custom dimension 2: contact_method
Custom dimension 3: user_segment
Custom dimension 4: content_category
Custom dimension 5: conversion_funnel
```

### 4. Goals & Conversions
- **Form Submissions** - Liên hệ, báo giá
- **Phone Calls** - Click số điện thoại
- **Email Clicks** - Click email address
- **Service Views** - Xem trang dịch vụ
- **Quote Requests** - Yêu cầu báo giá

## 🎯 Setup Microsoft Clarity

### 1. Tạo Project
1. Vào [Microsoft Clarity](https://clarity.microsoft.com)
2. Đăng nhập với Microsoft account
3. Click **New Project**:
   - **Name**: TBS GROUP Website
   - **Website**: https://tbs-group.netlify.app
   - **Category**: Business Services

### 2. Cấu hình Recording
- ✅ **Heatmaps** - Enable
- ✅ **Session recordings** - Enable
- ✅ **Mask sensitive content** - Enable
- ⚠️ **Recording limit**: 1000 sessions/day (free)

### 3. Privacy Settings
```javascript
// Auto-mask settings
- Email addresses: ✅
- Phone numbers: ✅
- Credit card numbers: ✅
- Addresses: ✅
```

## 🔍 Setup Google Search Console

### 1. Add Property
1. Vào [Google Search Console](https://search.google.com/console)
2. **Add Property** → **URL prefix**
3. URL: `https://tbs-group.netlify.app`

### 2. Verify Ownership
**Method 1: HTML file**
```bash
# Download verification file
# Upload to /public/google[code].html
```

**Method 2: Meta tag**
```html
<meta name="google-site-verification" content="your_code_here" />
```

**Method 3: DNS (Recommended)**
```
TXT record: google-site-verification=your_code_here
```

### 3. Submit Sitemap
1. Sau khi verify, vào **Sitemaps**
2. Add new sitemap: `/sitemap.xml`
3. Submit và monitor status

## 📈 Custom Event Tracking

### Service Interactions
```javascript
// Service view
trackUserBehavior.serviceView('Nhập khẩu chính ngạch', 'import')

// Quote request
trackUserBehavior.quoteRequest('import', '500000000 VND')

// Phone call
trackUserBehavior.phoneCall('0363212333', '/dich-vu')
```

### Form Tracking
```javascript
// Contact form
trackFormSubmission('contact_form', 'main_contact')

// Newsletter signup
trackUserBehavior.newsletterSignup('user@email.com', 'footer')
```

### E-commerce Tracking
```javascript
// Service purchase/inquiry
trackPurchase('INQ-2024-001', 500000, [
  {
    item_id: 'import_service',
    item_name: 'Nhập khẩu chính ngạch',
    category: 'import',
    quantity: 1,
    price: 500000
  }
])
```

## 🍪 Cookie Consent Setup

### GDPR Compliance
- ✅ **Necessary cookies** - Always enabled
- ⚠️ **Analytics cookies** - Require consent
- ⚠️ **Marketing cookies** - Require consent
- ✅ **Functional cookies** - Optional

### Implementation
```javascript
// Check consent before tracking
if (hasConsent()) {
  gtag('config', GA_TRACKING_ID);
  clarity('consent', true);
}
```

## 📊 Analytics Dashboard

### Admin Dashboard Features
- 📈 **Real-time users**
- 📊 **Page views & unique visitors**
- ⏱️ **Average session duration**
- 📱 **Device breakdown**
- 🌐 **Traffic sources**
- 📄 **Top pages**
- 🔗 **External analytics links**

### External Analytics Access
- **Google Analytics**: [analytics.google.com](https://analytics.google.com)
- **Microsoft Clarity**: [clarity.microsoft.com](https://clarity.microsoft.com)
- **Search Console**: [search.google.com/console](https://search.google.com/console)

## 📧 Weekly Reports

### Automated Email Reports
```javascript
// Setup weekly email reports
// Include:
- Page views & sessions
- Top performing content
- Conversion metrics
- Search console data
- User behavior insights
```

## 🛡️ Privacy & Security

### Data Protection
- ✅ **IP Anonymization** - Enabled
- ✅ **Data Retention** - 14 months
- ✅ **User deletion** - On request
- ✅ **GDPR compliance** - Full

### Cookie Policy
```
Necessary: Session management, security
Analytics: Traffic analysis (anonymized)
Marketing: Targeted advertising (optional)
Functional: User preferences, language
```

## 🔧 Technical Implementation

### File Structure
```
src/
├── lib/
│   └── analytics.ts          # Analytics utilities
├── components/
│   ├── AnalyticsScripts.tsx  # GA4 & Clarity scripts
│   ├── CookieConsent.tsx     # GDPR consent
│   └── admin/
│       └── AnalyticsDashboard.tsx
└── app/
    ├── sitemap.ts            # Dynamic sitemap
    ├── robots.ts             # SEO robots.txt
    └── admin/analytics/
        └── page.tsx          # Analytics admin page
```

### Performance Impact
- ⚡ **Script loading** - Async & deferred
- 📦 **Bundle size** - <50KB additional
- 🚀 **Page speed** - <100ms impact
- 💾 **Local storage** - Consent preferences only

## 📱 Mobile Optimization

### Touch Tracking
- ✅ **Tap events** - Buttons, links
- ✅ **Scroll behavior** - Depth tracking
- ✅ **Form interactions** - Field focus
- ✅ **Navigation** - Menu usage

### Responsive Analytics
- 📱 **Mobile sessions** - Separate tracking
- 💻 **Desktop behavior** - Different metrics
- 🖥️ **Tablet usage** - Unique patterns

## 🎯 Conversion Tracking

### Key Conversions
1. **Primary**: Contact form submissions
2. **Secondary**: Phone calls, email clicks
3. **Micro**: Service page views, file downloads
4. **Engagement**: Newsletter signups, social shares

### Attribution Models
- **First click** - Lead generation
- **Last click** - Direct conversions
- **Linear** - Full customer journey
- **Time decay** - Recent interactions weighted

## 📋 Testing Checklist

### Before Going Live
- [ ] GA4 tracking code installed
- [ ] Clarity script working
- [ ] Cookie consent functional
- [ ] Sitemap submitted to GSC
- [ ] Real-time tracking verified
- [ ] Event tracking tested
- [ ] Mobile tracking confirmed
- [ ] Privacy policy updated

### Post-Launch Monitoring
- [ ] Daily active users
- [ ] Conversion rates
- [ ] Page performance
- [ ] Error tracking
- [ ] User feedback
- [ ] GDPR compliance

## 🆘 Troubleshooting

### Common Issues

**GA4 not tracking**
```javascript
// Check console for errors
gtag('config', GA_TRACKING_ID, { debug_mode: true });
```

**Clarity not recording**
```javascript
// Verify Clarity ID
console.log('Clarity ID:', CLARITY_PROJECT_ID);
```

**Cookie consent not working**
```javascript
// Check localStorage
console.log(localStorage.getItem('analytics_consent'));
```

## 📞 Support

### TBS GROUP Support
- 📧 **Email**: tech@tbs-group.vn
- 📞 **Phone**: 0363 212 333
- 💬 **Chat**: Website chat support

### External Resources
- [GA4 Help Center](https://support.google.com/analytics/answer/9304153)
- [Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Search Console Help](https://support.google.com/webmasters/)

---

**📋 Checklist tổng quan:**
- [x] Google Analytics 4 setup
- [x] Microsoft Clarity integration
- [x] Cookie consent implementation
- [x] Custom event tracking
- [x] Admin analytics dashboard
- [x] SEO optimization (sitemap, robots.txt)
- [x] Privacy compliance (GDPR)
- [x] Performance optimization

**🎯 Mục tiêu:** Website có hệ thống tracking hoàn chỉnh, tuân thủ quy định bảo mật, cung cấp insights chi tiết để tối ưu hóa hiệu suất kinh doanh. 