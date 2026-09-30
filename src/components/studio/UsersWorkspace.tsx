'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  LockClosedIcon,
  LockOpenIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import type { StudioUser, Role } from '@/lib/studio/auth'

const roleLabels: Record<Role, string> = {
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  seo: 'Chuyên viên SEO',
  viewer: 'Chỉ xem',
}
const roleOptions = Object.entries(roleLabels).map(([value, label]) => (
  <option key={value} value={value}>
    {label}
  </option>
))
type UserChange = {
  id: string
  revision: string
  changes: { role?: Role; status?: StudioUser['status'] }
}

export default function UsersWorkspace({
  users,
  currentId,
}: {
  users: StudioUser[]
  currentId: string
}) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [roles, setRoles] = useState<
    Record<string, { role: Role; revision: string }>
  >({})
  const [conflict, setConflict] = useState<{
    latest: StudioUser
    pending: UserChange
  } | null>(null)
  const conflictPanel = useRef<HTMLElement>(null)
  useEffect(() => {
    if (conflict) conflictPanel.current?.focus()
  }, [conflict])

  function discardRole(id: string) {
    setRoles((previous) => {
      const next = { ...previous }
      delete next[id]
      return next
    })
  }

  async function mutate(method: 'POST' | 'PATCH', body: unknown) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/studio/users/', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (
        response.status === 409 &&
        data.code === 'VERSION_CONFLICT' &&
        method === 'PATCH'
      ) {
        const refreshed = await fetch('/api/studio/users/', {
          cache: 'no-store',
        })
        const current = await refreshed.json()
        if (!refreshed.ok)
          throw new Error(current.error || 'Không thể đối chiếu tài khoản.')
        const pending = body as UserChange
        const latest = (current.users as StudioUser[]).find(
          (user) => user.id === pending.id,
        )
        if (!latest) throw new Error('Không tìm thấy tài khoản để đối chiếu.')
        setConflict({ latest, pending })
        return false
      }
      if (!response.ok) throw new Error(data.error || 'Không thể lưu thay đổi.')
      setMessage('Đã lưu thay đổi.')
      if (method === 'PATCH' && (body as UserChange).changes.role)
        discardRole((body as UserChange).id)
      setConflict(null)
      router.refresh()
      return true
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể kết nối.')
      return false
    } finally {
      setBusy(false)
    }
  }
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const saved = await mutate('POST', Object.fromEntries(values))
    if (saved) {
      form.reset()
      setCreating(false)
    }
  }

  return (
    <>
      <div className="studio-page-heading">
        <div>
          <h1>Đội ngũ & phân quyền</h1>
          <p>{users.length} tài khoản</p>
        </div>
        <button
          className="studio-button studio-primary"
          onClick={() => setCreating(!creating)}
          aria-expanded={creating}
          disabled={busy || !!conflict}
        >
          <PlusIcon />
          Thêm tài khoản
        </button>
      </div>
      {error && (
        <p className="studio-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="studio-success" role="status">
          {message}
        </p>
      )}
      {conflict && (
        <section
          ref={conflictPanel}
          tabIndex={-1}
          className="studio-user-form"
          aria-label="Đối chiếu thay đổi tài khoản"
        >
          <h2>Tài khoản đã được cập nhật</h2>
          <p>
            {conflict.latest.name}: {roleLabels[conflict.latest.role]},{' '}
            {conflict.latest.status === 'active' ? 'Hoạt động' : 'Đã khóa'} trên
            máy chủ.
          </p>
          <p>
            Thay đổi đang soạn:{' '}
            {conflict.pending.changes.role
              ? roleLabels[conflict.pending.changes.role]
              : conflict.pending.changes.status === 'disabled'
                ? 'Khóa tài khoản'
                : 'Mở khóa tài khoản'}
            .
          </p>
          <div className="studio-form-actions">
            <button
              className="studio-button studio-primary"
              disabled={busy}
              onClick={() =>
                mutate('PATCH', {
                  ...conflict.pending,
                  revision: conflict.latest.revision,
                })
              }
            >
              <CheckIcon /> Áp dụng lựa chọn của tôi
            </button>
            <button
              className="studio-button"
              disabled={busy}
              onClick={() => {
                discardRole(conflict.latest.id)
                setConflict(null)
                setError('')
                router.refresh()
              }}
            >
              Dùng bản trên máy chủ
            </button>
          </div>
        </section>
      )}
      {creating && (
        <section className="studio-user-form">
          <h2>Tài khoản mới</h2>
          <form className="studio-form" onSubmit={create}>
            <label>
              Họ và tên
              <input name="name" required minLength={2} maxLength={100} />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="off"
                maxLength={254}
              />
            </label>
            <label>
              Mật khẩu ban đầu
              <input
                name="password"
                type="password"
                required
                minLength={12}
                maxLength={256}
                autoComplete="new-password"
              />
            </label>
            <label>
              Vai trò
              <select name="role" defaultValue="editor">
                {roleOptions}
              </select>
            </label>
            <div className="studio-form-actions">
              <button
                className="studio-button studio-primary"
                disabled={busy || !!conflict}
                type="submit"
              >
                <CheckIcon />
                Tạo tài khoản
              </button>
              <button
                className="studio-button"
                type="button"
                disabled={busy}
                onClick={() => setCreating(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}
      <div className="studio-table-wrap">
        <table className="studio-table studio-users-table" role="table">
          <thead>
            <tr>
              <th scope="col">Thành viên</th>
              <th scope="col">Vai trò</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>
                    {user.name}
                    {user.id === currentId ? ' (Bạn)' : ''}
                  </strong>
                  <small>{user.email}</small>
                </td>
                <td>
                  <span className="studio-user-mobile-label" aria-hidden="true">
                    Vai trò
                  </span>
                  <select
                    aria-label={`Vai trò của ${user.name}`}
                    value={roles[user.id]?.role || user.role}
                    disabled={busy || !!conflict}
                    onChange={(event) =>
                      setRoles({
                        ...roles,
                        [user.id]: {
                          role: event.target.value as Role,
                          revision: roles[user.id]?.revision || user.revision,
                        },
                      })
                    }
                  >
                    {roleOptions}
                  </select>
                </td>
                <td>
                  <span
                    className={`studio-badge ${user.status !== 'active' ? 'studio-badge-off' : ''}`}
                  >
                    {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <div className="studio-form-actions">
                    {roles[user.id] && roles[user.id].role !== user.role && (
                      <button
                        className="studio-icon-button"
                        title="Lưu vai trò"
                        aria-label={`Lưu vai trò của ${user.name}`}
                        disabled={busy || !!conflict}
                        onClick={() =>
                          mutate('PATCH', {
                            id: user.id,
                            revision: roles[user.id].revision,
                            changes: { role: roles[user.id].role },
                          })
                        }
                      >
                        <CheckIcon />
                      </button>
                    )}
                    <button
                      className="studio-icon-button"
                      title={
                        user.status === 'active'
                          ? 'Khóa tài khoản'
                          : 'Mở khóa tài khoản'
                      }
                      aria-label={`${user.status === 'active' ? 'Khóa' : 'Mở khóa'} ${user.name}`}
                      disabled={busy || !!conflict}
                      onClick={() => {
                        if (
                          window.confirm(
                            `${user.status === 'active' ? 'Khóa' : 'Mở khóa'} tài khoản ${user.name}?`,
                          )
                        )
                          mutate('PATCH', {
                            id: user.id,
                            revision: user.revision,
                            changes: {
                              status:
                                user.status === 'active'
                                  ? 'disabled'
                                  : 'active',
                            },
                          })
                      }}
                    >
                      {user.status === 'active' ? (
                        <LockClosedIcon />
                      ) : (
                        <LockOpenIcon />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
