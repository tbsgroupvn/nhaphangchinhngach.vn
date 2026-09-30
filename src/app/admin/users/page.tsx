import { requirePageUser } from '@/lib/studio/pages'
import { getStudio } from '@/lib/studio/runtime'
import UsersWorkspace from '@/components/studio/UsersWorkspace'

export default function UsersPage() {
  const user = requirePageUser('users.manage')
  return (
    <UsersWorkspace
      users={getStudio().auth.listUsers(user)}
      currentId={user.id}
    />
  )
}
