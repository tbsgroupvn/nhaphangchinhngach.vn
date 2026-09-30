'use client'

import { useId, useRef, useState } from 'react'
import { useNavigationGuard } from 'next-navigation-guard'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import {
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  DocumentCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import {
  type ContentDocument,
  type ContentPayload,
} from '@/lib/studio/content-model'
import { contentKindLabels } from '@/lib/studio/content-labels'
import type { FixedField } from '@/lib/studio/fixed-page-registry'
import FixedPageFields from './FixedPageFields'
import MediaField from './MediaField'
import { searchTitle } from '@/lib/studio/seo-model'
import type { IndustryTrait } from '@/lib/studio/industry-taxonomy-model'
import IndustryFields from './IndustryFields'

type Revision = { version: number; action: string; createdAt: string }
const emptyArticle: ContentPayload = {
  kind: 'article',
  data: {
    title: '',
    slug: '',
    summary: '',
    image: '/images/marketing/containers.webp',
    category: 'Kiến thức nhập hàng',
    categorySlug: 'kien-thuc',
    sections: [{ heading: '', body: [''] }],
  },
  seo: {
    title: '',
    description: '',
    canonical: '',
    image: '/images/marketing/containers.webp',
    noindex: false,
  },
}
const AiEditorPanel = dynamic(() => import('./AiEditorPanel'))
const labels = { content: 'Nội dung', seo: 'SEO', ai: 'AI', history: 'Lịch sử' }
type Tab = keyof typeof labels

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  const id = useId()
  return (
    <label className="studio-editor-field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}
function TextList({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
}) {
  return (
    <div className="studio-edit-list">
      <h3>{label}</h3>
      {values.map((value, index) => (
        <div key={index} className="studio-list-row">
          <Field
            label={`${label} ${index + 1}`}
            value={value}
            multiline
            onChange={(text) =>
              onChange(values.map((item, i) => (i === index ? text : item)))
            }
          />
          <button
            type="button"
            className="studio-icon-button"
            title={`Xóa ${label.toLowerCase()} ${index + 1}`}
            aria-label={`Xóa ${label.toLowerCase()} ${index + 1}`}
            disabled={values.length <= 1}
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="studio-button studio-button-secondary"
        disabled={values.length >= 100}
        onClick={() => onChange([...values, ''])}
      >
        <PlusIcon />
        Thêm mục
      </button>
    </div>
  )
}

export default function ContentEditor({
  brandName,
  initial,
  initialRevisions = [],
  fixedFields = [],
  routeLocked = false,
  initialTab,
  canWrite,
  canWriteSeo,
  canPublish,
  canUseAi = false,
  initialGeneration,
  industryCategories = [],
  industryOptions = [],
  industryTraits = [],
}: {
  brandName: string
  initial?: ContentDocument
  initialRevisions?: Revision[]
  fixedFields?: Omit<FixedField, 'value'>[]
  routeLocked?: boolean
  initialTab?: Tab
  canWrite: boolean
  canWriteSeo: boolean
  canPublish: boolean
  canUseAi?: boolean
  initialGeneration?: string
  industryCategories?: { slug: string; title: string }[]
  industryOptions?: { slug: string; title: string }[]
  industryTraits?: IndustryTrait[]
}) {
  const router = useRouter()
  const [documentState, setDocument] = useState(initial)
  const [draft, setDraft] = useState<ContentPayload>(
    initial?.draft ?? emptyArticle,
  )
  const [saved, setSaved] = useState(
    JSON.stringify(initial?.draft ?? emptyArticle),
  )
  const [revisions, setRevisions] = useState(initialRevisions)
  const [tab, setTab] = useState<Tab>(
    initialTab || (!canWrite && canWriteSeo ? 'seo' : 'content'),
  )
  const [aiVisited, setAiVisited] = useState(initialTab === 'ai')
  function selectTab(next: Tab) {
    if (next === 'ai') setAiVisited(true)
    setTab(next)
  }
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const dirty = JSON.stringify(draft) !== saved
  const pendingChanges = useRef(dirty)
  pendingChanges.current = dirty
  useNavigationGuard({
    enabled: () => pendingChanges.current,
    confirm: ({ to }) => {
      // Logout confirms before revoking the session, not after the request succeeds.
      if (
        to.replace(/\/$/, '') === '/admin' &&
        document.querySelector('[data-studio-logging-out="true"]')
      )
        return true
      const accepted = window.confirm(
        'Nội dung chưa được lưu. Rời trang và bỏ các thay đổi?',
      )
      if (accepted) pendingChanges.current = false
      return accepted
    },
  })
  function updateData(patch: Record<string, unknown>) {
    setDraft(
      (current) =>
        ({ ...current, data: { ...current.data, ...patch } }) as ContentPayload,
    )
    setMessage('')
  }
  function updateSeo(
    key: keyof ContentPayload['seo'],
    value: string | boolean,
  ) {
    setDraft((current) => ({
      ...current,
      seo: { ...current.seo, [key]: value },
    }))
    setMessage('')
  }
  async function mutate(
    action:
      | 'save'
      | 'publish'
      | 'unpublish'
      | 'archive'
      | 'reactivate'
      | 'restore',
    revision?: number,
  ) {
    if (busy) return
    if (action !== 'save' && dirty) {
      setError('Lưu bản nháp trước khi thực hiện thao tác này.')
      return
    }
    if (
      action !== 'save' &&
      !window.confirm(
        action === 'publish'
          ? `Xuất bản “${draft.data.title}” lên website?`
          : action === 'unpublish'
            ? 'Gỡ nội dung khỏi website? Bản nháp vẫn được giữ.'
            : action === 'archive'
              ? 'Lưu trữ nội dung này? Nội dung sẽ được gỡ khỏi website.'
              : action === 'reactivate'
                ? 'Khôi phục nội dung này về trạng thái bản nháp?'
            : `Khôi phục phiên bản ${revision} thành bản nháp mới?`,
      )
    )
      return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const payload =
        !documentState && action === 'save'
          ? {
              ...draft,
              seo: {
                ...draft.seo,
                title: draft.seo.title || draft.data.title,
                description: draft.seo.description || draft.data.summary,
              },
            }
          : draft
      const response = await fetch(
        documentState
          ? `/api/studio/content/${documentState.id}/`
          : '/api/studio/content/',
        {
          method: documentState ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            documentState
              ? {
                  action: action === 'save' && !canWrite ? 'save-seo' : action,
                  version: documentState.version,
                  ...(action === 'save'
                    ? canWrite
                      ? { payload }
                      : { seo: payload.seo }
                    : {}),
                  ...(action === 'restore' ? { revision } : {}),
                }
              : payload,
          ),
        },
      )
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.error || 'Chưa thể lưu nội dung.')
      setDocument(result.document)
      setDraft(result.document.draft)
      setSaved(JSON.stringify(result.document.draft))
      pendingChanges.current = false
      setRevisions(result.revisions || [])
      setMessage(
        {
          save: 'Đã lưu bản nháp.',
          publish: 'Đã xuất bản lên website.',
          unpublish: 'Đã gỡ khỏi website.',
          archive: 'Đã lưu trữ nội dung.',
          reactivate: 'Đã khôi phục về bản nháp.',
          restore: 'Đã khôi phục thành bản nháp mới.',
        }[action],
      )
      if (!documentState)
        router.replace(`/admin/content/${result.document.id}/`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <Link
        href={
          draft.kind === 'industry' || draft.kind === 'industryCategory'
            ? '/admin/industries/'
            : '/admin/content/'
        }
        className="studio-back-link"
      >
        <ArrowLeftIcon />
        {draft.kind === 'industry' || draft.kind === 'industryCategory'
          ? 'Industry Atlas'
          : 'Nội dung website'}
      </Link>
      <div className="studio-page-heading studio-editor-heading">
        <div>
          <p className="studio-kicker">
            {contentKindLabels[draft.kind]}{' '}
            {documentState ? `/ v${documentState.version}` : '/ MỚI'}
          </p>
          <h1>
            {documentState
              ? 'Biên tập nội dung'
              : draft.kind === 'industry'
                ? 'Ngành hàng mới'
                : draft.kind === 'industryCategory'
                  ? 'Nhóm ngành mới'
                  : 'Bài viết mới'}
          </h1>
          <p>{documentState?.path || '/kien-thuc/...'}</p>
        </div>
        <span className="studio-badge studio-badge-off">
          {dirty
            ? 'Chưa lưu'
            : documentState?.published
              ? 'Có bản xuất bản'
              : 'Bản nháp'}
        </span>
      </div>
      <div className="studio-editor-toolbar" data-studio-unsaved={dirty}>
        <div role="tablist" aria-label="Biên tập">
          {(Object.keys(labels) as Tab[])
            .filter((key) => key !== 'ai' || (canUseAi && !!documentState))
            .map((key, index, all) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`editor-tab-${key}`}
                aria-controls={`editor-panel-${key}`}
                aria-selected={tab === key}
                tabIndex={tab === key ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault()
                    const next =
                      all[
                        (index +
                          (event.key === 'ArrowRight' ? 1 : -1) +
                          all.length) %
                          all.length
                      ]
                    selectTab(next)
                    document.getElementById(`editor-tab-${next}`)?.focus()
                  }
                }}
                onClick={() => selectTab(key)}
              >
                {labels[key]}
              </button>
            ))}
        </div>
        <div className="studio-editor-actions">
          {documentState && (
            <Link
              className="studio-icon-button"
              href={`/admin/content/${documentState.id}/preview/`}
              target="_blank"
              title="Xem bản nháp đã lưu"
              aria-label="Xem bản nháp đã lưu"
            >
              <EyeIcon />
            </Link>
          )}
          {(canWrite || canWriteSeo) && (
            <button
              className="studio-button studio-button-secondary"
              disabled={busy || (!dirty && !!documentState)}
              onClick={() => mutate('save')}
            >
              <DocumentCheckIcon />
              Lưu bản nháp
            </button>
          )}
          {canPublish && documentState && (
            documentState.archivedAt ? (
              <button
                className="studio-button studio-button-secondary"
                disabled={busy || dirty}
                onClick={() => mutate('reactivate')}
              >
                <ArrowUturnLeftIcon />
                Khôi phục
              </button>
            ) : (
              <button
                className="studio-button studio-primary"
                disabled={busy || dirty}
                onClick={() => mutate('publish')}
              >
                <ArrowUpTrayIcon />
                Xuất bản
              </button>
            )
          )}
        </div>
      </div>
      {error && (
        <div className="studio-error" role="alert">
          {error}
          <button
            type="button"
            className="studio-button studio-button-secondary"
            onClick={() => {
              if (
                !dirty ||
                window.confirm('Tải lại và bỏ các thay đổi chưa lưu?')
              )
                location.reload()
            }}
          >
            Tải lại dữ liệu
          </button>
        </div>
      )}
      <p role="status" className="studio-save-status" aria-live="polite">
        {busy ? 'Đang xử lý...' : message}
      </p>
      <div
        role="tabpanel"
        id={`editor-panel-${tab}`}
        aria-labelledby={`editor-tab-${tab}`}
      >
        {aiVisited && documentState && canUseAi && (
          <div hidden={tab !== 'ai'}>
            <AiEditorPanel
              document={documentState}
              canWrite={canWrite}
              canAdmin={canPublish}
              locked={dirty || busy}
              initialGeneration={initialGeneration}
              onBusy={setBusy}
              onApplied={(value) => {
                setDocument(value.document)
                setDraft(value.document.draft)
                setSaved(JSON.stringify(value.document.draft))
                pendingChanges.current = false
                setRevisions(value.revisions)
                setMessage('Đã áp dụng đề xuất vào bản nháp. Chưa xuất bản.')
              }}
            />
          </div>
        )}
        {tab === 'content' && (
          <fieldset className="studio-editor-body" disabled={!canWrite || busy}>
            <div className="studio-editor-fields">
              <Field
                label="Tiêu đề"
                value={draft.data.title}
                onChange={(title) => updateData({ title })}
              />
              {draft.kind !== 'page' && !routeLocked && (
                <Field
                  label="Đường dẫn"
                  value={draft.data.slug}
                  onChange={(slug) => updateData({ slug })}
                />
              )}
              <Field
                label="Mô tả ngắn"
                multiline
                value={draft.data.summary}
                onChange={(summary) => updateData({ summary })}
              />
              <MediaField
                label="Ảnh đại diện"
                value={draft.data.image}
                onChange={(image) => updateData({ image })}
              />
            </div>
            {draft.kind === 'page' && (
              <FixedPageFields
                fields={fixedFields}
                values={draft.data.fields}
                onChange={(fields) => updateData({ fields })}
              />
            )}
            {draft.kind === 'article' && (
              <>
                <div className="studio-editor-pair">
                  <Field
                    label="Chủ đề"
                    value={draft.data.category}
                    onChange={(category) => updateData({ category })}
                  />
                  <Field
                    label="Mã chủ đề"
                    value={draft.data.categorySlug}
                    onChange={(categorySlug) => updateData({ categorySlug })}
                  />
                </div>
                {draft.data.sections.map((section, index) => (
                  <section key={index} className="studio-editor-section">
                    <div className="studio-section-heading">
                      <h2>Mục {index + 1}</h2>
                      <div className="studio-editor-actions">
                        <button
                          type="button"
                          className="studio-icon-button"
                          title="Đưa mục lên"
                          aria-label={`Đưa mục ${index + 1} lên`}
                          disabled={index === 0}
                          onClick={() => {
                            const sections = [...draft.data.sections]
                            ;[sections[index - 1], sections[index]] = [
                              sections[index],
                              sections[index - 1],
                            ]
                            updateData({ sections })
                          }}
                        >
                          <ArrowUpIcon />
                        </button>
                        <button
                          type="button"
                          className="studio-icon-button"
                          title="Đưa mục xuống"
                          aria-label={`Đưa mục ${index + 1} xuống`}
                          disabled={index === draft.data.sections.length - 1}
                          onClick={() => {
                            const sections = [...draft.data.sections]
                            ;[sections[index + 1], sections[index]] = [
                              sections[index],
                              sections[index + 1],
                            ]
                            updateData({ sections })
                          }}
                        >
                          <ArrowDownIcon />
                        </button>
                        <button
                          type="button"
                          className="studio-icon-button"
                          title="Xóa mục"
                          aria-label={`Xóa mục ${index + 1}`}
                          disabled={draft.data.sections.length <= 1}
                          onClick={() => {
                            if (
                              window.confirm(
                                'Xóa mục nội dung này khỏi bản nháp?',
                              )
                            )
                              updateData({
                                sections: draft.data.sections.filter(
                                  (_, i) => i !== index,
                                ),
                              })
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                    <Field
                      label={`Tiêu đề mục ${index + 1}`}
                      value={section.heading}
                      onChange={(heading) =>
                        updateData({
                          sections: draft.data.sections.map((item, i) =>
                            i === index ? { ...item, heading } : item,
                          ),
                        })
                      }
                    />
                    <TextList
                      label={`Đoạn văn mục ${index + 1}`}
                      values={section.body}
                      onChange={(body) =>
                        updateData({
                          sections: draft.data.sections.map((item, i) =>
                            i === index ? { ...item, body } : item,
                          ),
                        })
                      }
                    />
                  </section>
                ))}
                <button
                  type="button"
                  className="studio-button studio-button-secondary"
                  disabled={draft.data.sections.length >= 100}
                  onClick={() =>
                    updateData({
                      sections: [
                        ...draft.data.sections,
                        { heading: '', body: [''] },
                      ],
                    })
                  }
                >
                  <PlusIcon />
                  Thêm mục nội dung
                </button>
              </>
            )}
            {draft.kind === 'service' && (
              <>
                <Field
                  label="Tên ngắn"
                  value={draft.data.shortTitle}
                  onChange={(shortTitle) => updateData({ shortTitle })}
                />
                <Field
                  label="Nhu cầu phù hợp"
                  multiline
                  value={draft.data.audience}
                  onChange={(audience) => updateData({ audience })}
                />
                <TextList
                  label="Phạm vi công việc"
                  values={draft.data.scope}
                  onChange={(scope) => updateData({ scope })}
                />
                <TextList
                  label="Thông tin cần chuẩn bị"
                  values={draft.data.inputs}
                  onChange={(inputs) => updateData({ inputs })}
                />
                <TextList
                  label="Điều kiện và giới hạn"
                  values={draft.data.boundaries}
                  onChange={(boundaries) => updateData({ boundaries })}
                />
                <h2>Câu hỏi thường gặp</h2>
                {draft.data.faqs.map((faq, index) => (
                  <section className="studio-editor-section" key={index}>
                    <Field
                      label={`Câu hỏi ${index + 1}`}
                      value={faq.q}
                      onChange={(q) =>
                        updateData({
                          faqs: draft.data.faqs.map((item, i) =>
                            i === index ? { ...item, q } : item,
                          ),
                        })
                      }
                    />
                    <Field
                      label={`Trả lời ${index + 1}`}
                      multiline
                      value={faq.a}
                      onChange={(a) =>
                        updateData({
                          faqs: draft.data.faqs.map((item, i) =>
                            i === index ? { ...item, a } : item,
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      className="studio-icon-button"
                      title="Xóa câu hỏi"
                      aria-label={`Xóa câu hỏi ${index + 1}`}
                      onClick={() =>
                        updateData({
                          faqs: draft.data.faqs.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <TrashIcon />
                    </button>
                  </section>
                ))}
                <button
                  type="button"
                  className="studio-button studio-button-secondary"
                  disabled={draft.data.faqs.length >= 50}
                  onClick={() =>
                    updateData({ faqs: [...draft.data.faqs, { q: '', a: '' }] })
                  }
                >
                  <PlusIcon />
                  Thêm câu hỏi
                </button>
              </>
            )}
            {(draft.kind === 'industry' ||
              draft.kind === 'industryCategory') && (
              <IndustryFields
                payload={draft}
                categories={industryCategories}
                industries={industryOptions}
                traits={industryTraits}
                onChange={(data) =>
                  setDraft((current) => ({ ...current, data }) as ContentPayload)
                }
              />
            )}
          </fieldset>
        )}
        {tab === 'seo' && (
          <div className="studio-seo-editor">
            <fieldset
              className="studio-editor-body"
              disabled={!canWriteSeo || busy}
            >
              <Field
                label="SEO title"
                value={draft.seo.title}
                onChange={(value) => updateSeo('title', value)}
              />
              <small>{draft.seo.title.length} ký tự</small>
              <Field
                label="Meta description"
                multiline
                value={draft.seo.description}
                onChange={(value) => updateSeo('description', value)}
              />
              <small>{draft.seo.description.length} ký tự</small>
              <Field
                label="Canonical"
                value={draft.seo.canonical}
                onChange={(value) => updateSeo('canonical', value)}
              />
              <MediaField
                label="Ảnh Open Graph"
                value={draft.seo.image}
                onChange={(value) => updateSeo('image', value)}
              />
              <label className="studio-checkbox">
                <input
                  type="checkbox"
                  checked={draft.seo.noindex}
                  onChange={(event) =>
                    updateSeo('noindex', event.target.checked)
                  }
                />
                Không lập chỉ mục trang này
              </label>
            </fieldset>
            <aside className="studio-serp">
              <h2>Xem trước kết quả tìm kiếm</h2>
              <small>nhaphangchinhngach.vn</small>
              <p className="studio-serp-title">
                {searchTitle(draft, brandName)}
              </p>
              <p>{draft.seo.description}</p>
            </aside>
          </div>
        )}
        {tab === 'history' && (
          <div className="studio-table-wrap">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Phiên bản</th>
                  <th>Thao tác</th>
                  <th>Thời điểm</th>
                  <th>
                    <span className="sr-only">Khôi phục</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((item) => (
                  <tr key={item.version}>
                    <td>v{item.version}</td>
                    <td>
                      {{
                        seeded: 'Nội dung ban đầu',
                        created: 'Tạo bản nháp',
                        saved: 'Lưu bản nháp',
                        'seo-saved': 'Lưu SEO',
                        published: 'Xuất bản',
                        unpublished: 'Gỡ xuất bản',
                        restored: 'Khôi phục',
                      }[item.action] || item.action}
                    </td>
                    <td>{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                    <td>
                      {canWrite && (
                        <button
                          type="button"
                          className="studio-icon-button"
                          title={`Khôi phục phiên bản ${item.version}`}
                          aria-label={`Khôi phục phiên bản ${item.version}`}
                          disabled={
                            busy ||
                            dirty ||
                            item.version === documentState?.version
                          }
                          onClick={() => mutate('restore', item.version)}
                        >
                          <ArrowUturnLeftIcon />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!revisions.length && (
              <p className="studio-empty">Chưa có phiên bản đã lưu.</p>
            )}
          </div>
        )}
      </div>
      {canPublish && documentState?.published && (
        <div className="studio-publish-footer">
          <Link
            href={
              documentState.publishedPath === '/'
                ? '/'
                : `${documentState.publishedPath}/`
            }
            target="_blank"
          >
            Xem trang đã xuất bản
          </Link>
          <button
            className="studio-button studio-button-secondary"
            disabled={busy || dirty}
            onClick={() => mutate('unpublish')}
          >
            <TrashIcon />
            Gỡ xuất bản
          </button>
        </div>
      )}
      {canPublish &&
        documentState &&
        !documentState.archivedAt &&
        !documentState.published &&
        (documentState.kind === 'industry' ||
          documentState.kind === 'industryCategory') && (
          <div className="studio-publish-footer">
            <span className="studio-muted">Ẩn nội dung không còn sử dụng khỏi Atlas.</span>
            <button
              className="studio-button studio-button-secondary"
              disabled={busy || dirty}
              onClick={() => mutate('archive')}
            >
              <TrashIcon />
              Lưu trữ
            </button>
          </div>
        )}
    </>
  )
}
