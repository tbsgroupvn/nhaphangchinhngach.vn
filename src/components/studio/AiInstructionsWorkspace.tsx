'use client'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import {
  aiInstructionsSchema,
  type AiInstructions,
  type AiInstructionsDocument,
} from '@/lib/studio/ai-knowledge-model'
import AiNavigation from './AiNavigation'
import { useAiDraftGuard } from './useAiDraftGuard'
const labels: Record<keyof AiInstructions, string> = {
  audience: 'Đối tượng độc giả',
  tone: 'Giọng văn',
  terminology: 'Thuật ngữ thương hiệu',
  instructions: 'Yêu cầu biên tập',
}
export default function AiInstructionsWorkspace({
  initial,
  canWrite,
}: {
  initial: AiInstructionsDocument
  canWrite: boolean
}) {
  const [saved, setSaved] = useState(initial),
    [values, setValues] = useState(initial.values),
    [latest, setLatest] = useState<AiInstructionsDocument | null>(null)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const dirty = JSON.stringify(values) !== JSON.stringify(saved.values),
    pending = useAiDraftGuard(dirty)
  async function save(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    const parsed = aiInstructionsSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setBusy(true)
    try {
      const response = await fetch('/api/studio/ai/instructions/', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ version: saved.version, values: parsed.data }),
        }),
        result = await response.json()
      if (!response.ok) {
        if (result.code === 'VERSION_CONFLICT') {
          const remote = await fetch('/api/studio/ai/instructions/', {
            cache: 'no-store',
          })
          if (remote.ok) setLatest(await remote.json())
        }
        throw new Error(result.error)
      }
      setSaved(result)
      setValues(result.values)
      setLatest(null)
      pending.current = false
      setMessage('Đã lưu nguyên tắc viết. Nội dung website không thay đổi.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolve(remote: boolean) {
    if (!latest) return
    setSaved(latest)
    if (remote) {
      setValues(latest.values)
      pending.current = false
    }
    setLatest(null)
    setError('')
  }
  return (
    <div className="studio-knowledge" data-studio-unsaved={dirty}>
      <AiNavigation active="instructions" />
      <div className="studio-page-heading">
        <div>
          <h1>Nguyên tắc viết TBS</h1>
          <p className="studio-muted">Phiên bản {saved.version}</p>
        </div>
      </div>
      {error && (
        <p role="alert" className="studio-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="studio-success">
          {message}
        </p>
      )}
      <form onSubmit={save}>
        <fieldset disabled={busy || !canWrite}>
          <div className="studio-knowledge-fields">
            {(Object.keys(labels) as (keyof AiInstructions)[]).map((key) => (
              <div key={key} className="studio-knowledge-field">
                <label htmlFor={`ai-instructions-${key}`}>{labels[key]}</label>
                <textarea
                  id={`ai-instructions-${key}`}
                  value={values[key]}
                  rows={7}
                  maxLength={2000}
                  onChange={(event) =>
                    setValues({ ...values, [key]: event.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </fieldset>
        {latest && (
          <section
            className="studio-task-conflict"
            aria-label="Bản trên máy chủ"
          >
            <h2>Bản trên máy chủ · v{latest.version}</h2>
            <dl className="studio-site-conflicts">
              {(Object.keys(labels) as (keyof AiInstructions)[]).map((key) => (
                <div key={key}>
                  <dt>{labels[key]}</dt>
                  <dd>
                    <strong>Bản của tôi</strong>
                    <p>{values[key]}</p>
                  </dd>
                  <dd>
                    <strong>Máy chủ</strong>
                    <p>{latest.values[key]}</p>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="studio-task-conflict-actions">
              <button
                type="button"
                className="studio-button"
                onClick={() => resolve(false)}
              >
                Giữ bản của tôi
              </button>
              <button
                type="button"
                className="studio-button"
                onClick={() => resolve(true)}
              >
                Dùng bản trên máy chủ
              </button>
            </div>
          </section>
        )}
        {canWrite && (
          <div className="studio-ai-actions">
            <button
              className="studio-button studio-primary"
              disabled={busy || !dirty || !!latest}
            >
              <CheckIcon />
              {busy ? 'Đang lưu...' : 'Lưu nguyên tắc'}
            </button>
            <span className="studio-muted">
              {dirty ? 'Có thay đổi chưa lưu' : 'Đã đồng bộ'}
            </span>
          </div>
        )}
      </form>
    </div>
  )
}
