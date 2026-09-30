'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  Component,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  ArchiveBoxArrowDownIcon,
  ArrowRightIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  PauseIcon,
  PlayIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import './journey.css'
import type { TemplateCopy } from '@/lib/studio/template-model'

const JourneyScene = dynamic(() => import('./JourneyScene'), {
  ssr: false,
  loading: () => null,
})

const stageIcons = [
  ArchiveBoxArrowDownIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  TruckIcon,
]

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Journey({ copy }: { copy: TemplateCopy['journey'] }) {
  const stages = copy.stages
  const [stage, setStage] = useState(0)
  const [nearViewport, setNearViewport] = useState(false)
  const [inViewport, setInViewport] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const sceneRef = useRef<HTMLDivElement>(null)
  const selected = stages[stage]
  const motionLabel = paused ? 'Tiếp tục chuyển động' : 'Tạm dừng chuyển động'
  const MotionIcon = paused ? PlayIcon : PauseIcon
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(media.matches)
    const updateVisibility = () =>
      setPageVisible(document.visibilityState !== 'hidden')
    updateMotion()
    updateVisibility()
    media.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      media.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  useEffect(() => {
    const element = sceneRef.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true)
      setInViewport(true)
      return
    }
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          preload.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    const visibility = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0 },
    )
    preload.observe(element)
    visibility.observe(element)
    return () => {
      preload.disconnect()
      visibility.disconnect()
    }
  }, [])

  return (
    <section
      id="hanh-trinh"
      className="tbs-journey"
      aria-labelledby="journey-heading"
    >
      <div className="journey-inner">
        <header className="journey-header">
          <div>
            <p className="journey-eyebrow">{copy.eyebrow}</p>
            <h2 id="journey-heading">
              {copy.title} <span>{copy.accent}</span>
            </h2>
          </div>
          <p className="journey-intro">
            {copy.intro.split('\n').map((line, index) => (
              <Fragment key={index}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </header>

        <div
          id="journey-visual"
          ref={sceneRef}
          className="journey-visual"
          data-testid="journey-canvas"
          data-stage={stage}
        >
          <div className="journey-scene-note" aria-hidden="true">
            <span className="journey-note-line" />
            <span>{copy.origin}</span>
            <ArrowRightIcon />
            <span>{copy.destination}</span>
          </div>
          {!failed && (
            <button
              type="button"
              className="journey-motion-toggle"
              aria-label={motionLabel}
              title={motionLabel}
              aria-controls="journey-visual"
              onClick={() => setPaused((value) => !value)}
            >
              <MotionIcon aria-hidden="true" />
            </button>
          )}
          <div
            className={`journey-preview${ready && !failed ? ' journey-preview-hidden' : ''}`}
            data-testid="journey-fallback"
            aria-hidden={ready && !failed}
          >
            <Image
              src={copy.image}
              alt={copy.imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, 1240px"
              className="journey-preview-image"
            />
            <div className="journey-preview-caption">
              <span className="journey-preview-number">0{stage + 1}</span>
              <div>
                <span className="journey-preview-label">
                  {selected.location}
                </span>
                <strong>{selected.title}</strong>
              </div>
            </div>
          </div>
          {nearViewport && !failed && (
            <SceneBoundary onError={onError}>
              <JourneyScene
                stage={stage}
                active={inViewport && pageVisible}
                reducedMotion={reducedMotion}
                paused={paused}
                onReady={onReady}
                onError={onError}
              />
            </SceneBoundary>
          )}
          <span className="journey-illustration-label">
            {copy.illustration}
          </span>
        </div>

        <div
          className="journey-stages"
          role="group"
          aria-label="Các chặng nhập hàng"
        >
          {stages.map((item, index) => {
            const Icon = stageIcons[index]
            return (
              <button
                key={item.name}
                type="button"
                className="journey-stage"
                aria-label={item.name}
                aria-pressed={stage === index}
                aria-controls="journey-detail"
                onClick={() => setStage(index)}
              >
                <span className="journey-stage-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <Icon className="journey-stage-icon" aria-hidden="true" />
                <span className="journey-stage-copy">
                  <strong>{item.name}</strong>
                  <span>{item.location}</span>
                </span>
                <ArrowRightIcon
                  className="journey-stage-arrow"
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>

        <div
          id="journey-detail"
          className="journey-detail"
          data-journey-detail
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="journey-detail-heading">
            <span className="journey-detail-number" aria-hidden="true">
              0{stage + 1}
            </span>
            <h3>{selected.title}</h3>
          </div>
          <p>{selected.description}</p>
          <ul className="journey-checks">
            {selected.checks.map((check) => (
              <li key={check}>
                <CheckIcon aria-hidden="true" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
