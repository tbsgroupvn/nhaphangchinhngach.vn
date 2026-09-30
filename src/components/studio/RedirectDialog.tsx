'use client'

import { useRef, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useNavigationGuard } from 'next-navigation-guard'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  redirectSchema,
  type RedirectInput,
  type RedirectRule,
  type TechnicalSeoData,
} from '@/lib/studio/technical-seo-model'

const payloadOf = (item: RedirectRule): RedirectInput => ({
  source: item.source,
  targetId: item.targetId,
  status: item.status,
})
export default function RedirectDialog({
  initial,
  targets,
  onClose,
  onSaved,
}: {
  initial: RedirectRule | null
  targets: TechnicalSeoData['targets']
  onClose: () => void
  onSaved: (data: TechnicalSeoData) => void
}) {
  const [id, setId] = useState(initial?.id || null)
  const [version, setVersion] = useState(initial?.version || 0)
  const [original, setOriginal] = useState<RedirectInput>(
    initial ? payloadOf(initial) : { source: '', targetId: '', status: 308 },
  )
  const [form, setForm] = useState(original)
  const [targetOptions, setTargetOptions] = useState(targets)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const [latest, setLatest] = useState<RedirectRule | null | undefined>(
    undefined,
  )
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
        'Chuyển hướng chưa lưu. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  function close() {
    if (
      busy ||
      (dirty && !window.confirm('Chuyển hướng chưa lưu. Đóng và bỏ thay đổi?'))
    )
      return
    pending.current = false
    onClose()
  }
  async function save(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    const parsed = redirectSchema.safeParse(form)
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
          action: 'save-redirect',
          id,
          version,
          payload: parsed.data,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.code === 'VERSION_CONFLICT' || result.code === 'NOT_FOUND') {
          const refresh = await fetch('/api/studio/seo/technical/', {
            cache: 'no-store',
          })
          if (refresh.ok) {
            const data: TechnicalSeoData = await refresh.json()
            setTargetOptions(data.targets)
            setLatest(data.redirects.find((item) => item.id === id) || null)
          }
        }
        throw new Error(result.error)
      }
      pending.current = false
      onSaved(result)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolve(useRemote: boolean) {
    if (latest === undefined) return
    setId(latest?.id || null)
    setVersion(latest?.version || 0)
    const remote = latest
      ? payloadOf(latest)
      : { source: '', targetId: '', status: 308 as const }
    setOriginal(remote)
    if (useRemote) setForm(remote)
    setLatest(undefined)
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
        <DialogPanel className="studio-task-panel">
          <div className="studio-section-heading">
            <DialogTitle as="h2">
              {initial ? 'Chỉnh sửa chuyển hướng' : 'Chuyển hướng mới'}
            </DialogTitle>
            <button
              type="button"
              className="studio-icon-button"
              title="Đóng chuyển hướng"
              aria-label="Đóng chuyển hướng"
              disabled={busy}
              onClick={close}
            >
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={save}>
            <fieldset disabled={busy} className="studio-task-fields">
              <label className="studio-editor-field">
                <span>URL nguồn</span>
                <input
                  required
                  maxLength={500}
                  value={form.source}
                  placeholder="/duong-dan-cu"
                  onChange={(event) =>
                    setForm({ ...form, source: event.target.value })
                  }
                />
              </label>
              <label className="studio-editor-field">
                <span>Trang đích</span>
                <select
                  aria-label="Trang đích"
                  required
                  value={form.targetId}
                  onChange={(event) =>
                    setForm({ ...form, targetId: event.target.value })
                  }
                >
                  <option value="">Chọn trang đã xuất bản</option>
                  {targetOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} · {item.path}
                    </option>
                  ))}
                </select>
              </label>
              <label className="studio-editor-field">
                <span>Loại chuyển hướng</span>
                <select
                  aria-label="Loại chuyển hướng"
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: Number(event.target.value) as 307 | 308,
                    })
                  }
                >
                  <option value={308}>308 · Vĩnh viễn</option>
                  <option value={307}>307 · Tạm thời</option>
                </select>
              </label>
            </fieldset>
            {error && (
              <p role="alert" className="studio-error">
                {error}
              </p>
            )}
            {latest !== undefined && (
              <section
                className="studio-task-conflict"
                aria-label="Bản trên máy chủ"
              >
                <h3>
                  Bản trên máy chủ
                  {latest ? ` · v${latest.version}` : ' · Đã xóa'}
                </h3>
                {latest && (
                  <p className="studio-technical-path">
                    {latest.source} → {latest.targetPath} · {latest.status}
                  </p>
                )}
                <div className="studio-task-conflict-actions">
                  <button
                    type="button"
                    className="studio-button"
                    onClick={() => resolve(false)}
                  >
                    {latest ? 'Giữ bản của tôi' : 'Tạo lại từ bản này'}
                  </button>
                  {latest && (
                    <button
                      type="button"
                      className="studio-button"
                      onClick={() => resolve(true)}
                    >
                      Dùng bản trên máy chủ
                    </button>
                  )}
                </div>
              </section>
            )}
            <div className="studio-task-footer">
              <button
                type="button"
                className="studio-button"
                disabled={busy}
                onClick={close}
              >
                Hủy
              </button>
              <button
                className="studio-button studio-primary"
                disabled={busy || latest !== undefined}
              >
                <CheckIcon />
                {busy ? 'Đang lưu...' : 'Lưu chuyển hướng'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
