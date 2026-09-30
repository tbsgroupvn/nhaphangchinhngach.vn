'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigationGuard } from 'next-navigation-guard'
import {
  mediaMetadataSchema,
  type MediaItem,
  type MediaMetadata,
  type MediaUsage,
} from '@/lib/studio/media-model'

const metadataOf = ({ title, alt, source }: MediaItem): MediaMetadata => ({
  title,
  alt,
  source,
})
const locationNames = {
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
  history: 'Lịch sử',
}
export default function MediaDialog({
  initial,
  canWrite,
  onClose,
  onSaved,
  onUpdated,
  onDeleted,
}: {
  initial: MediaItem
  canWrite: boolean
  onClose: () => void
  onSaved: (item: MediaItem) => void
  onUpdated: (item: MediaItem) => void
  onDeleted: (id: string) => void
}) {
  const [item, setItem] = useState(initial),
    [form, setForm] = useState(metadataOf(initial))
  const [usage, setUsage] = useState<MediaUsage[] | null>(null)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const [latest, setLatest] = useState<MediaItem | null>(null)
  const [deleted, setDeleted] = useState(false)
  const dirty = JSON.stringify(form) !== JSON.stringify(metadataOf(item))
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
        'Thông tin ảnh chưa lưu. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/studio/media/?id=${initial.id}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
        setUsage(result.usage)
      })
      .catch((caught) => {
        if (!controller.signal.aborted)
          setError(
            caught instanceof Error
              ? caught.message
              : 'Không tải được nơi sử dụng ảnh.',
          )
      })
    return () => controller.abort()
  }, [initial.id])
  function close() {
    if (
      busy ||
      (dirty && !window.confirm('Thông tin ảnh chưa lưu. Đóng và bỏ thay đổi?'))
    )
      return
    pending.current = false
    onClose()
  }
  async function mutate(remove: boolean) {
    const parsed = mediaMetadataSchema.safeParse(form)
    if (!remove && !parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (
      remove &&
      !window.confirm(
        `Xóa ảnh “${item.title}”? Thao tác này không thể hoàn tác.`,
      )
    )
      return
    setBusy(true)
    setError('')
    try {
      const response = await fetch(item.url, {
        method: remove ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          remove
            ? { version: item.version }
            : {
                version: item.version,
                payload: parsed.success ? parsed.data : form,
              },
        ),
      })
      const result = await response.json()
      if (!response.ok) {
        if (
          result.code === 'VERSION_CONFLICT' ||
          result.code === 'MEDIA_IN_USE'
        ) {
          const refresh = await fetch(`/api/studio/media/?id=${item.id}`, {
            cache: 'no-store',
          })
          if (refresh.ok) {
            const remote = await refresh.json()
            setUsage(remote.usage)
            if (result.code === 'VERSION_CONFLICT') setLatest(remote.item)
          }
        }
        if (result.code === 'NOT_FOUND') setDeleted(true)
        throw new Error(result.error)
      }
      pending.current = false
      if (remove) onDeleted(item.id)
      else onSaved(result.item)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolve(useRemote: boolean) {
    if (!latest) return
    setItem(latest)
    onUpdated(latest)
    if (useRemote) setForm(metadataOf(latest))
    setLatest(null)
    setError('')
  }
  return (
    <Dialog
      open
      onClose={close}
      className="studio studio-task-dialog"
      data-studio-unsaved={dirty}
    >
      <div className="studio-backdrop" aria-hidden="true" />
      <div className="studio-task-dialog-scroll">
        <DialogPanel className="studio-task-panel studio-media-panel">
          <div className="studio-section-heading">
            <DialogTitle as="h2">Thông tin ảnh</DialogTitle>
            <button
              type="button"
              className="studio-icon-button"
              aria-label="Đóng thông tin ảnh"
              title="Đóng thông tin ảnh"
              disabled={busy}
              onClick={close}
            >
              <XMarkIcon />
            </button>
          </div>
          <div className="studio-media-detail">
            <div className="studio-media-preview">
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(max-width: 760px) 90vw, 300px"
              />
            </div>
            <div>
              <strong>{item.filename}</strong>
              <p>
                {item.width} × {item.height} · WebP · v{item.version}
              </p>
              <p>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void mutate(false)
            }}
          >
            <fieldset
              className="studio-task-fields"
              disabled={!canWrite || busy || deleted}
            >
              <label className="studio-editor-field">
                <span>Tên ảnh</span>
                <input
                  required
                  maxLength={160}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </label>
              <label className="studio-editor-field">
                <span>Mô tả thay thế</span>
                <textarea
                  aria-label="Mô tả thay thế"
                  rows={3}
                  maxLength={500}
                  value={form.alt}
                  onChange={(event) =>
                    setForm({ ...form, alt: event.target.value })
                  }
                />
              </label>
              <label className="studio-editor-field">
                <span>Nguồn ảnh</span>
                <input
                  maxLength={500}
                  value={form.source}
                  onChange={(event) =>
                    setForm({ ...form, source: event.target.value })
                  }
                />
              </label>
            </fieldset>
            <section
              className="studio-media-usage"
              aria-label="Nơi sử dụng ảnh"
            >
              <h3>Nơi sử dụng</h3>
              {usage === null ? (
                <p>Đang tải...</p>
              ) : usage.length ? (
                <ul>
                  {usage.map((row) => (
                    <li key={row.documentId}>
                      <Link
                        href={
                          row.editorPath || `/admin/content/${row.documentId}/`
                        }
                      >
                        {row.title}
                      </Link>
                      <small>
                        {row.locations
                          .map((location) => locationNames[location])
                          .join(' · ')}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Chưa có nội dung sử dụng ảnh.</p>
              )}
            </section>
            {error && (
              <p role="alert" className="studio-error">
                {error}
              </p>
            )}
            {latest && (
              <section
                className="studio-task-conflict"
                aria-label="Bản trên máy chủ"
              >
                <h3>Bản trên máy chủ · v{latest.version}</h3>
                <p>{latest.title}</p>
                <p>{latest.alt || 'Chưa có mô tả thay thế'}</p>
                <p>{latest.source}</p>
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
            <div className="studio-task-footer studio-media-footer">
              {canWrite && (
                <button
                  type="button"
                  className="studio-button studio-danger"
                  disabled={
                    busy ||
                    deleted ||
                    !!latest ||
                    usage === null ||
                    usage.length > 0
                  }
                  onClick={() => void mutate(true)}
                >
                  <TrashIcon />
                  Xóa ảnh
                </button>
              )}
              <button
                type="button"
                className="studio-button"
                disabled={busy}
                onClick={close}
              >
                Đóng
              </button>
              {canWrite && (
                <button
                  className="studio-button studio-primary"
                  disabled={busy || deleted || !!latest}
                >
                  <CheckIcon />
                  {busy ? 'Đang xử lý...' : 'Lưu thông tin ảnh'}
                </button>
              )}
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
