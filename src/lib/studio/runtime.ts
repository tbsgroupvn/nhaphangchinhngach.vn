import 'server-only'
import { cookies } from 'next/headers'
import { readFileSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import { openStudioDatabase, type StudioDatabase } from './database'
import { StudioAuth, requireCapability, type Capability } from './auth'
import { StudioError } from './errors'
import { StudioContent } from './content'
import { StudioSeo } from './seo'
import { StudioTechnicalSeo } from './technical-seo'
import { StudioMedia } from './media'
import { StudioSiteSettings } from './site-settings'
import { StudioTemplates } from './templates'
import { StudioBackups } from './backups'
import { StudioAiProvider } from './ai-provider'
import { StudioKnowledge } from './ai-knowledge'
import { StudioGenerations } from './ai-generation'
import { StudioIndustryTaxonomy } from './industry-taxonomy'

export const SESSION_COOKIE = 'tbs-studio-session'

export function studioDirectory() {
  const directory = resolve(
    process.env.STUDIO_DATA_DIR || join(process.cwd(), '.data'),
  )
  const publicDirectory = resolve(process.cwd(), 'public')
  if (
    directory === publicDirectory ||
    directory.startsWith(`${publicDirectory}${sep}`)
  )
    throw new Error('Studio data must not be stored in public')
  return directory
}

const globalStore = globalThis as typeof globalThis & {
  __tbsStudioDb?: { path: string; db: StudioDatabase }
}
export function getStudio() {
  const path = join(studioDirectory(), 'studio.sqlite')
  if (globalStore.__tbsStudioDb && globalStore.__tbsStudioDb.path !== path)
    throw new Error('Studio database location changed during runtime')
  if (!globalStore.__tbsStudioDb)
    globalStore.__tbsStudioDb = { path, db: openStudioDatabase(path) }
  const db = globalStore.__tbsStudioDb.db
  const auth = new StudioAuth(db)
  const content = new StudioContent(db, auth)
  content.seedMarketing()
  const aiProvider = new StudioAiProvider(db, auth),
    knowledge = new StudioKnowledge(db, auth)
  return {
    db,
    auth,
    content,
    seo: new StudioSeo(db, auth, content),
    technical: new StudioTechnicalSeo(db, auth),
    media: new StudioMedia(db, auth),
    siteSettings: new StudioSiteSettings(db, auth),
    templates: new StudioTemplates(db, auth),
    industryTaxonomy: new StudioIndustryTaxonomy(db, auth),
    backups: new StudioBackups(db, auth, studioDirectory()),
    aiProvider,
    knowledge,
    generations: new StudioGenerations(
      db,
      auth,
      content,
      aiProvider,
      knowledge,
    ),
  }
}

export function bootstrapToken() {
  if (process.env.STUDIO_BOOTSTRAP_TOKEN)
    return process.env.STUDIO_BOOTSTRAP_TOKEN
  try {
    const config = JSON.parse(
      readFileSync(join(studioDirectory(), 'installation.json'), 'utf8'),
    )
    return typeof config.bootstrapToken === 'string'
      ? config.bootstrapToken
      : ''
  } catch {
    return ''
  }
}

export function currentUser() {
  return getStudio().auth.session(cookies().get(SESSION_COOKIE)?.value)
}
export function requireUser(capability?: Capability) {
  const user = currentUser()
  if (!user)
    throw new StudioError(
      401,
      'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      'UNAUTHENTICATED',
    )
  if (capability) requireCapability(user, capability)
  return user
}
