import assert from 'node:assert/strict'
import test from 'node:test'
import {
  industryCategories,
  industries,
} from '../../src/data/industry-atlas'
import {
  contentPath,
  contentSchema,
  industryCategorySchema,
  industryPublicationSchema,
  industrySchema,
} from '../../src/lib/studio/content-model'

const seo = {
  title: 'Ngành hàng thử nghiệm',
  description: 'Mô tả thử nghiệm cho Industry Atlas.',
  canonical: '',
  noindex: false,
  image: '/images/marketing/containers.webp',
}

test('category and industry seeds satisfy the two-level Atlas contract', () => {
  assert.deepEqual(
    industryCategories.map((item) => item.slug),
    ['gia-dung-noi-that', 'may-moc-day-chuyen'],
  )
  assert.equal(industries.length, 3)

  for (const category of industryCategories) {
    const payload = contentSchema.parse({
      kind: 'industryCategory',
      data: industryCategorySchema.parse(category),
      seo,
    })
    assert.equal(contentPath(payload), `/nganh-hang/${category.slug}`)
  }

  for (const industry of industries) {
    const payload = contentSchema.parse({
      kind: 'industry',
      data: industrySchema.parse(industry),
      seo,
    })
    assert.equal(
      contentPath(payload),
      `/nganh-hang/${industry.categorySlug}/${industry.slug}`,
    )
    assert.equal(industry.review.status, 'legacy')
  }
})

test('industry requires category and bounds searchable taxonomy fields', () => {
  const industry = industries[0]
  assert.throws(
    () => industrySchema.parse({ ...industry, categorySlug: undefined }),
    /Required/,
  )
  assert.throws(
    () =>
      industrySchema.parse({
        ...industry,
        aliases: Array.from({ length: 51 }, (_, index) => `alias-${index}`),
      }),
    /Array must contain at most 50 element/,
  )
  assert.throws(
    () =>
      industrySchema.parse({
        ...industry,
        traits: ['x'.repeat(121)],
      }),
    /String must contain at most 120 character/,
  )
})

test('publication rejects legacy review and proof without approved rights metadata', () => {
  const base = industries[0]
  assert.equal(industryPublicationSchema.safeParse(base).success, false)

  const approved = {
    ...base,
    review: {
      status: 'approved' as const,
      reviewer: 'Bộ phận Xuất nhập khẩu TBS',
      reviewedAt: '2026-09-28T08:00:00.000Z',
      nextReviewAt: '2027-03-28T08:00:00.000Z',
    },
    proofItems: [
      {
        id: 'proof-warehouse-1',
        mediaId: '11111111-1111-4111-8111-111111111111',
        title: 'Kiểm tra tại kho',
        caption: 'Hình ảnh phạm vi kiểm đếm đã thống nhất.',
        sourceRef: 'TBS-OPS-2026-001',
        sourceDate: '2026-09-20',
        scopeNote: 'Chỉ minh họa bước kiểm đếm của lô được ghi nhận.',
        rightsStatus: 'pending' as const,
        reviewer: '',
        reviewedAt: '',
      },
    ],
  }
  const result = industryPublicationSchema.safeParse(approved)
  assert.equal(result.success, false)
  if (!result.success)
    assert.deepEqual(
      result.error.issues.map((issue) => issue.path.join('.')),
      ['proofItems.0.rightsStatus', 'proofItems.0.reviewer', 'proofItems.0.reviewedAt'],
    )
})
