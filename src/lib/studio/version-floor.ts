import type { StudioDatabase } from './database'

const key = 'ops.version.highwater'
export function versionFloor(db: StudioDatabase) {
  const row = db
    .prepare('SELECT value FROM studio_settings WHERE key=?')
    .get(key) as { value: string } | undefined
  return row ? Number(row.value) : 0
}
// Retain deleted versions so a future backup cannot recreate an old editor token.
export function rememberVersion(db: StudioDatabase, version: number) {
  const maximum = Math.max(versionFloor(db), version)
  db.prepare(
    'INSERT INTO studio_settings VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
  ).run(key, String(maximum), new Date().toISOString())
}
