'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { FixedField } from '@/lib/studio/fixed-page-registry'
import MediaField from './MediaField'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()

function fieldLabel(field: Omit<FixedField, 'value'>) {
  const parts = field.key.split('.')
  const item = Number(parts[1]) + 1
  if (parts[0] === 'sections')
    return parts[2] === 'heading'
      ? `Tiêu đề mục ${item}`
      : `Mục ${item} · Đoạn ${Number(parts[3]) + 1}`
  if (parts[0] === 'faqs')
    return `${{ q: 'Câu hỏi', a: 'Câu trả lời', href: 'Liên kết' }[parts[2]] || parts[2]} ${item}`
  if (parts[0] === 'processSteps')
    return `Bước ${item} · ${{ title: 'Tiêu đề', body: 'Nội dung', text: 'Nội dung' }[parts[2]] || parts[2]}`
  if (parts[0] === 'costRows')
    return `Dòng ${item} · ${['Nhóm chi phí', 'Câu hỏi cần làm rõ', 'Căn cứ đối chiếu'][Number(parts[2])]}`
  return field.label
}

export default function FixedPageFields({
  fields,
  values,
  onChange,
}: {
  fields: Omit<FixedField, 'value'>[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}) {
  const [query, setQuery] = useState('')
  const visible = fields.filter((field) =>
    normalize(
      `${fieldLabel(field)} ${field.key} ${values[field.key]}`,
    ).includes(normalize(query)),
  )
  const groups = Array.from(new Set(visible.map((field) => field.group)))
  return (
    <section className="studio-fixed-copy">
      <label className="studio-search">
        <MagnifyingGlassIcon aria-hidden="true" />
        <span className="sr-only">Tìm trường nội dung</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo nội dung hoặc tên trường"
        />
      </label>
      {groups.map((group, index) => (
        <details
          className="studio-copy-group"
          key={`${group}-${!!query}`}
          open={!!query || index === 0}
        >
          <summary>
            {group}
            <small>
              {visible.filter((field) => field.group === group).length} trường
            </small>
          </summary>
          <div>
            {visible
              .filter((field) => field.group === group)
              .map((field) =>
                field.kind === 'image' ? (
                  <MediaField
                    key={field.key}
                    label={fieldLabel(field)}
                    copyKey={field.key}
                    value={values[field.key]}
                    onChange={(value) =>
                      onChange({ ...values, [field.key]: value })
                    }
                  />
                ) : (
                  <label className="studio-editor-field" key={field.key}>
                    <span>{fieldLabel(field)}</span>
                    {field.kind === 'link' ? (
                      <input
                        data-copy-key={field.key}
                        value={values[field.key]}
                        onChange={(event) =>
                          onChange({
                            ...values,
                            [field.key]: event.target.value,
                          })
                        }
                      />
                    ) : (
                      <textarea
                        data-copy-key={field.key}
                        rows={field.kind === 'longtext' ? 4 : 2}
                        value={values[field.key]}
                        onChange={(event) =>
                          onChange({
                            ...values,
                            [field.key]: event.target.value,
                          })
                        }
                      />
                    )}
                  </label>
                ),
              )}
          </div>
        </details>
      ))}
      {!visible.length && (
        <p className="studio-empty">Không có trường phù hợp.</p>
      )}
    </section>
  )
}
