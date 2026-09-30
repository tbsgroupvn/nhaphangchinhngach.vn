import { z } from 'zod'
import { slugSchema } from './content-model'

export const traitGroups = [
  'handling',
  'packing',
  'supplier',
  'compliance',
  'transport',
] as const

export const industryTraitSchema = z
  .object({
    id: z.string().uuid(),
    slug: slugSchema,
    label: z.string().trim().min(1).max(120),
    group: z.enum(traitGroups),
    description: z.string().trim().min(1).max(1000),
    order: z.number().finite().int().min(0).max(10000),
    active: z.boolean(),
  })
  .strict()

const traitsSchema = z
  .array(industryTraitSchema)
  .max(1000)
  .superRefine((traits, context) => {
    const ids = new Set<string>()
    const slugs = new Set<string>()
    traits.forEach((trait, index) => {
      if (ids.has(trait.id))
        context.addIssue({
          code: 'custom',
          path: [index, 'id'],
          message: 'ID đặc tính không được trùng.',
        })
      if (slugs.has(trait.slug))
        context.addIssue({
          code: 'custom',
          path: [index, 'slug'],
          message: 'Slug đặc tính không được trùng.',
        })
      ids.add(trait.id)
      slugs.add(trait.slug)
    })
  })

export const industryTaxonomyInputSchema = z
  .object({ traits: traitsSchema })
  .strict()
export const industryTaxonomySchema = z
  .object({
    version: z.number().int().nonnegative(),
    traits: traitsSchema,
  })
  .strict()

export type IndustryTrait = z.infer<typeof industryTraitSchema>
export type IndustryTaxonomy = z.infer<typeof industryTaxonomySchema>
