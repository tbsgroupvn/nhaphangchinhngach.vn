'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowPathIcon,
  CheckIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  aiFields,
  aiTasks,
  type AiTask,
  type AiValue,
  type Generation,
} from '@/lib/studio/ai-generation-model'
import {
  aiErrorMessages,
  type AiProviderView,
} from '@/lib/studio/ai-provider-model'
import type { ContentDocument } from '@/lib/studio/content-model'

type Summary = {
  id: string
  task: AiTask
  status: string
  createdAt: string
  model: string
  appliedCount: number
}
type Applied = {
  document: ContentDocument
  revisions: { version: number; action: string; createdAt: string }[]
}
async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...init }),
    value = await response.json()
  if (!response.ok) throw new Error(value.error || 'Không thể xử lý yêu cầu.')
  return value
}
function Value({ value }: { value: AiValue }) {
  const formatted =
    typeof value === 'string'
      ? value
      : value
          .map((item) =>
            typeof item === 'string'
              ? item
              : 'heading' in item
                ? `${item.heading}\n${item.body.join('\n\n')}`
                : `${item.q}\n${item.a}`,
          )
          .join('\n\n')
  return <div className="studio-ai-prose">{formatted}</div>
}
export default function AiEditorPanel({
  document,
  canWrite,
  canAdmin,
  locked,
  initialGeneration,
  onBusy,
  onApplied,
}: {
  document: ContentDocument
  canWrite: boolean
  canAdmin: boolean
  locked: boolean
  initialGeneration?: string
  onBusy: (busy: boolean) => void
  onApplied: (value: Applied) => void
}) {
  const [provider, setProvider] = useState<AiProviderView | null>(null),
    [history, setHistory] = useState<Summary[]>([])
  const [task, setTask] = useState<AiTask>(canWrite ? 'rewrite' : 'seo'),
    [prompt, setPrompt] = useState('')
  const [targets, setTargets] = useState<string[]>(
    canWrite ? ['title', 'summary'] : ['seo.title', 'seo.description'],
  )
  const [job, setJob] = useState<Generation | null>(null),
    [selected, setSelected] = useState<string[]>([]),
    [recoveryId, setRecoveryId] = useState('')
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const active = useRef(''),
    epoch = useRef({ version: 0 })
  const fields = aiFields(document.draft).filter(
    (field) =>
      (canWrite || field.key.startsWith('seo.')) &&
      (task !== 'seo' || field.key.startsWith('seo.')),
  )
  async function refresh() {
    const version = ++epoch.current.version
    try {
      const status = await json<AiProviderView>('/api/studio/ai/provider/'),
        list = await json<{ generations: Summary[] }>(
          `/api/studio/ai/generations/?documentId=${document.id}`,
        )
      if (epoch.current.version === version) {
        setProvider(status)
        setHistory(list.generations)
      }
    } catch (caught) {
      if (epoch.current.version === version) setError((caught as Error).message)
    }
  }
  async function open(id: string) {
    active.current = id
    setSelected([])
    setError('')
    try {
      const value = await json<Generation>(`/api/studio/ai/generations/${id}/`)
      if (value.documentId !== document.id)
        throw new Error('Lượt tạo thuộc một nội dung khác.')
      if (active.current === id) {
        setJob(value)
        setRecoveryId('')
      }
    } catch (caught) {
      if (active.current === id) setError((caught as Error).message)
    }
  }
  useEffect(() => {
    const pending = epoch.current
    void refresh()
    if (initialGeneration) void open(initialGeneration)
    return () => {
      pending.version++
      active.current = ''
    }
    // A document has a stable editor instance; changing its version keeps the selected proposal visible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id])
  useEffect(() => {
    if (job?.status !== 'running') return
    const timer = setInterval(() => {
      void open(job.id)
    }, 2000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id, job?.status])
  function processing(value: boolean) {
    setBusy(value)
    onBusy(value)
  }
  async function generate(event: React.FormEvent) {
    event.preventDefault()
    if (busy || locked || !provider) return
    if (
      !window.confirm(
        'Gửi các trường bản nháp đã chọn, nguồn kiến thức được duyệt và nguyên tắc viết tới OpenAI? Lượt tạo có thể phát sinh phí API. Nội dung website chưa thay đổi.',
      )
    )
      return
    processing(true)
    setError('')
    setMessage('')
    setSelected([])
    const id = crypto.randomUUID()
    active.current = id
    setRecoveryId(id)
    setJob(null)
    try {
      const value = await json<Generation>('/api/studio/ai/generations/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          documentId: document.id,
          documentVersion: document.version,
          providerVersion: provider.version,
          task,
          fields: targets,
          prompt,
          consent: true,
        }),
      })
      if (active.current === id) {
        setJob(value)
        setRecoveryId('')
      }
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      processing(false)
      void refresh()
    }
  }
  async function apply() {
    if (!job || busy || locked || !selected.length) return
    if (
      !window.confirm(
        `Áp dụng ${selected.length} thay đổi vào bản nháp đã lưu? Website công khai không thay đổi.`,
      )
    )
      return
    processing(true)
    setError('')
    setMessage('')
    try {
      const value = await json<Applied & { generation: Generation }>(
        `/api/studio/ai/generations/${job.id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            version: job.version,
            documentVersion: document.version,
            fields: selected,
            consent: true,
          }),
        },
      )
      setJob(value.generation)
      setSelected([])
      onApplied(value)
      setMessage('Đã áp dụng vào bản nháp. Chưa xuất bản.')
    } catch (caught) {
      setError((caught as Error).message)
      try {
        const latest = await json<Generation>(
          `/api/studio/ai/generations/${job.id}/`,
        )
        setJob(latest)
        if (selected.every((field) => latest.appliedFields.includes(field))) {
          onApplied(await json<Applied>(`/api/studio/content/${document.id}/`))
          setSelected([])
          setError('')
          setMessage('Đã xác nhận thay đổi được lưu vào bản nháp.')
        }
      } catch {}
    } finally {
      processing(false)
      void refresh()
    }
  }
  async function remove() {
    if (
      !job ||
      busy ||
      locked ||
      !window.confirm(
        'Xóa lượt tạo này khỏi lịch sử? Nội dung đã áp dụng vẫn được giữ.',
      )
    )
      return
    processing(true)
    setError('')
    try {
      await json(`/api/studio/ai/generations/${job.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: job.version }),
      })
      setJob(null)
      active.current = ''
      void refresh()
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      processing(false)
    }
  }
  const ready = !!provider?.config && provider.credentialsReadable
  return (
    <section className="studio-ai-editor" aria-label="Đề xuất AI">
      <div className="studio-section-heading">
        <h2>Trợ lý biên tập</h2>
        <Link href="/admin/ai/generations/">Không gian AI</Link>
      </div>
      <p className="studio-muted">
        {!provider
          ? 'Đang kiểm tra kết nối AI...'
          : provider.config
            ? `${provider.config.model} · ${provider.budget.requests}/${provider.config.dailyRequestLimit} lượt hôm nay (UTC)`
            : 'Chưa cấu hình nhà cung cấp AI'}{' '}
        · Bản nháp v{document.version}
      </p>
      {provider && !ready && (
        <Link href="/admin/ai-assistant/">Cấu hình kết nối</Link>
      )}
      {locked && !busy && (
        <p role="status">Có thay đổi chưa lưu trong trình biên tập.</p>
      )}
      {error && (
        <p className="studio-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="studio-success" role="status">
          {message}
        </p>
      )}
      <form onSubmit={generate}>
        <fieldset disabled={!provider || busy || locked}>
          <div className="studio-ai-request-grid">
            <label>
              Tác vụ
              <select
                aria-label="Tác vụ"
                value={task}
                onChange={(event) => {
                  const next = event.target.value as AiTask
                  setTask(next)
                  if (next === 'seo')
                    setTargets(['seo.title', 'seo.description'])
                }}
              >
                {Object.entries(aiTasks)
                  .filter(
                    ([key]) =>
                      canWrite ||
                      ['seo', 'brief', 'outline', 'links'].includes(key),
                  )
                  .map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
              </select>
            </label>
            <div className="studio-knowledge-field">
              <label htmlFor="ai-generation-prompt">Yêu cầu biên tập</label>
              <textarea
                id="ai-generation-prompt"
                value={prompt}
                minLength={5}
                maxLength={2000}
                rows={4}
                required
                onChange={(event) => setPrompt(event.target.value)}
              />
            </div>
          </div>
          <details className="studio-ai-targets">
            <summary>Phạm vi nội dung · {targets.length}/12 trường</summary>
            <div className="studio-ai-field-options">
              {fields.map((field) => (
                <label key={field.key}>
                  <input
                    type="checkbox"
                    checked={targets.includes(field.key)}
                    disabled={
                      !targets.includes(field.key) && targets.length >= 12
                    }
                    onChange={(event) =>
                      setTargets(
                        event.target.checked
                          ? [...targets, field.key]
                          : targets.filter((key) => key !== field.key),
                      )
                    }
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
          </details>
          <button
            className="studio-button studio-primary"
            disabled={!ready || !targets.length || busy || locked}
          >
            <SparklesIcon />
            {busy ? 'Đang xử lý...' : 'Tạo đề xuất'}
          </button>
        </fieldset>
      </form>
      {recoveryId && (
        <button
          type="button"
          className="studio-button"
          disabled={busy}
          onClick={() => open(recoveryId)}
        >
          <ArrowPathIcon />
          Kiểm tra kết quả yêu cầu
        </button>
      )}
      {job && (
        <section className="studio-ai-result" aria-label="Kết quả đề xuất">
          <div className="studio-section-heading">
            <h2>{aiTasks[job.task]}</h2>
            {canAdmin && (
              <button
                className="studio-icon-button"
                type="button"
                aria-label="Xóa lượt tạo"
                title="Xóa lượt tạo"
                disabled={busy || job.status === 'running'}
                onClick={remove}
              >
                <TrashIcon />
              </button>
            )}
          </div>
          <p className="studio-muted">
            {job.model} · {new Date(job.createdAt).toLocaleString('vi-VN')} ·
            Bản nguồn v{job.documentVersion} ·{' '}
            {job.usage
              ? `${job.usage.totalTokens.toLocaleString('vi-VN')} token`
              : 'Chưa có số token xác nhận'}
          </p>
          {job.restored && (
            <p role="status">Lịch sử được khôi phục; chưa thể áp dụng lại.</p>
          )}
          {job.status === 'running' && (
            <p role="status">Đang chờ phản hồi của nhà cung cấp...</p>
          )}
          {job.status === 'failed' && (
            <p className="studio-error" role="alert">
              {aiErrorMessages[job.errorCode || ''] ||
                'Lượt tạo chưa hoàn tất.'}
            </p>
          )}
          {job.result && (
            <>
              <p>{job.result.summary}</p>
              <ul className="studio-ai-notes">
                {job.result.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
              {!!job.result.outline.length && (
                <ol>
                  {job.result.outline.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              )}
              {job.result.changes.map((change) => {
                const field = job.context.fields.find(
                    (item) => item.key === change.field,
                  )!,
                  applied = job.appliedFields.includes(change.field)
                return (
                  <article className="studio-ai-change" key={change.field}>
                    <label className="studio-ai-change-choice">
                      <input
                        type="checkbox"
                        checked={selected.includes(change.field)}
                        disabled={
                          busy ||
                          locked ||
                          applied ||
                          job.restored ||
                          (!canWrite && !change.field.startsWith('seo.'))
                        }
                        onChange={(event) =>
                          setSelected(
                            event.target.checked
                              ? [...selected, change.field]
                              : selected.filter((key) => key !== change.field),
                          )
                        }
                      />
                      <strong>{field.label}</strong>
                      {applied && (
                        <span className="studio-badge">Đã áp dụng</span>
                      )}
                    </label>
                    <p className="studio-muted">{change.reason}</p>
                    <div className="studio-ai-diff">
                      <div>
                        <h3>Bản nguồn</h3>
                        <Value value={field.value} />
                      </div>
                      <div>
                        <h3>Đề xuất</h3>
                        <Value value={change.value} />
                      </div>
                    </div>
                    <p className="studio-muted">
                      Căn cứ:{' '}
                      {change.sourceIds.length
                        ? change.sourceIds
                            .map(
                              (id) =>
                                job.context.knowledge.sources.find(
                                  (source) => source.id === id,
                                )?.title,
                            )
                            .join('; ')
                        : 'Chưa có trích dẫn nguồn cho mục này'}
                    </p>
                  </article>
                )
              })}
              {!!job.result.changes.length && (
                <button
                  className="studio-button studio-primary"
                  type="button"
                  disabled={busy || locked || !selected.length || job.restored}
                  onClick={apply}
                >
                  <CheckIcon />
                  Áp dụng mục đã chọn
                </button>
              )}
              {!!job.result.links.length && (
                <section aria-label="Liên kết đề xuất">
                  <h3>Liên kết nội bộ</h3>
                  {job.result.links.map((link, index) => (
                    <div key={index}>
                      <Link href={`/admin/content/${link.targetId}/`}>
                        {link.anchor}
                      </Link>
                      <p>
                        {
                          job.context.links.find(
                            (item) => item.id === link.targetId,
                          )?.path
                        }
                      </p>
                      <p>{link.reason}</p>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
          <details className="studio-ai-sources">
            <summary>
              Căn cứ đã gửi · {job.context.knowledge.sources.length} nguồn ·
              Nguyên tắc v{job.context.knowledge.policy.version}
            </summary>
            {!job.context.knowledge.sources.length && (
              <p>Không có nguồn đã duyệt phù hợp trong lượt tạo này.</p>
            )}
            {job.context.knowledge.sources.map((source) => (
              <article key={source.id}>
                <h3>{source.title}</h3>
                <p>
                  {source.sourceName} · Bản duyệt {source.version}
                </p>
                {source.sourceUrl && (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.sourceUrl}
                  </a>
                )}
                <p className="studio-ai-prose">{source.excerpt}</p>
                <small>{source.digest}</small>
              </article>
            ))}
            <p className="studio-ai-prose">
              {Object.values(job.context.knowledge.policy.values).join('\n\n')}
            </p>
          </details>
        </section>
      )}
      <section className="studio-ai-history" aria-label="Lịch sử AI">
        <div className="studio-section-heading">
          <h2>Lịch sử của nội dung</h2>
          <button
            className="studio-icon-button"
            type="button"
            title="Tải lại lịch sử AI"
            aria-label="Tải lại lịch sử AI"
            disabled={busy}
            onClick={refresh}
          >
            <ArrowPathIcon />
          </button>
        </div>
        {!history.length ? (
          <p>Chưa có lượt tạo.</p>
        ) : (
          <div className="studio-table-wrap">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Tác vụ</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        className="studio-text-button"
                        type="button"
                        disabled={busy}
                        onClick={() => open(item.id)}
                      >
                        {aiTasks[item.task]}
                      </button>
                    </td>
                    <td>
                      {item.status === 'completed'
                        ? `Hoàn tất · ${item.appliedCount} mục đã áp dụng`
                        : item.status === 'running'
                          ? 'Đang tạo'
                          : 'Chưa hoàn tất'}
                    </td>
                    <td>{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
