// Google Analytics 4 & Microsoft Clarity Integration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HQYS776HWJ'
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'clarity_id'

// GA4 Events
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args)
  }
}

// Page view tracking
export const pageview = (url: string) => {
  gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// Custom event tracking
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'VND',
    items: items
  })
}

// Service inquiry tracking
export const trackServiceInquiry = (serviceName: string, contactMethod: string) => {
  gtag('event', 'service_inquiry', {
    event_category: 'engagement',
    event_label: serviceName,
    custom_parameter_1: contactMethod
  })
}

// Form submission tracking
export const trackFormSubmission = (formName: string, formId: string) => {
  gtag('event', 'form_submit', {
    event_category: 'engagement',
    event_label: formName,
    form_id: formId
  })
}

// File download tracking
export const trackFileDownload = (fileName: string, fileType: string) => {
  gtag('event', 'file_download', {
    event_category: 'engagement',
    event_label: fileName,
    file_type: fileType
  })
}

// External link tracking
export const trackExternalLink = (url: string, linkText: string) => {
  gtag('event', 'click', {
    event_category: 'external_link',
    event_label: linkText,
    external_url: url
  })
}

// Search tracking
export const trackSearch = (searchTerm: string, resultCount: number) => {
  gtag('event', 'search', {
    search_term: searchTerm,
    event_category: 'engagement',
    custom_parameter_1: resultCount
  })
}

// Scroll depth tracking
export const trackScrollDepth = (percentage: number, page: string) => {
  gtag('event', 'scroll', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    page_path: page
  })
}

// Microsoft Clarity helpers
export const clarityTrack = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('event', eventName, data)
  }
}

export const clarityIdentify = (userId: string, userProperties?: any) => {
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('identify', userId, userProperties)
  }
}

// Enhanced user behavior tracking
export const trackUserBehavior = {
  // Service page interactions
  serviceView: (serviceName: string, category: string) => {
    event({
      action: 'service_view',
      category: 'services',
      label: serviceName
    })
    clarityTrack('service_view', { service: serviceName, category })
  },

  // Quote request
  quoteRequest: (serviceType: string, amount: string) => {
    event({
      action: 'quote_request',
      category: 'conversion',
      label: serviceType,
      value: parseInt(amount.replace(/\D/g, '')) || 0
    })
    clarityTrack('quote_request', { service: serviceType, amount })
  },

  // Phone call tracking
  phoneCall: (phoneNumber: string, page: string) => {
    event({
      action: 'phone_call',
      category: 'conversion',
      label: phoneNumber
    })
    clarityTrack('phone_call', { phone: phoneNumber, page })
  },

  // Email click
  emailClick: (emailAddress: string, page: string) => {
    event({
      action: 'email_click',
      category: 'conversion',
      label: emailAddress
    })
    clarityTrack('email_click', { email: emailAddress, page })
  },

  // Newsletter signup
  newsletterSignup: (email: string, source: string) => {
    event({
      action: 'newsletter_signup',
      category: 'conversion',
      label: source
    })
    clarityTrack('newsletter_signup', { source })
  },

  // Page engagement
  pageEngagement: (timeOnPage: number, page: string) => {
    event({
      action: 'page_engagement',
      category: 'engagement',
      label: page,
      value: timeOnPage
    })
    clarityTrack('page_engagement', { time: timeOnPage, page })
  }
}

// Privacy-compliant tracking
export const hasConsent = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics_consent') === 'true'
}

export const grantConsent = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics_consent', 'true')
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted'
    })
  }
}

export const revokeConsent = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics_consent', 'false')
    gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied'
    })
  }
}

// Industry Atlas: chỉ gửi nhóm độ dài, ID trong allowlist và số lượng —
// không bao giờ gửi từ khóa gốc, model, tiêu đề, nội dung clipboard hay URL query.
const industryIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const industryPlacements = ['hub', 'category', 'detail', 'no_result'] as const
export type IndustryPlacement = (typeof industryPlacements)[number]

function safeIndustryId(value: string) {
  return industryIdPattern.test(value) && value.length <= 120 ? value : ''
}
function safeCount(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(10000, Math.round(value))) : 0
}
function industryEvent(name: string, params: Record<string, string | number>) {
  if (typeof window === 'undefined' || !hasConsent()) return
  gtag('event', name, params)
}
export function queryLengthBucket(query: string) {
  const length = query.trim().length
  if (length === 0) return '0'
  if (length <= 3) return '1-3'
  if (length <= 10) return '4-10'
  if (length <= 30) return '11-30'
  return '31+'
}
export const trackIndustrySearch = (lengthBucket: string, resultCount: number) =>
  industryEvent('industry_search', {
    length_bucket: ['0', '1-3', '4-10', '11-30', '31+'].includes(lengthBucket)
      ? lengthBucket
      : '0',
    result_count: safeCount(resultCount),
  })
export const trackIndustryFilter = (filterIds: string[], resultCount: number) =>
  industryEvent('industry_filter_apply', {
    filter_ids: filterIds.map(safeIndustryId).filter(Boolean).slice(0, 20).join(','),
    result_count: safeCount(resultCount),
  })
export const trackIndustryOpen = (industryId: string, placement: IndustryPlacement) => {
  const id = safeIndustryId(industryId)
  if (!id) return
  industryEvent('industry_open', {
    industry_id: id,
    placement: industryPlacements.includes(placement) ? placement : 'hub',
  })
}
export const trackIndustryBriefCopy = (industryId: string) => {
  const id = safeIndustryId(industryId)
  if (id) industryEvent('brief_copy', { industry_id: id })
}
