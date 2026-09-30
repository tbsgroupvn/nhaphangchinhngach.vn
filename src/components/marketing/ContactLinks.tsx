'use client'

import { ChatBubbleLeftRightIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { useSiteSettings } from './SiteSettingsProvider'

export function ContactLinks({
  variant = 'primary',
  placement = 'content',
}: {
  variant?: 'primary' | 'light' | 'compact'
  placement?: string
}) {
  const { identity: site, contactLabel } = useSiteSettings()
  return (
    <div className={`tbs-contact-links tbs-contact-links-${variant}`}>
      <a
        className="tbs-button tbs-button-primary"
        href={`tel:${site.phone}`}
        data-contact="phone"
        data-placement={placement}
      >
        <PhoneIcon aria-hidden="true" /> <span>{site.phoneDisplay}</span>
      </a>
      <a
        className="tbs-button tbs-button-secondary"
        href={site.zalo}
        target="_blank"
        rel="noopener noreferrer"
        data-contact="zalo"
        data-placement={placement}
      >
        <ChatBubbleLeftRightIcon aria-hidden="true" />{' '}
        <span>{contactLabel}</span>
      </a>
    </div>
  )
}
