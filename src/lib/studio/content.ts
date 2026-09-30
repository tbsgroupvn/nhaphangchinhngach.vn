import { randomUUID } from 'node:crypto'
import {
  articles,
  industries,
  services,
  legacyServiceAliases,
} from '../../data/marketing'
import { StudioAuth, requireCapability, type Capability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import { assertMediaReferences, snapshotMediaAlts } from './media-references'
import { fixedTemplates } from './fixed-page-registry'
import {
  contentSchema,
  industryPublicationSchema,
  seoSchema,
  contentPath,
  type ContentDocument,
  type ContentPayload,
  type ContentSummary,
} from './content-model'

type Row = {
  id: string
  kind: ContentPayload['kind']
  path: string
  draft: string
  published: string | null
  published_path: string | null
  version: number
  updated_at: string
  published_at: string | null
  archived_at: string | null
}
const decode = (row: Row): ContentDocument => ({
  id: row.id,
  kind: row.kind,
  path: row.path,
  draft: contentSchema.parse(JSON.parse(row.draft)),
  published: row.published
    ? contentSchema.parse(JSON.parse(row.published))
    : null,
  publishedPath: row.published_path,
  version: row.version,
  updatedAt: row.updated_at,
  publishedAt: row.published_at,
  archivedAt: row.archived_at,
})

export class StudioContent {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
  ) {}

  private authorize(token: string, capability: Capability) {
    const user = this.auth.session(token)
    if (!user)
      throw new StudioError(
        401,
        'Phiên đăng nhập không còn hợp lệ.',
        'UNAUTHENTICATED',
      )
    requireCapability(user, capability)
    return user
  }

  seedMarketing() {
    this.seedFixedPages()
    if (
      this.db
        .prepare(
          "SELECT key FROM studio_settings WHERE key = 'content.seed.v1'",
        )
        .get()
    )
      return
    this.db
      .transaction(() => {
        if (
          this.db
            .prepare(
              "SELECT key FROM studio_settings WHERE key = 'content.seed.v1'",
            )
            .get()
        )
          return
        const groups = [
          { kind: 'service', items: services },
          { kind: 'industry', items: industries },
          { kind: 'article', items: articles },
        ] as const
        for (const group of groups)
          for (const data of group.items) {
            const payload = contentSchema.parse({
              kind: group.kind,
              data,
              seo: {
                title: data.title,
                description: data.summary,
                canonical: '',
                noindex: false,
                image: data.image,
              },
            })
            const path = contentPath(payload)
            if (
              this.db
                .prepare(
                  'SELECT id FROM studio_documents WHERE path = ? OR published_path = ?',
                )
                .get(path, path)
            )
              continue
            const id = randomUUID(),
              now = new Date().toISOString(),
              json = JSON.stringify(payload)
            this.db
              .prepare(
                'INSERT INTO studio_documents (id,kind,path,draft,published,published_path,updated_at,published_at) VALUES (?,?,?,?,?,?,?,?)',
              )
              .run(id, payload.kind, path, json, json, path, now, now)
            this.record(id, 1, payload, 'seeded', null)
          }
        this.db
          .prepare(
            'INSERT INTO studio_settings (key,value,updated_at) VALUES (?,?,?)',
          )
          .run('content.seed.v1', 'true', new Date().toISOString())
      })
      .immediate()
  }

  private seedFixedPages() {
    const marker = 'content.fixed.seed.v1'
    if (
      this.db
        .prepare('SELECT key FROM studio_settings WHERE key = ?')
        .get(marker)
    )
      return
    this.db
      .transaction(() => {
        if (
          this.db
            .prepare('SELECT key FROM studio_settings WHERE key = ?')
            .get(marker)
        )
          return
        for (const template of fixedTemplates) {
          if (
            this.db
              .prepare(
                'SELECT id FROM studio_documents WHERE path = ? OR published_path = ?',
              )
              .get(template.path, template.path)
          )
            continue
          const payload = contentSchema.parse({
            kind: 'page',
            data: {
              slug: template.slug,
              title: template.title,
              summary: template.summary,
              image: template.image,
              fields: Object.fromEntries(
                template.fields.map((field) => [field.key, field.value]),
              ),
            },
            seo: {
              title: template.seoTitle,
              description: template.seoDescription,
              image: template.image,
              canonical: '',
              noindex: false,
            },
          })
          const id = randomUUID(),
            now = new Date().toISOString(),
            json = JSON.stringify(payload)
          this.db
            .prepare(
              'INSERT INTO studio_documents (id,kind,path,draft,published,published_path,updated_at,published_at) VALUES (?,?,?,?,?,?,?,?)',
            )
            .run(id, 'page', template.path, json, json, template.path, now, now)
          this.record(id, 1, payload, 'seeded', null)
        }
        this.db
          .prepare(
            'INSERT INTO studio_settings (key,value,updated_at) VALUES (?,?,?)',
          )
          .run(marker, 'true', new Date().toISOString())
      })
      .immediate()
  }

  get(id: string) {
    const row = this.db
      .prepare('SELECT * FROM studio_documents WHERE id = ?')
      .get(id) as Row | undefined
    if (!row)
      throw new StudioError(404, 'Không tìm thấy nội dung.', 'NOT_FOUND')
    return decode(row)
  }

  list(): ContentSummary[] {
    return (
      this.db
        .prepare('SELECT * FROM studio_documents ORDER BY updated_at DESC, id')
        .all() as Row[]
    ).map((row) => {
      const { draft, published, ...document } = decode(row)
      return {
        ...document,
        title: draft.data.title,
        status: document.archivedAt
          ? 'archived'
          : !published
          ? 'draft'
          : row.draft === row.published
            ? 'published'
            : 'changed',
      }
    })
  }

  publishedAt(path: string): ContentPayload | null {
    const row = this.db
      .prepare(
          'SELECT published FROM studio_documents WHERE published_path = ? AND published IS NOT NULL AND archived_at IS NULL',
      )
      .get(path.replace(/\/$/, '') || '/') as { published: string } | undefined
    return row ? contentSchema.parse(JSON.parse(row.published)) : null
  }

  preview(id: string) {
    return snapshotMediaAlts(this.db, this.get(id).draft)
  }

  publishedList() {
    return (
      this.db
        .prepare(
          'SELECT published,published_path,published_at FROM studio_documents WHERE published IS NOT NULL AND archived_at IS NULL ORDER BY rowid',
        )
        .all() as {
        published: string
        published_path: string
        published_at: string
      }[]
    ).map((row) => ({
      payload: contentSchema.parse(JSON.parse(row.published)),
      path: row.published_path,
      updatedAt: row.published_at,
    }))
  }

  revisions(id: string) {
    this.get(id)
    return this.db
      .prepare(
        'SELECT version,action,created_at AS createdAt FROM studio_revisions WHERE document_id = ? ORDER BY version DESC LIMIT 100',
      )
      .all(id) as { version: number; action: string; createdAt: string }[]
  }

  private checkVersion(document: ContentDocument, expected: number) {
    if (!Number.isSafeInteger(expected) || document.version !== expected)
      throw new StudioError(
        409,
        'Nội dung đã được người khác cập nhật. Tải lại phiên bản mới trước khi lưu.',
        'VERSION_CONFLICT',
      )
  }

  private activeChildren(categorySlug: string, publishedOnly = false) {
    const rows = this.db
      .prepare(
        `SELECT draft,published FROM studio_documents
         WHERE kind='industry' AND archived_at IS NULL`,
      )
      .all() as { draft: string; published: string | null }[]
    return rows.filter((row) => {
      const raw = publishedOnly ? row.published : row.draft
      if (!raw) return false
      const payload = contentSchema.parse(JSON.parse(raw))
      return (
        payload.kind === 'industry' &&
        payload.data.categorySlug === categorySlug
      )
    })
  }

  private assertActive(document: ContentDocument) {
    if (document.archivedAt)
      throw new StudioError(
        409,
        'Nội dung đang được lưu trữ. Hãy khôi phục trước khi chỉnh sửa.',
        'CONTENT_ARCHIVED',
      )
  }

  private assertIndustryCategory(
    payload: ContentPayload,
    requirePublished = false,
  ) {
    if (payload.kind !== 'industry') return
    const rows = this.db
      .prepare(
        `SELECT draft,published,archived_at FROM studio_documents
         WHERE kind='industryCategory'`,
      )
      .all() as {
      draft: string
      published: string | null
      archived_at: string | null
    }[]
    const category = rows.find((row) => {
      const draft = contentSchema.parse(JSON.parse(row.draft))
      return (
        draft.kind === 'industryCategory' &&
        draft.data.slug === payload.data.categorySlug
      )
    })
    if (!category || category.archived_at)
      throw new StudioError(
        409,
        'Nhóm ngành hàng không tồn tại hoặc đang được lưu trữ.',
        'INDUSTRY_CATEGORY_NOT_FOUND',
      )
    if (requirePublished && !category.published)
      throw new StudioError(
        409,
        'Nhóm ngành hàng cần được xuất bản trước.',
        'INDUSTRY_CATEGORY_UNPUBLISHED',
      )
  }

  private assertPublishable(payload: ContentPayload) {
    if (payload.kind === 'industry') {
      this.assertIndustryCategory(payload, true)
      const checked = industryPublicationSchema.safeParse(payload.data)
      if (!checked.success)
        throw new StudioError(
          409,
          checked.error.issues[0]?.message ||
            'Ngành hàng chưa đủ điều kiện xuất bản.',
          'INDUSTRY_REVIEW_REQUIRED',
        )
      for (const proof of checked.data.proofItems) {
        const media = this.db
          .prepare('SELECT alt FROM studio_media WHERE id=?')
          .get(proof.mediaId) as { alt: string } | undefined
        if (!media || !media.alt.trim())
          throw new StudioError(
            409,
            'Bằng chứng cần ảnh còn tồn tại và có mô tả thay thế.',
            'INDUSTRY_PROOF_MEDIA_REQUIRED',
          )
      }
    }
    if (
      payload.kind === 'industryCategory' &&
      this.activeChildren(payload.data.slug).length === 0
    )
      throw new StudioError(
        409,
        'Nhóm cần ít nhất một ngành hàng đang hoạt động.',
        'CATEGORY_EMPTY',
      )
  }

  private checkPath(payload: ContentPayload, id: string) {
    assertMediaReferences(this.db, payload)
    const path = contentPath(payload)
    const fixedRoute = this.fixedRoute(id)
    if (
      this.db
        .prepare('SELECT id FROM studio_redirects WHERE source = ?')
        .get(path)
    )
      throw new StudioError(
        409,
        'Đường dẫn đang được dùng để chuyển hướng. Xóa chuyển hướng trước khi tái sử dụng.',
        'PATH_CONFLICT',
      )
    if (
      fixedRoute &&
      payload.kind !== 'industry' &&
      payload.kind !== 'industryCategory' &&
      path !== fixedRoute
    )
      throw new StudioError(
        409,
        'Đường dẫn này thuộc cấu trúc website đã phát hành. Không thể đổi trong trình biên tập.',
        'FIXED_ROUTE',
      )
    if (
      payload.kind === 'service' &&
      Object.prototype.hasOwnProperty.call(
        legacyServiceAliases,
        payload.data.slug,
      )
    )
      throw new StudioError(
        409,
        'Đường dẫn đang được dùng để chuyển hướng.',
        'PATH_CONFLICT',
      )
    if (
      this.db
        .prepare(
          'SELECT id FROM studio_documents WHERE id != ? AND (path = ? OR published_path = ?)',
        )
        .get(id, path, path)
    )
      throw new StudioError(
        409,
        'Đường dẫn đã thuộc một nội dung khác.',
        'PATH_CONFLICT',
      )
    return path
  }

  fixedRoute(id: string) {
    const seed = this.db
      .prepare(
        "SELECT snapshot FROM studio_revisions WHERE document_id = ? AND version = 1 AND action = 'seeded'",
      )
      .get(id) as { snapshot: string } | undefined
    return seed
      ? contentPath(contentSchema.parse(JSON.parse(seed.snapshot)))
      : null
  }

  private record(
    id: string,
    version: number,
    payload: ContentPayload,
    action: string,
    actorId: string | null,
  ) {
    this.db
      .prepare(
        'INSERT INTO studio_revisions (document_id,version,snapshot,action,actor_id,created_at) VALUES (?,?,?,?,?,?)',
      )
      .run(
        id,
        version,
        JSON.stringify(payload),
        action,
        actorId,
        new Date().toISOString(),
      )
    audit(this.db, actorId, `content.${action}`, id, { version })
  }

  create(token: string, input: unknown) {
    const payload = contentSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.write')
        if (payload.kind === 'page')
          throw new StudioError(
            409,
            'Trang cố định đã được khởi tạo trong danh sách nội dung.',
            'FIXED_PAGE',
          )
        const id = randomUUID(),
          path = this.checkPath(payload, id)
        this.assertIndustryCategory(payload)
        this.db
          .prepare(
            'INSERT INTO studio_documents (id,kind,path,draft,updated_by,updated_at) VALUES (?,?,?,?,?,?)',
          )
          .run(
            id,
            payload.kind,
            path,
            JSON.stringify(payload),
            actor.id,
            new Date().toISOString(),
          )
        this.record(id, 1, payload, 'created', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  save(token: string, id: string, expected: number, input: unknown) {
    const payload = contentSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.write'),
          document = this.get(id)
        this.checkVersion(document, expected)
        this.assertActive(document)
        if (
          document.kind === 'page' &&
          document.draft.data.slug !== payload.data.slug
        )
          throw new StudioError(
            409,
            'Không thể thay đổi mẫu hoặc đường dẫn trang cố định.',
            'FIXED_PAGE',
          )
        if (document.kind !== payload.kind)
          throw new StudioError(
            409,
            'Không thể thay đổi loại nội dung.',
            'KIND_CONFLICT',
          )
        if (
          document.kind === 'industryCategory' &&
          document.draft.data.slug !== payload.data.slug &&
          this.activeChildren(document.draft.data.slug).length > 0
        )
          throw new StudioError(
            409,
            'Không thể đổi đường dẫn nhóm khi còn ngành hàng đang tham chiếu.',
            'CATEGORY_HAS_CHILDREN',
          )
        this.assertIndustryCategory(payload)
        const path = this.checkPath(payload, id),
          version = document.version + 1
        this.db
          .prepare(
            'UPDATE studio_documents SET path = ?, draft = ?, version = ?, updated_by = ?, updated_at = ? WHERE id = ?',
          )
          .run(
            path,
            JSON.stringify(payload),
            version,
            actor.id,
            new Date().toISOString(),
            id,
          )
        this.record(id, version, payload, 'saved', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  saveSeo(token: string, id: string, expected: number, input: unknown) {
    const seo = seoSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'seo.write')
        const document = this.get(id)
        this.checkVersion(document, expected)
        this.assertActive(document)
        const payload = { ...document.draft, seo }
        assertMediaReferences(this.db, payload)
        const version = document.version + 1
        this.db
          .prepare(
            'UPDATE studio_documents SET draft = ?, version = ?, updated_by = ?, updated_at = ? WHERE id = ?',
          )
          .run(
            JSON.stringify(payload),
            version,
            actor.id,
            new Date().toISOString(),
            id,
          )
        this.record(id, version, payload, 'seo-saved', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  publish(token: string, id: string, expected: number) {
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.publish'),
          document = this.get(id)
        this.checkVersion(document, expected)
        this.assertActive(document)
        this.assertPublishable(document.draft)
        const path = this.checkPath(document.draft, id),
          version = document.version + 1,
          now = new Date().toISOString()
        const snapshot = snapshotMediaAlts(this.db, document.draft)
        const json = JSON.stringify(snapshot)
        this.db
          .prepare(
            'UPDATE studio_documents SET draft = ?, published = ?, published_path = ?, published_at = ?, version = ?, updated_by = ?, updated_at = ? WHERE id = ?',
          )
          .run(json, json, path, now, version, actor.id, now, id)
        if (document.publishedPath && document.publishedPath !== path) {
          const redirectId = randomUUID()
          this.db
            .prepare(
              'INSERT INTO studio_redirects (id,source,target_id,status,version,updated_at) VALUES (?,?,?,308,1,?)',
            )
            .run(redirectId, document.publishedPath, id, now)
          audit(this.db, actor.id, 'redirect.created', redirectId, {
            source: document.publishedPath,
            targetId: id,
            status: 308,
            reason: 'publication-move',
          })
        }
        this.record(id, version, snapshot, 'published', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  unpublish(token: string, id: string, expected: number) {
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.publish'),
          document = this.get(id)
        this.checkVersion(document, expected)
        this.assertActive(document)
        if (
          document.kind === 'industryCategory' &&
          this.activeChildren(document.draft.data.slug, true).length > 0
        )
          throw new StudioError(
            409,
            'Nhóm còn ngành hàng đã xuất bản. Hãy chuyển hoặc gỡ các ngành hàng trước.',
            'CATEGORY_HAS_PUBLISHED_CHILDREN',
          )
        if (
          document.kind !== 'industry' &&
          this.db
            .prepare('SELECT id FROM studio_redirects WHERE target_id = ?')
            .get(id)
        )
          throw new StudioError(
            409,
            'Trang này đang là đích chuyển hướng. Đổi đích hoặc xóa các chuyển hướng trước khi gỡ xuất bản.',
            'REDIRECT_IN_USE',
          )
        const version = document.version + 1
        this.db
          .prepare(
            'UPDATE studio_documents SET published = NULL, published_path = NULL, published_at = NULL, version = ?, updated_by = ?, updated_at = ? WHERE id = ?',
          )
          .run(version, actor.id, new Date().toISOString(), id)
        this.record(id, version, document.draft, 'unpublished', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  restore(token: string, id: string, expected: number, revision: number) {
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.write'),
          document = this.get(id)
        this.checkVersion(document, expected)
        this.assertActive(document)
        const row = this.db
          .prepare(
            'SELECT snapshot FROM studio_revisions WHERE document_id = ? AND version = ?',
          )
          .get(id, revision) as { snapshot: string } | undefined
        if (!row)
          throw new StudioError(404, 'Không tìm thấy phiên bản.', 'NOT_FOUND')
        const payload = contentSchema.parse(JSON.parse(row.snapshot))
        this.assertIndustryCategory(payload)
        const path = this.checkPath(payload, id),
          version = document.version + 1
        this.db
          .prepare(
            'UPDATE studio_documents SET path = ?, draft = ?, version = ?, updated_by = ?, updated_at = ? WHERE id = ?',
          )
          .run(
            path,
            JSON.stringify(payload),
            version,
            actor.id,
            new Date().toISOString(),
            id,
          )
        this.record(id, version, payload, 'restored', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  archive(token: string, id: string, expected: number) {
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.publish')
        const document = this.get(id)
        this.checkVersion(document, expected)
        this.assertActive(document)
        if (
          document.kind !== 'industry' &&
          document.kind !== 'industryCategory'
        )
          throw new StudioError(
            409,
            'Chỉ nhóm và ngành hàng hỗ trợ lưu trữ.',
            'ARCHIVE_UNSUPPORTED',
          )
        if (
          document.kind === 'industryCategory' &&
          this.activeChildren(document.draft.data.slug).length > 0
        )
          throw new StudioError(
            409,
            'Nhóm còn ngành hàng đang hoạt động. Hãy chuyển hoặc lưu trữ các ngành hàng trước.',
            'CATEGORY_HAS_CHILDREN',
          )
        const version = document.version + 1
        const now = new Date().toISOString()
        this.db
          .prepare(`UPDATE studio_documents SET
            published=NULL,published_path=NULL,published_at=NULL,
            archived_at=?,version=?,updated_by=?,updated_at=? WHERE id=?`)
          .run(now, version, actor.id, now, id)
        this.record(id, version, document.draft, 'archived', actor.id)
        return this.get(id)
      })
      .immediate()
  }

  reactivate(token: string, id: string, expected: number) {
    return this.db
      .transaction(() => {
        const actor = this.authorize(token, 'content.publish')
        const document = this.get(id)
        this.checkVersion(document, expected)
        if (!document.archivedAt)
          throw new StudioError(
            409,
            'Nội dung không ở trạng thái lưu trữ.',
            'CONTENT_NOT_ARCHIVED',
          )
        this.assertIndustryCategory(document.draft)
        const version = document.version + 1
        const now = new Date().toISOString()
        this.db
          .prepare(`UPDATE studio_documents SET
            archived_at=NULL,version=?,updated_by=?,updated_at=? WHERE id=?`)
          .run(version, actor.id, now, id)
        this.record(id, version, document.draft, 'reactivated', actor.id)
        return this.get(id)
      })
      .immediate()
  }
}
