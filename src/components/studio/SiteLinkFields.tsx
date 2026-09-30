'use client'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
type SiteLink = { label: string; href: string }

export default function SiteLinkFields({
  label,
  value,
  onChange,
  max = 6,
  labelMax = 40,
}: {
  label: string
  value: SiteLink[]
  onChange: (value: SiteLink[]) => void
  max?: number
  labelMax?: number
}) {
  function update(index: number, patch: Partial<SiteLink>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )
  }
  function move(index: number, step: number) {
    const next = [...value]
    ;[next[index], next[index + step]] = [next[index + step], next[index]]
    onChange(next)
  }
  return (
    <section className="studio-site-links" aria-label={label}>
      <div className="studio-section-heading">
        <h3>{label}</h3>
        <button
          type="button"
          className="studio-icon-button"
          title={`Thêm mục: ${label}`}
          aria-label={`Thêm mục: ${label}`}
          disabled={value.length >= max}
          onClick={() => onChange([...value, { label: '', href: '/' }])}
        >
          <PlusIcon />
        </button>
      </div>
      <ol>
        {value.map((item, index) => (
          <li key={index}>
            <span className="studio-site-link-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <label className="studio-editor-field">
              <span>Tên mục</span>
              <input
                aria-label={`${label} · Tên mục ${index + 1}`}
                maxLength={labelMax}
                value={item.label}
                onChange={(event) =>
                  update(index, { label: event.target.value })
                }
              />
            </label>
            <label className="studio-editor-field">
              <span>Đường dẫn</span>
              <input
                aria-label={`${label} · Đường dẫn ${index + 1}`}
                maxLength={300}
                value={item.href}
                spellCheck={false}
                onChange={(event) =>
                  update(index, { href: event.target.value })
                }
              />
            </label>
            <div className="studio-site-link-actions">
              <button
                type="button"
                className="studio-icon-button"
                aria-label={`Đưa mục ${index + 1} lên: ${label}`}
                title="Đưa lên"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUpIcon />
              </button>
              <button
                type="button"
                className="studio-icon-button"
                aria-label={`Đưa mục ${index + 1} xuống: ${label}`}
                title="Đưa xuống"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDownIcon />
              </button>
              <button
                type="button"
                className="studio-icon-button"
                aria-label={`Xóa mục ${index + 1}: ${label}`}
                title="Xóa mục"
                disabled={value.length === 1}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                <TrashIcon />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
