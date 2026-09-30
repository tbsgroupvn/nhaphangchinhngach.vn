import Link from 'next/link'
const links = [
  { key: 'generations', label: 'Đề xuất AI', href: '/admin/ai/generations/' },
  { key: 'knowledge', label: 'Kho kiến thức', href: '/admin/ai/knowledge/' },
  {
    key: 'instructions',
    label: 'Nguyên tắc viết',
    href: '/admin/ai/instructions/',
  },
  { key: 'connection', label: 'Kết nối AI', href: '/admin/ai-assistant/' },
] as const
export default function AiNavigation({
  active,
}: {
  active: (typeof links)[number]['key']
}) {
  return (
    <nav className="studio-ai-navigation" aria-label="Không gian AI">
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          aria-current={link.key === active ? 'page' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
