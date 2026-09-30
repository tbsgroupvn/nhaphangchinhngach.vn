import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { publishedItems, publicTemplates } from '@/lib/studio/public-content'

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
}

export default function KnowledgeFilter({
  q = '',
  category = '',
}: {
  q?: string
  category?: string
}) {
  const { shared: copy } = publicTemplates()
  const articles = publishedItems('article')
  const terms = normalizeSearch(q).split(/\s+/).filter(Boolean)
  const categories = articles
    .map((article) => ({
      label: article.category,
      value: article.categorySlug,
    }))
    .filter(
      (item, index, all) =>
        all.findIndex((candidate) => candidate.value === item.value) === index,
    )
  const knownCategory = categories.some((item) => item.value === category)
  const results = articles.filter((article) => {
    const text = normalizeSearch(
      [
        article.title,
        article.summary,
        article.category,
        ...article.sections.map(
          (section) => `${section.heading} ${section.body.join(' ')}`,
        ),
      ].join(' '),
    )
    return (
      (!category || category === article.categorySlug) &&
      terms.every((term) => text.includes(term))
    )
  })

  return (
    <div>
      <form
        role="search"
        action="/kien-thuc"
        method="get"
        className="tbs-knowledge-filter"
      >
        <div className="tbs-field">
          <label htmlFor="knowledge-query">Tìm bài viết</label>
          <input
            id="knowledge-query"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Sản phẩm, báo giá, chứng từ..."
          />
        </div>
        <div className="tbs-field">
          <label htmlFor="knowledge-category">Chủ đề</label>
          <select
            id="knowledge-category"
            name="category"
            defaultValue={category}
          >
            <option value="">Tất cả chủ đề</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
            {category && !knownCategory && (
              <option value={category}>Chủ đề không tồn tại</option>
            )}
          </select>
        </div>
        <button className="tbs-button tbs-button-primary" type="submit">
          <MagnifyingGlassIcon width={20} height={20} aria-hidden="true" />
          Tìm kiếm
        </button>
        {(q || category) && (
          <Link href="/kien-thuc" className="tbs-inline-link">
            <XMarkIcon width={18} height={18} aria-hidden="true" />
            Xóa bộ lọc
          </Link>
        )}
      </form>
      <p role="status" aria-live="polite" className="tbs-article-meta">
        {results.length} bài viết{q ? ` cho “${q}”` : ''}
      </p>
      <div className="tbs-card-grid" data-knowledge-results>
        {results.map((article) => (
          <article key={article.slug} className="tbs-content-card">
            <span className="tbs-tag">{article.category}</span>
            <h2>
              <Link href={`/kien-thuc/${article.slug}`}>{article.title}</Link>
            </h2>
            <p>{article.summary}</p>
            <Link
              className="tbs-inline-link"
              href={`/kien-thuc/${article.slug}`}
            >
              {copy.articleLink}
              <ArrowRightIcon width={18} height={18} aria-hidden="true" />
              <span className="tbs-sr-only">: {article.title}</span>
            </Link>
          </article>
        ))}
      </div>
      {results.length === 0 && <p className="tbs-lead">{copy.searchEmpty}</p>}
    </div>
  )
}
