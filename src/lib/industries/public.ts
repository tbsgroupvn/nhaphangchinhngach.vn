import { createHash } from 'node:crypto'
import { join, resolve } from 'node:path'
import { StudioAuth } from '../studio/auth'
import { StudioContent } from '../studio/content'
import type {
  ContentPayload,
  Industry,
  IndustryCategory,
} from '../studio/content-model'
import {
  openStudioDatabase,
  type StudioDatabase,
} from '../studio/database'
import { industryTraits } from '../../data/industry-atlas'
import { readIndustryTaxonomy } from '../studio/industry-taxonomy'
import type {
  IndustryTaxonomy,
  IndustryTrait,
} from '../studio/industry-taxonomy-model'
import {
  buildIndustrySearchIndex,
  type IndustrySearchEntry,
} from './search'

const searchSnapshotKey = 'industries.search-snapshot.v1'

export type PublicIndustryCategory = IndustryCategory & {
  id: string
  path: string
}
export type PublicIndustry = Industry & { id: string; path: string }
export type PublicIndustryAtlas = {
  version: string
  categories: PublicIndustryCategory[]
  industries: PublicIndustry[]
  traits: IndustryTrait[]
  featured: string[]
}
export type IndustrySearchProjection = {
  index: IndustrySearchEntry[]
  sourceVersion: string
  generatedAt: string
  stale: boolean
  unavailable: boolean
  diagnostic: string
}

type PublishedDocument = {
  payload: ContentPayload
  path: string
  updatedAt: string
}
type ProjectionOptions = {
  db?: StudioDatabase
  buildIndex?: (atlas: PublicIndustryAtlas) => IndustrySearchEntry[]
}
type StoredProjection = IndustrySearchProjection & { hasGoodIndex: boolean }

const atlasDiagnostics = new WeakMap<PublicIndustryAtlas, { omitted: number }>()

function defaultDatabasePath() {
  return join(resolve(process.env.STUDIO_DATA_DIR || join(process.cwd(), '.data')), 'studio.sqlite')
}

function withDatabase<T>(db: StudioDatabase | undefined, work: (value: StudioDatabase) => T) {
  if (db) return work(db)
  const owned = openStudioDatabase(defaultDatabasePath())
  try {
    return work(owned)
  } finally {
    owned.close()
  }
}

function compareCategory(left: PublicIndustryCategory, right: PublicIndustryCategory) {
  return left.order - right.order || left.title.localeCompare(right.title, 'vi')
}

export function buildPublicIndustryAtlas(
  publications: PublishedDocument[],
  taxonomy: IndustryTaxonomy,
): PublicIndustryAtlas {
  const categories = publications
    .flatMap((publication) =>
      publication.payload.kind === 'industryCategory'
        ? [{ ...publication.payload.data, id: publication.payload.data.slug, path: publication.path }]
        : [],
    )
    .sort(compareCategory)
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))
  let omitted = 0
  const industries = publications
    .flatMap((publication) => {
      if (publication.payload.kind !== 'industry') return []
      if (!categoryBySlug.has(publication.payload.data.categorySlug)) {
        omitted += 1
        return []
      }
      return [{ ...publication.payload.data, id: publication.payload.data.slug, path: publication.path }]
    })
    .sort((left, right) => {
      const leftCategory = categoryBySlug.get(left.categorySlug)!
      const rightCategory = categoryBySlug.get(right.categorySlug)!
      return (
        compareCategory(leftCategory, rightCategory) ||
        left.title.localeCompare(right.title, 'vi') ||
        left.id.localeCompare(right.id)
      )
    })
  const industryIds = new Set(industries.map((industry) => industry.id))
  const featured = [
    ...new Set(
      categories.flatMap((category) =>
        category.featuredIndustryIds.filter((id) => industryIds.has(id)),
      ),
    ),
  ]
  const traits = taxonomy.traits
    .map((trait) => ({ ...trait }))
    .sort((left, right) => left.order - right.order || left.label.localeCompare(right.label, 'vi'))
  const version = createHash('sha256')
    .update(JSON.stringify({ categories, industries, traits, featured }))
    .digest('hex')
  const atlas = { version, categories, industries, traits, featured }
  atlasDiagnostics.set(atlas, { omitted })
  return atlas
}

// Public không được 500 vì setting taxonomy hỏng: rơi về nhãn trait gốc;
// Studio vẫn đọc chặt để admin thấy và sửa lỗi.
function readPublicTaxonomy(db: StudioDatabase): IndustryTaxonomy {
  try {
    return readIndustryTaxonomy(db)
  } catch {
    return { version: 0, traits: industryTraits.map((trait) => ({ ...trait })) }
  }
}

export function readPublicIndustryAtlas(db?: StudioDatabase): PublicIndustryAtlas {
  return withDatabase(db, (database) => {
    const content = new StudioContent(database, new StudioAuth(database))
    return buildPublicIndustryAtlas(
      content.publishedList(),
      readPublicTaxonomy(database),
    )
  })
}

function isSearchEntry(value: unknown): value is IndustrySearchEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.id === 'string' &&
    typeof entry.slug === 'string' &&
    typeof entry.path === 'string' &&
    typeof entry.title === 'string' &&
    typeof entry.categorySlug === 'string' &&
    Array.isArray(entry.traits)
  )
}

function parseStoredProjection(value: string | undefined): StoredProjection | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<StoredProjection>
    if (
      typeof parsed.sourceVersion !== 'string' ||
      typeof parsed.generatedAt !== 'string' ||
      typeof parsed.stale !== 'boolean' ||
      typeof parsed.unavailable !== 'boolean' ||
      typeof parsed.diagnostic !== 'string' ||
      typeof parsed.hasGoodIndex !== 'boolean' ||
      !Array.isArray(parsed.index) ||
      !parsed.index.every(isSearchEntry)
    )
      return null
    return parsed as StoredProjection
  } catch {
    return null
  }
}

function storedProjection(db: StudioDatabase) {
  const row = db
    .prepare('SELECT value FROM studio_settings WHERE key=?')
    .get(searchSnapshotKey) as { value: string } | undefined
  return parseStoredProjection(row?.value)
}

function saveProjection(db: StudioDatabase, projection: StoredProjection) {
  db.prepare(`INSERT INTO studio_settings (key,value,updated_at)
    VALUES (?,?,?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`)
    .run(searchSnapshotKey, JSON.stringify(projection), new Date().toISOString())
}

function publicProjection(projection: StoredProjection): IndustrySearchProjection {
  const { hasGoodIndex: _hasGoodIndex, ...publicValue } = projection
  return publicValue
}

function atlasDiagnostic(atlas: PublicIndustryAtlas) {
  const omitted = atlasDiagnostics.get(atlas)?.omitted || 0
  return omitted
    ? `${omitted} published industry publication${omitted === 1 ? '' : 's'} omitted because its category is unavailable.`
    : ''
}

export function readIndustrySearchProjection(
  atlas: PublicIndustryAtlas,
  options: ProjectionOptions = {},
): IndustrySearchProjection {
  return withDatabase(options.db, (db) => {
    const previous = storedProjection(db)
    if (
      previous &&
      previous.sourceVersion === atlas.version &&
      !previous.stale &&
      !previous.unavailable
    )
      return publicProjection(previous)

    try {
      const next: StoredProjection = {
        index: (options.buildIndex || buildIndustrySearchIndex)(atlas),
        sourceVersion: atlas.version,
        generatedAt: new Date().toISOString(),
        stale: false,
        unavailable: false,
        diagnostic: atlasDiagnostic(atlas),
        hasGoodIndex: true,
      }
      saveProjection(db, next)
      return publicProjection(next)
    } catch {
      const fallback: StoredProjection = previous?.hasGoodIndex
        ? {
            ...previous,
            sourceVersion: atlas.version,
            stale: true,
            unavailable: false,
            diagnostic: 'Search index rebuild failed; the last known good index is active.',
            hasGoodIndex: true,
          }
        : {
            index: [],
            sourceVersion: atlas.version,
            generatedAt: new Date().toISOString(),
            stale: false,
            unavailable: true,
            diagnostic: 'Search index is temporarily unavailable.',
            hasGoodIndex: false,
          }
      saveProjection(db, fallback)
      return publicProjection(fallback)
    }
  })
}

export function getIndustryProjectionStatus(
  db?: StudioDatabase,
): IndustrySearchProjection {
  return withDatabase(db, (database) => {
    const stored = storedProjection(database)
    return stored
      ? publicProjection(stored)
      : {
          index: [],
          sourceVersion: '',
          generatedAt: '',
          stale: false,
          unavailable: true,
          diagnostic: 'Search index has not been generated.',
        }
  })
}
