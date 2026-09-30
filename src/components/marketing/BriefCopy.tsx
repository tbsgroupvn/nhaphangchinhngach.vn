'use client'

import { useRef, useState } from 'react'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'
import { trackIndustryBriefCopy } from '@/lib/analytics'

export default function BriefCopy({
  text,
  industryId,
}: {
  text: string
  industryId?: string
}) {
  const [status, setStatus] = useState<
    'idle' | 'copying' | 'success' | 'error'
  >('idle')
  const brief = useRef<HTMLPreElement>(null)

  async function copyBrief() {
    setStatus('copying')
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      if (industryId) trackIndustryBriefCopy(industryId)
      setStatus('success')
    } catch {
      setStatus('error')
      brief.current?.focus()
    }
  }

  return (
    <div className="tbs-brief">
      <pre
        ref={brief}
        className="tbs-brief-text"
        tabIndex={0}
        role="region"
        aria-label="Nội dung chuẩn bị"
      >
        {text}
      </pre>
      <button
        type="button"
        className="tbs-button tbs-button-secondary"
        onClick={copyBrief}
        disabled={status === 'copying'}
      >
        {status === 'success' ? (
          <CheckIcon width={20} height={20} aria-hidden="true" />
        ) : (
          <ClipboardDocumentIcon width={20} height={20} aria-hidden="true" />
        )}
        Sao chép nội dung chuẩn bị
      </button>
      <p role="status" aria-live="polite" className="tbs-copy-status">
        {status === 'success' && 'Đã sao chép nội dung chuẩn bị.'}
        {status === 'error' &&
          'Chưa sao chép được. Anh/chị có thể chọn và sao chép nội dung ở trên.'}
        {status === 'copying' && 'Đang sao chép...'}
      </p>
    </div>
  )
}
