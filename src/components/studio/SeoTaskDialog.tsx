'use client'

import { useRef, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useNavigationGuard } from 'next-navigation-guard'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  taskStatuses,
  taskStatusLabels,
  type SeoTask,
  type SeoTaskInput,
} from '@/lib/studio/seo-model'

const blank: SeoTaskInput = {
  keyword: '',
  title: '',
  documentId: null,
  assigneeId: null,
  dueDate: '',
  status: 'planned',
  notes: '',
}
function taskInput(task: SeoTask): SeoTaskInput {
  return {
    keyword: task.keyword,
    title: task.title,
    documentId: task.documentId,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate,
    status: task.status,
    notes: task.notes,
  }
}
export default function SeoTaskDialog({
  initial,
  documents,
  assignees,
  onClose,
  onSaved,
}: {
  initial: SeoTask | null
  documents: { id: string; title: string }[]
  assignees: { id: string; name: string }[]
  onClose: () => void
  onSaved: (task: SeoTask) => void
}) {
  const [original, setOriginal] = useState<SeoTaskInput>(
    initial ? taskInput(initial) : blank,
  )
  const [version, setVersion] = useState(initial?.version || 0),
    [id, setId] = useState(initial?.id || null)
  const [conflict, setConflict] = useState(false),
    [latest, setLatest] = useState<SeoTask | null>(null),
    [deleted, setDeleted] = useState(false)
  const [form, setForm] = useState(original),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const dirty = JSON.stringify(form) !== JSON.stringify(original),
    pending = useRef(dirty)
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
        'Công việc chưa được lưu. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  const change = (patch: Partial<SeoTaskInput>) =>
    setForm((current) => ({ ...current, ...patch }))
  function close() {
    if (!busy && (!dirty || window.confirm('Bỏ các thay đổi chưa lưu?')))
      onClose()
  }
  async function compare() {
    setBusy(true)
    try {
      const response = await fetch(`/api/studio/seo/tasks/?id=${id}`),
        data = await response.json()
      if (response.status === 404) {
        setDeleted(true)
        throw new Error(data.error)
      }
      if (!response.ok)
        throw new Error(data.error || 'Chưa đọc được phiên bản mới.')
      setLatest(data.task)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
  }
  function resolveConflict(useRemote: boolean) {
    if (!latest) return
    const remote = taskInput(latest)
    setVersion(latest.version)
    setOriginal(remote)
    if (useRemote) setForm(remote)
    setConflict(false)
    setLatest(null)
    setError('')
  }
  async function save(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/studio/seo/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          id,
          version,
          payload: form,
        }),
      })
      const data = await response.json()
      if (response.status === 409) {
        setConflict(true)
        setLatest(null)
      }
      if (!response.ok) throw new Error(data.error || 'Chưa thể lưu công việc.')
      pending.current = false
      onSaved(data.task)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy(false)
    }
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
              {initial ? 'Chỉnh sửa công việc' : 'Công việc mới'}
            </DialogTitle>
            <button
              type="button"
              className="studio-icon-button"
              aria-label="Đóng công việc"
              title="Đóng công việc"
              onClick={close}
              disabled={busy}
            >
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={save}>
            <fieldset disabled={busy} className="studio-task-fields">
              <label className="studio-editor-field">
                <span>Từ khóa chính</span>
                <input
                  required
                  maxLength={200}
                  value={form.keyword}
                  onChange={(event) => change({ keyword: event.target.value })}
                />
              </label>
              <label className="studio-editor-field">
                <span>Công việc</span>
                <input
                  required
                  maxLength={240}
                  value={form.title}
                  onChange={(event) => change({ title: event.target.value })}
                />
              </label>
              <label className="studio-editor-field">
                <span>Nội dung liên quan</span>
                <select
                  aria-label="Nội dung liên quan"
                  value={form.documentId || ''}
                  onChange={(event) =>
                    change({ documentId: event.target.value || null })
                  }
                >
                  <option value="">Chưa gắn trang</option>
                  {documents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="studio-task-pair">
                <label className="studio-editor-field">
                  <span>Người phụ trách</span>
                  <select
                    aria-label="Người phụ trách"
                    value={form.assigneeId || ''}
                    onChange={(event) =>
                      change({ assigneeId: event.target.value || null })
                    }
                  >
                    <option value="">Chưa phân công</option>
                    {assignees.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="studio-editor-field">
                  <span>Hạn hoàn thành</span>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      change({ dueDate: event.target.value })
                    }
                  />
                </label>
              </div>
              <label className="studio-editor-field">
                <span>Trạng thái công việc</span>
                <select
                  aria-label="Trạng thái công việc"
                  value={form.status}
                  onChange={(event) =>
                    change({
                      status: event.target.value as SeoTaskInput['status'],
                    })
                  }
                >
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {taskStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="studio-editor-field">
                <span>Ghi chú & nguồn tham khảo</span>
                <textarea
                  rows={4}
                  maxLength={5000}
                  value={form.notes}
                  onChange={(event) => change({ notes: event.target.value })}
                />
              </label>
            </fieldset>
            {error && (
              <p className="studio-error" role="alert">
                {error}
              </p>
            )}
            {conflict && !latest && !deleted && (
              <button
                type="button"
                className="studio-button"
                disabled={busy}
                onClick={compare}
              >
                Đối chiếu bản mới
              </button>
            )}
            {latest && (
              <section
                className="studio-task-conflict"
                aria-label="Bản đang lưu trên máy chủ"
              >
                <h3>Bản đang lưu trên máy chủ · v{latest.version}</h3>
                <dl>
                  <dt>Công việc</dt>
                  <dd>{latest.title}</dd>
                  <dt>Từ khóa</dt>
                  <dd>{latest.keyword}</dd>
                  <dt>Nội dung</dt>
                  <dd>
                    {documents.find((item) => item.id === latest.documentId)
                      ?.title || 'Chưa gắn trang'}
                  </dd>
                  <dt>Người phụ trách</dt>
                  <dd>
                    {assignees.find((item) => item.id === latest.assigneeId)
                      ?.name || 'Chưa phân công'}
                  </dd>
                  <dt>Hạn hoàn thành</dt>
                  <dd>{latest.dueDate || 'Chưa đặt hạn'}</dd>
                  <dt>Trạng thái</dt>
                  <dd>{taskStatusLabels[latest.status]}</dd>
                  <dt>Ghi chú</dt>
                  <dd>{latest.notes || 'Không có'}</dd>
                </dl>
                <div className="studio-task-conflict-actions">
                  <button
                    type="button"
                    className="studio-button"
                    disabled={busy}
                    onClick={() => resolveConflict(false)}
                  >
                    Giữ bản của tôi trên phiên bản mới
                  </button>
                  <button
                    type="button"
                    className="studio-button"
                    disabled={busy}
                    onClick={() => resolveConflict(true)}
                  >
                    Dùng bản trên máy chủ
                  </button>
                </div>
              </section>
            )}
            {deleted && (
              <button
                type="button"
                className="studio-button"
                disabled={busy}
                onClick={() => {
                  setId(null)
                  setVersion(0)
                  setOriginal(blank)
                  setConflict(false)
                  setDeleted(false)
                  setError('')
                }}
              >
                Tạo lại từ bản này
              </button>
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
                disabled={busy || conflict}
              >
                <CheckIcon />
                {busy ? 'Đang lưu...' : 'Lưu công việc'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
