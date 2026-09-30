'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  backupConfirmation,
  backupLimit,
  type BackupJob,
  type BackupSummary,
} from '@/lib/studio/backup-model'

const time = (value: string) => new Date(value).toLocaleString('vi-VN')
const size = (bytes: number) =>
  `${(bytes / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} MiB`
function Summary({ value }: { value: BackupSummary }) {
  return (
    <dl className="studio-backup-counts">
      <div>
        <dt>Nội dung</dt>
        <dd>{value.documents}</dd>
      </div>
      <div>
        <dt>Đã xuất bản</dt>
        <dd>{value.publications}</dd>
      </div>
      <div>
        <dt>Phiên bản</dt>
        <dd>{value.revisions}</dd>
      </div>
      <div>
        <dt>Ảnh</dt>
        <dd>{value.media}</dd>
      </div>
      <div>
        <dt>Kế hoạch SEO</dt>
        <dd>{value.tasks}</dd>
      </div>
      <div>
        <dt>Chuyển hướng</dt>
        <dd>{value.redirects}</dd>
      </div>
      <div>
        <dt>Nguồn AI</dt>
        <dd>{value.knowledge}</dd>
      </div>
      <div>
        <dt>Lượt tạo AI</dt>
        <dd>{value.generations}</dd>
      </div>
    </dl>
  )
}
export default function BackupWorkspace({ initial }: { initial: BackupJob[] }) {
  const router = useRouter()
  const [jobs, setJobs] = useState(initial)
  const [review, setReview] = useState<BackupJob | null>(null)
  const [confirmation, setConfirmation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [stale, setStale] = useState(false)
  const [rollbackId, setRollbackId] = useState('')

  function restored(id: string) {
    setReview(null)
    setConfirmation('')
    setRollbackId(id)
    setFile(null)
    setStale(false)
    setError('')
    if (input.current) input.current.value = ''
    setMessage(
      'Đã khôi phục website. Bản sao trước khôi phục đã sẵn sàng tải về.',
    )
    router.refresh()
  }
  async function refresh(reconcile = true) {
    const response = await fetch('/api/studio/backups/', { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    setJobs(data.jobs)
    const completed = (data.jobs as BackupJob[]).find(
      (job) => job.id === review?.id && job.kind === 'restored',
    )
    if (reconcile && completed?.rollbackId) {
      restored(completed.rollbackId)
      return true
    }
    return false
  }
  async function run(
    action: 'export' | 'stage' | 'restore' | 'delete',
    job?: BackupJob,
  ) {
    if (busy) return
    if (
      action === 'restore' &&
      (!review || stale || confirmation !== backupConfirmation)
    )
      return
    if (
      action === 'stage' &&
      (!file || file.size === 0 || file.size > backupLimit)
    ) {
      setError('Chọn tệp sao lưu SQLite không quá 1 GiB.')
      return
    }
    if (
      action === 'restore' &&
      !window.confirm(
        'Thay thế nội dung, ảnh, kế hoạch SEO và cấu hình đang dùng bằng bản sao này? Website công khai cũng thay đổi ngay.',
      )
    )
      return
    if (
      action === 'delete' &&
      !window.confirm(
        'Xóa tệp tạm này khỏi máy chủ? Bản đã tải về máy không bị xóa.',
      )
    )
      return
    setBusy(action)
    setError('')
    setMessage('')
    try {
      const command =
        action === 'restore'
          ? {
              action,
              id: review!.id,
              fingerprint: review!.fingerprint,
              confirmation,
            }
          : action === 'delete'
            ? { id: job!.id }
            : { action }
      const response = await fetch('/api/studio/backups/', {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: {
          'Content-Type':
            action === 'stage' ? 'application/vnd.sqlite3' : 'application/json',
        },
        body: action === 'stage' ? file : JSON.stringify(command),
      })
      const result = await response.json()
      if (!response.ok) {
        if (
          action === 'restore' &&
          ['VERSION_CONFLICT', 'NOT_FOUND', 'INVALID_BACKUP'].includes(
            result.code,
          )
        )
          setStale(true)
        throw new Error(result.error)
      }
      if (action === 'stage') {
        setReview(result.job)
        setConfirmation('')
        setStale(false)
        setMessage('Bản sao hợp lệ. Chưa thay đổi website.')
      } else if (action === 'restore') {
        restored(result.rollbackId)
      } else if (action === 'delete') {
        if (review?.id === job!.id) {
          setReview(null)
          setConfirmation('')
        }
        if (rollbackId === job!.id) setRollbackId('')
        setMessage('Đã xóa tệp tạm.')
      } else setMessage('Đã tạo bản sao website.')
      try {
        await refresh(false)
      } catch {
        setError(
          'Thao tác đã thành công nhưng danh sách chưa cập nhật. Tải lại trang để đối chiếu.',
        )
      }
    } catch (caught) {
      if (action === 'restore') {
        try {
          if (await refresh()) return
        } catch {
          /* Keep the result explicitly uncertain. */
        }
      }
      setError(
        caught instanceof Error
          ? `${action === 'restore' ? 'Chưa xác nhận được kết quả khôi phục. ' : ''}${caught.message}`
          : 'Lỗi kết nối. Tải lại danh sách để kiểm tra trạng thái trước khi thử lại.',
      )
    } finally {
      setBusy('')
    }
  }
  return (
    <div className="studio-backups">
      <div className="studio-page-heading">
        <div>
          <h1>Sao lưu & khôi phục</h1>
          <p className="studio-muted">
            Dữ liệu website · SQLite · Tệp tạm có hiệu lực 2 giờ
          </p>
        </div>
        <button
          className="studio-button studio-primary"
          disabled={!!busy}
          onClick={() => run('export')}
        >
          <CircleStackIcon />
          {busy === 'export' ? 'Đang tạo bản sao…' : 'Tạo bản sao'}
        </button>
      </div>
      {error && (
        <div className="studio-error" role="alert">
          {error}
        </div>
      )}
      <div role="status" className={message ? 'studio-notice' : ''}>
        {message}
      </div>
      {rollbackId && (
        <a
          className="studio-button"
          href={`/api/studio/backups/${rollbackId}/`}
          download
        >
          <ArrowDownTrayIcon />
          Bản sao trước khôi phục
        </a>
      )}
      <section className="studio-backup-section" aria-labelledby="backup-files">
        <div className="studio-section-heading">
          <h2 id="backup-files">Bản sao của tôi</h2>
          <button
            className="studio-icon-button"
            title="Làm mới danh sách"
            aria-label="Làm mới danh sách"
            disabled={!!busy}
            onClick={() => {
              refresh().catch((error) => setError(error.message))
            }}
          >
            <ArrowPathIcon />
          </button>
        </div>
        <p className="studio-muted">
          Không gồm tài khoản, mật khẩu, phiên đăng nhập, khóa AI và nhật ký bảo
          mật. Cấu hình máy chủ và mã nguồn được lưu riêng.
        </p>
        {jobs.length === 0 ? (
          <div className="studio-empty">Chưa có bản sao còn hiệu lực.</div>
        ) : (
          <div className="studio-table-wrap">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Bản sao</th>
                  <th>Nội dung</th>
                  <th>Dung lượng</th>
                  <th>Hết hạn</th>
                  <th>
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <strong>
                        {job.kind === 'export'
                          ? 'Bản xuất website'
                          : job.kind === 'restored'
                            ? 'Đã khôi phục'
                            : 'Bản kiểm tra khôi phục'}
                      </strong>
                      <small>{time(job.sourceCreatedAt)}</small>
                      <small className="studio-backup-mobile-meta">
                        {job.summary.documents} trang · {job.summary.media} ảnh
                        · {size(job.bytes)}
                        <br />
                        Hết hạn: {time(job.expiresAt)}
                      </small>
                    </td>
                    <td>
                      {job.summary.documents} trang · {job.summary.media} ảnh
                    </td>
                    <td>{size(job.bytes)}</td>
                    <td>{time(job.expiresAt)}</td>
                    <td>
                      <div className="studio-backup-row-actions">
                        {job.kind === 'export' ? (
                          <a
                            className="studio-button"
                            download
                            href={`/api/studio/backups/${job.id}/`}
                          >
                            <ArrowDownTrayIcon />
                            Tải bản sao
                          </a>
                        ) : job.kind === 'review' ? (
                          <button
                            className="studio-button"
                            disabled={!!busy}
                            onClick={() => {
                              setReview(job)
                              setConfirmation('')
                              setStale(false)
                              setError('')
                            }}
                          >
                            <CheckBadgeIcon />
                            Xem bản kiểm tra
                          </button>
                        ) : job.rollbackId &&
                          jobs.some((item) => item.id === job.rollbackId) ? (
                          <a
                            className="studio-button"
                            download
                            href={`/api/studio/backups/${job.rollbackId}/`}
                          >
                            <ArrowDownTrayIcon />
                            Bản trước khôi phục
                          </a>
                        ) : null}
                        <button
                          className="studio-icon-button"
                          title="Xóa tệp tạm"
                          aria-label={`Xóa tệp tạm ${job.id}`}
                          disabled={!!busy}
                          onClick={() => run('delete', job)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section
        className="studio-backup-section"
        aria-labelledby="backup-restore"
      >
        <div className="studio-section-heading">
          <h2 id="backup-restore">Khôi phục từ tệp</h2>
        </div>
        <div className="studio-backup-upload">
          <label>
            Tệp sao lưu
            <input
              ref={input}
              type="file"
              accept=".sqlite,application/vnd.sqlite3"
              disabled={!!busy}
              onChange={(event) => {
                setFile(event.target.files?.[0] || null)
                setReview(null)
                setConfirmation('')
                setStale(false)
              }}
            />
          </label>
          <button
            className="studio-button"
            disabled={!!busy || !file}
            onClick={() => run('stage')}
          >
            <ArrowUpTrayIcon />
            {busy === 'stage' ? 'Đang kiểm tra…' : 'Kiểm tra bản sao'}
          </button>
        </div>
        {file && (
          <p className="studio-muted studio-backup-filename">
            {file.name} · {size(file.size)}
          </p>
        )}
        {review && (
          <div className="studio-backup-review">
            <h2>Bản sao đã kiểm tra</h2>
            <p className="studio-muted">
              Thời điểm dữ liệu: {time(review.sourceCreatedAt)} ·{' '}
              {size(review.bytes)}
            </p>
            <Summary value={review.summary} />
            <p className="studio-notice">
              Khôi phục sẽ thay thế toàn bộ nội dung nháp, nội dung công khai,
              ảnh, chuyển hướng, kế hoạch SEO và cấu hình website. Tài khoản,
              khóa bí mật và nhật ký hiện tại được giữ nguyên. Báo cáo quét SEO
              cần chạy lại.
            </p>
            {stale && (
              <p className="studio-error">
                Bản kiểm tra không còn dùng được. Đối chiếu nhật ký và kiểm tra
                lại tệp trước khi tiếp tục.
              </p>
            )}
            <label>
              Xác nhận khôi phục
              <input
                aria-label="Xác nhận khôi phục"
                value={confirmation}
                disabled={!!busy || stale}
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setConfirmation(event.target.value)}
              />
              <small>{backupConfirmation}</small>
            </label>
            <button
              className="studio-button studio-danger"
              disabled={!!busy || stale || confirmation !== backupConfirmation}
              onClick={() => run('restore')}
            >
              <ArrowPathIcon />
              {busy === 'restore' ? 'Đang khôi phục…' : 'Khôi phục website'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
