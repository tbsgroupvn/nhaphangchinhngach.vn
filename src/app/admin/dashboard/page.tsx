import Link from 'next/link'
import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'
import { can } from '@/lib/studio/auth'
import ActivityTable from '@/components/studio/ActivityTable'
import { recentActivity } from '@/lib/studio/activity'

export default function DashboardPage() {
  const user = requirePageUser()
  const { db, content, seo } = getStudio()
  const documents = content.list()
  const counts = {
    total: documents.length,
    published: documents.filter((item) => item.publishedPath).length,
    drafts: documents.filter((item) => item.status !== 'published').length,
  }
  const seoAttention = seo
    .overview()
    .filter((row) =>
      row.issues.some((issue) => issue.severity !== 'info'),
    ).length
  const tasks = seo.tasks().filter((task) => task.status !== 'done')
  const activity = can(user, 'audit.read') ? recentActivity(db, 8) : []
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-kicker">WEBSITE / TBS GROUP</p>
          <h1>Tổng quan</h1>
          <p>Xin chào, {user.name}.</p>
        </div>
        <span className="studio-badge studio-badge-off">
          Bản nội bộ · Noindex
        </span>
      </div>
      <div className="studio-metrics studio-dashboard-metrics">
        <div className="studio-metric">
          <span>Tổng nội dung</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="studio-metric">
          <span>Đã xuất bản</span>
          <strong>{counts.published}</strong>
        </div>
        <div className="studio-metric">
          <span>Chưa xuất bản / có thay đổi</span>
          <strong>{counts.drafts}</strong>
        </div>
        <Link href="/admin/seo/" className="studio-metric">
          <span>Trang cần xem lại SEO</span>
          <strong>{seoAttention}</strong>
        </Link>
      </div>
      <section className="studio-dashboard-tasks">
        <div className="studio-section-heading">
          <h2>Công việc nội dung · {tasks.length}</h2>
          <Link href="/admin/seo/?view=planner">Xem kế hoạch</Link>
        </div>
        <div className="studio-table-wrap">
          <table className="studio-table">
            <thead>
              <tr>
                <th scope="col">Công việc</th>
                <th scope="col">Từ khóa</th>
                <th scope="col">Hạn hoàn thành</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task) => (
                <tr key={task.id}>
                  <td>
                    <Link href="/admin/seo/?view=planner">{task.title}</Link>
                  </td>
                  <td>{task.keyword}</td>
                  <td>{task.dueDate || 'Chưa đặt hạn'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!tasks.length && (
            <p className="studio-empty">Chưa có công việc đang mở.</p>
          )}
        </div>
      </section>
      {can(user, 'audit.read') && (
        <section>
          <div className="studio-section-heading">
            <h2>Hoạt động gần đây</h2>
            <Link href="/admin/activity/">Xem tất cả</Link>
          </div>
          <ActivityTable items={activity} />
        </section>
      )}
    </>
  )
}
