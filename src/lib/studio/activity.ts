import type { StudioDatabase } from './database'

export type Activity = {
  id: number
  action: string
  actor: string | null
  created_at: string
  entity_id: string | null
}
export function recentActivity(db: StudioDatabase, limit = 100): Activity[] {
  return db
    .prepare(
      'SELECT a.id,a.action,a.created_at,a.entity_id,u.name AS actor FROM studio_audit a LEFT JOIN studio_users u ON u.id = a.actor_id ORDER BY a.id DESC LIMIT ?',
    )
    .all(Math.max(1, Math.min(limit, 200))) as Activity[]
}
