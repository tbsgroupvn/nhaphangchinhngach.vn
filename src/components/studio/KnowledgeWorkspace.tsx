'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import {
  knowledgeCategories,
  knowledgeStatusNames,
  normalizeKnowledgeText,
  type KnowledgeContext,
  type KnowledgeSummary,
} from '@/lib/studio/ai-knowledge-model'
import AiNavigation from './AiNavigation'
export default function KnowledgeWorkspace({
  initial,
}: {
  initial: KnowledgeSummary[]
}) {
  const [sources, setSources] = useState(initial),
    [search, setSearch] = useState(''),
    [status, setStatus] = useState('all')
  const [query, setQuery] = useState(''),
    [context, setContext] = useState<KnowledgeContext | null>(null)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const queryVersion = useRef(0)
  const visible = sources.filter(
    (item) =>
      (status === 'all' || item.status === status) &&
      normalizeKnowledgeText(
        `${item.title} ${item.sourceName} ${item.tags.join(' ')}`,
      ).includes(normalizeKnowledgeText(search)),
  )
  async function refresh() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/studio/ai/knowledge/', {
        cache: 'no-store',
      })
      const value = await response.json()
      if (!response.ok) throw new Error(value.error)
      setSources(value.sources)
      setContext(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  async function retrieve(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return
    const version = ++queryVersion.current
    setBusy(true)
    setError('')
    setContext(null)
    try {
      const response = await fetch('/api/studio/ai/knowledge/context/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const value = await response.json()
      if (!response.ok) throw new Error(value.error)
      if (version === queryVersion.current) setContext(value)
    } catch (caught) {
      if (version === queryVersion.current)
        setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="studio-knowledge">
      <AiNavigation active="knowledge" />
      <div className="studio-page-heading">
        <div>
          <h1>Kho kiến thức TBS</h1>
          <p className="studio-muted">
            {sources.length} nguồn ·{' '}
            {
              sources.filter((item) =>
                ['approved', 'changes'].includes(item.status),
              ).length
            }{' '}
            đang được duyệt
          </p>
        </div>
        <Link
          className="studio-button studio-primary"
          href="/admin/ai/knowledge/new/"
        >
          <PlusIcon />
          Thêm nguồn
        </Link>
      </div>
      {error && (
        <p role="alert" className="studio-error">
          {error}
        </p>
      )}
      <div className="studio-knowledge-filters">
        <label>
          Tìm nguồn
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          Trạng thái
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">Tất cả</option>
            {Object.entries(knowledgeStatusNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="studio-icon-button"
          aria-label="Tải lại nguồn"
          title="Tải lại nguồn"
          disabled={busy}
          onClick={refresh}
        >
          <ArrowPathIcon />
        </button>
      </div>
      <div className="studio-table-wrap">
        <table className="studio-table studio-knowledge-table">
          <thead>
            <tr>
              <th>Tài liệu</th>
              <th>Phân loại</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/admin/ai/knowledge/${item.id}/`}>
                    {item.title}
                  </Link>
                  <small>{item.sourceName}</small>
                </td>
                <td>{knowledgeCategories[item.category]}</td>
                <td>{knowledgeStatusNames[item.status]}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <p className="studio-empty">
            {sources.length
              ? 'Không có nguồn phù hợp.'
              : 'Chưa có nguồn kiến thức.'}
          </p>
        )}
      </div>
      <section className="studio-knowledge-retrieval">
        <h2>Đối chiếu căn cứ</h2>
        <form onSubmit={retrieve}>
          <label>
            Chủ đề đối chiếu
            <input
              value={query}
              minLength={2}
              maxLength={4000}
              required
              onChange={(event) => {
                queryVersion.current++
                setQuery(event.target.value)
                setContext(null)
              }}
            />
          </label>
          <button className="studio-button" disabled={busy}>
            <MagnifyingGlassIcon />
            {busy ? 'Đang kiểm tra...' : 'Đối chiếu nguồn'}
          </button>
        </form>
        {context && (
          <section
            aria-label="Nguồn phù hợp"
            className="studio-knowledge-matches"
          >
            <p role="status">
              {context.sources.length
                ? `${context.sources.length} nguồn đã duyệt phù hợp`
                : 'Chưa có nguồn đã duyệt phù hợp.'}
            </p>
            {context.sources.map((source) => (
              <article key={source.id}>
                <h3>
                  <Link href={`/admin/ai/knowledge/${source.id}/`}>
                    {source.title}
                  </Link>
                </h3>
                <p className="studio-muted">
                  {source.sourceName} · Bản duyệt {source.version}
                  {source.reviewDue && ` · Rà soát trước ${source.reviewDue}`}
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
                <p className="studio-source-text">{source.excerpt}</p>
              </article>
            ))}
          </section>
        )}
      </section>
    </div>
  )
}
