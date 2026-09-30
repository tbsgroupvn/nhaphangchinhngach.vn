'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  CheckBadgeIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  emptyKnowledge,
  knowledgeCategories,
  knowledgePayloadSchema,
  knowledgeStatusNames,
  type KnowledgeDocument,
  type KnowledgePayload,
} from '@/lib/studio/ai-knowledge-model'
import AiNavigation from './AiNavigation'
import { useAiDraftGuard } from './useAiDraftGuard'
const labels: Record<keyof KnowledgePayload, string> = {
  title: 'Tên tài liệu',
  category: 'Phân loại',
  sourceName: 'Đơn vị / người cung cấp',
  sourceUrl: 'URL nguồn',
  body: 'Nội dung nguồn',
  tags: 'Nhãn',
  reviewDue: 'Hạn rà soát',
}
function Snapshot({
  title,
  payload,
}: {
  title: string
  payload: KnowledgePayload | null
}) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      {payload ? (
        <dl className="studio-knowledge-snapshot">
          {Object.entries(labels).map(([field, label]) => (
            <div key={field}>
              <dt>{label}</dt>
              <dd>
                {field === 'category'
                  ? knowledgeCategories[payload.category]
                  : Array.isArray(payload[field as keyof KnowledgePayload])
                    ? payload.tags.join(', ')
                    : payload[field as keyof KnowledgePayload] || 'Chưa có'}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>Chưa có bản duyệt.</p>
      )}
    </section>
  )
}
export default function KnowledgeEditor({
  initial,
  canApprove,
}: {
  initial: KnowledgeDocument | null
  canApprove: boolean
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(initial),
    [draft, setDraft] = useState(initial?.draft || emptyKnowledge),
    [tags, setTags] = useState(initial?.draft.tags.join(', ') || '')
  const [latest, setLatest] = useState<KnowledgeDocument | null>(null),
    [tab, setTab] = useState('draft')
  const [busy, setBusy] = useState(''),
    [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const dirty =
      JSON.stringify(draft) !== JSON.stringify(saved?.draft || emptyKnowledge),
    pending = useAiDraftGuard(dirty)
  const update = (value: KnowledgeDocument) => {
    setSaved(value)
    setDraft(value.draft)
    setTags(value.draft.tags.join(', '))
    setLatest(null)
    pending.current = false
  }
  async function mutate(
    action:
      | 'save'
      | 'approve'
      | 'withdraw'
      | 'archive'
      | 'reactivate'
      | 'delete',
  ) {
    if (busy) return
    setError('')
    setMessage('')
    if (action === 'save') {
      const parsed = knowledgePayloadSchema.safeParse(draft)
      if (!parsed.success) {
        const issue = parsed.error.issues[0]
        setError(
          `${labels[issue.path[0] as keyof KnowledgePayload] || 'Nguồn'}: ${issue.message}`,
        )
        return
      }
    }
    if (
      action !== 'save' &&
      !window.confirm(
        {
          approve:
            'Duyệt bản đã lưu làm nguồn cho AI? Anh chị xác nhận đã kiểm tra nội dung và nguồn gốc tài liệu.',
          withdraw: 'Rút bản duyệt khỏi nguồn dùng cho AI?',
          archive: 'Lưu trữ nguồn và ngừng dùng cho AI?',
          reactivate:
            'Khôi phục nguồn đã lưu trữ? Bản duyệt còn hiệu lực sẽ được dùng trở lại.',
          delete: 'Xóa vĩnh viễn nguồn kiến thức này?',
        }[action],
      )
    )
      return
    setBusy(action)
    try {
      const response = await fetch(
        saved
          ? `/api/studio/ai/knowledge/${saved.id}/`
          : '/api/studio/ai/knowledge/',
        {
          method: action === 'delete' ? 'DELETE' : saved ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            saved
              ? {
                  version: saved.version,
                  ...(action === 'delete' ? {} : { action }),
                  ...(action === 'save' ? { payload: draft } : {}),
                }
              : { payload: draft },
          ),
        },
      )
      const value = await response.json()
      if (!response.ok) {
        if (value.code === 'VERSION_CONFLICT' && saved) {
          const remote = await fetch(`/api/studio/ai/knowledge/${saved.id}/`, {
            cache: 'no-store',
          })
          if (remote.ok) setLatest(await remote.json())
        }
        throw new Error(value.error || 'Không thể lưu thay đổi.')
      }
      if (action === 'delete') {
        pending.current = false
        router.push('/admin/ai/knowledge/')
        router.refresh()
        return
      }
      if (action === 'reactivate') {
        setSaved(value)
        setLatest(null)
      } else update(value)
      setMessage(
        {
          save: 'Đã lưu bản nháp. Bản đang dùng cho AI không thay đổi.',
          approve: 'Đã duyệt bản đã lưu cho AI.',
          withdraw: 'Đã rút duyệt.',
          archive: 'Đã lưu trữ nguồn.',
          reactivate: 'Đã khôi phục nguồn.',
        }[action],
      )
      if (!saved) router.replace(`/admin/ai/knowledge/${value.id}/`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy('')
    }
  }
  function resolve(remote: boolean) {
    if (!latest) return
    if (remote) update(latest)
    else {
      setSaved(latest)
      setLatest(null)
    }
    setError('')
    setMessage(
      remote
        ? 'Đã dùng bản trên máy chủ.'
        : 'Đã giữ bản của tôi. Chưa lưu thay đổi.',
    )
  }
  const actionDisabled = !!busy || dirty || !!latest
  return (
    <div className="studio-knowledge" data-studio-unsaved={dirty}>
      <AiNavigation active="knowledge" />
      <div className="studio-page-heading">
        <div>
          <h1>{saved ? 'Biên tập nguồn kiến thức' : 'Thêm nguồn kiến thức'}</h1>
          <p className="studio-muted">
            {saved
              ? `${knowledgeStatusNames[saved.status]} · Phiên bản ${saved.version}`
              : 'Bản nháp mới'}
            {saved?.approvedVersion &&
              ` · AI dùng bản duyệt ${saved.approvedVersion}`}
          </p>
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
      <div
        className="studio-ai-editor-tabs"
        role="tablist"
        aria-label="Phiên bản nguồn"
      >
        {[
          { key: 'draft', label: 'Bản nháp' },
          { key: 'compare', label: 'So sánh bản duyệt' },
        ].map((item, index) => (
          <button
            type="button"
            role="tab"
            key={item.key}
            id={`knowledge-${item.key}`}
            aria-selected={tab === item.key}
            aria-controls="knowledge-panel"
            tabIndex={tab === item.key ? 0 : -1}
            onClick={() => setTab(item.key)}
            onKeyDown={(event) => {
              if (
                ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              ) {
                event.preventDefault()
                const target =
                  event.key === 'Home'
                    ? 'draft'
                    : event.key === 'End'
                      ? 'compare'
                      : index === 0
                        ? 'compare'
                        : 'draft'
                setTab(target)
                document.getElementById(`knowledge-${target}`)?.focus()
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="knowledge-panel"
        aria-labelledby={`knowledge-${tab}`}
      >
        {tab === 'draft' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void mutate('save')
            }}
          >
            <fieldset disabled={!!busy || !!saved?.archived}>
              <div className="studio-knowledge-fields">
                <label className="studio-knowledge-wide">
                  Tên tài liệu
                  <input
                    value={draft.title}
                    maxLength={160}
                    required
                    onChange={(event) =>
                      setDraft({ ...draft, title: event.target.value })
                    }
                  />
                </label>
                <label>
                  Phân loại
                  <select
                    value={draft.category}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        category: event.target
                          .value as KnowledgePayload['category'],
                      })
                    }
                  >
                    {Object.entries(knowledgeCategories).map(([key, name]) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Đơn vị / người cung cấp
                  <input
                    value={draft.sourceName}
                    maxLength={160}
                    required
                    onChange={(event) =>
                      setDraft({ ...draft, sourceName: event.target.value })
                    }
                  />
                </label>
                <label>
                  URL nguồn
                  <input
                    type="url"
                    value={draft.sourceUrl}
                    maxLength={1000}
                    onChange={(event) =>
                      setDraft({ ...draft, sourceUrl: event.target.value })
                    }
                  />
                </label>
                <label>
                  Hạn rà soát
                  <input
                    type="date"
                    value={draft.reviewDue}
                    onChange={(event) =>
                      setDraft({ ...draft, reviewDue: event.target.value })
                    }
                  />
                </label>
                <label className="studio-knowledge-wide">
                  Nhãn
                  <input
                    value={tags}
                    maxLength={400}
                    placeholder="chứng từ, nhập khẩu"
                    onChange={(event) => {
                      setTags(event.target.value)
                      setDraft({
                        ...draft,
                        tags: event.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }}
                  />
                </label>
                <div className="studio-knowledge-wide studio-knowledge-field">
                  <label htmlFor="knowledge-body">Nội dung nguồn</label>
                  <textarea
                    id="knowledge-body"
                    value={draft.body}
                    maxLength={24000}
                    rows={16}
                    required
                    onChange={(event) =>
                      setDraft({ ...draft, body: event.target.value })
                    }
                  />
                </div>
              </div>
            </fieldset>
            <div className="studio-ai-actions">
              <button
                className="studio-button studio-primary"
                disabled={!!busy || !dirty || !!latest || !!saved?.archived}
              >
                <CheckIcon />
                {busy === 'save' ? 'Đang lưu...' : 'Lưu bản nháp'}
              </button>
              <span className="studio-muted">
                {draft.body.length.toLocaleString('vi-VN')} / 24.000 ký tự
                {dirty ? ' · Chưa lưu' : ''}
              </span>
            </div>
          </form>
        ) : (
          <div className="studio-knowledge-comparison">
            <Snapshot title="Bản nháp hiện tại" payload={draft} />
            <Snapshot
              title="Bản đang dùng cho AI"
              payload={saved?.approved || null}
            />
          </div>
        )}
      </div>
      {latest && (
        <section
          aria-label="Xung đột phiên bản"
          className="studio-task-conflict"
        >
          <h2>Bản trên máy chủ · v{latest.version}</h2>
          <div className="studio-knowledge-comparison">
            <Snapshot title="Bản của tôi" payload={draft} />
            <Snapshot title="Bản máy chủ" payload={latest.draft} />
          </div>
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
      {saved && canApprove && (
        <div className="studio-ai-actions">
          <button
            type="button"
            className="studio-button"
            disabled={actionDisabled || saved.archived}
            onClick={() => mutate('approve')}
          >
            <CheckBadgeIcon />
            Duyệt cho AI
          </button>
          {saved.approved && (
            <button
              type="button"
              className="studio-button"
              disabled={actionDisabled}
              onClick={() => mutate('withdraw')}
            >
              <XMarkIcon />
              Rút duyệt
            </button>
          )}
          <button
            type="button"
            className="studio-button"
            disabled={!!busy || !!latest || (!saved.archived && dirty)}
            onClick={() => mutate(saved.archived ? 'reactivate' : 'archive')}
          >
            {saved.archived ? <ArrowUturnLeftIcon /> : <ArchiveBoxIcon />}
            {saved.archived ? 'Khôi phục nguồn' : 'Lưu trữ nguồn'}
          </button>
          <button
            type="button"
            className="studio-icon-button"
            title="Xóa nguồn"
            aria-label="Xóa nguồn"
            disabled={actionDisabled || (!!saved.approved && !saved.archived)}
            onClick={() => mutate('delete')}
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </div>
  )
}
