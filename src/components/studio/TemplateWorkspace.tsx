'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNavigationGuard } from 'next-navigation-guard'
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import {
  templateFields,
  templateValuesSchema,
  type TemplateDocument,
} from '@/lib/studio/template-model'
import FixedPageFields from './FixedPageFields'

export default function TemplateWorkspace({
  initial,
}: {
  initial: TemplateDocument
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(initial)
  const [values, setValues] = useState(initial.values)
  const [latest, setLatest] = useState<TemplateDocument | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const changes = templateFields.filter(
    (field) => values[field.key] !== saved.values[field.key],
  )
  const dirty = changes.length > 0
  const pending = useRef(dirty)
  pending.current = dirty
  useNavigationGuard({
    enabled: () => pending.current,
    confirm: ({ to }) => {
      if (
        to.replace(/\/$/, '') === '/admin' &&
        document.querySelector('[data-studio-logging-out="true"]')
      )
        return true
      const accepted = window.confirm(
        'Nội dung mẫu chưa áp dụng. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  async function apply(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    const parsed = templateValuesSchema.safeParse(values)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      const field = templateFields.find((item) => item.key === issue.path[0])
      setError(
        `${field ? `${field.group} · ${field.label}` : 'Nội dung'}: ${issue.message}`,
      )
      return
    }
    if (
      !window.confirm(
        `Áp dụng ${changes.length} trường thay đổi lên toàn bộ website ngay?`,
      )
    )
      return
    setBusy(true)
    try {
      const response = await fetch('/api/studio/templates/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: saved.version, values: parsed.data }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.code === 'VERSION_CONFLICT') {
          const remote = await fetch('/api/studio/templates/', {
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
      setMessage('Đã áp dụng nội dung mẫu lên website.')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolve(useRemote: boolean) {
    if (!latest) return
    setSaved(latest)
    if (useRemote) {
      setValues(latest.values)
      pending.current = false
    }
    setLatest(null)
    setError('')
    setMessage(
      useRemote
        ? 'Đã dùng bản trên máy chủ.'
        : 'Đã giữ bản của anh chị. Chưa áp dụng lên website.',
    )
  }
  return (
    <div className="studio-site-settings" data-studio-unsaved={dirty}>
      <div className="studio-page-heading">
        <div>
          <h1>Nội dung mẫu dùng chung</h1>
          <p className="studio-muted">
            {templateFields.length} trường · Phiên bản {saved.version}
          </p>
        </div>
        <a
          className="studio-button"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowTopRightOnSquareIcon />
          Xem website
        </a>
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
      <form onSubmit={apply}>
        <fieldset disabled={busy}>
          <FixedPageFields
            fields={templateFields}
            values={values}
            onChange={setValues}
          />
        </fieldset>
        {latest && (
          <section
            className="studio-task-conflict"
            aria-label="Bản trên máy chủ"
          >
            <h2>Bản trên máy chủ · v{latest.version}</h2>
            <dl className="studio-site-conflicts">
              {templateFields
                .filter(
                  (field) => values[field.key] !== latest.values[field.key],
                )
                .map((field) => (
                  <div key={field.key}>
                    <dt>
                      {field.group} · {field.label}
                    </dt>
                    <dd>
                      <strong>Bản của tôi</strong>
                      <p>{values[field.key]}</p>
                    </dd>
                    <dd>
                      <strong>Máy chủ</strong>
                      <p>{latest.values[field.key]}</p>
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
        <div className="studio-site-save">
          <span className="studio-muted">
            {dirty
              ? `${changes.length} trường chưa áp dụng`
              : 'Đồng bộ với website'}
          </span>
          <button
            className="studio-button studio-primary"
            disabled={busy || !dirty || !!latest}
          >
            <CheckIcon />
            {busy ? 'Đang áp dụng...' : 'Áp dụng nội dung mẫu'}
          </button>
        </div>
      </form>
    </div>
  )
}
