import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test, { afterEach, beforeEach } from 'node:test'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { openStudioDatabase } from '../../src/lib/studio/database'
import {
  activeIndustryTraits,
  StudioIndustryTaxonomy,
} from '../../src/lib/studio/industry-taxonomy'

let directory: string
let db: ReturnType<typeof openStudioDatabase>
let auth: StudioAuth
let content: StudioContent
let taxonomy: StudioIndustryTaxonomy
let ownerToken: string

beforeEach(async () => {
  directory = mkdtempSync(join(tmpdir(), 'tbs-industry-taxonomy-'))
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  const secret = 'taxonomy-setup-token-with-more-than-thirty-two-characters'
  await auth.setupOwner(
    {
      email: 'taxonomy-owner@example.test',
      name: 'Taxonomy Owner',
      password: 'Taxonomy-owner-password-728!',
    },
    secret,
    secret,
  )
  ownerToken = (
    await auth.login(
      'taxonomy-owner@example.test',
      'Taxonomy-owner-password-728!',
      null,
    )
  ).token
  taxonomy = new StudioIndustryTaxonomy(db, auth)
})

afterEach(() => {
  db.close()
  rmSync(directory, { recursive: true, force: true })
})

test('taxonomy validates identities and saves with optimistic version and audit', () => {
  const initial = taxonomy.read()
  assert.equal(initial.version, 0)
  assert.ok(initial.traits.length >= 5)
  assert.throws(
    () =>
      taxonomy.save(ownerToken, 0, {
        traits: [
          initial.traits[0],
          { ...initial.traits[1], slug: initial.traits[0].slug },
        ],
      }),
    /slug/i,
  )
  assert.throws(
    () =>
      taxonomy.save(ownerToken, 0, {
        traits: [
          {
            ...initial.traits[0],
            group: 'unknown',
            order: Number.POSITIVE_INFINITY,
          },
        ],
      }),
    /Invalid enum value|finite/i,
  )
  assert.throws(
    () =>
      taxonomy.save(ownerToken, 0, {
        traits: initial.traits.slice(1),
      }),
    { code: 'TRAIT_IN_USE' },
  )

  const archivedTraits = initial.traits.map((trait, index) =>
    index === 0 ? { ...trait, active: false } : trait,
  )
  const saved = taxonomy.save(ownerToken, 0, { traits: archivedTraits })
  assert.equal(saved.version, 1)
  assert.equal(saved.traits[0].label, initial.traits[0].label)
  assert.equal(saved.traits[0].active, false)
  assert.equal(
    (
      db
        .prepare("SELECT COUNT(*) count FROM studio_audit WHERE action='industry-taxonomy.saved'")
        .get() as { count: number }
    ).count,
    1,
  )

  const auditBefore = (
    db.prepare('SELECT COUNT(*) count FROM studio_audit').get() as {
      count: number
    }
  ).count
  assert.throws(
    () => taxonomy.save(ownerToken, 0, { traits: archivedTraits }),
    { code: 'VERSION_CONFLICT' },
  )
  assert.equal(
    (
      db.prepare('SELECT COUNT(*) count FROM studio_audit').get() as {
        count: number
      }
    ).count,
    auditBefore,
  )
})

test('editor can save taxonomy while SEO and viewer roles cannot mutate it', async () => {
  const owner = auth.session(ownerToken)!
  for (const role of ['editor', 'seo', 'viewer'] as const)
    await auth.createUser(owner, {
      email: `${role}@example.test`,
      name: role,
      password: `Taxonomy-${role}-password-728!`,
      role,
    })

  const editorToken = (
    await auth.login(
      'editor@example.test',
      'Taxonomy-editor-password-728!',
      null,
    )
  ).token
  const first = taxonomy.read()
  assert.equal(
    taxonomy.save(editorToken, first.version, { traits: first.traits }).version,
    1,
  )

  for (const role of ['seo', 'viewer'] as const) {
    const token = (
      await auth.login(
        `${role}@example.test`,
        `Taxonomy-${role}-password-728!`,
        null,
      )
    ).token
    assert.throws(
      () => taxonomy.save(token, taxonomy.read().version, { traits: taxonomy.read().traits }),
      { code: 'FORBIDDEN' },
    )
  }
})

test('archived referenced traits remain readable but leave active filters', () => {
  const item = content.list().find((entry) => entry.kind === 'industry')!
  const document = content.get(item.id)
  const traitSlug = document.draft.kind === 'industry' ? document.draft.data.traits[0] : ''
  const approved = content.save(ownerToken, item.id, item.version, {
    ...document.draft,
    data: {
      ...document.draft.data,
      review: {
        status: 'approved',
        reviewer: 'Bộ phận Xuất nhập khẩu TBS',
        reviewedAt: '2026-09-28T08:00:00.000Z',
        nextReviewAt: '2027-03-28T08:00:00.000Z',
      },
    },
  })
  content.publish(ownerToken, approved.id, approved.version)

  const initial = taxonomy.read()
  const archived = taxonomy.save(ownerToken, initial.version, {
    traits: initial.traits.map((trait) =>
      trait.slug === traitSlug ? { ...trait, active: false } : trait,
    ),
  })
  const published = content.publishedAt(content.get(item.id).publishedPath!)!
  assert.equal(published.kind, 'industry')
  if (published.kind === 'industry') assert.ok(published.data.traits.includes(traitSlug))
  assert.ok(archived.traits.some((trait) => trait.slug === traitSlug && !trait.active))
  assert.equal(
    activeIndustryTraits(archived).some((trait) => trait.slug === traitSlug),
    false,
  )
})
