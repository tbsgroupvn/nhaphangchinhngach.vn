'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  StopIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import type { ContentSummary } from '@/lib/studio/content-model'
import {
  taskStatuses,
  taskStatusLabels,
  type SeoIssue,
  type SeoRow,
  type SeoTask,
  type LinkSuggestion,
} from '@/lib/studio/seo-model'
import SeoTaskDialog from './SeoTaskDialog'

type Data = {
  rows: SeoRow[]
  tasks: SeoTask[]
  documents: ContentSummary[]
  assignees: { id: string; name: string }[]
  indexable: boolean
  auditConfigured: boolean
}
const tabs = {
  audit: 'Kiểm tra SEO',
  planner: 'Kế hoạch nội dung',
  links: 'Liên kết nội bộ',
}
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
const date = (value: string) =>
  new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
async function jsonRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, options),
    data = await response.json()
  if (!response.ok)
    throw new Error(data.error || 'Không thể hoàn thành thao tác.')
  return data
}
function Issues({ items }: { items: SeoIssue[] }) {
  if (!items.length)
    return (
      <span className="studio-seo-clean">
        <CheckCircleIcon />
        Không có phát hiện
      </span>
    )
  const actionable = items.filter((issue) => issue.severity !== 'info')
  return (
    <details className="studio-seo-issues">
      <summary>
        {actionable.length
          ? `${actionable.length} cần xem lại`
          : `${items.length} ghi chú`}
        <span className="studio-muted"> / {items.length} phát hiện</span>
      </summary>
      <ul>
        {items.map((issue, index) => (
          <li key={`${issue.code}-${index}`} data-severity={issue.severity}>
            <span>{issue.message}</span>
            {issue.detail && <small>{issue.detail}</small>}
            <small>{issue.field}</small>
          </li>
        ))}
      </ul>
    </details>
  )
}

export default function SeoWorkspace({
  initial,
  canWrite,
  initialView = 'audit',
}: {
  initial: Data
  canWrite: boolean
  initialView?: 'audit' | 'planner'
}) {
  const [data, setData] = useState(initial),
    [tab, setTab] = useState<keyof typeof tabs>(initialView)
  const [query, setQuery] = useState(''),
    [mode, setMode] = useState('draft'),
    [severity, setSeverity] = useState('')
  const [taskQuery, setTaskQuery] = useState(''),
    [taskStatus, setTaskStatus] = useState('')
  const [editing, setEditing] = useState<SeoTask | null | undefined>(undefined)
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('')
  const [source, setSource] = useState(''),
    [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]),
    [linksLoading, setLinksLoading] = useState(false)
  const stopped = useRef(false),
    controller = useRef<AbortController>()
  useEffect(
    () => () => {
      stopped.current = true
      controller.current?.abort()
    },
    [],
  )
  useEffect(() => {
    setSuggestions([])
    if (!source) return
    const request = new AbortController()
    setLinksLoading(true)
    setError('')
    jsonRequest(`/api/studio/seo/links/?id=${source}`, {
      signal: request.signal,
    })
      .then((result) => setSuggestions(result.suggestions))
      .catch((caught) => {
        if (!request.signal.aborted) setError(caught.message)
      })
      .finally(() => {
        if (!request.signal.aborted) setLinksLoading(false)
      })
    return () => request.abort()
  }, [source, data.documents])
  async function reload() {
    setSuggestions([])
    if (source) setLinksLoading(true)
    try {
      setData(await jsonRequest('/api/studio/seo/'))
    } catch (error) {
      setLinksLoading(false)
      throw error
    }
  }
  async function refresh() {
    setBusy(true)
    setError('')
    try {
      await reload()
      setMessage('Đã cập nhật dữ liệu.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  const issuesFor = (row: SeoRow) =>
    mode === 'draft' ? row.issues : row.live?.issues || []
  const visible = data.rows.filter(
    (row) =>
      normalize(`${row.title} ${row.path}`).includes(normalize(query)) &&
      (!severity ||
        issuesFor(row).some((issue) => issue.severity === severity)),
  )
  const attention = data.rows.filter((row) =>
    issuesFor(row).some((issue) => issue.severity !== 'info'),
  ).length
  async function scan(rows: SeoRow[]) {
    if (busy) return
    setBusy(true)
    setError('')
    stopped.current = false
    let checked = 0,
      failed = 0
    try {
      for (const row of rows.filter((item) => item.published)) {
        if (stopped.current) break
        setMessage(`Đang quét ${row.path}...`)
        controller.current = new AbortController()
        const result = await jsonRequest('/api/studio/seo/audit/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: row.id }),
          signal: controller.current.signal,
        })
        if (result.report.status === 'failed') failed++
        else checked++
        setData((current) => ({
          ...current,
          rows: current.rows.map((item) =>
            item.id === row.id
              ? {
                  ...item,
                  live: {
                    ...result.report,
                    version: row.version,
                    stale: false,
                  },
                }
              : item,
          ),
        }))
      }
      await reload()
      setMessage(
        `${stopped.current ? 'Đã dừng. ' : ''}Đã quét ${checked} trang${failed ? `; ${failed} trang không đọc được HTML` : ''}.`,
      )
    } catch (caught) {
      if (!controller.current?.signal.aborted)
        setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
      else setMessage('Đã dừng lượt quét.')
    } finally {
      setBusy(false)
      controller.current = undefined
    }
  }
  async function removeTask(task: SeoTask) {
    if (!window.confirm(`Xóa công việc “${task.title}”?`)) return
    setBusy(true)
    setError('')
    try {
      await jsonRequest('/api/studio/seo/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: task.id,
          version: task.version,
        }),
      })
      await reload()
      setMessage('Đã xóa công việc.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  async function copy(path: string) {
    try {
      await navigator.clipboard.writeText(
        `https://nhaphangchinhngach.vn${path === '/' ? '/' : `${path}/`}`,
      )
      setMessage('Đã sao chép liên kết.')
    } catch {
      setError(
        'Trình duyệt không cho sao chép. Đường dẫn vẫn hiển thị bên dưới tiêu đề.',
      )
    }
  }
  const tasks = data.tasks.filter(
    (task) =>
      (!taskStatus || task.status === taskStatus) &&
      normalize(`${task.title} ${task.keyword}`).includes(normalize(taskQuery)),
  )
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-kicker">TBS STUDIO / SEARCH</p>
          <h1>SEO & nội dung</h1>
          <p>{data.rows.length} trang trong danh mục</p>
        </div>
        <div className="studio-seo-actions">
          <Link className="studio-button" href="/admin/seo/technical/">
            SEO kỹ thuật <ArrowTopRightOnSquareIcon />
          </Link>
          <span
            className={`studio-badge ${data.indexable ? '' : 'studio-badge-off'}`}
          >
            {data.indexable ? 'Cho phép lập chỉ mục' : 'Website đang Noindex'}
          </span>
          <button
            type="button"
            className="studio-icon-button"
            title="Tải lại dữ liệu SEO"
            aria-label="Tải lại dữ liệu SEO"
            onClick={refresh}
            disabled={busy}
          >
            <ArrowPathIcon />
          </button>
        </div>
      </div>
      <div className="studio-metrics studio-seo-metrics">
        <div className="studio-metric">
          <span>Trang cần xem lại</span>
          <strong>{attention}</strong>
        </div>
        <div className="studio-metric">
          <span>HTML đã quét / đã xuất bản</span>
          <strong>
            {
              data.rows.filter(
                (row) =>
                  row.published &&
                  row.live?.status === 'checked' &&
                  !row.live.stale,
              ).length
            }
            <small> / {data.rows.filter((row) => row.published).length}</small>
          </strong>
        </div>
        <div className="studio-metric">
          <span>Công việc đang mở</span>
          <strong>
            {data.tasks.filter((task) => task.status !== 'done').length}
          </strong>
        </div>
      </div>
      <div
        className="studio-seo-tabs"
        role="tablist"
        aria-label="Không gian SEO"
      >
        {(Object.keys(tabs) as (keyof typeof tabs)[]).map((key, index, all) => (
          <button
            type="button"
            role="tab"
            key={key}
            id={`seo-tab-${key}`}
            aria-controls={`seo-panel-${key}`}
            aria-selected={tab === key}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(event) => {
              if (
                ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              ) {
                event.preventDefault()
                const next =
                  event.key === 'Home'
                    ? all[0]
                    : event.key === 'End'
                      ? all[all.length - 1]
                      : all[
                          (index +
                            (event.key === 'ArrowRight' ? 1 : -1) +
                            all.length) %
                            all.length
                        ]
                setTab(next)
                document.getElementById(`seo-tab-${next}`)?.focus()
              }
            }}
          >
            {tabs[key]}
          </button>
        ))}
      </div>
      {error && (
        <p className="studio-error" role="alert">
          {error}
        </p>
      )}
      <p className="studio-save-status" role="status" aria-live="polite">
        {message}
      </p>
      <div
        role="tabpanel"
        id={`seo-panel-${tab}`}
        aria-labelledby={`seo-tab-${tab}`}
      >
        {tab === 'audit' && (
          <>
            <div className="studio-seo-filters">
              <label className="studio-search">
                <MagnifyingGlassIcon />
                <span className="sr-only">Tìm trang SEO</span>
                <input
                  type="search"
                  placeholder="Tên trang hoặc URL"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label>
                <span className="sr-only">Nguồn kiểm tra</span>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value)}
                >
                  <option value="draft">Bản nháp · nội dung đã lưu</option>
                  <option value="live">HTML đã xuất bản</option>
                </select>
              </label>
              <label>
                <span className="sr-only">Mức độ phát hiện</span>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value)}
                >
                  <option value="">Mọi mức độ</option>
                  <option value="error">Lỗi</option>
                  <option value="warning">Cần xem lại</option>
                  <option value="info">Ghi chú</option>
                </select>
              </label>
              {canWrite &&
                (busy ? (
                  <button
                    type="button"
                    className="studio-button"
                    onClick={() => {
                      stopped.current = true
                      controller.current?.abort()
                    }}
                  >
                    <StopIcon />
                    Dừng quét
                  </button>
                ) : (
                  <button
                    type="button"
                    className="studio-button"
                    disabled={
                      !data.auditConfigured ||
                      !visible.some((row) => row.published)
                    }
                    onClick={() => scan(visible)}
                  >
                    <MagnifyingGlassIcon />
                    Quét các trang đang lọc
                  </button>
                ))}
            </div>
            {!data.auditConfigured && (
              <p className="studio-error">
                Chưa cấu hình STUDIO_ORIGIN cho lượt quét HTML.
              </p>
            )}
            <div className="studio-table-wrap">
              <table className="studio-table studio-seo-table">
                <thead>
                  <tr>
                    <th scope="col">Trang</th>
                    <th scope="col">
                      {mode === 'draft'
                        ? 'Nội dung & metadata bản nháp'
                        : 'HTML đã xuất bản'}
                    </th>
                    <th scope="col">Lần quét HTML</th>
                    <th scope="col">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link href={`/admin/content/${row.id}/?tab=seo`}>
                          {row.title}
                        </Link>
                        <small>{row.path}</small>
                        <small>
                          v{row.version} ·{' '}
                          {row.published ? 'Có bản xuất bản' : 'Chưa xuất bản'}
                        </small>
                      </td>
                      <td>
                        {mode === 'draft' ? (
                          <Issues items={row.issues} />
                        ) : !row.published ? (
                          <span className="studio-muted">Chưa xuất bản</span>
                        ) : !row.live ? (
                          <span className="studio-muted">Chưa quét</span>
                        ) : (
                          <>
                            <Issues items={row.live.issues} />
                            <small>
                              {row.live.headings} tiêu đề · {row.live.images}{' '}
                              ảnh · {row.live.links} liên kết
                            </small>
                            {row.live.stale && (
                              <span className="studio-seo-stale">
                                Nội dung đã đổi · cần quét lại
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td>
                        {row.live ? (
                          <>
                            <span>
                              {row.live.status === 'checked'
                                ? 'Đã quét'
                                : 'Quét chưa thành công'}
                            </span>
                            <small>{date(row.live.checkedAt)}</small>
                          </>
                        ) : (
                          <span className="studio-muted">Chưa quét</span>
                        )}
                      </td>
                      <td>
                        {canWrite && (
                          <button
                            type="button"
                            className="studio-icon-button"
                            title={`Quét HTML ${row.path}`}
                            aria-label={`Quét HTML ${row.path}`}
                            disabled={
                              busy || !row.published || !data.auditConfigured
                            }
                            onClick={() => scan([row])}
                          >
                            <MagnifyingGlassIcon />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!visible.length && (
              <p className="studio-empty">Không có trang phù hợp.</p>
            )}
          </>
        )}
        {tab === 'planner' && (
          <>
            <div className="studio-seo-filters">
              <label className="studio-search">
                <MagnifyingGlassIcon />
                <span className="sr-only">Tìm công việc SEO</span>
                <input
                  type="search"
                  placeholder="Từ khóa hoặc công việc"
                  value={taskQuery}
                  onChange={(event) => setTaskQuery(event.target.value)}
                />
              </label>
              <label>
                <span className="sr-only">Lọc trạng thái công việc</span>
                <select
                  value={taskStatus}
                  onChange={(event) => setTaskStatus(event.target.value)}
                >
                  <option value="">Mọi trạng thái</option>
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {taskStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
              {canWrite && (
                <button
                  className="studio-button studio-primary"
                  type="button"
                  onClick={() => setEditing(null)}
                >
                  <PlusIcon />
                  Thêm công việc
                </button>
              )}
            </div>
            <div className="studio-table-wrap">
              <table className="studio-table studio-seo-task-table">
                <thead>
                  <tr>
                    <th scope="col">Từ khóa / công việc</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Phụ trách / hạn</th>
                    <th scope="col">Nội dung</th>
                    <th scope="col">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <small>{task.keyword}</small>
                        {task.notes && (
                          <details>
                            <summary>Ghi chú</summary>
                            <p className="studio-task-notes">{task.notes}</p>
                          </details>
                        )}
                      </td>
                      <td>
                        <span
                          className={`studio-badge ${task.status === 'done' ? '' : 'studio-badge-off'}`}
                        >
                          {taskStatusLabels[task.status]}
                        </span>
                      </td>
                      <td>
                        {data.assignees.find(
                          (user) => user.id === task.assigneeId,
                        )?.name || 'Chưa phân công'}
                        <small>{task.dueDate || 'Chưa đặt hạn'}</small>
                      </td>
                      <td>
                        {task.documentId ? (
                          <Link href={`/admin/content/${task.documentId}/`}>
                            {data.documents.find(
                              (item) => item.id === task.documentId,
                            )?.title || 'Xem nội dung'}
                          </Link>
                        ) : (
                          <span className="studio-muted">Chưa gắn trang</span>
                        )}
                      </td>
                      <td>
                        {canWrite && (
                          <div className="studio-seo-actions">
                            <button
                              className="studio-icon-button"
                              type="button"
                              aria-label={`Sửa ${task.title}`}
                              title={`Sửa ${task.title}`}
                              onClick={() => setEditing(task)}
                              disabled={busy}
                            >
                              <PencilSquareIcon />
                            </button>
                            <button
                              className="studio-icon-button"
                              type="button"
                              aria-label={`Xóa ${task.title}`}
                              title={`Xóa ${task.title}`}
                              onClick={() => removeTask(task)}
                              disabled={busy}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!tasks.length && (
              <p className="studio-empty">Chưa có công việc phù hợp.</p>
            )}
          </>
        )}
        {tab === 'links' && (
          <section className="studio-link-suggestions">
            <label className="studio-editor-field">
              <span>Trang cần bổ sung liên kết</span>
              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                <option value="">Chọn nội dung</option>
                {data.documents.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} · {item.path}
                  </option>
                ))}
              </select>
            </label>
            {source &&
              (linksLoading ? (
                <p className="studio-empty">Đang đối chiếu nội dung...</p>
              ) : (
                <>
                  <div className="studio-section-heading">
                    <h2>Trang liên quan đã xuất bản</h2>
                    <Link href={`/admin/content/${source}/`}>
                      Biên tập trang nguồn
                    </Link>
                  </div>
                  {suggestions.map((item) => (
                    <article className="studio-link-row" key={item.id}>
                      <div>
                        <Link href={`/admin/content/${item.id}/`}>
                          {item.title}
                        </Link>
                        <p>{item.path}</p>
                        <small>Từ chung: {item.terms.join(', ')}</small>
                      </div>
                      <div className="studio-seo-actions">
                        <button
                          className="studio-icon-button"
                          type="button"
                          title={`Sao chép ${item.path}`}
                          aria-label={`Sao chép ${item.path}`}
                          onClick={() => copy(item.path)}
                        >
                          <ClipboardDocumentIcon />
                        </button>
                        <Link
                          className="studio-icon-button"
                          href={item.path === '/' ? '/' : `${item.path}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Xem trang xuất bản"
                          aria-label={`Xem ${item.title}`}
                        >
                          <ArrowTopRightOnSquareIcon />
                        </Link>
                      </div>
                    </article>
                  ))}
                  {!suggestions.length && (
                    <p className="studio-empty">
                      Chưa có trang xuất bản phù hợp với chủ đề này.
                    </p>
                  )}
                </>
              ))}
          </section>
        )}
      </div>
      {editing !== undefined && (
        <SeoTaskDialog
          initial={editing}
          documents={data.documents}
          assignees={data.assignees}
          onClose={() => setEditing(undefined)}
          onSaved={(task) => {
            setData((current) => ({
              ...current,
              tasks: [
                task,
                ...current.tasks.filter((item) => item.id !== task.id),
              ],
            }))
            setEditing(undefined)
            setMessage('Đã lưu công việc.')
          }}
        />
      )}
    </>
  )
}
