'use client'

import { useEffect, useRef, useState } from 'react'
import { useNavigationGuard } from 'next-navigation-guard'
import {
  ArrowPathIcon,
  CheckIcon,
  LinkIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  aiConfigSchema,
  aiErrorMessages,
  type AiConfig,
  type AiProviderView,
} from '@/lib/studio/ai-provider-model'
import AiNavigation from './AiNavigation'

const defaults: AiConfig = {
  provider: 'openai',
  model: '',
  maxOutputTokens: 2048,
  dailyTokenBudget: 100000,
  dailyRequestLimit: 50,
}
const connectionNames = {
  untested: 'Chưa kiểm tra',
  running: 'Đang kiểm tra',
  connected: 'Kết nối thành công',
  failed: 'Kết nối thất bại',
}
const configLabels: Record<keyof AiConfig, string> = {
  provider: 'Nhà cung cấp',
  model: 'Model',
  maxOutputTokens: 'Token đầu ra / yêu cầu',
  dailyTokenBudget: 'Ngân sách token / ngày UTC',
  dailyRequestLimit: 'Số yêu cầu / ngày UTC',
}

export default function AiProviderWorkspace({
  initial,
  canConfigure,
}: {
  initial: AiProviderView
  canConfigure: boolean
}) {
  const [saved, setSaved] = useState(initial),
    [config, setConfig] = useState(initial.config || defaults)
  const [apiKey, setApiKey] = useState(''),
    [latest, setLatest] = useState<AiProviderView | null>(null)
  const [busy, setBusy] = useState(''),
    [error, setError] = useState(''),
    [message, setMessage] = useState('')
  const dirty =
    !!apiKey ||
    JSON.stringify(config) !== JSON.stringify(saved.config || defaults)
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
        'Cấu hình AI chưa lưu. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  async function readCurrent() {
    const response = await fetch('/api/studio/ai/provider/', {
      cache: 'no-store',
    })
    const result = await response.json()
    if (!response.ok)
      throw new Error(result.error || 'Không đọc được trạng thái AI.')
    return result as AiProviderView
  }
  useEffect(() => {
    if (saved.connection.status !== 'running') return
    let alive = true
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch('/api/studio/ai/provider/', {
          cache: 'no-store',
        })
        if (!response.ok) return
        const result: AiProviderView = await response.json()
        if (!alive) return
        if (result.version === saved.version) setSaved(result)
        else setLatest(result)
      } catch {
        /* Manual refresh remains available after a network failure. */
      }
    }, 3000)
    return () => {
      alive = false
      clearTimeout(timeout)
    }
  }, [saved])
  async function mutate(action: 'save' | 'test' | 'clear') {
    if (busy) return
    setError('')
    setMessage('')
    if (action === 'save' && !aiConfigSchema.safeParse(config).success) {
      setError(
        'Kiểm tra model và các giới hạn. Ngân sách ngày cần lớn hơn đầu ra ít nhất 2.048 token.',
      )
      return
    }
    if (
      action === 'test' &&
      !window.confirm(
        'Gửi một phép thử ngắn tới OpenAI bằng cấu hình đã lưu? Có thể phát sinh phí API; không gửi nội dung website.',
      )
    )
      return
    if (
      action === 'clear' &&
      !window.confirm(
        'Gỡ cấu hình và khóa API đã lưu? Yêu cầu đã gửi tới nhà cung cấp không thể thu hồi.',
      )
    )
      return
    setBusy(action)
    try {
      const response = await fetch('/api/studio/ai/provider/', {
        method:
          action === 'save' ? 'PUT' : action === 'clear' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: saved.version,
          ...(action === 'save'
            ? { config: { ...config, ...(apiKey ? { apiKey } : {}) } }
            : action === 'test'
              ? { consent: true }
              : {}),
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.code === 'VERSION_CONFLICT') setLatest(await readCurrent())
        throw new Error(result.error || 'Chưa hoàn tất yêu cầu.')
      }
      setSaved(result)
      if (action !== 'test') {
        setConfig(result.config || defaults)
        setApiKey('')
        setLatest(null)
        pending.current = false
      }
      if (action === 'test')
        setMessage(
          result.connection.status === 'connected'
            ? 'Đã kiểm tra cấu hình đã lưu.'
            : '',
        )
      else
        setMessage(
          action === 'save'
            ? 'Đã lưu cấu hình. Cần kiểm tra kết nối.'
            : 'Đã gỡ kết nối AI.',
        )
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Lỗi kết nối. Tải lại trạng thái trước khi thử tiếp.',
      )
      if (action === 'test') {
        try {
          const current = await readCurrent()
          if (current.version === saved.version) setSaved(current)
          else setLatest(current)
        } catch {}
      }
    } finally {
      setBusy('')
    }
  }
  async function refresh() {
    setBusy('refresh')
    setError('')
    setMessage('')
    try {
      const result = await readCurrent()
      if (dirty && result.version !== saved.version) setLatest(result)
      else {
        setSaved(result)
        if (!dirty) setConfig(result.config || defaults)
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Lỗi kết nối.')
    } finally {
      setBusy('')
    }
  }
  function resolve(remote: boolean) {
    if (!latest) return
    setSaved(latest)
    if (remote) {
      setConfig(latest.config || defaults)
      setApiKey('')
      pending.current = false
    }
    setLatest(null)
    setError('')
    setMessage(
      remote
        ? 'Đã dùng bản trên máy chủ.'
        : 'Đã giữ bản của tôi. Chưa lưu thay đổi.',
    )
  }
  const connectionError =
    saved.connection.errorCode && aiErrorMessages[saved.connection.errorCode]
  return (
    <div className="studio-ai-provider" data-studio-unsaved={dirty}>
      <AiNavigation active="connection" />
      <div className="studio-page-heading">
        <div>
          <h1>Kết nối AI</h1>
          <p className="studio-muted">
            OpenAI Responses · Phiên bản {saved.version}
          </p>
        </div>
        <button
          type="button"
          className="studio-icon-button"
          title="Tải lại trạng thái"
          aria-label="Tải lại trạng thái"
          onClick={refresh}
          disabled={!!busy}
        >
          <ArrowPathIcon />
        </button>
      </div>
      {(error || connectionError) && (
        <p role="alert" className="studio-error">
          {error || connectionError}
        </p>
      )}
      {message && (
        <p role="status" className="studio-success">
          {message}
        </p>
      )}
      <section className="studio-ai-status" aria-label="Trạng thái kết nối">
        <div>
          <span
            className={`studio-ai-connection studio-ai-${saved.connection.status}`}
          >
            <LinkIcon />
            {saved.hasKey
              ? connectionNames[saved.connection.status]
              : 'Chưa cấu hình'}
          </span>
          {saved.connection.testedAt && (
            <p className="studio-muted">
              {new Date(saved.connection.testedAt).toLocaleString('vi-VN')}
              {saved.connection.latencyMs !== undefined &&
                ` · ${saved.connection.latencyMs} ms`}
            </p>
          )}
        </div>
        <dl>
          <div>
            <dt>Yêu cầu hôm nay</dt>
            <dd>
              {saved.budget.requests}{' '}
              <span>/ {saved.config?.dailyRequestLimit ?? '-'}</span>
            </dd>
          </div>
          <div>
            <dt>Token đã dùng / dự phòng</dt>
            <dd>
              {saved.budget.tokens.toLocaleString('vi-VN')}{' '}
              <span>
                /{' '}
                {saved.config?.dailyTokenBudget.toLocaleString('vi-VN') ?? '-'}
              </span>
            </dd>
          </div>
        </dl>
        <p className="studio-muted">Ngày ngân sách UTC: {saved.budget.day}</p>
      </section>
      {!saved.encryptionReady && (
        <p className="studio-error">
          Chưa có khóa mã hóa trên máy chủ: STUDIO_AI_ENCRYPTION_KEY. Không thể
          lưu hoặc gọi AI.
        </p>
      )}
      {saved.encryptionReady && saved.hasKey && !saved.credentialsReadable && (
        <p className="studio-error">
          Không giải mã được khóa đã lưu. Cần khôi phục khóa mã hóa đúng hoặc
          nhập khóa API mới.
        </p>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void mutate('save')
        }}
      >
        <fieldset disabled={!!busy || !canConfigure}>
          <legend>Nhà cung cấp & model</legend>
          <div className="studio-ai-fields">
            <label>
              Nhà cung cấp
              <select value={config.provider} onChange={() => {}}>
                <option value="openai">OpenAI</option>
              </select>
            </label>
            <label>
              Model
              <input
                value={config.model}
                onChange={(event) =>
                  setConfig({ ...config, model: event.target.value })
                }
                maxLength={100}
                required
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            {canConfigure && (
              <div className="studio-ai-key">
                <label htmlFor="studio-ai-api-key">Khóa API</label>
                <input
                  id="studio-ai-api-key"
                  aria-describedby="studio-ai-key-status"
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  autoComplete="new-password"
                  maxLength={512}
                  minLength={16}
                  placeholder={
                    saved.hasKey
                      ? 'Đã lưu khóa; để trống để giữ nguyên'
                      : 'Chưa có khóa'
                  }
                />
                <span id="studio-ai-key-status" className="studio-muted">
                  <ShieldCheckIcon />
                  {saved.hasKey
                    ? 'Khóa đã lưu được mã hóa trên máy chủ.'
                    : 'Khóa API chưa được lưu.'}
                </span>
              </div>
            )}
          </div>
          <h2>Ngân sách sử dụng</h2>
          <div className="studio-ai-limits">
            {(
              [
                'maxOutputTokens',
                'dailyTokenBudget',
                'dailyRequestLimit',
              ] as const
            ).map((field) => (
              <label key={field}>
                {configLabels[field]}
                <input
                  type="number"
                  value={Number.isNaN(config[field]) ? '' : config[field]}
                  min={
                    field === 'maxOutputTokens'
                      ? 128
                      : field === 'dailyTokenBudget'
                        ? 4096
                        : 1
                  }
                  max={
                    field === 'maxOutputTokens'
                      ? 8192
                      : field === 'dailyTokenBudget'
                        ? 2000000
                        : 500
                  }
                  step={1}
                  required
                  onChange={(event) =>
                    setConfig({
                      ...config,
                      [field]: event.target.valueAsNumber,
                    })
                  }
                />
              </label>
            ))}
          </div>
        </fieldset>
        {latest && (
          <section
            className="studio-task-conflict"
            aria-label="Bản trên máy chủ"
          >
            <h2>Bản trên máy chủ · v{latest.version}</h2>
            <dl className="studio-site-conflicts">
              {(Object.keys(configLabels) as (keyof AiConfig)[]).map((key) => (
                <div key={key}>
                  <dt>{configLabels[key]}</dt>
                  <dd>
                    <strong>Bản của tôi</strong>
                    <p>{config[key]}</p>
                  </dd>
                  <dd>
                    <strong>Máy chủ</strong>
                    <p>{latest.config?.[key] ?? 'Chưa cấu hình'}</p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="studio-muted">
              Khóa trên máy chủ:{' '}
              {latest.hasKey ? 'đã lưu, không hiển thị' : 'chưa có'}. Khóa vừa
              nhập: {apiKey ? 'có thay đổi' : 'không thay đổi'}.
            </p>
            <div className="studio-task-conflict-actions">
              <button
                type="button"
                className="studio-button"
                onClick={() => resolve(false)}
              >
                Giữ bản của tôi
              </button>
              <button
                type="button"
                className="studio-button"
                onClick={() => resolve(true)}
              >
                Dùng bản trên máy chủ
              </button>
            </div>
          </section>
        )}
        {canConfigure && (
          <div className="studio-ai-actions">
            <button
              type="submit"
              className="studio-button studio-primary"
              disabled={!!busy || !dirty || !!latest || !saved.encryptionReady}
            >
              <CheckIcon />
              {busy === 'save' ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
            <button
              type="button"
              className="studio-button"
              onClick={() => mutate('test')}
              disabled={
                !!busy ||
                dirty ||
                !!latest ||
                !saved.credentialsReadable ||
                saved.connection.status === 'running'
              }
            >
              <LinkIcon />
              {busy === 'test' ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
            </button>
            <button
              type="button"
              className="studio-button"
              onClick={() => mutate('clear')}
              disabled={!!busy || dirty || !!latest || !saved.hasKey}
            >
              <TrashIcon />
              Gỡ kết nối
            </button>
            <span className="studio-muted">
              {dirty ? 'Có thay đổi chưa lưu' : 'Cấu hình đã đồng bộ'}
            </span>
          </div>
        )}
      </form>
    </div>
  )
}
