// Content Manager - Sync Admin CMS với Website Data
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export interface ContentFile {
  id: string
  title: string
  slug: string
  content: string
  frontmatter: any
  category: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
  path: string
}

export interface ServiceData {
  id: string
  title: string
  slug: string
  icon: string
  description: string
  shortDescription: string
  benefits: string[]
  process: string[]
  commitment: string[]
  features: string[]
  ctaText: string
  category: 'import' | 'logistics' | 'consulting' | 'support'
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
  }
}

export class ContentManager {
  private contentDir = path.join(process.cwd(), 'content')
  private dataDir = path.join(process.cwd(), 'src/data')
  private isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true'
  private isReadOnly = this.isProduction // Production environments are typically read-only
  
  // Cache for production to avoid repeated file reads
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes cache in production

  // Check if write operations are allowed
  private canWrite(): boolean {
    return !this.isReadOnly
  }

  // Get cached data or fetch new data
  private async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.isProduction && this.cache.has(key)) {
      const cached = this.cache.get(key)
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      const data = await fetcher()
      if (this.isProduction) {
        this.cache.set(key, { data, timestamp: Date.now() })
      }
      return data
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
      // Return empty fallback in production to avoid blocking
      if (this.isProduction) {
        return [] as T
      }
      throw error
    }
  }

  // Get environment info
  getEnvironmentInfo() {
    return {
      isProduction: this.isProduction,
      isReadOnly: this.isReadOnly,
      nodeEnv: process.env.NODE_ENV,
      netlify: process.env.NETLIFY,
      platform: process.platform
    }
  }

  // SERVICES MANAGEMENT
  async getServices(): Promise<ServiceData[]> {
    return this.getCachedData('services', async () => {
      try {
        const servicesPath = path.join(this.dataDir, 'services.ts')
        const content = await fs.readFile(servicesPath, 'utf-8')
        
        // Extract services array from TypeScript file
        const servicesMatch = content.match(/export const services: Service\[\] = (\[[\s\S]*?\]);/)
        if (servicesMatch) {
          // This would need proper parsing in real implementation
          return JSON.parse(servicesMatch[1].replace(/'/g, '"'))
        }
        return []
      } catch (error) {
        console.error('Error reading services:', error)
        // Return fallback services in production
        if (this.isProduction) {
          return this.getFallbackServices()
        }
        return []
      }
    })
  }

  // Fallback services for production
  private getFallbackServices(): ServiceData[] {
    return [
      {
        id: 'nhap-khau-chinh-ngach',
        title: 'Nhập khẩu chính ngạch',
        slug: 'nhap-khau-chinh-ngach',
        icon: '🚢',
        description: 'Dịch vụ nhập khẩu chính ngạch chuyên nghiệp',
        shortDescription: 'Dịch vụ nhập khẩu chính ngạch',
        benefits: ['Hợp pháp', 'An toàn', 'Nhanh chóng'],
        process: ['Tư vấn', 'Thực hiện', 'Giao hàng'],
        commitment: ['Uy tín', 'Chất lượng', 'Tiến độ'],
        features: ['Chuyên nghiệp', 'Hiệu quả'],
        ctaText: 'Tư vấn ngay',
        category: 'import' as const
      }
    ]
  }

  async updateService(id: string, serviceData: Partial<ServiceData>): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations are disabled in production environment. Please use development environment or GitHub for content updates.')
    }

    try {
      // Clear cache when updating
      this.cache.delete('services')
      
      // Update TypeScript data file
      await this.updateServicesTypeScript(id, serviceData)
      
      // Update markdown content file
      await this.updateServiceMarkdown(id, serviceData)
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  private async updateServicesTypeScript(id: string, serviceData: Partial<ServiceData>): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations disabled in production')
    }

    const servicesPath = path.join(this.dataDir, 'services.ts')
    let content = await fs.readFile(servicesPath, 'utf-8')
    
    // Update the specific service in TypeScript file
    // This would need more sophisticated parsing/replacement logic
    // For now, placeholder implementation
    
    await fs.writeFile(servicesPath, content)
  }

  private async updateServiceMarkdown(id: string, serviceData: Partial<ServiceData>): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations disabled in production')
    }

    if (!serviceData.slug) return
    
    const servicePath = path.join(this.contentDir, 'services', `${serviceData.slug}.md`)
    
    try {
      const content = await fs.readFile(servicePath, 'utf-8')
      const { data: frontmatter, content: markdownContent } = matter(content)
      
      // Update frontmatter
      const updatedFrontmatter = {
        ...frontmatter,
        title: serviceData.title || frontmatter.title,
        description: serviceData.description || frontmatter.description,
        // ... other fields
      }
      
      const newContent = matter.stringify(markdownContent, updatedFrontmatter)
      await fs.writeFile(servicePath, newContent)
    } catch (error) {
      // File doesn't exist, create new one
      await this.createServiceMarkdown(serviceData as ServiceData)
    }
  }

  private async createServiceMarkdown(serviceData: ServiceData): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations disabled in production')
    }

    const frontmatter = {
      title: serviceData.title,
      description: serviceData.description,
      slug: serviceData.slug,
      icon: serviceData.icon,
      category: serviceData.category,
      status: 'active',
      priceFrom: 'Liên hệ báo giá',
      duration: '5-14 ngày'
    }
    
    const content = `## Tổng quan dịch vụ

${serviceData.description}

## Lợi ích chính

${serviceData.benefits.map(benefit => `- ${benefit}`).join('\n')}

## Quy trình thực hiện

${serviceData.process.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Cam kết của chúng tôi

${serviceData.commitment.map(item => `- ${item}`).join('\n')}

## Tính năng nổi bật

${serviceData.features.map(feature => `- ${feature}`).join('\n')}
`
    
    const markdownFile = matter.stringify(content, frontmatter)
    const filePath = path.join(this.contentDir, 'services', `${serviceData.slug}.md`)
    
    await fs.writeFile(filePath, markdownFile)
  }

  // POSTS/NEWS MANAGEMENT
  async getPosts(category?: string): Promise<ContentFile[]> {
    try {
      const newsDir = path.join(this.contentDir, 'news')
      const files = await fs.readdir(newsDir)
      const posts: ContentFile[] = []
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(newsDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const { data: frontmatter, content: markdownContent } = matter(content)
          
          posts.push({
            id: file.replace('.md', ''),
            title: frontmatter.title || 'Untitled',
            slug: frontmatter.slug || file.replace('.md', ''),
            content: markdownContent,
            frontmatter,
            category: frontmatter.category || 'uncategorized',
            status: frontmatter.status || 'draft',
            createdAt: frontmatter.date || new Date().toISOString(),
            updatedAt: frontmatter.updated || new Date().toISOString(),
            path: filePath
          })
        }
      }
      
      return category ? posts.filter(p => p.category === category) : posts
    } catch (error) {
      console.error('Error reading posts:', error)
      return []
    }
  }

  async createPost(postData: {
    title: string
    slug: string
    content: string
    category: string
    status: 'published' | 'draft'
    excerpt?: string
    tags?: string[]
  }): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations are disabled in production environment. Please use development environment or push changes via GitHub.')
    }

    const frontmatter = {
      title: postData.title,
      slug: postData.slug,
      category: postData.category,
      status: postData.status,
      date: new Date().toISOString(),
      updated: new Date().toISOString(),
      excerpt: postData.excerpt || '',
      tags: postData.tags || []
    }
    
    const markdownFile = matter.stringify(postData.content, frontmatter)
    const filename = `${new Date().toISOString().split('T')[0]}-${postData.slug}.md`
    const filePath = path.join(this.contentDir, 'news', filename)
    
    await fs.writeFile(filePath, markdownFile)
  }

  async updatePost(id: string, postData: Partial<ContentFile>): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations are disabled in production environment. Please use development environment or push changes via GitHub.')
    }

    try {
      const posts = await this.getPosts()
      const post = posts.find(p => p.id === id)
      if (!post) throw new Error('Post not found')
      
      const content = await fs.readFile(post.path, 'utf-8')
      const { data: frontmatter, content: markdownContent } = matter(content)
      
      const updatedFrontmatter = {
        ...frontmatter,
        ...postData.frontmatter,
        title: postData.title || frontmatter.title,
        updated: new Date().toISOString()
      }
      
      const newContent = matter.stringify(postData.content || markdownContent, updatedFrontmatter)
      await fs.writeFile(post.path, newContent)
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  async deletePost(id: string): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations are disabled in production environment. Please use development environment or push changes via GitHub.')
    }

    const posts = await this.getPosts()
    const post = posts.find(p => p.id === id)
    if (post) {
      await fs.unlink(post.path)
    }
  }

  // SETTINGS MANAGEMENT
  async getSettings(): Promise<SiteSettings> {
    try {
      const settingsPath = path.join(this.contentDir, 'settings', 'general.json')
      const content = await fs.readFile(settingsPath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      console.error('Error reading settings:', error)
      // Return default settings
      return {
        siteName: 'TBS GROUP',
        siteDescription: 'Công ty xuất nhập khẩu hàng đầu Việt Nam',
        siteUrl: 'https://nhaphangchinhngach.vn',
        logo: '/images/tbs-logo.png',
        favicon: '/favicon.ico',
        primaryColor: '#dc2626',
        secondaryColor: '#2563eb',
        seo: {
          metaTitle: 'TBS GROUP - Công ty Xuất Nhập Khẩu Hàng Đầu Việt Nam',
          metaDescription: 'TBS GROUP chuyên cung cấp dịch vụ xuất nhập khẩu, logistics...',
          keywords: ['xuất nhập khẩu', 'logistics', 'TBS GROUP'],
          ogImage: '/images/tbs-logo.png'
        }
      }
    }
  }

  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations are disabled in production environment. Please use development environment or push changes via GitHub.')
    }

    try {
      const currentSettings = await this.getSettings()
      const updatedSettings = { ...currentSettings, ...settings }
      
      const settingsPath = path.join(this.contentDir, 'settings', 'general.json')
      await fs.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2))
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  // NAVIGATION MANAGEMENT
  async getNavigation(): Promise<any> {
    try {
      const navPath = path.join(this.contentDir, 'settings', 'navigation.json')
      const content = await fs.readFile(navPath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      console.error('Error reading navigation:', error)
      return { mainMenu: [], footerMenu: [] }
    }
  }

  async updateNavigation(navigation: any): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations are disabled in production environment. Please use development environment or push changes via GitHub.')
    }

    const navPath = path.join(this.contentDir, 'settings', 'navigation.json')
    await fs.writeFile(navPath, JSON.stringify(navigation, null, 2))
  }

  // CUSTOMER STORIES MANAGEMENT
  async getCustomerStories(): Promise<ContentFile[]> {
    const storiesDir = path.join(this.contentDir, 'customer-stories')
    return this.readMarkdownFiles(storiesDir)
  }

  // JOBS MANAGEMENT  
  async getJobs(): Promise<ContentFile[]> {
    const jobsDir = path.join(this.contentDir, 'jobs')
    return this.readMarkdownFiles(jobsDir)
  }

  // POLICIES MANAGEMENT
  async getPolicies(): Promise<ContentFile[]> {
    const policiesDir = path.join(this.contentDir, 'policies')
    return this.readMarkdownFiles(policiesDir)
  }

  private async readMarkdownFiles(dir: string): Promise<ContentFile[]> {
    try {
      const files = await fs.readdir(dir)
      const contentFiles: ContentFile[] = []
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(dir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const { data: frontmatter, content: markdownContent } = matter(content)
          
          contentFiles.push({
            id: file.replace('.md', ''),
            title: frontmatter.title || 'Untitled',
            slug: frontmatter.slug || file.replace('.md', ''),
            content: markdownContent,
            frontmatter,
            category: frontmatter.category || 'default',
            status: frontmatter.status || 'published',
            createdAt: frontmatter.date || new Date().toISOString(),
            updatedAt: frontmatter.updated || new Date().toISOString(),
            path: filePath
          })
        }
      }
      
      return contentFiles
    } catch (error) {
      console.error(`Error reading markdown files from ${dir}:`, error)
      return []
    }
  }

  // SYNC FUNCTIONS
  async syncAll(): Promise<{success: boolean, errors: string[]}> {
    const errors: string[] = []
    
    // Check environment first
    if (!this.canWrite()) {
      errors.push('Sync operations are disabled in production environment (read-only file system)')
      errors.push('For content updates in production, please:')
      errors.push('1. Make changes in development environment')
      errors.push('2. Push changes to GitHub repository')
      errors.push('3. Netlify will automatically deploy the updates')
      
      return {
        success: false,
        errors
      }
    }
    
    try {
      // Sync services data
      await this.syncServices()
    } catch (error) {
      errors.push(`Services sync failed: ${error}`)
    }

    try {
      // Sync posts/news
      await this.syncPosts()
    } catch (error) {
      errors.push(`Posts sync failed: ${error}`)
    }

    return {
      success: errors.length === 0,
      errors
    }
  }

  private async syncServices(): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations disabled in production environment')
    }

    // Sync between TypeScript data and markdown files
    const services = await this.getServices()
    
    for (const service of services) {
      await this.updateServiceMarkdown(service.id, service)
    }
  }

  private async syncPosts(): Promise<void> {
    if (!this.canWrite()) {
      throw new Error('Write operations disabled in production environment')
    }

    // Sync posts metadata and content
    const posts = await this.getPosts()
    
    // Update any missing fields or inconsistencies
    for (const post of posts) {
      if (!post.frontmatter.updated) {
        await this.updatePost(post.id, {
          frontmatter: { ...post.frontmatter, updated: new Date().toISOString() }
        })
      }
    }
  }
}

export const contentManager = new ContentManager() 