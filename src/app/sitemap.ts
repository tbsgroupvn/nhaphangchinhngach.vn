import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tbs-group.netlify.app'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dich-vu`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tuyen-dung`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cau-chuyen-khach-hang`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }
  ]

  // Service pages
  const servicePages = [
    'nhap-khau-chinh-ngach',
    'xuat-khau-hang-hoa',
    'van-chuyen-logistics',
    'thong-quan-hai-quan',
    'kiem-tra-chat-luong',
    'bao-hiem-hang-hoa',
    'tu-van-thuong-mai',
    'dich-vu-kho-bai'
  ].map(slug => ({
    url: `${baseUrl}/dich-vu/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // News categories
  const newsCategories = [
    'cam-nang-xnk',
    'nganh',
    'noi-bo',
    'tuyen-dung'
  ].map(category => ({
    url: `${baseUrl}/tin-tuc/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // Policy pages
  const policyPages = [
    'dieu-khoan',
    'van-chuyen',
    'doi-tra',
    'cookie'
  ].map(slug => ({
    url: `${baseUrl}/chinh-sach/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  return [
    ...staticPages,
    ...servicePages,
    ...newsCategories,
    ...policyPages
  ]
} 