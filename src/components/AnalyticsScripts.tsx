'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { GA_TRACKING_ID, CLARITY_PROJECT_ID, gtag, hasConsent } from '@/lib/analytics'

export default function AnalyticsScripts() {
  useEffect(() => {
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
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        onLoad={() => console.log('📊 Google Analytics gtag.js loaded')}
      />
      <Script id="google-analytics" strategy="afterInteractive">
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
              site_search: true,
              video_engagement: true,
              file_downloads: true
            },
            // Debug mode for development
            debug_mode: ${process.env.NODE_ENV === 'development'},
            // Custom dimensions for TBS GROUP
            custom_map: {
              'dimension1': 'service_type',
              'dimension2': 'contact_method',
              'dimension3': 'user_segment'
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

      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
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

      {/* Enhanced scroll tracking */}
      <Script id="scroll-tracking" strategy="afterInteractive">
        {`
          let scrollDepths = [25, 50, 75, 90, 100];
          let scrollMarks = {};
          
          function trackScrollDepth() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            scrollDepths.forEach(depth => {
              if (scrollPercent >= depth && !scrollMarks[depth]) {
                scrollMarks[depth] = true;
                
                // Track to Google Analytics
                gtag('event', 'scroll', {
                  event_category: 'engagement',
                  event_label: depth + '%',
                  value: depth,
                  page_location: window.location.href
                });
                
                // Track to Clarity
                if (window.clarity) {
                  clarity('event', 'scroll_depth', { 
                    depth: depth,
                    page: window.location.pathname 
                  });
                }
                
                console.log('📏 Scroll tracking:', depth + '%');
              }
            });
          }
          
          let scrollTimeout;
          window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
          });
        `}
      </Script>

      {/* Enhanced link and interaction tracking */}
      <Script id="interaction-tracking" strategy="afterInteractive">
        {`
          // Track all clicks for TBS GROUP analytics
          document.addEventListener('click', function(e) {
            let target = e.target.closest('a, button, [data-track]');
            if (!target) return;
            
            const href = target.href;
            const text = target.textContent || target.innerText || '';
            const trackData = target.getAttribute('data-track');
            
            // Phone number tracking
            if (href && href.startsWith('tel:')) {
              const phone = href.replace('tel:', '');
              gtag('event', 'phone_call', {
                event_category: 'conversion',
                event_label: phone,
                page_location: window.location.href
              });
              
              if (window.clarity) {
                clarity('event', 'phone_call', { 
                  phone: phone, 
                  page: window.location.pathname 
                });
              }
              
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
              
              if (window.clarity) {
                clarity('event', 'email_click', { 
                  email: email, 
                  page: window.location.pathname 
                });
              }
              
              console.log('📧 Email click tracked:', email);
            }
            
            // External link tracking
            if (href && !href.includes(window.location.hostname) && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
              gtag('event', 'click', {
                event_category: 'external_link',
                event_label: text || href,
                external_url: href,
                page_location: window.location.href
              });
              
              if (window.clarity) {
                clarity('event', 'external_link_click', { 
                  url: href, 
                  text: text,
                  page: window.location.pathname 
                });
              }
              
              console.log('🔗 External link tracked:', href);
            }
            
            // Service button tracking
            if (target.classList.contains('service-btn') || trackData === 'service') {
              gtag('event', 'service_interaction', {
                event_category: 'services',
                event_label: text,
                page_location: window.location.href
              });
              
              console.log('🏢 Service interaction tracked:', text);
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
            
            if (window.clarity) {
              clarity('event', 'form_submit', { 
                form: formName,
                page: window.location.pathname 
              });
            }
            
            console.log('✅ Form submission tracked:', formName);
          });
          
          console.log('🎯 TBS GROUP interaction tracking initialized');
        `}
      </Script>
    </>
  )
} 