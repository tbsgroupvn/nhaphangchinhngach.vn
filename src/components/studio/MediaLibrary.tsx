'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ArrowPathIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import type { MediaItem } from '@/lib/studio/media-model'
import { uploadLimit } from '@/lib/studio/media-model'
import MediaDialog from './MediaDialog'

export const searchMedia = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
export const mediaSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`

export default function MediaLibrary({
  initial,
  canWrite,
}: {
  initial: MediaItem[]
  canWrite: boolean
}) {
  const [items, setItems] = useState(initial)
  const [query, setQuery] = useState(''),
    [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          (filter !== 'missing-alt' || !item.alt) &&
          searchMedia(
            `${item.title} ${item.filename} ${item.alt} ${item.source}`,
          ).includes(searchMedia(query)),
      ),
    [items, query, filter],
  )
  async function refresh() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/studio/media/', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setItems(data.items)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  async function upload(file?: File) {
    if (!file) return
    setError('')
    setMessage('')
    if (file.size > uploadLimit) {
      setError('Ảnh vượt giới hạn 8 MB.')
      return
    }
    setBusy(true)
    try {
      const response = await fetch('/api/studio/media/', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'x-file-name': encodeURIComponent(file.name),
        },
        body: file,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setItems((current) => [result.item, ...current])
      setMessage(`Đã tải ảnh ${result.item.title}.`)
      setFilter('all')
      setQuery('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <h1>Thư viện ảnh</h1>
          <p>
            {items.length} ảnh ·{' '}
            {mediaSize(items.reduce((total, item) => total + item.bytes, 0))} /
            512 MB
          </p>
        </div>
        {canWrite && (
          <div className="studio-media-upload">
            <input
              ref={input}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              aria-label="Tải ảnh lên"
              disabled={busy}
              onChange={(event) => void upload(event.target.files?.[0])}
            />
            <button
              type="button"
              className="studio-button studio-primary"
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              <ArrowUpTrayIcon />
              {busy ? 'Đang xử lý...' : 'Tải ảnh lên'}
            </button>
          </div>
        )}
      </div>
      <div className="studio-media-toolbar">
        <label className="studio-search">
          <MagnifyingGlassIcon aria-hidden="true" />
          <span className="sr-only">Tìm ảnh</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tên, mô tả hoặc nguồn ảnh"
          />
        </label>
        <select
          aria-label="Lọc ảnh"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">Tất cả ảnh</option>
          <option value="missing-alt">Chưa có mô tả thay thế</option>
        </select>
        <button
          type="button"
          className="studio-icon-button"
          title="Làm mới thư viện"
          aria-label="Làm mới thư viện"
          disabled={busy}
          onClick={refresh}
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
      <div className="studio-media-grid">
        {visible.map((item) => (
          <button
            type="button"
            key={item.id}
            className="studio-media-tile"
            aria-label={`${canWrite ? 'Chỉnh sửa' : 'Xem'} ${item.title}`}
            onClick={() => setSelected(item)}
          >
            <span className="studio-media-thumbnail">
              <Image
                src={item.url}
                alt=""
                fill
                sizes="(max-width: 600px) 45vw, 240px"
              />
            </span>
            <span className="studio-media-caption">
              <strong>{item.title}</strong>
              <small>
                {item.width} × {item.height} · {mediaSize(item.bytes)}
              </small>
              <small className={!item.alt ? 'studio-media-warning' : ''}>
                {item.alt ? 'Có mô tả thay thế' : 'Chưa có mô tả thay thế'}
              </small>
            </span>
          </button>
        ))}
      </div>
      {!visible.length && (
        <div className="studio-empty studio-media-empty">
          <PhotoIcon />
          <p>
            {items.length
              ? 'Không tìm thấy ảnh phù hợp.'
              : 'Thư viện chưa có ảnh tải lên.'}
          </p>
        </div>
      )}
      {selected && (
        <MediaDialog
          key={selected.id}
          initial={selected}
          canWrite={canWrite}
          onClose={() => setSelected(null)}
          onUpdated={(item) => setItems(current => current.map(row => row.id === item.id ? item : row))}
          onSaved={(item) => {
            setItems((current) =>
              current.map((row) => (row.id === item.id ? item : row)),
            )
            setSelected(null)
            setMessage('Đã lưu thông tin ảnh.')
          }}
          onDeleted={(id) => {
            setItems((current) => current.filter((item) => item.id !== id))
            setSelected(null)
            setMessage('Đã xóa ảnh.')
          }}
        />
      )}
    </>
  )
}
