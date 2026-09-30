'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ArrowTopRightOnSquareIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ChartBarSquareIcon,
  ClockIcon,
  Cog6ToothIcon,
  CircleStackIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  UsersIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import type { StudioUser } from '@/lib/studio/auth'

const navigation = [
  { label: 'Tổng quan', href: '/admin/dashboard/', icon: ChartBarSquareIcon },
  { label: 'Nội dung', href: '/admin/content/', icon: DocumentTextIcon },
  { label: 'Industry Atlas', href: '/admin/industries/', icon: Squares2X2Icon },
  { label: 'SEO & nội dung', href: '/admin/seo/', icon: MagnifyingGlassIcon },
  { label: 'Thư viện ảnh', href: '/admin/media/', icon: PhotoIcon },
  {
    label: 'Kết nối AI',
    href: '/admin/ai-assistant/',
    icon: SparklesIcon,
    ai: true,
  },
  {
    label: 'Nội dung mẫu',
    href: '/admin/templates/',
    icon: RectangleStackIcon,
    admin: true,
  },
  {
    label: 'Cấu hình website',
    href: '/admin/settings/',
    icon: Cog6ToothIcon,
    admin: true,
  },
  {
    label: 'Đội ngũ & phân quyền',
    href: '/admin/users/',
    icon: UsersIcon,
    admin: true,
  },
  {
    label: 'Nhật ký hoạt động',
    href: '/admin/activity/',
    icon: ClockIcon,
    admin: true,
  },
  {
    label: 'Sao lưu & khôi phục',
    href: '/admin/backups/',
    icon: CircleStackIcon,
    admin: true,
  },
]
const roleNames = {
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  seo: 'Chuyên viên SEO',
  viewer: 'Chỉ xem',
}

export default function StudioShell({
  user,
  children,
}: {
  user: StudioUser
  children: React.ReactNode
}) {
  const path = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const current = navigation.find(
    (item) =>
      path?.startsWith(item.href.replace(/\/$/, '')) ||
      (item.ai && path?.startsWith('/admin/ai/')),
  )
  async function logout() {
    if (
      document.querySelector('[data-studio-unsaved="true"]') &&
      !window.confirm('Nội dung chưa được lưu. Đăng xuất và bỏ các thay đổi?')
    )
      return
    setLoggingOut(true)
    try {
      const response = await fetch('/api/studio/session/', { method: 'DELETE' })
      if (!response.ok) throw new Error('Chưa thể đăng xuất. Vui lòng thử lại.')
      router.replace('/admin/')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
      setLoggingOut(false)
    }
  }
  const sidebar = (
    <>
      <Link
        href="/admin/dashboard/"
        className="studio-brand"
        onClick={() => setOpen(false)}
      >
        <Image
          src="/images/marketing/logo-color.png"
          alt="TBS GROUP"
          width={76}
          height={48}
          priority
        />
        <span>
          STUDIO<small>Website workspace</small>
        </span>
      </Link>
      <div className="studio-site-name">
        <span className="studio-status-dot" />
        nhaphangchinhngach.vn
      </div>
      <nav aria-label="Quản trị website">
        {navigation
          .filter(
            (item) =>
              (!item.admin || user.role === 'admin') &&
              (!item.ai || user.role !== 'viewer'),
          )
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current?.href === item.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
      </nav>
      <div className="studio-sidebar-bottom">
        <div className="studio-user">
          <span>{user.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{roleNames[user.role]}</small>
          </div>
        </div>
        <button
          type="button"
          className="studio-logout"
          onClick={logout}
          disabled={loggingOut}
        >
          <ArrowRightStartOnRectangleIcon />
          {loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </>
  )
  return (
    <div
      className="studio studio-workspace"
      data-studio-logging-out={loggingOut}
    >
      <a className="studio-skip" href="#studio-main">
        Đến nội dung chính
      </a>
      <aside className="studio-sidebar">{sidebar}</aside>
      <Dialog open={open} onClose={setOpen} className="studio-mobile-dialog">
        <div className="studio-backdrop" aria-hidden="true" />
        <DialogPanel className="studio-mobile-panel">
          <div className="studio-mobile-title">
            <DialogTitle>Quản trị website</DialogTitle>
            <button
              className="studio-icon-button"
              aria-label="Đóng menu quản trị"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon />
            </button>
          </div>
          {sidebar}
        </DialogPanel>
      </Dialog>
      <div className="studio-work-area">
        <header className="studio-topbar">
          <div>
            <button
              className="studio-icon-button studio-menu-button"
              aria-label="Mở menu quản trị"
              onClick={() => setOpen(true)}
            >
              <Bars3Icon />
            </button>
            <span className="studio-breadcrumb">
              Không gian làm việc <span>/</span>{' '}
              <strong>{current?.label || 'TBS Studio'}</strong>
            </span>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="studio-website-link"
          >
            Xem website
            <ArrowTopRightOnSquareIcon />
          </Link>
        </header>
        {error && (
          <p role="alert" className="studio-error">
            {error}
          </p>
        )}
        <main id="studio-main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
