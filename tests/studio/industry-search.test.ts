import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { industryCategories, industries, industryTraits } from '../../src/data/industry-atlas'
import { openStudioDatabase } from '../../src/lib/studio/database'
import {
  buildPublicIndustryAtlas,
  getIndustryProjectionStatus,
  readPublicIndustryAtlas,
  readIndustrySearchProjection,
  type PublicIndustryAtlas,
} from '../../src/lib/industries/public'
import {
  buildIndustrySearchIndex,
  filterIndustries,
  normalizeIndustryQuery,
  parseIndustrySearchState,
} from '../../src/lib/industries/search'

function atlasFixture(): PublicIndustryAtlas {
  return {
    version: 'fixture-v1',
    categories: [
      {
        ...industryCategories[0],
        id: industryCategories[0].slug,
        path: `/nganh-hang/${industryCategories[0].slug}`,
      },
      {
        ...industryCategories[1],
        id: industryCategories[1].slug,
        path: `/nganh-hang/${industryCategories[1].slug}`,
      },
    ],
    industries: [
      {
        ...industries[0],
        id: industries[0].slug,
        path: `/nganh-hang/${industries[0].categorySlug}/${industries[0].slug}`,
      },
      {
        ...industries[1],
        id: industries[1].slug,
        path: `/nganh-hang/${industries[1].categorySlug}/${industries[1].slug}`,
      },
      {
        ...industries[2],
        id: industries[2].slug,
        path: `/nganh-hang/${industries[2].categorySlug}/${industries[2].slug}`,
      },
    ],
    traits: industryTraits.map((trait) => ({ ...trait })),
    featured: industries.map((industry) => industry.slug),
  }
}

test('Vietnamese normalization is bounded and ranking prefers title, alias, model, category then body', () => {
  assert.equal(normalizeIndustryQuery('  Máy dệt!!!  '), 'may det')
  assert.equal(normalizeIndustryQuery('ma\u0301y de\u0323t'), 'may det')
  assert.doesNotThrow(() => normalizeIndustryQuery('🧵 中文 \u0000'))
  assert.equal(normalizeIndustryQuery('a'.repeat(300)).length, 120)

  const atlas = atlasFixture()
  const category = atlas.categories[0]
  const base = atlas.industries[0]
  atlas.industries = [
    { ...base, id: 'body', slug: 'body', categorySlug: atlas.categories[1].slug, title: 'Khác', aliases: [], models: [], summary: 'Giải pháp máy dệt', path: `${atlas.categories[1].path}/body` },
    { ...base, id: 'category', slug: 'category', categorySlug: category.slug, title: 'Khác 2', aliases: [], models: [], summary: 'Khác', path: `${category.path}/category` },
    { ...base, id: 'model', slug: 'model', title: 'Khác 3', aliases: [], models: ['Máy dệt'], summary: 'Khác', path: `${category.path}/model` },
    { ...base, id: 'alias', slug: 'alias', title: 'Khác 4', aliases: ['Máy dệt'], models: [], summary: 'Khác', path: `${category.path}/alias` },
    { ...base, id: 'title', slug: 'title', title: 'Máy dệt', aliases: [], models: [], summary: 'Khác', path: `${category.path}/title` },
  ]
  atlas.categories[0] = { ...category, title: 'Máy dệt' }
  const results = filterIndustries(buildIndustrySearchIndex(atlas), {
    q: 'may det',
    category: '',
    traits: [],
  })
  assert.deepEqual(results.map((item) => item.id), [
    'title',
    'alias',
    'model',
    'category',
    'body',
  ])
})

test('URL state keeps only allowlisted categories and active traits with stable deduped filters', () => {
  const atlas = atlasFixture()
  atlas.traits[0] = { ...atlas.traits[0], active: false }
  const state = parseIndustrySearchState(
    {
      q: '  máy mới  ',
      category: atlas.categories[1].slug,
      traits: [
        atlas.traits[0].slug,
        atlas.traits[1].slug,
        atlas.traits[1].slug,
        'khong-hop-le',
      ],
    },
    atlas,
  )
  assert.deepEqual(state, {
    q: 'may moi',
    category: atlas.categories[1].slug,
    traits: [atlas.traits[1].slug],
  })
  assert.equal(atlas.traits.find((trait) => !trait.active)?.label, 'Cần kiểm đếm')
  assert.deepEqual(
    parseIndustrySearchState(
      new URLSearchParams('category=la&traits=la&traits=la&q=%F0%9F%A7%B5'),
      atlas,
    ),
    { q: '', category: '', traits: [] },
  )
})

test('public Atlas omits orphan publications and projection falls back to the last known good index', () => {
  const categoryPayload = {
    kind: 'industryCategory' as const,
    data: industryCategories[0],
    seo: {
      title: industryCategories[0].title,
      description: industryCategories[0].summary,
      canonical: '',
      image: industryCategories[0].image,
      noindex: false,
    },
  }
  const validPayload = {
    kind: 'industry' as const,
    data: industries[0],
    seo: {
      title: industries[0].title,
      description: industries[0].summary,
      canonical: '',
      image: industries[0].image,
      noindex: false,
    },
  }
  const orphanPayload = {
    ...validPayload,
    data: {
      ...validPayload.data,
      slug: 'payload-secret-should-not-leak',
      categorySlug: 'missing-category',
    },
  }
  const atlas = buildPublicIndustryAtlas(
    [
      { payload: categoryPayload, path: '/nganh-hang/gia-dung-noi-that', updatedAt: '2026-09-29T08:00:00.000Z' },
      { payload: validPayload, path: '/nganh-hang/gia-dung-noi-that/gia-dung-khong-dien', updatedAt: '2026-09-29T08:00:00.000Z' },
      { payload: orphanPayload, path: '/nganh-hang/missing-category/payload-secret-should-not-leak', updatedAt: '2026-09-29T08:00:00.000Z' },
    ],
    { version: 3, traits: industryTraits },
  )
  assert.deepEqual(atlas.industries.map((item) => item.slug), ['gia-dung-khong-dien'])

  const folder = mkdtempSync(join(tmpdir(), 'tbs-industry-search-'))
  const db = openStudioDatabase(join(folder, 'studio.sqlite'))
  try {
    const fresh = readIndustrySearchProjection(atlas, { db })
    assert.equal(fresh.unavailable, false)
    assert.equal(fresh.stale, false)
    assert.equal(fresh.index.length, 1)
    assert.match(fresh.diagnostic, /omitted/i)
    assert.doesNotMatch(fresh.diagnostic, /payload-secret/i)

    const changed = { ...atlas, version: 'fixture-v2' }
    const stale = readIndustrySearchProjection(changed, {
      db,
      buildIndex: () => {
        throw new Error('payload-secret-should-not-leak')
      },
    })
    assert.equal(stale.stale, true)
    assert.equal(stale.unavailable, false)
    assert.deepEqual(stale.index, fresh.index)
    assert.doesNotMatch(stale.diagnostic, /payload-secret/i)
    assert.equal(getIndustryProjectionStatus(db).stale, true)
  } finally {
    db.close()
    rmSync(folder, { recursive: true, force: true })
  }
})

test('first projection failure is unavailable rather than an empty successful result', () => {
  const folder = mkdtempSync(join(tmpdir(), 'tbs-industry-search-empty-'))
  const db = openStudioDatabase(join(folder, 'studio.sqlite'))
  try {
    const projection = readIndustrySearchProjection(atlasFixture(), {
      db,
      buildIndex: () => {
        throw new Error('raw content must stay private')
      },
    })
    assert.equal(projection.unavailable, true)
    assert.equal(projection.stale, false)
    assert.deepEqual(projection.index, [])
    assert.doesNotMatch(projection.diagnostic, /raw content/i)
  } finally {
    db.close()
    rmSync(folder, { recursive: true, force: true })
  }
})

test('corrupt taxonomy setting degrades to seed trait labels instead of breaking public pages', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-atlas-taxonomy-'))
  const db = openStudioDatabase(join(directory, 'studio.sqlite'))
  try {
    db.prepare(
      `INSERT INTO studio_settings (key,value,updated_at) VALUES ('industries.taxonomy.v1','{broken',?)
       ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    ).run(new Date().toISOString())
    const atlas = readPublicIndustryAtlas(db)
    assert.deepEqual(
      atlas.traits.map((trait) => trait.slug).sort(),
      industryTraits.map((trait) => trait.slug).sort(),
    )
  } finally {
    db.close()
    rmSync(directory, { recursive: true, force: true })
  }
})
