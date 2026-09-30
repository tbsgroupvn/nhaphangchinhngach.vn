'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import type { ContentSummary } from '@/lib/studio/content-model'
import { contentKindLabels } from '@/lib/studio/content-labels'

export const contentStatusLabels = {
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
  changed: 'Có thay đổi',
  archived: 'Đã lưu trữ',
}
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()

export default function ContentInventory({
  items,
  canWrite,
}: {
  items: ContentSummary[]
  canWrite: boolean
}) {
  const [query, setQuery] = useState(''),
    [kind, setKind] = useState(''),
    [status, setStatus] = useState('')
  const editorialItems = items.filter(
    (item) => item.kind !== 'industry' && item.kind !== 'industryCategory',
  )
  const visible = editorialItems.filter(
    (item) =>
      (!kind || item.kind === kind) &&
      (!status || item.status === status) &&
      normalize(`${item.title} ${item.path}`).includes(normalize(query)),
  )
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-kicker">BIÊN TẬP / WEBSITE</p>
          <h1>Nội dung website</h1>
          <p>{editorialItems.length} nội dung biên tập</p>
        </div>
        <div className="studio-heading-actions">
          <Link className="studio-button studio-button-secondary" href="/admin/industries/">
            Industry Atlas
          </Link>
          {canWrite && (
            <Link className="studio-button" href="/admin/content/new/">
              <PlusIcon />
              Bài viết mới
            </Link>
          )}
        </div>
      </div>
      <div className="studio-content-filters">
        <label className="studio-search">
          <MagnifyingGlassIcon />
          <span className="sr-only">Tìm nội dung</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tên trang hoặc đường dẫn"
          />
        </label>
        <label>
          <span className="sr-only">Loại nội dung</span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
          >
            <option value="">Tất cả loại</option>
            {Object.entries(contentKindLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Trạng thái nội dung</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(contentStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="studio-table-wrap">
        <table className="studio-table studio-content-table">
          <thead>
            <tr>
              <th scope="col">Nội dung</th>
              <th scope="col">Loại</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Phiên bản</th>
              <th scope="col">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/admin/content/${item.id}/`}>
                    <PencilSquareIcon />
                    {item.title}
                  </Link>
                  <small>{item.path}</small>
                </td>
                <td>{contentKindLabels[item.kind]}</td>
                <td>
                  <span
                    className={`studio-badge ${item.status === 'published' ? '' : 'studio-badge-off'}`}
                  >
                    {contentStatusLabels[item.status]}
                  </span>
                </td>
                <td>v{item.version}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!visible.length && (
        <p className="studio-empty">Không có nội dung phù hợp.</p>
      )}
    </>
  )
}
