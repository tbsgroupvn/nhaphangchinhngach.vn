'use client'
import { useRef } from 'react'
import { useNavigationGuard } from 'next-navigation-guard'
export function useAiDraftGuard(dirty: boolean) {
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
        'Có thay đổi chưa lưu. Rời trang và bỏ thay đổi?',
      )
      if (accepted) pending.current = false
      return accepted
    },
  })
  return pending
}
