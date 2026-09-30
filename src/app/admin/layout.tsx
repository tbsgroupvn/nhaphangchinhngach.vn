import type { Metadata } from 'next'
import { bootstrapToken, currentUser, getStudio } from '@/lib/studio/runtime'
import StudioShell from '@/components/studio/StudioShell'
import StudioLogin from '@/components/studio/StudioLogin'
import './studio.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'TBS Studio',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = currentUser()
  if (!user)
    return (
      <StudioLogin
        setupRequired={getStudio().auth.needsSetup()}
        setupConfigured={bootstrapToken().length >= 32}
      />
    )
  return <StudioShell user={user}>{children}</StudioShell>
}
