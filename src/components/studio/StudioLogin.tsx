'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export default function StudioLogin({
  setupRequired,
  setupConfigured,
}: {
  setupRequired: boolean
  setupConfigured: boolean
}) {
  const router = useRouter()
  const [setup, setSetup] = useState(setupRequired)
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    setMessage('')
    const values = new FormData(event.currentTarget)
    const input = {
      email: values.get('email'),
      password: values.get('password'),
      name: values.get('name'),
      token: values.get('token'),
      remember: values.get('remember') === 'on',
    }
    try {
      const response = await fetch(
        setup ? '/api/studio/setup/' : '/api/studio/session/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        },
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Không thể đăng nhập.')
      if (setup) {
        setSetup(false)
        setMessage('Đã tạo tài khoản quản trị. Anh/chị có thể đăng nhập.')
      } else {
        router.replace('/admin/dashboard/')
        router.refresh()
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Không thể kết nối máy chủ.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="studio studio-login">
      <Link href="/" className="studio-back">
        <ArrowLeftIcon />
        Website TBS
      </Link>
      <main className="studio-login-main">
        <Image
          src="/images/marketing/logo-color.png"
          alt="TBS GROUP"
          width={116}
          height={74}
          priority
        />
        <p className="studio-kicker">TBS STUDIO</p>
        <h1>{setup ? 'Khởi tạo quản trị' : 'Chào mừng trở lại'}</h1>
        <p className="studio-muted">
          {setup
            ? 'Tài khoản chủ sở hữu website'
            : 'Đăng nhập vào không gian quản lý website.'}
        </p>
        <form onSubmit={submit} className="studio-form">
          {setup && (
            <label>
              Họ và tên
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
          )}
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label>
            Mật khẩu
            <span className="studio-password">
              <input
                name="password"
                type={visible ? 'text' : 'password'}
                autoComplete={setup ? 'new-password' : 'current-password'}
                required
                minLength={setup ? 12 : 1}
                maxLength={256}
              />
              <button
                type="button"
                className="studio-icon-button"
                aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                title={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </span>
          </label>
          {setup ? (
            <label>
              Mã khởi tạo
              <input
                name="token"
                type="password"
                required
                autoComplete="off"
                maxLength={256}
              />
            </label>
          ) : (
            <label className="studio-check">
              <input name="remember" type="checkbox" />
              Duy trì đăng nhập 7 ngày
            </label>
          )}
          {setup && !setupConfigured && (
            <p className="studio-notice">
              Chưa có mã khởi tạo trên máy chủ. Quản trị kỹ thuật cần chạy bước
              thiết lập trước.
            </p>
          )}
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
          <button
            className="studio-button studio-primary"
            disabled={busy || (setup && !setupConfigured)}
            type="submit"
          >
            {busy
              ? 'Đang xử lý...'
              : setup
                ? 'Tạo tài khoản chủ sở hữu'
                : 'Đăng nhập'}
            <ArrowRightIcon />
          </button>
        </form>
        <div className="studio-login-security">
          <ShieldCheckIcon />
          Không gian dành cho đội ngũ TBS GROUP
        </div>
      </main>
    </div>
  )
}
