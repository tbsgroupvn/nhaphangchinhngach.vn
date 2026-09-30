'use client'

import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type { MediaItem } from '@/lib/studio/media-model'
import { searchMedia } from './MediaLibrary'

const builtins = [
  { url: '/images/marketing/containers.webp', title: 'Container TBS', alt: '' },
  { url: '/images/marketing/transport.webp', title: 'Vận chuyển TBS', alt: '' },
  { url: '/images/marketing/sourcing.webp', title: 'Nguồn hàng TBS', alt: '' },
]
function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void
  onClose: () => void
}) {
  const [items, setItems] = useState<MediaItem[]>([]),
    [query, setQuery] = useState('')
  const [tab, setTab] = useState('uploads'),
    [attempt, setAttempt] = useState(0)
  const [loading, setLoading] = useState(true),
    [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetch('/api/studio/media/', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
        setItems(result.items)
      })
      .catch((caught) => {
        if (!controller.signal.aborted)
          setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [attempt])
  const visible = (tab === 'uploads' ? items : builtins).filter((item) =>
    searchMedia(`${item.title} ${item.alt}`).includes(searchMedia(query)),
  )
  return (
    <Dialog open onClose={onClose} className="studio studio-task-dialog">
      <div className="studio-backdrop" aria-hidden="true" />
      <div className="studio-task-dialog-scroll">
        <DialogPanel className="studio-task-panel studio-media-picker">
          <div className="studio-section-heading">
            <DialogTitle as="h2">Chọn ảnh</DialogTitle>
            <button
              type="button"
              className="studio-icon-button"
              aria-label="Đóng chọn ảnh"
              title="Đóng chọn ảnh"
              onClick={onClose}
            >
              <XMarkIcon />
            </button>
          </div>
          <div className="studio-seo-tabs" role="group" aria-label="Nguồn ảnh">
            <button
              type="button"
              aria-pressed={tab === 'uploads'}
              onClick={() => setTab('uploads')}
            >
              Ảnh tải lên
            </button>
            <button
              type="button"
              aria-pressed={tab === 'website'}
              onClick={() => setTab('website')}
            >
              Ảnh website
            </button>
          </div>
          <label className="studio-search">
            <MagnifyingGlassIcon aria-hidden="true" />
            <span className="sr-only">Tìm ảnh</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tên hoặc mô tả ảnh"
            />
          </label>
          {tab === 'uploads' && loading ? (
            <p role="status">Đang tải thư viện...</p>
          ) : (
            <>
              {tab === 'uploads' && error && (
                <div className="studio-error" role="alert">
                  <p>{error}</p>
                  <button
                    type="button"
                    className="studio-button"
                    onClick={() => setAttempt((value) => value + 1)}
                  >
                    <ArrowPathIcon />
                    Thử lại
                  </button>
                </div>
              )}
              <div className="studio-media-grid">
                {visible.map((item) => (
                  <button
                    type="button"
                    className="studio-media-tile"
                    key={item.url}
                    aria-label={`Chọn ${item.title}`}
                    onClick={() => onSelect(item.url)}
                  >
                    <span className="studio-media-thumbnail">
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 40vw, 200px"
                      />
                    </span>
                    <span className="studio-media-caption">
                      <strong>{item.title}</strong>
                    </span>
                  </button>
                ))}
              </div>
              {!error && !visible.length && (
                <p className="studio-empty">Không có ảnh phù hợp.</p>
              )}
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default function MediaField({
  label,
  value,
  onChange,
  copyKey,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  copyKey?: string
}) {
  const id = useId(),
    [open, setOpen] = useState(false)
  return (
    <div className="studio-editor-field studio-media-field">
      <label htmlFor={id}>{label}</label>
      <div>
        <input
          id={id}
          data-copy-key={copyKey}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="studio-icon-button"
          aria-label={`Chọn ảnh: ${label}`}
          title={`Chọn ảnh: ${label}`}
          onClick={() => setOpen(true)}
        >
          <PhotoIcon />
        </button>
      </div>
      {open && (
        <MediaPicker
          onClose={() => setOpen(false)}
          onSelect={(url) => {
            onChange(url)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}
