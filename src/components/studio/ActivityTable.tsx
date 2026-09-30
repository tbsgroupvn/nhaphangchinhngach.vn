import type { Activity } from '@/lib/studio/activity'

const labels: Record<string, string> = {
  'setup.completed': 'Khởi tạo hệ thống',
  'user.created': 'Tạo tài khoản',
  'user.updated': 'Cập nhật tài khoản',
  'session.created': 'Đăng nhập',
  'session.revoked': 'Đăng xuất',
  'content.seeded': 'Khởi tạo nội dung',
  'content.created': 'Tạo bản nháp',
  'content.saved': 'Lưu nội dung',
  'content.seo-saved': 'Lưu SEO',
  'content.published': 'Xuất bản nội dung',
  'content.unpublished': 'Gỡ xuất bản',
  'content.restored': 'Khôi phục bản nháp',
  'seo.audited': 'Quét HTML cho SEO',
  'seo.task-saved': 'Lưu công việc SEO',
  'seo.task-deleted': 'Xóa công việc SEO',
  'seo.settings-saved': 'Lưu cấu hình SEO kỹ thuật',
  'site.applied': 'Áp dụng cấu hình website',
  'templates.applied': 'Áp dụng nội dung mẫu dùng chung',
  'backup.created': 'Tạo bản sao website',
  'backup.checked': 'Kiểm tra bản sao khôi phục',
  'backup.restored': 'Khôi phục website từ bản sao',
  'backup.deleted': 'Xóa tệp sao lưu tạm',
  'redirect.created': 'Tạo chuyển hướng URL',
  'redirect.updated': 'Cập nhật chuyển hướng URL',
  'redirect.deleted': 'Xóa chuyển hướng URL',
}
export default function ActivityTable({ items }: { items: Activity[] }) {
  return (
    <div className="studio-table-wrap">
      <table className="studio-table">
        <thead>
          <tr>
            <th scope="col">Hoạt động</th>
            <th scope="col">Người thực hiện</th>
            <th scope="col">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{labels[item.action] || item.action}</td>
              <td>{item.actor || 'Hệ thống'}</td>
              <td>
                <time dateTime={item.created_at}>
                  {new Date(item.created_at).toLocaleString('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                  })}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <p className="studio-empty">Chưa có hoạt động.</p>}
    </div>
  )
}
