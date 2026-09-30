'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { aiTasks, type AiTask } from '@/lib/studio/ai-generation-model'
import AiNavigation from './AiNavigation'
export default function AiHistoryWorkspace({
  documents,
  records,
}: {
  documents: { id: string; title: string }[]
  records: {
    id: string
    documentId: string
    title: string
    task: AiTask
    status: string
    model: string
    createdAt: string
    appliedCount: number
    usage: { totalTokens: number } | null
  }[]
}) {
  const [id, setId] = useState(documents[0]?.id || ''),
    [filter, setFilter] = useState('all'),
    [busy, start] = useTransition(),
    router = useRouter()
  const visible = records.filter(
    (record) => filter === 'all' || record.status === filter,
  )
  return (
    <div className="studio-knowledge studio-ai-history-workspace">
      <AiNavigation active="generations" />
      <div className="studio-page-heading">
        <div>
          <h1>Đề xuất & lịch sử AI</h1>
          <p className="studio-muted">{records.length} lượt gần nhất</p>
        </div>
        <button
          type="button"
          className="studio-icon-button"
          title="Tải lại lịch sử"
          aria-label="Tải lại lịch sử"
          disabled={busy}
          onClick={() => start(() => router.refresh())}
        >
          <ArrowPathIcon />
        </button>
      </div>
      <div className="studio-ai-document-choice">
        <label>
          Nội dung website
          <select
            aria-label="Nội dung website"
            value={id}
            onChange={(event) => setId(event.target.value)}
          >
            {documents.map((doc) => (
              <option value={doc.id} key={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </label>
        {id && (
          <Link
            className="studio-button studio-primary"
            href={`/admin/content/${id}/?tab=ai`}
          >
            Biên tập với AI
            <ArrowRightIcon />
          </Link>
        )}
      </div>
      <label className="studio-ai-history-filter">
        Trạng thái
        <select
          aria-label="Trạng thái"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="running">Đang tạo</option>
          <option value="completed">Hoàn tất</option>
          <option value="failed">Chưa hoàn tất</option>
        </select>
      </label>
      {!visible.length ? (
        <p className="studio-empty">Chưa có lượt tạo phù hợp.</p>
      ) : (
        <div className="studio-table-wrap">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Nội dung / tác vụ</th>
                <th>Model</th>
                <th>Trạng thái</th>
                <th>Token</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link
                      href={`/admin/content/${item.documentId}/?tab=ai&generation=${item.id}`}
                    >
                      {item.title}
                    </Link>
                    <small>{aiTasks[item.task]}</small>
                  </td>
                  <td>{item.model}</td>
                  <td>
                    {item.status === 'completed'
                      ? `Hoàn tất · ${item.appliedCount} mục đã áp dụng`
                      : item.status === 'running'
                        ? 'Đang tạo'
                        : 'Chưa hoàn tất'}
                  </td>
                  <td>
                    {item.usage?.totalTokens.toLocaleString('vi-VN') ||
                      'Chưa xác nhận'}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
