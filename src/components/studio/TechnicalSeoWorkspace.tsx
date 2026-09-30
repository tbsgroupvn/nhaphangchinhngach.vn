'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useNavigationGuard } from 'next-navigation-guard'
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  technicalSettingsSchema,
  type TechnicalSettings,
  type TechnicalSeoData,
  type RedirectRule,
} from '@/lib/studio/technical-seo-model'
import RedirectDialog from './RedirectDialog'

const toForm = (settings: TechnicalSettings) => ({
  tokens: settings.googleVerification.join('\n'),
  blockIndexing: settings.blockIndexing,
})
export default function TechnicalSeoWorkspace({
  initial,
  canWrite,
}: {
  initial: TechnicalSeoData
  canWrite: boolean
}) {
  const [data, setData] = useState(initial)
  const [original, setOriginal] = useState(toForm(initial.settings))
  const [form, setForm] = useState(original)
  const [version, setVersion] = useState(initial.settings.version)
  const [latest, setLatest] = useState<TechnicalSettings | null>(null)
  const [editing, setEditing] = useState<RedirectRule | null | undefined>(
    undefined,
  )
  const [query, setQuery] = useState(''),
    [busy, setBusy] = useState(false)
  const [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const dirty = JSON.stringify(form) !== JSON.stringify(original)
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
        'Cấu hình SEO chưa lưu. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  async function reload() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/studio/seo/technical/', {
        cache: 'no-store',
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setData(result)
      // Refreshing the inventory must never silently discard a settings draft.
      if (!dirty) {
        setForm(toForm(result.settings))
        setOriginal(toForm(result.settings))
        setVersion(result.settings.version)
      }
      setMessage('Đã tải lại dữ liệu.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  async function saveSettings(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    const parsed = technicalSettingsSchema.safeParse({
      googleVerification: form.tokens
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
      blockIndexing: form.blockIndexing,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setBusy(true)
    try {
      const response = await fetch('/api/studio/seo/technical/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'settings',
          version,
          payload: parsed.data,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.code === 'VERSION_CONFLICT') {
          const refreshed = await fetch('/api/studio/seo/technical/', {
            cache: 'no-store',
          })
          if (refreshed.ok) {
            const remote: TechnicalSeoData = await refreshed.json()
            setData(remote)
            setLatest(remote.settings)
          }
        }
        throw new Error(result.error)
      }
      setData(result)
      setForm(toForm(result.settings))
      setOriginal(toForm(result.settings))
      setVersion(result.settings.version)
      pending.current = false
      setMessage('Đã lưu cấu hình SEO.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  async function remove(rule: RedirectRule) {
    if (
      !window.confirm(
        `Xóa chuyển hướng ${rule.source}? URL cũ sẽ không còn dẫn tới trang đích.`,
      )
    )
      return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/studio/seo/technical/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-redirect',
          id: rule.id,
          version: rule.version,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setData(result)
      setMessage('Đã xóa chuyển hướng.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolve(useRemote: boolean) {
    if (!latest) return
    const remote = toForm(latest)
    setOriginal(remote)
    setVersion(latest.version)
    if (useRemote) setForm(remote)
    setLatest(null)
    setError('')
  }
  const rows = data.redirects.filter((item) =>
    `${item.source} ${item.targetPath} ${item.targetTitle}`
      .toLocaleLowerCase('vi')
      .includes(query.toLocaleLowerCase('vi')),
  )
  return (
    <div data-studio-unsaved={dirty}>
      <div className="studio-page-heading">
        <div>
          <Link href="/admin/seo/" className="studio-technical-back">
            <ArrowLeftIcon /> SEO & nội dung
          </Link>
          <h1>SEO kỹ thuật</h1>
        </div>
        <button
          type="button"
          className="studio-icon-button"
          title="Tải lại SEO kỹ thuật"
          aria-label="Tải lại SEO kỹ thuật"
          disabled={busy}
          onClick={reload}
        >
          <ArrowPathIcon />
        </button>
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
      <div className="studio-metrics studio-seo-metrics">
        <div className="studio-metric">
          <span>Chuyển hướng đang hoạt động</span>
          <strong>{data.redirects.length}</strong>
        </div>
        <div className="studio-metric">
          <span>URL trong sitemap hiện tại</span>
          <strong>{data.indexable ? data.sitemapPaths.length : 0}</strong>
        </div>
        <div className="studio-metric">
          <span>Lập chỉ mục</span>
          <strong className="studio-technical-state">
            {data.indexable ? 'Cho phép' : 'Noindex'}
          </strong>
        </div>
      </div>
      <section
        className="studio-technical-section"
        aria-labelledby="redirect-heading"
      >
        <div className="studio-section-heading">
          <h2 id="redirect-heading">Chuyển hướng URL</h2>
          {canWrite && (
            <button
              type="button"
              className="studio-button studio-primary"
              disabled={busy}
              onClick={() => setEditing(null)}
            >
              <PlusIcon />
              Thêm chuyển hướng
            </button>
          )}
        </div>
        <div className="studio-seo-filters">
          <label className="studio-search">
            <MagnifyingGlassIcon />
            <input
              aria-label="Tìm chuyển hướng"
              placeholder="Tìm URL hoặc trang đích"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div className="studio-table-wrap">
          <table className="studio-table studio-redirect-table">
            <thead>
              <tr>
                <th scope="col">URL nguồn</th>
                <th scope="col">Trang đích</th>
                <th scope="col">HTTP</th>
                <th scope="col">
                  <span className="sr-only">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((rule) => (
                <tr key={rule.id}>
                  <td className="studio-technical-path">{rule.source}</td>
                  <td>
                    <a
                      href={`${rule.targetPath === '/' ? '' : rule.targetPath}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {rule.targetTitle}
                    </a>
                    <small className="studio-technical-path">
                      {rule.targetPath}
                    </small>
                  </td>
                  <td>
                    <span className="studio-badge">{rule.status}</span>
                  </td>
                  <td>
                    <div className="studio-seo-actions">
                      {canWrite && (
                        <>
                          <button
                            type="button"
                            className="studio-icon-button"
                            aria-label="Sửa chuyển hướng"
                            title="Sửa chuyển hướng"
                            disabled={busy}
                            onClick={() => setEditing(rule)}
                          >
                            <PencilSquareIcon />
                          </button>
                          <button
                            type="button"
                            className="studio-icon-button"
                            aria-label="Xóa chuyển hướng"
                            title="Xóa chuyển hướng"
                            disabled={busy}
                            onClick={() => remove(rule)}
                          >
                            <TrashIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <p className="studio-empty">
              {query
                ? 'Không tìm thấy chuyển hướng phù hợp.'
                : 'Chưa có chuyển hướng URL.'}
            </p>
          )}
        </div>
      </section>
      <div className="studio-technical-grid">
        <section
          className="studio-technical-section"
          aria-labelledby="verification-heading"
        >
          <div className="studio-section-heading">
            <h2 id="verification-heading">Search Console</h2>
            <a
              className="studio-icon-button"
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mở Google Search Console"
              title="Mở Google Search Console"
            >
              <ArrowTopRightOnSquareIcon />
            </a>
          </div>
          <p className="studio-muted">
            {data.settings.googleVerification.length
              ? `${data.settings.googleVerification.length} mã đã cấu hình · Chưa xác nhận trạng thái từ Google`
              : 'Chưa cấu hình xác minh'}
          </p>
          <form onSubmit={saveSettings}>
            <fieldset
              disabled={!canWrite || busy}
              className="studio-task-fields"
            >
              <label className="studio-editor-field">
                <span>Mã xác minh Google</span>
                <textarea
                  rows={4}
                  maxLength={2700}
                  spellCheck={false}
                  value={form.tokens}
                  onChange={(event) =>
                    setForm({ ...form, tokens: event.target.value })
                  }
                />
              </label>
              <label className="studio-technical-checkbox">
                <input
                  type="checkbox"
                  checked={form.blockIndexing}
                  onChange={(event) =>
                    setForm({ ...form, blockIndexing: event.target.checked })
                  }
                />
                <span>Tạm ngừng lập chỉ mục</span>
              </label>
            </fieldset>
            {latest && (
              <section
                className="studio-task-conflict"
                aria-label="Bản trên máy chủ"
              >
                <h3>Bản trên máy chủ · v{latest.version}</h3>
                <p className="studio-technical-path">
                  {latest.googleVerification.join('\n') ||
                    'Không có mã xác minh'}
                </p>
                <p>
                  Tạm ngừng lập chỉ mục: {latest.blockIndexing ? 'Có' : 'Không'}
                </p>
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
              <div className="studio-technical-save">
                <button
                  className="studio-button studio-primary"
                  disabled={busy || !!latest || !dirty}
                >
                  <CheckIcon />
                  {busy ? 'Đang lưu...' : 'Lưu cấu hình SEO'}
                </button>
                {dirty && <span className="studio-muted">Chưa lưu</span>}
              </div>
            )}
          </form>
        </section>
        <section
          className="studio-technical-section"
          aria-labelledby="indexing-heading"
        >
          <h2 id="indexing-heading">Sitemap & lập chỉ mục</h2>
          <dl className="studio-technical-details">
            <dt>Khóa phát hành</dt>
            <dd>
              {data.releaseApproved
                ? 'Đã mở tại máy chủ'
                : 'Đang khóa tại máy chủ'}
            </dd>
            <dt>Robots hiện tại</dt>
            <dd>
              {data.indexable
                ? 'Cho phép thu thập trang công khai'
                : 'Disallow: / · Noindex'}
            </dd>
            <dt>Xác minh sở hữu</dt>
            <dd>Thẻ HTML · URL-prefix</dd>
            <dt>Kết nối dữ liệu Google</dt>
            <dd>Chưa kết nối</dd>
          </dl>
          <div className="studio-technical-links">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
              Sitemap XML <ArrowTopRightOnSquareIcon />
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
              Robots.txt <ArrowTopRightOnSquareIcon />
            </a>
          </div>
          <details className="studio-technical-sitemap">
            <summary>
              {data.sitemapPaths.length} URL canonical đủ điều kiện
            </summary>
            <ul>
              {data.sitemapPaths.map((path) => (
                <li key={path}>
                  <a
                    href={path === '/' ? '/' : `${path}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {path}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </section>
      </div>
      {editing !== undefined && (
        <RedirectDialog
          initial={editing}
          targets={data.targets}
          onClose={() => setEditing(undefined)}
          onSaved={(result) => {
            setData(result)
            setEditing(undefined)
            setMessage('Đã lưu chuyển hướng.')
            setError('')
          }}
        />
      )}
    </div>
  )
}
