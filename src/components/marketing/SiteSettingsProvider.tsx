'use client'

import { createContext, useContext } from 'react'
import {
  defaultSiteSettings,
  type SiteSettings,
} from '@/lib/studio/site-settings-model'

const SiteContext = createContext<SiteSettings>(defaultSiteSettings)
export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings
  children: React.ReactNode
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
export const useSiteSettings = () => useContext(SiteContext)
