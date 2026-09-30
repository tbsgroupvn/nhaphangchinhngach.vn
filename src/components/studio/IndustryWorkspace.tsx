'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type {
  ContentDocument,
  ContentPayload,
  ContentSummary,
} from '@/lib/studio/content-model'
import type {
  IndustryTaxonomy,
  IndustryTrait,
} from '@/lib/studio/industry-taxonomy-model'
import type { IndustrySearchProjection } from '@/lib/industries/public'
import { contentStatusLabels } from './ContentInventory'

type Tab = 'categories' | 'industries' | 'traits'
type CreateKind = 'industryCategory' | 'industry'
const tabs: { id: Tab; label: string }[] = [
  { id: 'categories', label: 'Nhóm ngành' },
  { id: 'industries', label: 'Ngành hàng' },
  { id: 'traits', label: 'Đặc tính' },
]
const groupLabels: Record<IndustryTrait['group'], string> = {
  handling: 'Xử lý hàng',
  packing: 'Đóng gói',
  supplier: 'Nhà cung cấp',
  compliance: 'Tuân thủ',
  transport: 'Vận chuyển',
}
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()

function summaryOf(document: ContentDocument): ContentSummary {
  return {
    id: document.id,
    kind: document.kind,
    path: document.path,
    title: document.draft.data.title,
    status: document.archivedAt
      ? 'archived'
      : !document.published
        ? 'draft'
        : JSON.stringify(document.draft) === JSON.stringify(document.published)
          ? 'published'
          : 'changed',
    version: document.version,
    updatedAt: document.updatedAt,
    publishedAt: document.publishedAt,
    publishedPath: document.publishedPath,
    archivedAt: document.archivedAt,
  }
}

function CreateDialog({
  kind,
  categories,
  onClose,
}: {
  kind: CreateKind
  categories: ContentSummary[]
  onClose: () => void
}) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [categorySlug, setCategorySlug] = useState(
    categories[0]?.path.split('/').filter(Boolean).at(-1) || '',
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function create() {
    setBusy(true)
    setError('')
    const base = {
      slug,
      title,
      summary,
      image: '/images/marketing/containers.webp',
      review: {
        status: 'pending' as const,
        reviewer: '',
        reviewedAt: '',
        nextReviewAt: '',
      },
    }
    const payload: ContentPayload =
      kind === 'industryCategory'
        ? {
            kind,
            data: {
              ...base,
              order: (categories.length + 1) * 10,
              featuredIndustryIds: [],
            },
            seo: {
              title,
              description: summary,
              canonical: '',
              image: '/images/marketing/containers.webp',
              noindex: false,
            },
          }
        : {
            kind,
            data: {
              ...base,
              categorySlug,
              shortTitle: title,
              aliases: [],
              searchTerms: [],
              models: [],
              uses: [],
              materials: [],
              traits: [],
              details: ['Mô tả đặc điểm sản phẩm cần được hoàn thiện.'],
              inputs: ['Thông tin lô hàng cần được bổ sung trước khi tư vấn.'],
              preparationItems: [],
              technicalInputs: [],
              packingNotes: [],
              verificationPoints: [],
              proofItems: [],
              serviceSlugs: [],
              articleSlugs: [],
              faqs: [],
              saleBriefItems: [],
            },
            seo: {
              title,
              description: summary,
              canonical: '',
              image: '/images/marketing/containers.webp',
              noindex: false,
            },
          }
    try {
      const response = await fetch('/api/studio/content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Chưa thể tạo bản nháp.')
      router.push(`/admin/content/${result.document.id}/`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
      setBusy(false)
    }
  }

  return (
    <Dialog open onClose={busy ? () => undefined : onClose} className="studio studio-task-dialog">
      <div className="studio-backdrop" aria-hidden="true" />
      <div className="studio-task-dialog-scroll">
        <DialogPanel className="studio-task-panel studio-atlas-create">
          <div className="studio-section-heading">
            <DialogTitle as="h2">
              {kind === 'industryCategory' ? 'Tạo nhóm ngành' : 'Tạo ngành hàng'}
            </DialogTitle>
            <button type="button" className="studio-icon-button" aria-label="Đóng tạo bản nháp" title="Đóng" onClick={onClose} disabled={busy}>
              <XMarkIcon />
            </button>
          </div>
          <label>
            <span>{kind === 'industryCategory' ? 'Tên nhóm ngành' : 'Tên ngành hàng'}</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            <span>{kind === 'industryCategory' ? 'Đường dẫn nhóm' : 'Đường dẫn ngành'}</span>
            <input value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
          {kind === 'industry' && (
            <label>
              <span>Nhóm ngành</span>
              <select value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
                {categories.map((category) => (
                  <option key={category.id} value={category.path.split('/').filter(Boolean).at(-1)}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            <span>{kind === 'industryCategory' ? 'Mô tả nhóm' : 'Mô tả ngành'}</span>
            <textarea rows={4} value={summary} onChange={(event) => setSummary(event.target.value)} />
          </label>
          {error && <p className="studio-error" role="alert">{error}</p>}
          <div className="studio-dialog-actions">
            <button type="button" className="studio-button studio-button-secondary" onClick={onClose} disabled={busy}>Hủy</button>
            <button type="button" className="studio-button studio-primary" onClick={create} disabled={busy || !title.trim() || !slug.trim() || !summary.trim() || (kind === 'industry' && !categorySlug)}>
              <PlusIcon />
              {busy ? 'Đang tạo...' : 'Tạo bản nháp'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default function IndustryWorkspace({
  initialItems,
  initialTaxonomy,
  projectionStatus,
  canWrite,
  canPublish,
}: {
  initialItems: ContentSummary[]
  initialTaxonomy: IndustryTaxonomy
  projectionStatus: Pick<
    IndustrySearchProjection,
    'stale' | 'unavailable' | 'diagnostic'
  >
  canWrite: boolean
  canPublish: boolean
}) {
  const [items, setItems] = useState(initialItems)
  const [taxonomy, setTaxonomy] = useState(initialTaxonomy)
  const [tab, setTab] = useState<Tab>('categories')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [createKind, setCreateKind] = useState<CreateKind | null>(null)
  const [confirming, setConfirming] = useState<ContentSummary | null>(null)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [rowError, setRowError] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const categories = items.filter((item) => item.kind === 'industryCategory')
  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          item.kind === (tab === 'categories' ? 'industryCategory' : 'industry') &&
          (!status || item.status === status) &&
          normalize(`${item.title} ${item.path}`).includes(normalize(query)),
      ),
    [items, query, status, tab],
  )

  async function changeArchive(item: ContentSummary, action: 'archive' | 'reactivate') {
    setBusyId(item.id)
    setRowError((current) => ({ ...current, [item.id]: '' }))
    try {
      const response = await fetch(`/api/studio/content/${item.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, version: item.version }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Chưa thể cập nhật.')
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? summaryOf(result.document) : entry,
        ),
      )
      setConfirming(null)
    } catch (caught) {
      setRowError((current) => ({
        ...current,
        [item.id]: caught instanceof Error ? caught.message : 'Lỗi kết nối.',
      }))
    } finally {
      setBusyId('')
    }
  }

  async function saveTaxonomy() {
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/studio/industries/taxonomy/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: taxonomy.version, traits: taxonomy.traits }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Chưa thể lưu đặc tính.')
      setTaxonomy(result)
      setMessage('Đã lưu đặc tính.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    }
  }

  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-kicker">NỘI DUNG / NGÀNH HÀNG</p>
          <h1>Industry Atlas</h1>
          <p>{categories.length} nhóm · {items.filter((item) => item.kind === 'industry').length} ngành · {taxonomy.traits.length} đặc tính</p>
        </div>
        {canWrite && tab !== 'traits' && (
          <button type="button" className="studio-button studio-primary" onClick={() => setCreateKind(tab === 'categories' ? 'industryCategory' : 'industry')}>
            <PlusIcon />
            {tab === 'categories' ? 'Tạo nhóm ngành' : 'Tạo ngành hàng'}
          </button>
        )}
      </div>
      <p
        className={`studio-projection-status ${projectionStatus.unavailable ? 'studio-error' : projectionStatus.stale ? 'studio-notice' : 'studio-success'}`}
        role={projectionStatus.unavailable ? 'alert' : undefined}
      >
        {projectionStatus.unavailable
          ? 'Chỉ mục tìm kiếm tạm chưa sẵn sàng. Nội dung đã xuất bản vẫn được giữ nguyên.'
          : projectionStatus.stale
            ? 'Chỉ mục tìm kiếm đang dùng bản tốt gần nhất trong khi chờ tạo lại.'
            : 'Chỉ mục tìm kiếm sẵn sàng.'}
        {projectionStatus.diagnostic && (
          <small>{projectionStatus.diagnostic}</small>
        )}
      </p>
      <div className="studio-atlas-tabs" role="tablist" aria-label="Industry Atlas">
        {tabs.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => { setTab(item.id); setQuery(''); setStatus('') }}>
            {item.label}
          </button>
        ))}
      </div>

      {tab !== 'traits' ? (
        <>
          <div className="studio-content-filters">
            <label className="studio-search">
              <MagnifyingGlassIcon />
              <span className="sr-only">Tìm ngành hàng</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên hoặc đường dẫn" />
            </label>
            <label>
              <span className="sr-only">Trạng thái ngành hàng</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">Tất cả trạng thái</option>
                {Object.entries(contentStatusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <div className="studio-table-wrap studio-atlas-table-wrap">
            <table className="studio-table studio-atlas-table">
              <thead><tr><th>Nội dung</th><th>Trạng thái</th><th>Cập nhật</th><th><span className="sr-only">Thao tác</span></th></tr></thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td><Link href={`/admin/content/${item.id}/`}><PencilSquareIcon />{item.title}</Link><small>{item.path}</small>{rowError[item.id] && <span className="studio-inline-error" role="alert">{rowError[item.id]}</span>}</td>
                    <td><span className={`studio-badge ${item.status === 'published' ? '' : 'studio-badge-off'}`}>{contentStatusLabels[item.status]}</span></td>
                    <td>{new Date(item.updatedAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {canPublish && (item.status === 'archived' ? (
                        <button type="button" className="studio-icon-button" title={`Khôi phục ${item.title}`} aria-label={`Khôi phục ${item.title}`} disabled={busyId === item.id} onClick={() => changeArchive(item, 'reactivate')}><ArrowPathIcon /></button>
                      ) : (
                        <button type="button" className="studio-icon-button" title={`Lưu trữ ${item.title}`} aria-label={`Lưu trữ ${item.title}`} disabled={busyId === item.id} onClick={() => setConfirming(item)}><ArchiveBoxArrowDownIcon /></button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length && <p className="studio-empty">Không có nội dung phù hợp.</p>}
        </>
      ) : (
        <section className="studio-taxonomy">
          <div className="studio-section-heading">
            <div><h2>Từ điển đặc tính</h2><p className="studio-muted">Slug đã được tham chiếu sẽ không thể đổi; tắt để lưu trữ.</p></div>
            {canWrite && <button type="button" className="studio-button studio-primary" onClick={saveTaxonomy}>Lưu đặc tính</button>}
          </div>
          {error && <p className="studio-error" role="alert">{error}</p>}
          <p className="studio-save-status" role="status">{message}</p>
          <div className="studio-trait-list">
            {taxonomy.traits.map((trait, index) => (
              <fieldset key={trait.id} data-industry-trait disabled={!canWrite}>
                <legend>{trait.label}</legend>
                <label><span>Tên hiển thị</span><input value={trait.label} onChange={(event) => setTaxonomy((current) => ({ ...current, traits: current.traits.map((item, position) => position === index ? { ...item, label: event.target.value } : item) }))} /></label>
                <label><span>Slug cố định</span><input value={trait.slug} disabled /></label>
                <label><span>Nhóm</span><select value={trait.group} onChange={(event) => setTaxonomy((current) => ({ ...current, traits: current.traits.map((item, position) => position === index ? { ...item, group: event.target.value as IndustryTrait['group'] } : item) }))}>{Object.entries(groupLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                <label><span>Thứ tự</span><input type="number" value={trait.order} onChange={(event) => setTaxonomy((current) => ({ ...current, traits: current.traits.map((item, position) => position === index ? { ...item, order: Number(event.target.value) } : item) }))} /></label>
                <label className="studio-trait-description"><span>Mô tả</span><textarea rows={2} value={trait.description} onChange={(event) => setTaxonomy((current) => ({ ...current, traits: current.traits.map((item, position) => position === index ? { ...item, description: event.target.value } : item) }))} /></label>
                <label className="studio-checkbox"><input type="checkbox" aria-label="Đang sử dụng" checked={trait.active} onChange={(event) => setTaxonomy((current) => ({ ...current, traits: current.traits.map((item, position) => position === index ? { ...item, active: event.target.checked } : item) }))} />Đang sử dụng</label>
              </fieldset>
            ))}
          </div>
        </section>
      )}

      {createKind && <CreateDialog kind={createKind} categories={categories.filter((item) => item.status !== 'archived')} onClose={() => setCreateKind(null)} />}
      {confirming && (
        <Dialog open onClose={() => setConfirming(null)} className="studio studio-task-dialog">
          <div className="studio-backdrop" aria-hidden="true" />
          <div className="studio-task-dialog-scroll"><DialogPanel className="studio-task-panel studio-confirm-panel"><DialogTitle as="h2">Lưu trữ ngành hàng</DialogTitle><p>Nội dung “{confirming.title}” sẽ được gỡ xuất bản và ẩn khỏi website.</p><div className="studio-dialog-actions"><button type="button" className="studio-button studio-button-secondary" onClick={() => setConfirming(null)}>Hủy</button><button type="button" className="studio-button studio-danger" onClick={() => changeArchive(confirming, 'archive')} disabled={busyId === confirming.id}>Xác nhận lưu trữ</button></div></DialogPanel></div>
        </Dialog>
      )}
    </>
  )
}
