import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import Database from 'better-sqlite3'
import { industries } from '../../src/data/industry-atlas'
import {
  migrateIndustryAtlas,
  type IndustryMigrationDatabase,
} from '../../src/lib/studio/industry-migration'
import { openStudioDatabase } from '../../src/lib/studio/database'

const count = (db: Database.Database, sql: string) =>
  (db.prepare(sql).get() as { count: number }).count

function createV6(filename: string, rejectCategories = false) {
  const db = new Database(filename)
  db.pragma('foreign_keys = ON')
  db.exec(`
    CREATE TABLE studio_documents (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      path TEXT NOT NULL UNIQUE,
      draft TEXT NOT NULL,
      published TEXT,
      published_path TEXT UNIQUE,
      version INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT,
      updated_at TEXT NOT NULL,
      published_at TEXT
    );
    CREATE TABLE studio_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id TEXT NOT NULL REFERENCES studio_documents(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      snapshot TEXT NOT NULL,
      action TEXT NOT NULL,
      actor_id TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(document_id, version)
    );
    CREATE TABLE studio_settings (key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at TEXT NOT NULL);
    CREATE TABLE studio_audit (id INTEGER PRIMARY KEY AUTOINCREMENT,actor_id TEXT,action TEXT NOT NULL,entity_id TEXT,details TEXT NOT NULL DEFAULT '{}',created_at TEXT NOT NULL);
    CREATE TABLE studio_redirects (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL UNIQUE,
      target_id TEXT NOT NULL REFERENCES studio_documents(id),
      status INTEGER NOT NULL CHECK(status IN (307,308)),
      version INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX studio_redirects_target ON studio_redirects(target_id);
    PRAGMA user_version = 6;
  `)
  const now = '2026-09-27T10:00:00.000Z'
  const insert = db.prepare(`INSERT INTO studio_documents
    (id,kind,path,draft,published,published_path,version,updated_by,updated_at,published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)`)
  const revision = db.prepare(`INSERT INTO studio_revisions
    (document_id,version,snapshot,action,actor_id,created_at) VALUES (?,?,?,'seeded',NULL,?)`)
  for (const [index, item] of industries.entries()) {
    const data = {
      slug: item.slug,
      title: index === 0 ? 'Gia dụng do người dùng biên tập' : item.title,
      summary:
        index === 0 ? 'Nội dung tùy chỉnh phải được giữ nguyên.' : item.summary,
      image: item.image,
      imageAlts:
        index === 0
          ? { [item.image]: 'Alt do người dùng biên tập' }
          : undefined,
      details: item.details,
      inputs: item.inputs,
      serviceSlugs: item.serviceSlugs,
    }
    const payload = {
      kind: 'industry',
      data,
      seo: {
        title: index === 0 ? 'SEO tùy chỉnh' : item.title,
        description: data.summary,
        canonical: '',
        noindex: false,
        image: item.image,
      },
    }
    const id = `legacy-industry-${index + 1}`
    const path = `/nganh-hang/${item.slug}`
    const json = JSON.stringify(payload)
    insert.run(id, 'industry', path, json, json, path, 4, null, now, now)
    revision.run(id, 4, json, now)
  }
  if (rejectCategories)
    db.exec(`CREATE TRIGGER reject_industry_categories
      BEFORE INSERT ON studio_documents
      WHEN NEW.kind='industryCategory'
      BEGIN SELECT RAISE(ABORT,'category insert blocked'); END;`)
  db.close()
}

test('v6 migration preserves customized content and creates two-level publications with one-hop redirects', () => {
  const folder = mkdtempSync(join(tmpdir(), 'tbs-industry-v6-'))
  const filename = join(folder, 'studio.sqlite')
  try {
    createV6(filename)
    const db = openStudioDatabase(filename)
    assert.equal(db.pragma('user_version', { simple: true }), 7)
    assert.equal(
      count(
        db,
        "SELECT COUNT(*) count FROM studio_documents WHERE kind='industryCategory'",
      ),
      2,
    )
    const migrated = db
      .prepare("SELECT * FROM studio_documents WHERE id='legacy-industry-1'")
      .get() as Record<string, unknown>
    const draft = JSON.parse(String(migrated.draft))
    assert.equal(draft.data.title, 'Gia dụng do người dùng biên tập')
    assert.equal(draft.data.summary, 'Nội dung tùy chỉnh phải được giữ nguyên.')
    assert.equal(draft.data.imageAlts[draft.data.image], 'Alt do người dùng biên tập')
    assert.equal(draft.seo.title, 'SEO tùy chỉnh')
    assert.equal(draft.data.categorySlug, 'gia-dung-noi-that')
    assert.equal(draft.data.review.status, 'legacy')
    assert.equal(migrated.path, '/nganh-hang/gia-dung-noi-that/gia-dung-khong-dien')
    assert.equal(migrated.published_path, migrated.path)
    assert.equal(migrated.version, 5)
    assert.equal(migrated.archived_at, null)

    const redirect = db
      .prepare(`SELECT r.source,r.status,d.published_path target
        FROM studio_redirects r JOIN studio_documents d ON d.id=r.target_id
        WHERE r.source='/nganh-hang/gia-dung-khong-dien'`)
      .get() as { source: string; status: number; target: string }
    assert.deepEqual(redirect, {
      source: '/nganh-hang/gia-dung-khong-dien',
      status: 308,
      target: '/nganh-hang/gia-dung-noi-that/gia-dung-khong-dien',
    })
    db.close()
  } finally {
    rmSync(folder, { recursive: true, force: true })
  }
})

test('migration is atomic on failure and idempotent after retry', () => {
  const folder = mkdtempSync(join(tmpdir(), 'tbs-industry-atomic-'))
  const filename = join(folder, 'studio.sqlite')
  try {
    createV6(filename, true)
    assert.throws(() => openStudioDatabase(filename), /category insert blocked/)

    const failed = new Database(filename)
    assert.equal(failed.pragma('user_version', { simple: true }), 6)
    assert.equal(
      count(
        failed,
        "SELECT COUNT(*) count FROM studio_documents WHERE kind='industryCategory'",
      ),
      0,
    )
    assert.equal(
      (
        failed
          .prepare("SELECT path FROM studio_documents WHERE id='legacy-industry-1'")
          .get() as { path: string }
      ).path,
      '/nganh-hang/gia-dung-khong-dien',
    )
    assert.equal(
      count(
        failed,
        "SELECT COUNT(*) count FROM pragma_table_info('studio_documents') WHERE name='archived_at'",
      ),
      0,
    )
    failed.exec('DROP TRIGGER reject_industry_categories')
    failed.close()

    const migrated = openStudioDatabase(filename)
    const before = {
      documents: count(migrated, 'SELECT COUNT(*) count FROM studio_documents'),
      revisions: count(migrated, 'SELECT COUNT(*) count FROM studio_revisions'),
      redirects: count(migrated, 'SELECT COUNT(*) count FROM studio_redirects'),
      audits: count(migrated, 'SELECT COUNT(*) count FROM studio_audit'),
    }
    migrateIndustryAtlas(migrated as IndustryMigrationDatabase)
    const after = {
      documents: count(migrated, 'SELECT COUNT(*) count FROM studio_documents'),
      revisions: count(migrated, 'SELECT COUNT(*) count FROM studio_revisions'),
      redirects: count(migrated, 'SELECT COUNT(*) count FROM studio_redirects'),
      audits: count(migrated, 'SELECT COUNT(*) count FROM studio_audit'),
    }
    assert.deepEqual(after, before)
    migrated.close()
  } finally {
    rmSync(folder, { recursive: true, force: true })
  }
})
