'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  filterIndustries,
  normalizeIndustryQuery,
  type IndustrySearchEntry,
  type IndustrySearchState,
} from '@/lib/industries/search'
import {
  queryLengthBucket,
  trackIndustryFilter,
  trackIndustryOpen,
  trackIndustrySearch,
} from '@/lib/analytics'
import { ContactLinks } from './ContactLinks'
import styles from './IndustryAtlas.module.css'

export type ExplorerCategory = { slug: string; title: string; path: string }
export type ExplorerTrait = { slug: string; label: string; active: boolean }
export type ExplorerMedia = Record<string, { image: string; alt: string }>

const emptyState: IndustrySearchState = { q: '', category: '', traits: [] }

function parseLocation(
  search: string,
  categories: ExplorerCategory[],
  traits: ExplorerTrait[],
): IndustrySearchState {
  const params = new URLSearchParams(search)
  const categorySet = new Set(categories.map((item) => item.slug))
  const traitSet = new Set(
    traits.filter((item) => item.active).map((item) => item.slug),
  )
  const category = params.get('category') || ''
  return {
    q: (params.get('q') || '').slice(0, 120),
    category: categorySet.has(category) ? category : '',
    traits: [
      ...new Set(
        params
          .getAll('traits')
          .flatMap((value) => value.split(','))
          .filter((value) => traitSet.has(value)),
      ),
    ],
  }
}

function toSearch(state: IndustrySearchState) {
  const params = new URLSearchParams()
  if (state.q.trim()) params.set('q', state.q.trim())
  if (state.category) params.set('category', state.category)
  for (const trait of state.traits) params.append('traits', trait)
  const value = params.toString()
  return value ? `?${value}` : ''
}

function nearestCategories(
  query: string,
  categories: ExplorerCategory[],
  index: IndustrySearchEntry[],
) {
  const words = normalizeIndustryQuery(query).split(' ').filter((word) => word.length > 1)
  const scored = categories.map((category) => {
    const haystack = [
      normalizeIndustryQuery(category.title),
      ...index
        .filter((entry) => entry.categorySlug === category.slug)
        .map((entry) => `${entry.normalizedTitle} ${entry.normalizedAliases.join(' ')}`),
    ].join(' ')
    return {
      category,
      score: words.filter((word) => haystack.includes(word)).length,
    }
  })
  return scored
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map((item) => item.category)
}

export default function IndustryExplorer({
  index,
  categories,
  traits,
  media,
  initialState,
  unavailable,
  preparationItems,
}: {
  index: IndustrySearchEntry[]
  categories: ExplorerCategory[]
  traits: ExplorerTrait[]
  media: ExplorerMedia
  initialState: IndustrySearchState
  unavailable: boolean
  preparationItems: string[]
}) {
  const [state, setState] = useState<IndustrySearchState>(initialState)
  const [enhanced, setEnhanced] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetDraft, setSheetDraft] = useState<string[]>(initialState.traits)
  const replaceTimer = useRef<number | undefined>(undefined)
  const trackTimer = useRef<number | undefined>(undefined)
  const traitLabels = useMemo(
    () => new Map(traits.map((trait) => [trait.slug, trait.label])),
    [traits],
  )
  const activeTraits = traits.filter((trait) => trait.active)
  const results = useMemo(
    () => (unavailable ? [] : filterIndustries(index, state)),
    [index, state, unavailable],
  )
  const hasFilter = Boolean(state.q.trim() || state.category || state.traits.length)

  useEffect(() => {
    setEnhanced(true)
    const onPop = () =>
      setState(parseLocation(window.location.search, categories, traits))
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.clearTimeout(replaceTimer.current)
      window.clearTimeout(trackTimer.current)
    }
  }, [categories, traits])

  const commit = useCallback(
    (next: IndustrySearchState, mode: 'push' | 'replace') => {
      setState(next)
      const url = `${window.location.pathname}${toSearch(next)}`
      window.clearTimeout(replaceTimer.current)
      if (mode === 'push') window.history.pushState(null, '', url)
      else
        replaceTimer.current = window.setTimeout(
          () => window.history.replaceState(null, '', url),
          250,
        )
    },
    [],
  )

  function trackFilters(next: IndustrySearchState) {
    const count = unavailable ? 0 : filterIndustries(index, next).length
    trackIndustryFilter(
      [...(next.category ? [next.category] : []), ...next.traits],
      count,
    )
  }

  function onQuery(value: string) {
    const next = { ...state, q: value.slice(0, 120) }
    commit(next, 'replace')
    window.clearTimeout(trackTimer.current)
    trackTimer.current = window.setTimeout(() => {
      trackIndustrySearch(
        queryLengthBucket(next.q),
        filterIndustries(index, next).length,
      )
    }, 800)
  }

  function onCategory(value: string) {
    const next = { ...state, category: value }
    commit(next, 'push')
    trackFilters(next)
  }

  function toggleTrait(slug: string) {
    const traitsNext = state.traits.includes(slug)
      ? state.traits.filter((item) => item !== slug)
      : [...state.traits, slug]
    const next = { ...state, traits: traitsNext }
    commit(next, 'push')
    trackFilters(next)
  }

  function applySheet() {
    const next = { ...state, traits: sheetDraft }
    commit(next, 'push')
    trackFilters(next)
    setSheetOpen(false)
  }

  function clearAll() {
    commit(emptyState, 'push')
  }

  const nearest = !results.length && hasFilter
    ? nearestCategories(state.q, categories, index)
    : []

  return (
    <section className={styles.explorer} aria-labelledby="atlas-search-title" data-enhanced={enhanced ? 'true' : undefined}>
      <h2 id="atlas-search-title" className="tbs-sr-only">Tìm ngành hàng</h2>
      <form
        role="search"
        method="get"
        action="/nganh-hang/"
        className={styles.searchForm}
        onSubmit={(event) => {
          event.preventDefault()
          commit(state, 'push')
          trackIndustrySearch(queryLengthBucket(state.q), results.length)
        }}
      >
        <div className={styles.searchRow}>
          <label className={styles.searchField}>
            <MagnifyingGlassIcon aria-hidden="true" />
            <span className="tbs-sr-only">Tìm ngành hàng</span>
            <input
              type="search"
              name="q"
              value={state.q}
              maxLength={120}
              autoComplete="off"
              disabled={unavailable}
              placeholder="Tên hàng, model hoặc công dụng"
              onChange={(event) => onQuery(event.target.value)}
            />
          </label>
          {state.q && enhanced && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Xóa từ khóa"
              title="Xóa từ khóa"
              onClick={() => commit({ ...state, q: '' }, 'push')}
            >
              <XMarkIcon aria-hidden="true" />
            </button>
          )}
          <label className={styles.categorySelect}>
            <span className="tbs-sr-only">Nhóm ngành</span>
            <select
              aria-label="Nhóm ngành"
              name="category"
              value={state.category}
              disabled={unavailable}
              onChange={(event) => onCategory(event.target.value)}
            >
              <option value="">Tất cả nhóm ngành</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="tbs-button tbs-button-primary" disabled={unavailable}>
            Tìm kiếm
          </button>
        </div>

        {activeTraits.length > 0 && (
          <>
            <fieldset className={styles.traitFilters} disabled={unavailable}>
              <legend>Lọc theo đặc tính</legend>
              <div className={styles.traitList}>
                {activeTraits.map((trait) => (
                  <label key={trait.slug} className={styles.traitOption}>
                    <input
                      type="checkbox"
                      name="traits"
                      value={trait.slug}
                      checked={state.traits.includes(trait.slug)}
                      onChange={() => toggleTrait(trait.slug)}
                    />
                    <span>{trait.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {enhanced && (
              <button
                type="button"
                className={`tbs-button tbs-button-secondary ${styles.sheetTrigger}`}
                disabled={unavailable}
                onClick={() => {
                  setSheetDraft(state.traits)
                  setSheetOpen(true)
                }}
              >
                <AdjustmentsHorizontalIcon aria-hidden="true" />
                Bộ lọc{state.traits.length ? ` (${state.traits.length} đang chọn)` : ''}
              </button>
            )}
          </>
        )}
      </form>

      {unavailable ? (
        <p className={styles.notice} role="alert">
          Tìm kiếm tạm thời chưa sẵn sàng. Anh/chị vẫn có thể xem theo nhóm
          ngành bên dưới hoặc gọi/Zalo để được hướng dẫn.
        </p>
      ) : (
        <div className={styles.results} data-industry-results>
          <div className={styles.resultsHeader}>
            <p role="status" aria-live="polite" aria-atomic="true">
              {hasFilter
                ? `${results.length} ngành hàng phù hợp`
                : `${index.length} ngành hàng đã xuất bản — nhập từ khóa hoặc chọn bộ lọc để thu hẹp`}
            </p>
            {hasFilter && (
              <a
                href="/nganh-hang/"
                className="tbs-inline-link"
                onClick={(event) => {
                  event.preventDefault()
                  clearAll()
                }}
              >
                Xóa bộ lọc
              </a>
            )}
          </div>
          {state.traits.length > 0 && (
            <p className={styles.activeFilters}>
              Đang lọc: {state.traits.map((slug) => traitLabels.get(slug) || slug).join(', ')}
            </p>
          )}
          {!hasFilter ? null : results.length > 0 ? (
            <ul className={styles.resultList}>
              {results.map((entry) => {
                const visual = media[entry.id]
                return (
                  <li key={entry.id} className={styles.resultRow}>
                    <div className={styles.resultThumb}>
                      {visual?.image ? (
                        <Image
                          src={visual.image}
                          alt={visual.alt}
                          fill
                          sizes="112px"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className={styles.resultCategory}>{entry.categoryTitle}</p>
                      <h3>
                        <Link
                          href={`${entry.path}/`}
                          onClick={() => trackIndustryOpen(entry.id, 'hub')}
                        >
                          {entry.title}
                        </Link>
                      </h3>
                      <p>{entry.summary}</p>
                      {entry.traits.length > 0 && (
                        <ul className={styles.tagList} aria-label="Đặc tính">
                          {entry.traits.map((slug) => (
                            <li key={slug}>{traitLabels.get(slug) || slug}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className={styles.noResult}>
              <h3>Chưa có ngành hàng khớp với lựa chọn hiện tại</h3>
              <p>
                {state.q.trim() ? <>Từ khóa: <strong>{state.q.trim()}</strong>. </> : null}
                Nhóm ngành trên website chỉ là điểm bắt đầu; TBS vẫn có thể
                trao đổi về sản phẩm của anh/chị.
              </p>
              {nearest.length > 0 && (
                <p>
                  Có thể gần với:{' '}
                  {nearest.map((category, position) => (
                    <span key={category.slug}>
                      {position > 0 && ', '}
                      <Link href={`${category.path}/`}>{category.title}</Link>
                    </span>
                  ))}
                </p>
              )}
              <p>Nên chuẩn bị trước khi liên hệ:</p>
              <ul className="tbs-list">
                {preparationItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ContactLinks placement="industry_hub" />
            </div>
          )}
        </div>
      )}

      <Dialog
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        className={styles.sheetRoot}
      >
        <div className={styles.sheetBackdrop} aria-hidden="true" />
        <DialogPanel className={styles.sheet}>
          <div className={styles.sheetHeader}>
            <DialogTitle as="h2">Lọc theo đặc tính</DialogTitle>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Đóng bộ lọc"
              title="Đóng bộ lọc"
              onClick={() => setSheetOpen(false)}
            >
              <XMarkIcon aria-hidden="true" />
            </button>
          </div>
          <div className={styles.sheetBody}>
            {activeTraits.map((trait) => (
              <label key={trait.slug} className={styles.traitOption}>
                <input
                  type="checkbox"
                  checked={sheetDraft.includes(trait.slug)}
                  onChange={() =>
                    setSheetDraft((current) =>
                      current.includes(trait.slug)
                        ? current.filter((item) => item !== trait.slug)
                        : [...current, trait.slug],
                    )
                  }
                />
                <span>{trait.label}</span>
              </label>
            ))}
          </div>
          <div className={styles.sheetActions}>
            <button
              type="button"
              className="tbs-button tbs-button-secondary"
              onClick={() => setSheetDraft([])}
            >
              Xóa lọc
            </button>
            <button
              type="button"
              className="tbs-button tbs-button-primary"
              onClick={applySheet}
            >
              Áp dụng
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </section>
  )
}
