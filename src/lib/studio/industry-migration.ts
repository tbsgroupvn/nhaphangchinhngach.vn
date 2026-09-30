import { randomUUID } from 'node:crypto'
import type Database from 'better-sqlite3'
import { industries, industryCategories } from '../../data/industry-atlas'
import { contentPath, contentSchema, type ContentPayload } from './content-model'

export type IndustryMigrationDatabase = Database.Database

type IndustryRow = {
  id: string
  path: string
  draft: string
  published: string | null
  published_path: string | null
  version: number
}

function hasColumn(
  db: IndustryMigrationDatabase,
  table: string,
  column: string,
) {
  return (
    db
      .prepare(`SELECT COUNT(*) count FROM pragma_table_info(?) WHERE name=?`)
      .get(table, column) as { count: number }
  ).count > 0
}

function migrateIndustryPayload(raw: string): ContentPayload {
  const value = JSON.parse(raw) as {
    kind: string
    data: Record<string, unknown> & { slug?: string }
    seo: unknown
  }
  if (value.kind !== 'industry' || !value.data?.slug)
    throw new Error('Invalid legacy industry payload')
  const seed = industries.find((item) => item.slug === value.data.slug)
  if (!seed) throw new Error(`Unknown legacy industry: ${value.data.slug}`)
  return contentSchema.parse({
    ...value,
    kind: 'industry',
    data: {
      ...seed,
      ...value.data,
      categorySlug: value.data.categorySlug ?? seed.categorySlug,
      shortTitle: value.data.shortTitle ?? seed.shortTitle,
      aliases: value.data.aliases ?? seed.aliases,
      searchTerms: value.data.searchTerms ?? seed.searchTerms,
      models: value.data.models ?? seed.models,
      uses: value.data.uses ?? seed.uses,
      materials: value.data.materials ?? seed.materials,
      traits: value.data.traits ?? seed.traits,
      preparationItems:
        value.data.preparationItems ?? seed.preparationItems,
      technicalInputs: value.data.technicalInputs ?? seed.technicalInputs,
      packingNotes: value.data.packingNotes ?? seed.packingNotes,
      verificationPoints:
        value.data.verificationPoints ?? seed.verificationPoints,
      proofItems: value.data.proofItems ?? seed.proofItems,
      articleSlugs: value.data.articleSlugs ?? seed.articleSlugs,
      faqs: value.data.faqs ?? seed.faqs,
      saleBriefItems: value.data.saleBriefItems ?? seed.saleBriefItems,
      review: value.data.review ?? seed.review,
    },
  })
}

export function migrateIndustryAtlas(db: IndustryMigrationDatabase): void {
  const current = db.pragma('user_version', { simple: true }) as number
  if (current >= 7) return
  if (current > 6)
    throw new Error('Studio database schema is newer than this application')

  db.transaction(() => {
    if (!hasColumn(db, 'studio_documents', 'archived_at'))
      db.exec('ALTER TABLE studio_documents ADD COLUMN archived_at TEXT')

    const now = new Date().toISOString()
    const rows = db
      .prepare(
        "SELECT id,path,draft,published,published_path,version FROM studio_documents WHERE kind='industry' ORDER BY id",
      )
      .all() as IndustryRow[]
    const publishedCategories = new Set<string>()
    const redirects: { source: string; targetId: string }[] = []
    const update = db.prepare(`UPDATE studio_documents SET
      kind='industry',path=?,draft=?,published=?,published_path=?,version=?,updated_at=?
      WHERE id=?`)
    const revision = db.prepare(`INSERT INTO studio_revisions
      (document_id,version,snapshot,action,actor_id,created_at)
      VALUES (?,?,?,'industry-atlas-migrated',NULL,?)`)

    for (const row of rows) {
      const draft = migrateIndustryPayload(row.draft)
      const published = row.published
        ? migrateIndustryPayload(row.published)
        : null
      const path = contentPath(draft)
      const publishedPath = published ? contentPath(published) : null
      const version = row.version + 1
      update.run(
        path,
        JSON.stringify(draft),
        published ? JSON.stringify(published) : null,
        publishedPath,
        version,
        now,
        row.id,
      )
      revision.run(row.id, version, JSON.stringify(draft), now)
      if (published?.kind === 'industry') {
        publishedCategories.add(published.data.categorySlug)
        if (row.published_path && row.published_path !== publishedPath)
          redirects.push({ source: row.published_path, targetId: row.id })
      }
    }

    const insertCategory = db.prepare(`INSERT INTO studio_documents
      (id,kind,path,draft,published,published_path,version,updated_by,updated_at,published_at,archived_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,NULL)`)
    const insertRevision = db.prepare(`INSERT INTO studio_revisions
      (document_id,version,snapshot,action,actor_id,created_at)
      VALUES (?,1,?,'industry-atlas-seeded',NULL,?)`)
    let categoryCount = 0
    for (const category of industryCategories) {
      const payload = contentSchema.parse({
        kind: 'industryCategory',
        data: category,
        seo: {
          title: category.title,
          description: category.summary,
          canonical: '',
          noindex: false,
          image: category.image,
        },
      })
      const path = contentPath(payload)
      const existing = db
        .prepare(
          'SELECT id,kind,draft FROM studio_documents WHERE path=? OR published_path=?',
        )
        .get(path, path) as
        | { id: string; kind: string; draft: string }
        | undefined
      if (existing) {
        const parsed = contentSchema.safeParse(JSON.parse(existing.draft))
        if (
          existing.kind === 'industryCategory' &&
          parsed.success &&
          parsed.data.kind === 'industryCategory' &&
          parsed.data.data.slug === category.slug
        )
          continue
        throw new Error(`Industry category path is already occupied: ${path}`)
      }
      const id = randomUUID()
      const json = JSON.stringify(payload)
      const publish = current === 0 || publishedCategories.has(category.slug)
      insertCategory.run(
        id,
        'industryCategory',
        path,
        json,
        publish ? json : null,
        publish ? path : null,
        1,
        null,
        now,
        publish ? now : null,
      )
      insertRevision.run(id, json, now)
      categoryCount += 1
    }

    const insertRedirect = db.prepare(`INSERT INTO studio_redirects
      (id,source,target_id,status,version,updated_at) VALUES (?,?,?,308,1,?)`)
    for (const redirect of redirects)
      insertRedirect.run(
        randomUUID(),
        redirect.source,
        redirect.targetId,
        now,
      )

    db.prepare(`INSERT INTO studio_audit
      (actor_id,action,entity_id,details,created_at)
      VALUES (NULL,'industry-atlas.migrated',NULL,?,?)`).run(
      JSON.stringify({
        fromVersion: current,
        toVersion: 7,
        categories: categoryCount,
        industries: rows.length,
        redirects: redirects.length,
      }),
      now,
    )
    db.pragma('user_version = 7')
  })()
}
