'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { GA_TRACKING_ID, CLARITY_PROJECT_ID, gtag, hasConsent } from '@/lib/analytics'

export default function AnalyticsScripts() {
  useEffect(() => {
    // Defer consent setup
    const timer = setTimeout(() => {
      gtag('consent', 'default', {
        analytics_storage: hasConsent() ? 'granted' : 'denied',
        ad_storage: hasConsent() ? 'granted' : 'denied',
        wait_for_update: 500,
      })

      gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      })

      // Log analytics initialization
      console.log('🔍 TBS GROUP Analytics initialized:', {
        ga_id: GA_TRACKING_ID,
        consent: hasConsent(),
        url: window.location.href
      })
    }, 2000) // Delay 2 seconds for better initial load performance

    return () => clearTimeout(timer)
  }, [])

  // Enable analytics if we have the specific GA ID or if explicitly enabled
  const shouldLoadAnalytics = GA_TRACKING_ID === 'G-HQYS776HWJ' ||
    process.env.NODE_ENV === 'production' || 
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'

  if (!shouldLoadAnalytics) {
    console.log('🚫 Analytics disabled. GA ID:', GA_TRACKING_ID)
    return null
  }

  console.log('✅ Loading TBS GROUP Analytics with ID:', GA_TRACKING_ID)

  return (
    <>
      {/* Google Analytics 4 - Load lazily */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="lazyOnload"
        onLoad={() => console.log('📊 Google Analytics gtag.js loaded')}
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Configure Google Analytics
          gtag('config', '${GA_TRACKING_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            enhanced_measurement: {
              scrolls: true,
              outbound_clicks: true,
              site_search: false, // Disable to improve performance
              video_engagement: false, // Disable to improve performance
              file_downloads: true
            },
            // Debug mode for development
            debug_mode: ${process.env.NODE_ENV === 'development'},
            // Custom dimensions for TBS GROUP
            custom_map: {
              'dimension1': 'service_type',
              'dimension2': 'contact_method'
            }
          });

          // Track initial page view
          gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            event_category: 'engagement'
          });

          console.log('🎯 Google Analytics configured for TBS GROUP');
        `}
      </Script>

      {/* Microsoft Clarity - Load lazily */}
      <Script id="microsoft-clarity" strategy="lazyOnload">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");

          if (window.clarity) {
            clarity('consent', ${hasConsent()});
            clarity('set', 'website', 'TBS_GROUP');
            clarity('set', 'version', '2024.12');
            console.log('🎯 Microsoft Clarity configured');
          }
        `}
      </Script>

      {/* Essential tracking only - Load after user interaction */}
      <Script id="essential-tracking" strategy="lazyOnload">
        {`
          // Track essential interactions only
          document.addEventListener('click', function(e) {
            let target = e.target.closest('a[href^="tel:"], a[href^="mailto:"], button[type="submit"], .service-btn');
            if (!target) return;
            
            const href = target.href;
            const text = target.textContent || target.innerText || '';
            
            // Phone number tracking
            if (href && href.startsWith('tel:')) {
              const phone = href.replace('tel:', '');
              gtag('event', 'phone_call', {
                event_category: 'conversion',
                event_label: phone,
                page_location: window.location.href
              });
              console.log('📞 Phone call tracked:', phone);
            }
            
            // Email tracking
            if (href && href.startsWith('mailto:')) {
              const email = href.replace('mailto:', '');
              gtag('event', 'email_click', {
                event_category: 'conversion',
                event_label: email,
                page_location: window.location.href
              });
              console.log('📧 Email click tracked:', email);
            }
            
            // Contact form tracking
            if (target.type === 'submit' || target.classList.contains('contact-btn')) {
              gtag('event', 'form_interaction', {
                event_category: 'engagement',
                event_label: 'contact_form',
                page_location: window.location.href
              });
              console.log('📝 Form interaction tracked');
            }
          });
          
          // Track form submissions
          document.addEventListener('submit', function(e) {
            const form = e.target;
            const formName = form.name || form.id || 'unknown_form';
            
            gtag('event', 'form_submit', {
              event_category: 'conversion',
              event_label: formName,
              page_location: window.location.href
            });
            
            console.log('📊 Form submission tracked:', formName);
          });
        `}
      </Script>
    </>
  )
} 