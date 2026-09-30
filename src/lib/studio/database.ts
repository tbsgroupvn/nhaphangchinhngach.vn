import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { migrateIndustryAtlas } from './industry-migration'

export type StudioDatabase = Database.Database

export function openStudioDatabase(filename: string): StudioDatabase {
  if (filename !== ':memory:')
    mkdirSync(dirname(filename), { recursive: true, mode: 0o700 })
  const db = new Database(filename)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')
  const version = db.pragma('user_version', { simple: true }) as number
  if (version > 7) {
    db.close()
    throw new Error('Studio database schema is newer than this application')
  }
  try {
    db.transaction(() => {
      db.exec(`
      CREATE TABLE IF NOT EXISTS studio_users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL COLLATE NOCASE UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin','editor','seo','viewer')),
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_sessions (
        token_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES studio_users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS studio_sessions_user ON studio_sessions(user_id);
      CREATE TABLE IF NOT EXISTS studio_rate_limits (
        bucket TEXT PRIMARY KEY,
        attempts INTEGER NOT NULL,
        resets_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT,
        action TEXT NOT NULL,
        entity_id TEXT,
        details TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_documents (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        draft TEXT NOT NULL,
        published TEXT,
        published_path TEXT UNIQUE,
        version INTEGER NOT NULL DEFAULT 1,
        updated_by TEXT,
        updated_at TEXT NOT NULL,
        published_at TEXT,
        archived_at TEXT
      );
      CREATE TABLE IF NOT EXISTS studio_revisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL REFERENCES studio_documents(id) ON DELETE CASCADE,
        version INTEGER NOT NULL,
        snapshot TEXT NOT NULL,
        action TEXT NOT NULL,
        actor_id TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(document_id, version)
      );
      CREATE TABLE IF NOT EXISTS studio_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_seo_audits (
        document_id TEXT PRIMARY KEY REFERENCES studio_documents(id) ON DELETE CASCADE,
        document_version INTEGER NOT NULL,
        report TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_seo_tasks (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        version INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_redirects (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL UNIQUE,
        target_id TEXT NOT NULL REFERENCES studio_documents(id),
        status INTEGER NOT NULL CHECK(status IN (307,308)),
        version INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS studio_redirects_target ON studio_redirects(target_id);
      CREATE TABLE IF NOT EXISTS studio_media (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        alt TEXT NOT NULL,
        source TEXT NOT NULL,
        filename TEXT NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        bytes INTEGER NOT NULL,
        data BLOB NOT NULL,
        version INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS studio_knowledge (
        id TEXT PRIMARY KEY,
        draft TEXT NOT NULL,
        approved TEXT,
        approved_version INTEGER,
        version INTEGER NOT NULL,
        archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        approved_at TEXT,
        approved_by TEXT
      );
      CREATE TABLE IF NOT EXISTS studio_ai_generations (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL REFERENCES studio_documents(id) ON DELETE CASCADE,
        version INTEGER NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS studio_ai_generations_document ON studio_ai_generations(document_id);
    `)
      migrateIndustryAtlas(db)
    })()
  } catch (error) {
    db.close()
    throw error
  }
  return db
}

export function audit(
  db: StudioDatabase,
  actorId: string | null,
  action: string,
  entityId?: string,
  details: Record<string, unknown> = {},
) {
  db.prepare(
    'INSERT INTO studio_audit (actor_id, action, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(
    actorId,
    action,
    entityId ?? null,
    JSON.stringify(details),
    new Date().toISOString(),
  )
}
