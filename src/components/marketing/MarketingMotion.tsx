'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function MarketingMotion() {
  const pathname = usePathname()
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    let disposed = false
    let observer: IntersectionObserver | undefined
    let revert: (() => void) | undefined
    import('gsap').then(({ gsap }) => {
      if (disposed || media.matches) return
      const context = gsap.context(() => {
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries)
              if (entry.isIntersecting) {
                gsap.fromTo(
                  entry.target,
                  { y: 24, opacity: 0.65 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: 'power2.out',
                    clearProps: 'all',
                  },
                )
                observer?.unobserve(entry.target)
              }
          },
          { threshold: 0.08 },
        )
        document
          .querySelectorAll('[data-reveal]')
          .forEach((element) => observer?.observe(element))
      })
      revert = () => context.revert()
    })
    const stop = () => {
      observer?.disconnect()
      revert?.()
    }
    media.addEventListener('change', stop)
    return () => {
      disposed = true
      stop()
      media.removeEventListener('change', stop)
    }
  }, [pathname])
  return null
}
