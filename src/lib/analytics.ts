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