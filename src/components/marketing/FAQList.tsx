'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronDownIcon,
  LinkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

function questionId(question: string) {
  return `faq-${question
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`
}

export default function FAQList({
  items,
  relatedLabel,
}: {
  items: { q: string; a: string; href?: string }[]
  relatedLabel: string
}) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const revealQuestion = () => {
      const question = Array.from(
        root.current?.querySelectorAll('details') ?? [],
      ).find((element) => `#${element.id}` === window.location.hash)
      if (!question) return
      question.open = true
      question.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    revealQuestion()
    window.addEventListener('hashchange', revealQuestion)
    return () => window.removeEventListener('hashchange', revealQuestion)
  }, [items])

  return (
    <div className="tbs-faq" ref={root}>
      {items.map((item) => {
        const id = questionId(item.q)
        return (
          <details id={id} key={id}>
            <summary>
              <span>{item.q}</span>
              <ChevronDownIcon className="tbs-faq-chevron" aria-hidden="true" />
              <a
                className="tbs-faq-permalink"
                href={`#${id}`}
                aria-label={`Liên kết câu hỏi: ${item.q}`}
                title="Liên kết câu hỏi"
                onClick={(event) => {
                  event.stopPropagation()
                  const detail = event.currentTarget.closest('details')
                  if (detail) detail.open = true
                }}
              >
                <LinkIcon aria-hidden="true" />
              </a>
            </summary>
            <p>{item.a}</p>
            {item.href && (
              <Link className="tbs-inline-link" href={item.href}>
                {relatedLabel}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            )}
          </details>
        )
      })}
    </div>
  )
}
