'use client'

import { useId } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { ContentPayload } from '@/lib/studio/content-model'
import type { IndustryTrait } from '@/lib/studio/industry-taxonomy-model'
import MediaField from './MediaField'

type AtlasPayload = Extract<
  ContentPayload,
  { kind: 'industry' | 'industryCategory' }
>
type CategoryOption = { slug: string; title: string }

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
}) {
  const id = useId()
  return (
    <label className="studio-editor-field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

function ListField({
  label,
  values,
  onChange,
  multiline = false,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  multiline?: boolean
}) {
  return (
    <section className="studio-atlas-list">
      <div className="studio-section-heading">
        <h3>{label}</h3>
        <button
          type="button"
          className="studio-icon-button"
          title={`Thêm ${label.toLowerCase()}`}
          aria-label={`Thêm ${label.toLowerCase()}`}
          disabled={values.length >= 100}
          onClick={() => onChange([...values, ''])}
        >
          <PlusIcon />
        </button>
      </div>
      {values.map((value, index) => (
        <div className="studio-atlas-list-row" key={index}>
          <Field
            label={`${label} ${index + 1}`}
            value={value}
            multiline={multiline}
            onChange={(next) =>
              onChange(values.map((item, position) => (position === index ? next : item)))
            }
          />
          <button
            type="button"
            className="studio-icon-button"
            title={`Xóa ${label.toLowerCase()} ${index + 1}`}
            aria-label={`Xóa ${label.toLowerCase()} ${index + 1}`}
            onClick={() => onChange(values.filter((_, position) => position !== index))}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      {!values.length && <p className="studio-muted">Chưa có mục nào.</p>}
    </section>
  )
}

const dateTimeValue = (value: string) => (value ? value.slice(0, 16) : '')
const storedDateTime = (value: string) =>
  value ? new Date(value).toISOString() : ''

export default function IndustryFields({
  payload,
  categories,
  industries,
  traits,
  onChange,
}: {
  payload: AtlasPayload
  categories: CategoryOption[]
  industries: CategoryOption[]
  traits: IndustryTrait[]
  onChange: (data: AtlasPayload['data']) => void
}) {
  const update = (patch: Record<string, unknown>) =>
    onChange({ ...payload.data, ...patch } as AtlasPayload['data'])
  const review = payload.data.review

  return (
    <div className="studio-atlas-fields">
      {payload.kind === 'industryCategory' ? (
        <>
          <Field
            label="Thứ tự hiển thị"
            type="number"
            value={payload.data.order}
            onChange={(value) => update({ order: Number(value) })}
          />
          <fieldset className="studio-atlas-checks">
            <legend>Ngành nổi bật</legend>
            <p className="studio-muted">Chọn tối đa 12 ngành để ưu tiên trong nhóm.</p>
            {payload.data.featuredIndustryIds.map((slug) => (
              <label key={slug}>
                <input
                  type="checkbox"
                  checked
                  onChange={() =>
                    update({
                      featuredIndustryIds: payload.data.featuredIndustryIds.filter(
                        (item) => item !== slug,
                      ),
                    })
                  }
                />
                {slug}
              </label>
            ))}
            <label className="studio-editor-field">
              <span>Thêm mã ngành nổi bật</span>
              <select
                value=""
                onChange={(event) => {
                  const slug = event.target.value
                  if (slug && !payload.data.featuredIndustryIds.includes(slug))
                    update({
                      featuredIndustryIds: [
                        ...payload.data.featuredIndustryIds,
                        slug,
                      ],
                    })
                }}
              >
                <option value="">Chọn ngành</option>
                {industries.map((industry) => (
                  <option key={industry.slug} value={industry.slug}>
                    {industry.title}
                  </option>
                ))}
                {industries.length === 0 && <option disabled>Chưa có dữ liệu</option>}
              </select>
            </label>
          </fieldset>
        </>
      ) : (
        <>
          <div className="studio-editor-pair">
            <label className="studio-editor-field">
              <span>Nhóm ngành</span>
              <select
                value={payload.data.categorySlug}
                onChange={(event) => update({ categorySlug: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Tên ngắn"
              value={payload.data.shortTitle}
              onChange={(shortTitle) => update({ shortTitle })}
            />
          </div>

          <section className="studio-atlas-section">
            <h2>Nhận diện và tìm kiếm</h2>
            <ListField label="Bí danh tìm kiếm" values={payload.data.aliases} onChange={(aliases) => update({ aliases })} />
            <ListField label="Từ khóa liên quan" values={payload.data.searchTerms} onChange={(searchTerms) => update({ searchTerms })} />
            <ListField label="Model sản phẩm" values={payload.data.models} onChange={(models) => update({ models })} />
            <ListField label="Công dụng" values={payload.data.uses} multiline onChange={(uses) => update({ uses })} />
            <ListField label="Vật liệu" values={payload.data.materials} onChange={(materials) => update({ materials })} />
          </section>

          <fieldset className="studio-atlas-checks">
            <legend>Đặc tính nghiệp vụ</legend>
            <div className="studio-atlas-trait-grid">
              {traits.map((trait) => (
                <label key={trait.id}>
                  <input
                    type="checkbox"
                    checked={payload.data.traits.includes(trait.slug)}
                    onChange={(event) =>
                      update({
                        traits: event.target.checked
                          ? [...payload.data.traits, trait.slug]
                          : payload.data.traits.filter((slug) => slug !== trait.slug),
                      })
                    }
                  />
                  <span>{trait.label}</span>
                  {!trait.active && <small>Đã lưu trữ</small>}
                </label>
              ))}
            </div>
          </fieldset>

          <section className="studio-atlas-section">
            <h2>Thông tin kỹ thuật</h2>
            <ListField label="Đặc điểm sản phẩm" values={payload.data.details} multiline onChange={(details) => update({ details })} />
            <ListField label="Thông tin cần chuẩn bị" values={payload.data.inputs} multiline onChange={(inputs) => update({ inputs })} />
            <ListField label="Việc cần chuẩn bị" values={payload.data.preparationItems} multiline onChange={(preparationItems) => update({ preparationItems })} />
            <ListField label="Dữ liệu kỹ thuật" values={payload.data.technicalInputs} multiline onChange={(technicalInputs) => update({ technicalInputs })} />
            <ListField label="Lưu ý đóng gói" values={payload.data.packingNotes} multiline onChange={(packingNotes) => update({ packingNotes })} />
            <ListField label="Điểm cần xác minh" values={payload.data.verificationPoints} multiline onChange={(verificationPoints) => update({ verificationPoints })} />
          </section>

          <section className="studio-atlas-section">
            <h2>Liên kết nội dung</h2>
            <ListField label="Mã dịch vụ liên quan" values={payload.data.serviceSlugs} onChange={(serviceSlugs) => update({ serviceSlugs })} />
            <ListField label="Mã bài viết liên quan" values={payload.data.articleSlugs} onChange={(articleSlugs) => update({ articleSlugs })} />
            <ListField label="Thông tin sale cần hỏi" values={payload.data.saleBriefItems} multiline onChange={(saleBriefItems) => update({ saleBriefItems })} />
          </section>

          <section className="studio-atlas-section">
            <div className="studio-section-heading">
              <h2>Bằng chứng hình ảnh</h2>
              <button
                type="button"
                className="studio-button studio-button-secondary"
                onClick={() =>
                  update({
                    proofItems: [
                      ...payload.data.proofItems,
                      {
                        id: `bang-chung-${payload.data.proofItems.length + 1}`,
                        mediaId: crypto.randomUUID(),
                        title: 'Bằng chứng mới',
                        caption: 'Mô tả nội dung bằng chứng.',
                        sourceRef: 'Nguồn nội bộ TBS',
                        sourceDate: new Date().toISOString().slice(0, 10),
                        scopeNote: 'Phạm vi sử dụng cần được ghi rõ.',
                        rightsStatus: 'pending',
                        reviewer: '',
                        reviewedAt: '',
                      },
                    ],
                  })
                }
              >
                <PlusIcon />
                Thêm bằng chứng
              </button>
            </div>
            {payload.data.proofItems.map((proof, index) => (
              <div className="studio-proof-editor" key={proof.id}>
                <div className="studio-section-heading">
                  <h3>Bằng chứng {index + 1}</h3>
                  <button
                    type="button"
                    className="studio-icon-button"
                    title={`Xóa bằng chứng ${index + 1}`}
                    aria-label={`Xóa bằng chứng ${index + 1}`}
                    onClick={() =>
                      update({
                        proofItems: payload.data.proofItems.filter((_, position) => position !== index),
                      })
                    }
                  >
                    <TrashIcon />
                  </button>
                </div>
                <MediaField
                  label={`Ảnh bằng chứng ${index + 1}`}
                  value={`/api/studio/media/${proof.mediaId}/`}
                  onChange={(url) => {
                    const mediaId = /\/api\/studio\/media\/([a-f0-9-]+)\//.exec(url)?.[1]
                    if (mediaId)
                      update({
                        proofItems: payload.data.proofItems.map((item, position) =>
                          position === index ? { ...item, mediaId } : item,
                        ),
                      })
                  }}
                />
                <Field label={`Tiêu đề bằng chứng ${index + 1}`} value={proof.title} onChange={(title) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, title } : item) })} />
                <Field label={`Chú thích bằng chứng ${index + 1}`} value={proof.caption} multiline onChange={(caption) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, caption } : item) })} />
                <div className="studio-editor-pair">
                  <Field label={`Nguồn bằng chứng ${index + 1}`} value={proof.sourceRef} onChange={(sourceRef) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, sourceRef } : item) })} />
                  <Field label={`Ngày nguồn ${index + 1}`} type="date" value={proof.sourceDate} onChange={(sourceDate) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, sourceDate } : item) })} />
                </div>
                <Field label={`Phạm vi sử dụng ${index + 1}`} value={proof.scopeNote} multiline onChange={(scopeNote) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, scopeNote } : item) })} />
                <div className="studio-editor-pair">
                  <label className="studio-editor-field">
                    <span>Quyền sử dụng {index + 1}</span>
                    <select value={proof.rightsStatus} onChange={(event) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, rightsStatus: event.target.value } : item) })}>
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </label>
                  <Field label={`Người duyệt bằng chứng ${index + 1}`} value={proof.reviewer} onChange={(reviewer) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, reviewer } : item) })} />
                </div>
                <Field label={`Ngày duyệt bằng chứng ${index + 1}`} type="datetime-local" value={dateTimeValue(proof.reviewedAt)} onChange={(reviewedAt) => update({ proofItems: payload.data.proofItems.map((item, position) => position === index ? { ...item, reviewedAt: storedDateTime(reviewedAt) } : item) })} />
              </div>
            ))}
            {!payload.data.proofItems.length && <p className="studio-muted">Chưa có bằng chứng hình ảnh.</p>}
          </section>
        </>
      )}

      <section className="studio-atlas-section">
        <h2>Duyệt nghiệp vụ</h2>
        <div className="studio-editor-pair">
          <label className="studio-editor-field">
            <span>Trạng thái duyệt</span>
            <select
              value={review.status === 'legacy' ? 'pending' : review.status}
              onChange={(event) => update({ review: { ...review, status: event.target.value } })}
            >
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
            </select>
          </label>
          <Field label="Người duyệt nghiệp vụ" value={review.reviewer} onChange={(reviewer) => update({ review: { ...review, reviewer } })} />
        </div>
        <div className="studio-editor-pair">
          <Field label="Ngày duyệt" type="datetime-local" value={dateTimeValue(review.reviewedAt)} onChange={(reviewedAt) => update({ review: { ...review, reviewedAt: storedDateTime(reviewedAt), status: reviewedAt ? 'approved' : 'pending' } })} />
          <Field label="Ngày rà soát tiếp theo" type="datetime-local" value={dateTimeValue(review.nextReviewAt)} onChange={(nextReviewAt) => update({ review: { ...review, nextReviewAt: storedDateTime(nextReviewAt) } })} />
        </div>
      </section>
    </div>
  )
}
