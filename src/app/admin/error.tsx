'use client'
export default function StudioError({ reset }: { reset: () => void }) {
  return <div className="studio-empty"><h1>Chưa thể tải nội dung</h1><p>Vui lòng thử lại. Dữ liệu đã lưu không bị thay đổi.</p><button className="studio-button" onClick={reset}>Thử lại</button></div>
}
