import 'server-only'
import { redirect } from 'next/navigation'
import { can, type Capability } from './auth'
import { currentUser } from './runtime'

export function requirePageUser(capability: Capability = 'content.read') {
  const user = currentUser()
  if (!user) redirect('/admin/')
  if (!can(user, capability)) redirect('/admin/dashboard/')
  return user
}
