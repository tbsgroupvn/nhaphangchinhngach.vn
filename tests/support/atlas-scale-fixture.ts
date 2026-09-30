// Dựng CSDL Studio cách ly có ~100 ngành hàng đã duyệt/xuất bản qua đúng API Studio.
// Không bao giờ chạy trên .data thật: bắt buộc truyền thư mục đích mới.
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { industryTraits } from '../../src/data/industry-atlas'

async function main() {
  const target = process.argv[2]
  const mode = process.argv[3] || 'normal'
  if (!target) throw new Error('Usage: atlas-scale-fixture.ts <empty-dir> [normal|stale]')
  const directory = resolve(target)
  if (directory === resolve('.data')) throw new Error('Refusing to touch the real .data directory')
  if (existsSync(directory) && readdirSync(directory).length)
    throw new Error(`Target directory is not empty: ${directory}`)
  mkdirSync(directory, { recursive: true })
  const db = openStudioDatabase(join(directory, 'studio.sqlite'))
  const auth = new StudioAuth(db)
  const content = new StudioContent(db, auth)
  content.seedMarketing()
  const secret = 'atlas-scale-fixture-bootstrap-token-32-chars'
  await auth.setupOwner(
    { name: 'Atlas fixture', email: 'atlas@example.test', password: 'Atlas-fixture-password-728!' },
    secret,
    secret,
  )
  const { token } = await auth.login('atlas@example.test', 'Atlas-fixture-password-728!', null)
  const reviewedAt = '2026-09-28T09:00:00.000Z'
  const review = { status: 'approved' as const, reviewer: 'Fixture reviewer', reviewedAt, nextReviewAt: '' }
  const images = [
    '/images/marketing/containers.webp',
    '/images/marketing/sourcing.webp',
  ]
  const groups = ['may-det', 'pin-nang-luong', 'linh-kien-o-to', 'dien-tu', 'bao-bi']
  const titles = ['Máy dệt', 'Pin năng lượng', 'Linh kiện ô tô', 'Điện tử', 'Bao bì']
  let order = 100
  for (const [groupIndex, group] of groups.entries()) {
    const categorySlug = `zz-scale-${group}`
    const category = content.create(token, {
      kind: 'industryCategory',
      data: {
        slug: categorySlug,
        title: `Nhóm thử ${titles[groupIndex]}`,
        summary: `Nhóm dữ liệu kiểm thử quy mô ${titles[groupIndex]}.`,
        image: images[groupIndex % 2],
        order: order++,
        featuredIndustryIds: [],
        review,
      },
      seo: { title: `Nhóm thử ${titles[groupIndex]}`, description: 'Kiểm thử', canonical: '', image: '', noindex: true },
    })
    const created = []
    for (let index = 1; index <= 20; index++) {
      const slug = `${group}-${String(index).padStart(3, '0')}`
      created.push(
        content.create(token, {
          kind: 'industry',
          data: {
            slug,
            categorySlug,
            title: `${titles[groupIndex]} thử ${index}`,
            shortTitle: `${titles[groupIndex]} ${index}`,
            summary: `Mục kiểm thử quy mô số ${index} của nhóm ${titles[groupIndex]}.`,
            image: images[index % 2],
            aliases: [`${group} alias ${index}`],
            searchTerms: [],
            models: [`ZZ-${group.toUpperCase()}-${index}`],
            uses: ['Dữ liệu kiểm thử quy mô.'],
            materials: ['thép'],
            traits: [industryTraits[index % industryTraits.length].slug],
            details: ['Đoạn mô tả kiểm thử quy mô.'],
            inputs: ['Thông tin kiểm thử cần chuẩn bị.'],
            preparationItems: [],
            technicalInputs: [],
            packingNotes: [],
            verificationPoints: [],
            proofItems: [],
            serviceSlugs: [],
            articleSlugs: [],
            faqs: [],
            saleBriefItems: [],
            review,
          },
          seo: { title: `${titles[groupIndex]} thử ${index}`, description: 'Kiểm thử', canonical: '', image: '', noindex: true },
        }),
      )
    }
    content.publish(token, category.id, category.version)
    for (const industry of created) content.publish(token, industry.id, industry.version)
  }
  if (mode === 'stale') {
    // Lưu một chỉ mục "tốt gần nhất" rồi để server chạy với lỗi dựng chỉ mục.
    const { readPublicIndustryAtlas, readIndustrySearchProjection } = await import('../../src/lib/industries/public')
    readIndustrySearchProjection(readPublicIndustryAtlas(db), { db })
    const extra = content.list().find((item) => item.kind === 'industry' && item.path.endsWith('bao-bi-020'))!
    const document = content.get(extra.id)
    const payload = document.draft
    if (payload.kind !== 'industry') throw new Error('unexpected kind')
    const saved = content.save(token, extra.id, document.version, {
      ...payload,
      data: { ...payload.data, summary: `${payload.data.summary} Đã đổi sau chỉ mục tốt.` },
    })
    content.publish(token, saved.id, saved.version)
  }
  db.close()
  console.log(`Atlas scale fixture ready in ${directory} (${mode})`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
