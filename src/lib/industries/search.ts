import type { PublicIndustryAtlas } from './public'

export type IndustrySearchState = {
  q: string
  category: string
  traits: string[]
}

export type IndustrySearchEntry = {
  id: string
  slug: string
  path: string
  title: string
  shortTitle: string
  summary: string
  categorySlug: string
  categoryTitle: string
  categoryOrder: number
  traits: string[]
  normalizedTitle: string
  normalizedAliases: string[]
  normalizedModels: string[]
  normalizedCategory: string
  normalizedBody: string
}

export type IndustrySearchResult = IndustrySearchEntry & { score: number }

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeIndustryQuery(value: string) {
  return normalize(value).slice(0, 120).trim()
}

export function buildIndustrySearchIndex(
  atlas: PublicIndustryAtlas,
): IndustrySearchEntry[] {
  const categories = new Map(
    atlas.categories.map((category) => [category.slug, category]),
  )
  return atlas.industries
    .flatMap((industry) => {
      const category = categories.get(industry.categorySlug)
      if (!category) return []
      return [
        {
          id: industry.id,
          slug: industry.slug,
          path: industry.path,
          title: industry.title,
          shortTitle: industry.shortTitle,
          summary: industry.summary,
          categorySlug: category.slug,
          categoryTitle: category.title,
          categoryOrder: category.order,
          traits: [...industry.traits],
          normalizedTitle: normalize(industry.title),
          normalizedAliases: industry.aliases.map(normalize),
          normalizedModels: industry.models.map(normalize),
          normalizedCategory: normalize(category.title),
          normalizedBody: normalize(
            [
              industry.shortTitle,
              industry.summary,
              ...industry.searchTerms,
              ...industry.uses,
              ...industry.materials,
              ...industry.details,
              ...industry.inputs,
              ...industry.preparationItems,
              ...industry.technicalInputs,
              ...industry.packingNotes,
              ...industry.verificationPoints,
            ].join(' '),
          ),
        },
      ]
    })
    .sort(
      (left, right) =>
        left.categoryOrder - right.categoryOrder ||
        left.title.localeCompare(right.title, 'vi') ||
        left.id.localeCompare(right.id),
    )
}

function valuesOf(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
) {
  if (input instanceof URLSearchParams) return input.getAll(key)
  const value = input[key]
  return Array.isArray(value) ? value : value === undefined ? [] : [value]
}

export function parseIndustrySearchState(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
  atlas: PublicIndustryAtlas,
): IndustrySearchState {
  const categoryAllowlist = new Set(
    atlas.categories.map((category) => category.slug),
  )
  const traitAllowlist = new Set(
    atlas.traits.filter((trait) => trait.active).map((trait) => trait.slug),
  )
  const requestedCategory = valuesOf(input, 'category')[0] || ''
  const requestedTraits = valuesOf(input, 'traits').flatMap((value) =>
    value.split(','),
  )
  return {
    q: normalizeIndustryQuery(valuesOf(input, 'q')[0] || ''),
    category: categoryAllowlist.has(requestedCategory)
      ? requestedCategory
      : '',
    traits: [...new Set(requestedTraits.filter((trait) => traitAllowlist.has(trait)))],
  }
}

function scoreEntry(entry: IndustrySearchEntry, query: string) {
  if (!query) return 0
  if (entry.normalizedTitle === query) return 1000
  if (entry.normalizedTitle.includes(query)) return 950
  if (entry.normalizedAliases.some((value) => value.includes(query))) return 800
  if (entry.normalizedModels.some((value) => value.includes(query))) return 700
  if (entry.normalizedCategory.includes(query)) return 600
  if (entry.normalizedBody.includes(query)) return 100
  return -1
}

export function filterIndustries(
  index: IndustrySearchEntry[],
  state: IndustrySearchState,
): IndustrySearchResult[] {
  const query = normalizeIndustryQuery(state.q)
  return index
    .flatMap((entry) => {
      if (state.category && entry.categorySlug !== state.category) return []
      if (state.traits.some((trait) => !entry.traits.includes(trait))) return []
      const score = scoreEntry(entry, query)
      if (query && score < 0) return []
      return [{ ...entry, score }]
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.categoryOrder - right.categoryOrder ||
        left.title.localeCompare(right.title, 'vi') ||
        left.id.localeCompare(right.id),
    )
}
