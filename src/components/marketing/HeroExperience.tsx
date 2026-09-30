'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

type MotionMode = 'static' | 'reduced' | 'touch' | 'desktop'
type EntranceState = 'static' | 'playing' | 'ready' | 'reduced' | 'unavailable'

export default function HeroExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  const replay = useRef<(() => void) | null>(null)
  const [mode, setMode] = useState<MotionMode>('static')
  const [state, setState] = useState<EntranceState>('static')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const precise = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 1024px)',
    )
    const update = () =>
      setMode(
        reduced.matches ? 'reduced' : precise.matches ? 'desktop' : 'touch',
      )
    update()
    reduced.addEventListener('change', update)
    precise.addEventListener('change', update)
    return () => {
      reduced.removeEventListener('change', update)
      precise.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const hero = root.current
    if (!hero || mode === 'static') return
    if (mode === 'reduced') {
      setState('reduced')
      return
    }
    let disposed = false
    let release = () => {}

    import('gsap')
      .then(({ gsap }) => {
        if (disposed) return
        const media = hero.querySelector('.tbs-hero-media')
        const depth = hero.querySelector('.tbs-hero-depth')
        const photo = hero.querySelector('.tbs-hero-image')
        const shutters = hero.querySelector('.tbs-hero-shutters')
        let inView = hero.getBoundingClientRect().bottom > 0
        let frame = 0
        let observer: IntersectionObserver | undefined
        const context = gsap.context(() => {
          const intro = gsap.timeline({
            paused: true,
            onStart: () => {
              if (!disposed) setState('playing')
            },
            onComplete: () => {
              if (!disposed) setState('ready')
            },
            defaults: { ease: 'power3.out' },
          })
          // Only decorative layers move; contact targets never shift or wait for the intro.
          intro
            .set(shutters, { autoAlpha: 1 }, 0)
            .fromTo(
              '.tbs-hero-shutter',
              { scaleX: 1 },
              {
                scaleX: 0,
                duration: 1.05,
                stagger: 0.09,
                ease: 'power4.inOut',
              },
              0,
            )
            .fromTo(
              photo,
              { scale: 1.12 },
              { scale: 1, duration: 1.85, ease: 'power2.out' },
              0,
            )
            .fromTo(
              '.tbs-hero-word',
              { y: 34, opacity: 0.35 },
              { y: 0, opacity: 1, duration: 1.15, stagger: 0.1 },
              0.18,
            )
            .fromTo(
              '.tbs-hero-tagline',
              { y: 20, opacity: 0.65 },
              { y: 0, opacity: 1, duration: 0.95 },
              0.35,
            )
            .fromTo(
              '.tbs-hero-caption i',
              { '--route-progress': 0 },
              { '--route-progress': 1, duration: 0.8 },
              0.8,
            )
            .set(shutters, { autoAlpha: 0 }, 1.35)
          if (mode === 'touch') intro.timeScale(1.8)
          replay.current = () => {
            if (!intro.isActive()) intro.restart()
          }

          const xTo =
            mode === 'desktop'
              ? gsap.quickTo(depth, 'x', { duration: 0.65, ease: 'power3.out' })
              : null
          const yTo =
            mode === 'desktop'
              ? gsap.quickTo(depth, 'y', { duration: 0.65, ease: 'power3.out' })
              : null
          const scrollTo =
            mode === 'desktop'
              ? gsap.quickTo(media, 'y', { duration: 0.55, ease: 'power2.out' })
              : null
          const resetPointer = () => {
            xTo?.(0)
            yTo?.(0)
          }
          const move = (event: PointerEvent) => {
            if (!inView || document.hidden || event.pointerType === 'touch')
              return
            const box = hero.getBoundingClientRect()
            xTo?.(
              gsap.utils.clamp(
                -12,
                12,
                ((event.clientX - box.left - box.width / 2) / box.width) * 24,
              ),
            )
            yTo?.(
              gsap.utils.clamp(
                -8,
                8,
                ((event.clientY - box.top - box.height / 2) / box.height) * 16,
              ),
            )
          }
          const scroll = () => {
            if (frame || !inView || document.hidden || !scrollTo) return
            frame = requestAnimationFrame(() => {
              frame = 0
              scrollTo(
                gsap.utils.clamp(
                  0,
                  52,
                  -hero.getBoundingClientRect().top * 0.09,
                ),
              )
            })
          }
          const visibility = () => {
            if (document.hidden) {
              intro.progress(1).pause()
              resetPointer()
            }
          }
          if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(([entry]) => {
              inView = entry.isIntersecting
              if (!inView) {
                intro.progress(1).pause()
                resetPointer()
              } else scroll()
            })
            observer.observe(hero)
          }
          if (mode === 'desktop') {
            hero.addEventListener('pointermove', move, { passive: true })
            hero.addEventListener('pointerleave', resetPointer)
            window.addEventListener('scroll', scroll, { passive: true })
          }
          document.addEventListener('visibilitychange', visibility)
          if (inView && !document.hidden) intro.play()
          else {
            intro.progress(1).pause()
            setState('ready')
          }

          release = () => {
            replay.current = null
            observer?.disconnect()
            cancelAnimationFrame(frame)
            hero.removeEventListener('pointermove', move)
            hero.removeEventListener('pointerleave', resetPointer)
            window.removeEventListener('scroll', scroll)
            document.removeEventListener('visibilitychange', visibility)
          }
        }, hero)
        const removeListeners = release
        release = () => {
          removeListeners()
          context.revert()
        }
      })
      .catch(() => {
        release()
        if (!disposed) setState('unavailable')
      })

    return () => {
      disposed = true
      release()
    }
  }, [mode])

  return (
    <section
      ref={root}
      className="tbs-hero"
      aria-labelledby="hero-title"
      data-hero-state={state}
      data-hero-mode={mode}
    >
      {children}
      <div className="tbs-hero-shutters" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <span className="tbs-hero-shutter" key={index} />
        ))}
      </div>
      {(state === 'playing' || state === 'ready') && mode !== 'reduced' && (
        <button
          className="tbs-hero-replay"
          type="button"
          aria-label="Xem lại hiệu ứng mở đầu"
          title="Xem lại hiệu ứng mở đầu"
          aria-controls="hero-visual"
          aria-disabled={state === 'playing'}
          onClick={() => {
            if (state === 'ready') replay.current?.()
          }}
        >
          <ArrowPathIcon aria-hidden="true" />
        </button>
      )}
    </section>
  )
}
