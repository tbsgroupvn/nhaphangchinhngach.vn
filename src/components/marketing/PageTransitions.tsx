'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const normalizePath = (path: string) => path.replace(/\/$/, '') || '/'

export default function PageTransitions() {
  const [brand, setBrand] = useState('')
  const [caption, setCaption] = useState('')
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  const overlayRef = useRef<HTMLDivElement>(null)
  const controller = useRef<{ arrive: () => void } | null>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay || typeof Element.prototype.animate !== 'function') return
    const layers = Array.from(
      overlay.querySelectorAll<HTMLElement>('.tbs-transition-layer'),
    )
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)')
    let animations: Animation[] = []
    let version = 0
    let deadline: ReturnType<typeof setTimeout> | undefined
    let departure: Promise<unknown> | undefined
    let direction = 1

    const reset = () => {
      version += 1
      clearTimeout(deadline)
      animations.forEach((animation) => animation.cancel())
      animations = []
      departure = undefined
      overlay.dataset.transitionState = 'idle'
    }
    const animate = (
      element: Element,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(frames, options)
      animations.push(animation)
      return animation.finished.catch(() => undefined)
    }
    const permitted = () =>
      !reduced.matches &&
      !document.hidden &&
      !!document.querySelector('.tbs-site')

    const enterContent = () => {
      const factor = compact.matches ? 0.65 : 1
      const elements = document.querySelectorAll(
        '.tbs-page-intro .tbs-eyebrow, .tbs-page-intro h1, .tbs-page-intro .tbs-lead',
      )
      const runs = Array.from(elements).map((element, index) =>
        animate(
          element,
          [
            {
              transform: `translateY(${compact.matches ? 12 : 26}px)`,
              opacity: 0.35,
            },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          {
            duration: 580 * factor,
            delay: index * 55 * factor,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards',
          },
        ),
      )
      const media = document.querySelector('.tbs-intro-media')
      if (media)
        runs.push(
          animate(
            media,
            [
              {
                transform: `translateX(${direction * 18}px) scale(1.025)`,
                opacity: 0.7,
              },
              { transform: 'translateX(0) scale(1)', opacity: 1 },
            ],
            {
              duration: 720 * factor,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
          ),
        )
      return runs
    }

    const begin = (reverse = false) => {
      reset()
      if (!permitted()) return
      direction = reverse ? -1 : 1
      const header = document.querySelector('.tbs-header')
      overlay.style.setProperty(
        '--transition-top',
        `${Math.max(0, header?.getBoundingClientRect().bottom ?? 0)}px`,
      )
      overlay.dataset.transitionState = 'departing'
      const factor = compact.matches ? 0.65 : 1
      departure = Promise.all(
        layers.map((layer, index) =>
          animate(
            layer,
            [
              { transform: `translateX(${-102 * direction}%)` },
              { transform: 'translateX(0)' },
            ],
            {
              duration: 280 * factor,
              delay: index * 40 * factor,
              easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
              fill: 'both',
            },
          ),
        ),
      )
      // Navigation never waits for animation. A stalled route must not leave a curtain up.
      deadline = setTimeout(reset, 1200)
    }

    const arrive = async () => {
      if (!permitted()) {
        reset()
        return
      }
      if (!departure) {
        // Programmatic navigation and late responses get a light entrance, not a second wipe.
        reset()
        const ticket = version
        await Promise.all(enterContent())
        if (ticket === version) reset()
        return
      }
      const ticket = version
      await departure
      if (ticket !== version || !permitted()) return
      clearTimeout(deadline)
      overlay.dataset.transitionState = 'revealing'
      const factor = compact.matches ? 0.65 : 1
      const exits = layers.map((layer, index) =>
        animate(
          layer,
          [
            { transform: 'translateX(0)' },
            { transform: `translateX(${102 * direction}%)` },
          ],
          {
            duration: 480 * factor,
            delay: index * 35 * factor,
            easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
            fill: 'forwards',
          },
        ),
      )
      await Promise.all([...exits, ...enterContent()])
      if (ticket === version) reset()
    }

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href]')
          : null
      if (
        !anchor ||
        !anchor.closest('.tbs-site, .tbs-mobile-dialog') ||
        anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')
      )
        return
      const target = new URL(anchor.href, window.location.href)
      if (
        target.origin !== window.location.origin ||
        !['http:', 'https:'].includes(target.protocol) ||
        /^\/(admin|api)(\/|$)/.test(target.pathname)
      )
        return
      if (
        normalizePath(target.pathname) ===
        normalizePath(window.location.pathname)
      )
        return
      begin()
    }
    const onHistory = () => {
      // Hash-only history belongs to the document, not to page transitions.
      if (
        normalizePath(window.location.pathname) !==
        normalizePath(previousPath.current ?? '/')
      )
        begin(true)
    }
    const onVisibility = () => {
      if (document.hidden) reset()
    }
    controller.current = { arrive }
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onHistory)
    window.addEventListener('pagehide', reset)
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', reset)

    return () => {
      reset()
      controller.current = null
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onHistory)
      window.removeEventListener('pagehide', reset)
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', reset)
    }
  }, [])

  useEffect(() => {
    setCaption(
      document.querySelector<HTMLElement>('.tbs-site')?.dataset
        .transitionCaption || '',
    )
    setBrand(
      document.querySelector<HTMLElement>('.tbs-site')?.dataset.siteName || '',
    )
  }, [pathname])

  useEffect(() => {
    if (pathname === previousPath.current) return
    previousPath.current = pathname
    controller.current?.arrive()
  }, [pathname])

  return (
    <div
      ref={overlayRef}
      className="tbs-page-transition"
      data-transition-state="idle"
      aria-hidden="true"
    >
      <div className="tbs-transition-layer" />
      <div className="tbs-transition-layer" />
      <div className="tbs-transition-layer">
        <div className="tbs-transition-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="tbs-transition-wordmark">
          {brand}
          <span>{caption}</span>
        </span>
      </div>
    </div>
  )
}
