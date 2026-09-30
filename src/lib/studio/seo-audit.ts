import { load } from 'cheerio'
import type { ContentDocument, ContentPayload } from './content-model'
import { fixedTemplate } from './fixed-page-registry'
import { legacyServiceAliases, site } from '../../data/marketing'
import {
  searchTitle,
  type HtmlAudit,
  type SeoIssue,
  type LinkSuggestion,
} from './seo-model'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
const route = (path: string) => path.split(/[?#]/)[0].replace(/\/$/, '') || '/'
const aliases = new Set(
  Object.keys(legacyServiceAliases).map((slug) => `/dich-vu/${slug}`),
)
const managed = (path: string, paths: Set<string>) =>
  paths.has(route(path)) ||
  aliases.has(route(path)) ||
  route(path) === '/sitemap'

function references(payload: ContentPayload) {
  if (payload.kind === 'industry')
    return payload.data.serviceSlugs.map((slug) => `/dich-vu/${slug}`)
  if (payload.kind !== 'page') return []
  return fixedTemplate(payload.data.slug)!
    .fields.filter((field) => field.kind === 'link')
    .map((field) => payload.data.fields[field.key])
    .filter((value) => !value.startsWith('#'))
}

export function auditDrafts(
  documents: ContentDocument[],
  redirectPaths: string[] = [],
  brand = 'TBS GROUP',
) {
  const paths = new Set(
    documents
      .filter((document) => document.published && document.publishedPath)
      .map((document) => document.publishedPath!),
  )
  const drafts = new Set(documents.map((document) => document.path))
  const redirects = new Set(redirectPaths.map(route))
  const duplicate = (value: string, field: 'title' | 'description') =>
    value &&
    documents.filter(
      (document) => normalize(document.draft.seo[field]) === normalize(value),
    ).length > 1
  return documents.map((document) => {
    const payload = document.draft,
      issues: SeoIssue[] = []
    const add = (
      code: string,
      severity: SeoIssue['severity'],
      message: string,
      field: string,
      detail?: string,
    ) => issues.push({ code, severity, message, field, detail })
    if (!payload.seo.description)
      add(
        'missing-description',
        'warning',
        'Chưa có meta description.',
        'seo.description',
      )
    for (const field of ['title', 'description'] as const)
      if (duplicate(payload.seo[field], field))
        add(
          `duplicate-${field}`,
          'warning',
          `Trùng ${field === 'title' ? 'tiêu đề SEO' : 'meta description'} với nội dung khác.`,
          `seo.${field}`,
        )
    if (searchTitle(payload, brand).length > 70)
      add(
        'long-title',
        'info',
        'Tiêu đề dài, nên xem lại phần thông tin quan trọng ở đầu.',
        'seo.title',
        `${searchTitle(payload, brand).length} ký tự, gồm tên thương hiệu. Đây là gợi ý biên tập, không phải giới hạn của Google.`,
      )
    if (payload.seo.description.length > 180)
      add(
        'long-description',
        'info',
        'Mô tả dài, nên ưu tiên thông tin chính ở đầu.',
        'seo.description',
        `${payload.seo.description.length} ký tự. Google có thể chọn đoạn trích khác.`,
      )
    if (!payload.seo.image)
      add(
        'missing-social-image',
        'info',
        'Chưa chọn ảnh Open Graph.',
        'seo.image',
      )
    if (payload.seo.noindex)
      add(
        'document-noindex',
        'info',
        'Trang này được đặt không lập chỉ mục.',
        'seo.noindex',
      )
    if (
      payload.seo.canonical &&
      route(payload.seo.canonical) !== document.path
    ) {
      const target = documents.find(
        (item) =>
          item.publishedPath === route(payload.seo.canonical) && item.published,
      )
      add(
        target ? 'canonical-other' : 'canonical-missing',
        target ? 'info' : 'warning',
        target
          ? 'Canonical trỏ đến trang khác.'
          : 'Canonical chưa trỏ đến nội dung đã xuất bản.',
        'seo.canonical',
        payload.seo.canonical,
      )
    }
    for (const path of Array.from(new Set(references(payload))))
      if (redirects.has(route(path)))
        add(
          'link-redirect',
          'info',
          'Liên kết đi qua chuyển hướng; có thể cập nhật URL đích trực tiếp.',
          'data',
          path,
        )
      else if (!managed(path, paths))
        add(
          drafts.has(route(path)) ? 'link-unpublished' : 'link-unmanaged',
          'warning',
          drafts.has(route(path))
            ? 'URL đích mới có trong bản nháp, chưa được xuất bản.'
            : 'Liên kết không có trong danh mục nội dung.',
          'data',
          path,
        )
    return {
      id: document.id,
      path: document.path,
      title: payload.data.title,
      version: document.version,
      published: !!document.published,
      issues,
      live: null,
    }
  })
}

export function inspectHtml(
  html: string,
  options: {
    path: string
    paths: string[]
    redirectPaths?: string[]
    assetExists: (path: string) => boolean
  },
): HtmlAudit {
  const $ = load(html),
    main = $('main').first(),
    issues: SeoIssue[] = []
  const paths = new Set(options.paths.map(route))
  const redirects = new Set((options.redirectPaths || []).map(route))
  const add = (
    code: string,
    severity: SeoIssue['severity'],
    message: string,
    detail?: string,
  ) => issues.push({ code, severity, message, field: 'html', detail })
  const headings = main.find('h1,h2,h3,h4,h5,h6')
  const h1 = main.find('h1')
  if (h1.length !== 1 || !h1.text().trim())
    add('h1-count', 'error', 'Trang cần một H1 có nội dung.', `${h1.length} H1`)
  let previous = 0
  headings.each((_, node) => {
    const level = Number(node.tagName.slice(1))
    if (previous && level > previous + 1)
      add(
        'heading-order',
        'warning',
        'Thứ bậc tiêu đề bị nhảy cấp.',
        `${node.tagName.toUpperCase()}: ${$(node).text().slice(0, 160)}`,
      )
    previous = level
  })
  main.find('img').each((_, node) => {
    const image = $(node),
      src = image.attr('src') || ''
    const decorative =
      image.attr('role') === 'presentation' ||
      image.attr('aria-hidden') === 'true'
    if (!decorative && !image.attr('alt')?.trim())
      add('image-alt', 'warning', 'Ảnh chưa có mô tả thay thế.', src)
    if (
      src.startsWith('/images/marketing/') ||
      src.startsWith('/api/studio/media/')
    ) {
      if (!options.assetExists(src))
        add('image-missing', 'error', 'Không tìm thấy tệp ảnh nội bộ.', src)
    } else if (!src) add('image-missing', 'error', 'Ảnh chưa có nguồn tệp.')
    else
      add(
        'image-unchecked',
        'info',
        'Nguồn ảnh ngoài thư viện chưa được kiểm tra.',
        src,
      )
  })
  main.find('a[href]').each((_, node) => {
    const href = $(node).attr('href')!
    if (/^(tel:|mailto:)/i.test(href)) return
    let url: URL
    try {
      url = new URL(
        href,
        `${site.url}${options.path === '/' ? '/' : `${options.path}/`}`,
      )
    } catch {
      add('link-invalid', 'warning', 'Liên kết không hợp lệ.', href)
      return
    }
    if (url.origin !== site.url) return
    if (redirects.has(route(url.pathname)))
      add(
        'link-redirect',
        'info',
        'Liên kết đi qua chuyển hướng; có thể cập nhật URL đích trực tiếp.',
        href,
      )
    else if (!managed(url.pathname, paths))
      add(
        'link-unmanaged',
        'warning',
        'URL không có trong danh mục xuất bản; cần kiểm tra.',
        href,
      )
    if (route(url.pathname) === route(options.path) && url.hash) {
      let id: string
      try {
        id = decodeURIComponent(url.hash.slice(1))
      } catch {
        id = url.hash.slice(1)
      }
      if (
        !$('[id]')
          .toArray()
          .some((node) => $(node).attr('id') === id)
      )
        add(
          'anchor-missing',
          'warning',
          'Không tìm thấy mục được liên kết trong trang.',
          href,
        )
    }
  })
  if (
    !main
      .find('p,li,td,dd')
      .toArray()
      .some((node) => $(node).text().trim().length > 0)
  )
    add(
      'missing-main-copy',
      'warning',
      'Chưa tìm thấy phần nội dung chính ngoài tiêu đề.',
    )
  const seen = new Set<string>()
  return {
    issues: issues.filter((issue) => {
      const key = `${issue.code}:${issue.detail || ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }),
    headings: headings.length,
    images: main.find('img').length,
    links: main.find('a[href]').length,
    checkedAt: new Date().toISOString(),
    status: 'checked',
  }
}

export function suggestLinks(
  source: ContentDocument,
  documents: ContentDocument[],
): LinkSuggestion[] {
  const stop = new Set([
    'cua',
    'cho',
    'cac',
    'voi',
    'trong',
    'nhung',
    'mot',
    'den',
    'tai',
    'khi',
    'theo',
    'tbs',
    'group',
  ])
  const terms = (payload: ContentPayload) =>
    new Set(
      normalize(`${payload.data.title} ${payload.data.summary}`)
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2 && !stop.has(word)),
    )
  const sourceTerms = terms(source.draft),
    existing = new Set(references(source.draft).map(route))
  return documents
    .filter(
      (item) =>
        item.id !== source.id &&
        item.published &&
        item.publishedPath &&
        !existing.has(item.publishedPath),
    )
    .map((item) => ({
      id: item.id,
      path: item.publishedPath!,
      title: item.published!.data.title,
      terms: Array.from(terms(item.published!)).filter((term) =>
        sourceTerms.has(term),
      ),
    }))
    .filter((item) => item.terms.length >= 2)
    .sort(
      (a, b) => b.terms.length - a.terms.length || a.path.localeCompare(b.path),
    )
    .slice(0, 5)
}
