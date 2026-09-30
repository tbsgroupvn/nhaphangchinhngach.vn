import { notFound } from 'next/navigation'
import ContentEditor from '@/components/studio/ContentEditor'
import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'
import { can } from '@/lib/studio/auth'
import { StudioError } from '@/lib/studio/errors'
import { fixedTemplate } from '@/lib/studio/fixed-page-registry'

export default function EditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string; generation?: string }
}) {
  const user = requirePageUser(),
    { content, siteSettings, industryTaxonomy } = getStudio()
  const brandName = siteSettings.get().payload.identity.name
  const atlasOptions = () => ({
    industryCategories: content
      .list()
      .filter((item) => item.kind === 'industryCategory' && !item.archivedAt)
      .map((item) => ({
        slug: item.path.split('/').filter(Boolean).at(-1)!,
        title: item.title,
      })),
    industryTraits: industryTaxonomy.read().traits,
    industryOptions: content
      .list()
      .filter((item) => item.kind === 'industry' && !item.archivedAt)
      .map((item) => ({
        slug: item.path.split('/').filter(Boolean).at(-1)!,
        title: item.title,
      })),
  })
  if (params.id === 'new') {
    requirePageUser('content.write')
    return (
      <ContentEditor
        brandName={brandName}
        canWrite={can(user, 'content.write')}
        canWriteSeo={can(user, 'seo.write') || can(user, 'content.write')}
        canPublish={can(user, 'content.publish')}
        {...atlasOptions()}
      />
    )
  }
  try {
    const document = content.get(params.id)
    const fields =
      document.draft.kind === 'page'
        ? fixedTemplate(document.draft.data.slug)!.fields.map(
            ({ value: _value, ...field }) => field,
          )
        : []
    return (
      <ContentEditor
        brandName={brandName}
        key={params.id}
        initialTab={
          searchParams.tab === 'seo'
            ? 'seo'
            : searchParams.tab === 'ai' && can(user, 'ai.use')
              ? 'ai'
              : undefined
        }
        canUseAi={can(user, 'ai.use')}
        initialGeneration={searchParams.generation}
        initial={document}
        routeLocked={
          document.kind !== 'industry' &&
          document.kind !== 'industryCategory' &&
          !!content.fixedRoute(params.id)
        }
        fixedFields={fields}
        initialRevisions={content.revisions(params.id)}
        canWrite={can(user, 'content.write')}
        canWriteSeo={can(user, 'seo.write') || can(user, 'content.write')}
        canPublish={can(user, 'content.publish')}
        {...atlasOptions()}
      />
    )
  } catch (error) {
    if (error instanceof StudioError && error.status === 404) notFound()
    throw error
  }
}
