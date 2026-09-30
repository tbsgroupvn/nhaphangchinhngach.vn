import { industryTraits } from '../../data/industry-atlas'
import { StudioAuth, requireCapability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import {
  industryTaxonomyInputSchema,
  industryTaxonomySchema,
  type IndustryTaxonomy,
  type IndustryTrait,
} from './industry-taxonomy-model'

export const industryTaxonomySettingsKey = 'industries.taxonomy.v1'

export function readIndustryTaxonomy(
  db: StudioDatabase,
): IndustryTaxonomy {
  const row = db
    .prepare('SELECT value FROM studio_settings WHERE key=?')
    .get(industryTaxonomySettingsKey) as { value: string } | undefined
  return row
    ? industryTaxonomySchema.parse(JSON.parse(row.value))
    : { version: 0, traits: industryTraits.map((trait) => ({ ...trait })) }
}

export function activeIndustryTraits(
  taxonomy: IndustryTaxonomy,
): IndustryTrait[] {
  return taxonomy.traits
    .filter((trait) => trait.active)
    .sort((left, right) => left.order - right.order || left.label.localeCompare(right.label, 'vi'))
}

export class StudioIndustryTaxonomy {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
  ) {}

  read() {
    return readIndustryTaxonomy(this.db)
  }

  save(token: string, expectedVersion: number, input: unknown) {
    const parsed = industryTaxonomyInputSchema.parse(input)
    return this.db
      .transaction(() => {
        const user = this.auth.session(token)
        if (!user)
          throw new StudioError(
            401,
            'Phiên đăng nhập không còn hợp lệ.',
            'UNAUTHENTICATED',
          )
        requireCapability(user, 'content.write')
        const current = this.read()
        if (
          !Number.isSafeInteger(expectedVersion) ||
          expectedVersion !== current.version
        )
          throw new StudioError(
            409,
            'Taxonomy đã được người khác cập nhật. Tải lại trước khi lưu.',
            'VERSION_CONFLICT',
          )
        const nextById = new Map(parsed.traits.map((trait) => [trait.id, trait]))
        for (const existing of current.traits) {
          const next = nextById.get(existing.id)
          if (!next)
            throw new StudioError(
              409,
              'Không xóa đặc tính. Hãy chuyển sang trạng thái lưu trữ.',
              'TRAIT_IN_USE',
            )
          if (next.slug !== existing.slug)
            throw new StudioError(
              409,
              'Slug đặc tính đã được dùng làm tham chiếu và không thể đổi.',
              'TRAIT_SLUG_FIXED',
            )
        }
        const value = industryTaxonomySchema.parse({
          version: current.version + 1,
          traits: parsed.traits,
        })
        const now = new Date().toISOString()
        this.db
          .prepare(`INSERT INTO studio_settings (key,value,updated_at)
            VALUES (?,?,?)
            ON CONFLICT(key) DO UPDATE SET
              value=excluded.value,updated_at=excluded.updated_at`)
          .run(industryTaxonomySettingsKey, JSON.stringify(value), now)
        audit(
          this.db,
          user.id,
          'industry-taxonomy.saved',
          industryTaxonomySettingsKey,
          { version: value.version },
        )
        return value
      })
      .immediate()
  }
}
