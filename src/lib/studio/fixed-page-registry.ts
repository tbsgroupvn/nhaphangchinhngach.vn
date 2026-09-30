import seeds from '../../data/fixed-page-seeds.json'

export type FixedField = {
  key: string
  label: string
  group: string
  kind: string
  value: string
}
export type FixedTemplate = {
  slug: string
  path: string
  title: string
  summary: string
  image: string
  seoTitle: string
  seoDescription: string
  fields: FixedField[]
}
export const fixedTemplates: FixedTemplate[] = seeds
export function fixedTemplate(slug: string) {
  return fixedTemplates.find((template) => template.slug === slug)
}

export function copyCollection<T>(
  value: T,
  fields: Record<string, string>,
  prefix: string,
): T {
  if (typeof value === 'string') {
    if (!Object.prototype.hasOwnProperty.call(fields, prefix))
      throw new Error(`Missing fixed-page copy: ${prefix}`)
    return fields[prefix] as T
  }
  if (Array.isArray(value))
    return value.map((item, index) =>
      copyCollection(item, fields, `${prefix}.${index}`),
    ) as T
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        copyCollection(item, fields, `${prefix}.${key}`),
      ]),
    ) as T
  return value
}
