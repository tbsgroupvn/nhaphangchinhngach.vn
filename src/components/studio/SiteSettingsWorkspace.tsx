'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNavigationGuard } from 'next-navigation-guard'
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import {
  siteSettingsSchema,
  type SiteSettings,
  type SiteSettingsDocument,
} from '@/lib/studio/site-settings-model'
import MediaField from './MediaField'
import SiteLinkFields from './SiteLinkFields'

const tabs = ['Thương hiệu', 'Điều hướng', 'Chân trang']
const identityFields = [
  { key: 'name', label: 'Tên doanh nghiệp', max: 60 },
  { key: 'phone', label: 'Số gọi quốc tế', max: 16 },
  { key: 'phoneDisplay', label: 'Số điện thoại hiển thị', max: 24 },
  { key: 'email', label: 'Email liên hệ', max: 254 },
  { key: 'zalo', label: 'Liên kết Zalo', max: 100 },
  { key: 'defaultTitle', label: 'Tiêu đề mặc định', max: 240 },
  { key: 'description', label: 'Mô tả mặc định', max: 1000, rows: 3 },
  { key: 'shareImageAlt', label: 'Mô tả ảnh chia sẻ mặc định', max: 500 },
] as const
const footerFields = [
  { key: 'eyebrow', label: 'Nhãn chân trang', max: 120 },
  { key: 'headline', label: 'Tiêu đề chân trang', max: 180, rows: 2 },
  { key: 'body', label: 'Nội dung chân trang', max: 400, rows: 3 },
  { key: 'tagline', label: 'Giới thiệu dưới logo', max: 240, rows: 2 },
  { key: 'routeLabel', label: 'Tên tuyến thị trường', max: 80 },
] as const
function TextField({
  label,
  value,
  onChange,
  max,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  max: number
  rows?: number
}) {
  const props = {
    'aria-label': label,
    value,
    maxLength: max,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
  }
  return (
    <label className="studio-editor-field">
      <span>{label}</span>
      {rows ? <textarea {...props} rows={rows} /> : <input {...props} />}
    </label>
  )
}
function comparable(settings: SiteSettings) {
  const rows: [string, string][] = identityFields.map((field) => [
    field.label,
    settings.identity[field.key],
  ])
  rows.push(
    ['Logo đầu trang', settings.identity.logo],
    ['Logo chân trang', settings.identity.footerLogo],
    ['Ảnh chia sẻ mặc định', settings.identity.shareImage],
    ['Nhãn nút Zalo', settings.contactLabel],
    ['Tiêu đề liên hệ di động', settings.mobileContactHeading],
  )
  footerFields.forEach((field) =>
    rows.push([field.label, settings.footer[field.key]]),
  )
  const links = (label: string, values: SiteSettings['navigation']) =>
    rows.push([
      label,
      values.map((link) => `${link.label} · ${link.href}`).join('\n'),
    ])
  links('Menu chính', settings.navigation)
  settings.footer.columns.forEach((column, index) => {
    rows.push([`Tên cột ${index + 1}`, column.title])
    links(`Liên kết cột ${index + 1}`, column.links)
  })
  links('Liên kết pháp lý', settings.footer.legalLinks)
  return Object.fromEntries(rows)
}

export default function SiteSettingsWorkspace({
  initial,
}: {
  initial: SiteSettingsDocument
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(initial)
  const [form, setForm] = useState(initial.payload)
  const [latest, setLatest] = useState<SiteSettingsDocument | null>(null)
  const [tab, setTab] = useState(0),
    [busy, setBusy] = useState(false)
  const [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const dirty = JSON.stringify(form) !== JSON.stringify(saved.payload)
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
        'Cấu hình website chưa áp dụng. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  function identity(key: keyof SiteSettings['identity'], value: string) {
    setForm((current) => ({
      ...current,
      identity: { ...current.identity, [key]: value },
    }))
  }
  async function apply(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    const parsed = siteSettingsSchema.safeParse(form)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      setTab(
        issue.path[0] === 'footer'
          ? 2
          : ['navigation', 'contactLabel', 'mobileContactHeading'].includes(
                String(issue.path[0]),
              )
            ? 1
            : 0,
      )
      setError(`Cấu hình chưa hợp lệ: ${issue.message}`)
      return
    }
    if (
      !window.confirm(
        'Áp dụng cấu hình này lên website ngay? Các trang công khai sẽ dùng thông tin mới.',
      )
    )
      return
    setBusy(true)
    try {
      const response = await fetch('/api/studio/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: saved.version, payload: parsed.data }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.code === 'VERSION_CONFLICT') {
          const remote = await fetch('/api/studio/settings/', {
            cache: 'no-store',
          })
          if (remote.ok) setLatest(await remote.json())
        }
        throw new Error(result.error)
      }
      setSaved(result)
      setForm(result.payload)
      setLatest(null)
      pending.current = false
      setMessage('Đã áp dụng cấu hình lên website.')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolve(useRemote: boolean) {
    if (!latest) return
    setSaved(latest)
    if (useRemote) {
      setForm(latest.payload)
      pending.current = false
    }
    setLatest(null)
    setError('')
    setMessage(
      useRemote
        ? 'Đã dùng bản trên máy chủ.'
        : 'Đã giữ bản của anh chị. Chưa áp dụng lên website.',
    )
  }
  const localRows = comparable(form)
  const changes = latest
    ? Object.entries(comparable(latest.payload)).filter(
        ([label, value]) => value !== localRows[label],
      )
    : []
  return (
    <div className="studio-site-settings" data-studio-unsaved={dirty}>
      <div className="studio-page-heading">
        <div>
          <h1>Cấu hình website</h1>
          <p className="studio-muted">
            nhaphangchinhngach.vn · Phiên bản {saved.version}
          </p>
        </div>
        <a
          className="studio-button"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowTopRightOnSquareIcon />
          Xem website
        </a>
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
      <form onSubmit={apply}>
        <div
          className="studio-seo-tabs"
          role="tablist"
          aria-label="Cấu hình website"
        >
          {tabs.map((label, index) => (
            <button
              type="button"
              role="tab"
              id={`site-tab-${index}`}
              aria-controls={`site-panel-${index}`}
              aria-selected={tab === index}
              tabIndex={tab === index ? 0 : -1}
              key={label}
              onClick={() => setTab(index)}
              onKeyDown={(event) => {
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? 2
                      : event.key === 'ArrowRight'
                        ? (index + 1) % 3
                        : event.key === 'ArrowLeft'
                          ? (index + 2) % 3
                          : null
                if (next !== null) {
                  event.preventDefault()
                  setTab(next)
                  document.getElementById(`site-tab-${next}`)?.focus()
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <fieldset disabled={busy}>
          <div
            role="tabpanel"
            id="site-panel-0"
            aria-labelledby="site-tab-0"
            hidden={tab !== 0}
          >
            <section className="studio-site-section">
              <h2>Thông tin doanh nghiệp</h2>
              <div className="studio-site-fields">
                {identityFields.slice(0, 5).map(({ key, ...field }) => (
                  <TextField
                    key={key}
                    {...field}
                    value={form.identity[key]}
                    onChange={(value) => identity(key, value)}
                  />
                ))}
              </div>
            </section>
            <section className="studio-site-section">
              <h2>Nhận diện thương hiệu</h2>
              <div className="studio-site-fields">
                <MediaField
                  label="Logo đầu trang"
                  value={form.identity.logo}
                  onChange={(value) => identity('logo', value)}
                />
                <MediaField
                  label="Logo chân trang"
                  value={form.identity.footerLogo}
                  onChange={(value) => identity('footerLogo', value)}
                />
              </div>
            </section>
            <section className="studio-site-section">
              <h2>SEO mặc định</h2>
              <div className="studio-site-fields">
                {identityFields.slice(5).map(({ key, ...field }) => (
                  <TextField
                    key={key}
                    {...field}
                    value={form.identity[key]}
                    onChange={(value) => identity(key, value)}
                  />
                ))}
                <MediaField
                  label="Ảnh chia sẻ mặc định"
                  value={form.identity.shareImage}
                  onChange={(value) => identity('shareImage', value)}
                />
              </div>
            </section>
          </div>
          <div
            role="tabpanel"
            id="site-panel-1"
            aria-labelledby="site-tab-1"
            hidden={tab !== 1}
          >
            <SiteLinkFields
              label="Menu chính"
              labelMax={24}
              value={form.navigation}
              onChange={(navigation) => setForm({ ...form, navigation })}
            />
            <section className="studio-site-section">
              <h2>Liên hệ nhanh</h2>
              <div className="studio-site-fields">
                <TextField
                  label="Nhãn nút Zalo"
                  max={32}
                  value={form.contactLabel}
                  onChange={(contactLabel) =>
                    setForm({ ...form, contactLabel })
                  }
                />
                <TextField
                  label="Tiêu đề liên hệ di động"
                  max={100}
                  value={form.mobileContactHeading}
                  onChange={(mobileContactHeading) =>
                    setForm({ ...form, mobileContactHeading })
                  }
                />
              </div>
            </section>
          </div>
          <div
            role="tabpanel"
            id="site-panel-2"
            aria-labelledby="site-tab-2"
            hidden={tab !== 2}
          >
            <section className="studio-site-section">
              <h2>Nội dung chân trang</h2>
              <div className="studio-site-fields">
                {footerFields.map(({ key, ...field }) => (
                  <TextField
                    key={key}
                    {...field}
                    value={form.footer[key]}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        footer: { ...form.footer, [key]: value },
                      })
                    }
                  />
                ))}
              </div>
            </section>
            {form.footer.columns.map((column, index) => (
              <section className="studio-site-section" key={index}>
                <TextField
                  label={`Tên cột ${index + 1}`}
                  max={60}
                  value={column.title}
                  onChange={(title) =>
                    setForm({
                      ...form,
                      footer: {
                        ...form.footer,
                        columns: form.footer.columns.map((item, i) =>
                          i === index ? { ...item, title } : item,
                        ),
                      },
                    })
                  }
                />
                <SiteLinkFields
                  label={`Liên kết cột ${index + 1}`}
                  value={column.links}
                  onChange={(links) =>
                    setForm({
                      ...form,
                      footer: {
                        ...form.footer,
                        columns: form.footer.columns.map((item, i) =>
                          i === index ? { ...item, links } : item,
                        ),
                      },
                    })
                  }
                />
              </section>
            ))}
            <SiteLinkFields
              label="Liên kết pháp lý"
              value={form.footer.legalLinks}
              max={4}
              onChange={(legalLinks) =>
                setForm({ ...form, footer: { ...form.footer, legalLinks } })
              }
            />
          </div>
        </fieldset>
        {latest && (
          <section
            className="studio-task-conflict"
            aria-label="Bản trên máy chủ"
          >
            <h2>Bản trên máy chủ · v{latest.version}</h2>
            {changes.length ? (
              <dl className="studio-site-conflicts">
                {changes.map(([label, remote]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      <strong>Bản của tôi</strong>
                      <p>{localRows[label]}</p>
                    </dd>
                    <dd>
                      <strong>Máy chủ</strong>
                      <p>{remote}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>Nội dung giống nhau, phiên bản đã thay đổi.</p>
            )}
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
        <div className="studio-site-save">
          <span className="studio-muted">
            {dirty ? 'Có thay đổi chưa áp dụng' : 'Đồng bộ với website'}
          </span>
          <button
            className="studio-button studio-primary"
            disabled={busy || !dirty || !!latest}
          >
            <CheckIcon />
            {busy ? 'Đang áp dụng...' : 'Áp dụng lên website'}
          </button>
        </div>
      </form>
    </div>
  )
}
