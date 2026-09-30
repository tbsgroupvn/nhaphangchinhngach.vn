import { createHash } from 'node:crypto'
import type { StudioDatabase } from './database'
import { backupSettingKeys, backupSummarySchema } from './backup-model'
import { readSiteSettings } from './site-settings'
import { readTemplates } from './templates'
import { StudioTechnicalSeo } from './technical-seo'
import { StudioAuth } from './auth'
import { readAiInstructions } from './ai-knowledge'
import { readIndustryTaxonomy } from './industry-taxonomy'

// Only these business columns may cross the installation boundary.
export const backupColumns = {
  studio_documents:
    'id,kind,path,draft,published,published_path,version,updated_by,updated_at,published_at,archived_at',
  studio_revisions:
    'id,document_id,version,snapshot,action,actor_id,created_at',
  studio_media:
    'id,title,alt,source,filename,width,height,bytes,data,version,created_at,updated_at',
  studio_seo_tasks: 'id,payload,version,updated_at',
  studio_redirects: 'id,source,target_id,status,version,updated_at',
  studio_knowledge:
    'id,draft,approved,approved_version,version,archived,created_at,updated_at,approved_at,approved_by',
  studio_ai_generations: 'id,document_id,version,payload,created_at,updated_at',
} as const
export type BackupTable = keyof typeof backupColumns
export type BackupRow = Record<string, string | number | Buffer | null>

export function backupSummary(db: StudioDatabase) {
  const count = (table: BackupTable) =>
    (db.prepare(`SELECT count(*) n FROM ${table}`).get() as { n: number }).n
  return backupSummarySchema.parse({
    documents: count('studio_documents'),
    publications: (
      db
        .prepare(
          'SELECT count(*) n FROM studio_documents WHERE published IS NOT NULL',
        )
        .get() as { n: number }
    ).n,
    revisions: count('studio_revisions'),
    media: count('studio_media'),
    mediaBytes: (
      db.prepare('SELECT coalesce(sum(bytes),0) n FROM studio_media').get() as {
        n: number
      }
    ).n,
    tasks: count('studio_seo_tasks'),
    redirects: count('studio_redirects'),
    knowledge: count('studio_knowledge'),
    generations: count('studio_ai_generations'),
  })
}

export function businessFingerprint(db: StudioDatabase) {
  const hash = createHash('sha256')
  for (const [table, columns] of Object.entries(backupColumns)) {
    // Blobs are immutable; metadata/version changes cover every supported mutation.
    const selection = columns
      .split(',')
      .filter((column) => column !== 'data')
      .join(',')
    hash.update(table)
    for (const row of db
      .prepare(`SELECT ${selection} FROM ${table} ORDER BY rowid`)
      .iterate())
      hash.update(JSON.stringify(row))
  }
  for (const key of backupSettingKeys) {
    hash.update(key)
    hash.update(
      JSON.stringify(
        db
          .prepare('SELECT value,updated_at FROM studio_settings WHERE key=?')
          .get(key) || null,
      ),
    )
  }
  return hash.digest('hex')
}

export function insertBackupRow(
  db: StudioDatabase,
  table: BackupTable,
  row: BackupRow,
) {
  const columns = backupColumns[table].split(',')
  db.prepare(
    `INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`,
  ).run(...columns.map((column) => row[column]))
}

export function exportBusinessData(
  source: StudioDatabase,
  target: StudioDatabase,
  now: string,
) {
  target.transaction(() => {
    for (const table of [
      'studio_ai_generations',
      'studio_redirects',
      'studio_seo_audits',
      'studio_revisions',
      'studio_documents',
      'studio_media',
      'studio_seo_tasks',
      'studio_knowledge',
      'studio_audit',
    ])
      target.prepare(`DELETE FROM ${table}`).run()
    target.prepare('DELETE FROM studio_settings').run()
    for (const [table, columns] of Object.entries(backupColumns))
      for (const row of source
        .prepare(`SELECT ${columns} FROM ${table} ORDER BY rowid`)
        .iterate())
        insertBackupRow(target, table as BackupTable, row as BackupRow)
    const site = readSiteSettings(source)
    const templates = readTemplates(source)
    const effective: Record<string, unknown> = {
      'content.seed.v1': true,
      'content.fixed.seed.v1': true,
      'ai.instructions.v1': readAiInstructions(source),
      'industries.taxonomy.v1': readIndustryTaxonomy(source),
      'site.public.v1': { version: site.version, payload: site.payload },
      'site.templates.v1': {
        version: templates.version,
        values: templates.values,
      },
      'seo.technical.v1': new StudioTechnicalSeo(
        source,
        new StudioAuth(source),
      ).settings(),
    }
    for (const key of backupSettingKeys)
      target
        .prepare('INSERT INTO studio_settings VALUES (?,?,?)')
        .run(key, JSON.stringify(effective[key]), now)
  })()
}
