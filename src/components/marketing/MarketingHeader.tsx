'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  ArrowUpRightIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import { useSiteSettings } from './SiteSettingsProvider'
import { ContactLinks } from './ContactLinks'

export default function MarketingHeader() {
  const { identity: site, navigation, mobileContactHeading } = useSiteSettings()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currentSection = (href: string) => {
    const target = href.split('#')[0].replace(/\/$/, '') || '/'
    const path = pathname?.replace(/\/$/, '') || '/'
    return path === target || (target !== '/' && path.startsWith(`${target}/`))
  }
  return (
    <>
      <header className="tbs-header">
        <div className="tbs-container tbs-header-inner">
          <Link
            href="/"
            className="tbs-brand"
            aria-label={`${site.name} - Trang chủ`}
          >
            <Image
              src={site.logo}
              alt={site.name}
              width={98}
              height={62}
              priority
            />
          </Link>
          <nav className="tbs-desktop-nav" aria-label="Điều hướng chính">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={currentSection(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a className="tbs-header-phone" href={`tel:${site.phone}`}>
            <PhoneIcon aria-hidden="true" />
            <span>{site.phoneDisplay}</span>
            <ArrowUpRightIcon aria-hidden="true" />
          </a>
          <button
            className="tbs-icon-button tbs-menu-toggle"
            aria-label="Mở menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Bars3Icon />
          </button>
        </div>
      </header>
      <Dialog open={open} onClose={setOpen} className="tbs-mobile-dialog">
        <div className="tbs-dialog-backdrop" aria-hidden="true" />
        <div className="tbs-dialog-position">
          <DialogPanel className="tbs-mobile-panel">
            <div className="tbs-mobile-top">
              <DialogTitle>Điều hướng</DialogTitle>
              <button
                className="tbs-icon-button"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon />
              </button>
            </div>
            <nav aria-label="Điều hướng di động">
              <Link href="/" onClick={() => setOpen(false)}>
                Trang chủ
                <ArrowUpRightIcon />
              </Link>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <ArrowUpRightIcon />
                </Link>
              ))}
            </nav>
            <div className="tbs-mobile-contact">
              <p>{mobileContactHeading}</p>
              <ContactLinks placement="mobile-menu" />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
