/**
 * Script to migrate content from markdown files to Supabase database
 * Run with: npx ts-node scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { contentManager } from '../src/lib/content-manager'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcryptjs'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDefaultAdmin() {
  console.log('📝 Creating default admin user...')

  const passwordHash = await bcrypt.hash('Anhcanem2015@', 10)

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', 'admin')
    .single()

  if (existingUser) {
    console.log('✅ Admin user already exists')
    return existingUser.id
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      username: 'admin',
      email: 'admin@nhaphangchinhngach.vn',
      full_name: 'Administrator',
      password_hash: passwordHash,
      role: 'super_admin',
      status: 'active',
      email_verified: true
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }

  console.log('✅ Admin user created successfully')
  return data.id
}

async function migrateServices(authorId: string) {
  console.log('\n📦 Migrating services...')

  const services = await contentManager.getServices()
  console.log(`Found ${services.length} services`)

  for (const service of services) {
    const { data, error } = await supabase
      .from('services')
      .upsert({
        title: service.title,
        slug: service.slug,
        description: service.shortDescription || service.description,
        content: service.description || '',
        icon: service.icon,
        features: service.features ? { list: service.features } : null,
        status: 'active',
        author_id: authorId,
        order_index: 0
      }, {
        onConflict: 'slug'
      })

    if (error) {
      console.error(`❌ Error migrating service ${service.title}:`, error)
    } else {
      console.log(`✅ Migrated: ${service.title}`)
    }
  }
}

async function migratePosts(authorId: string) {
  console.log('\n📰 Migrating posts...')

  const posts = await contentManager.getPosts()
  console.log(`Found ${posts.length} posts`)

  for (const post of posts) {
    const { data, error } = await supabase
      .from('posts')
      .upsert({
        title: post.title,
        slug: post.slug,
        excerpt: post.frontmatter.excerpt || '',
        content: post.content,
        featured_image: post.frontmatter.image || post.frontmatter.featuredImage || null,
        category: post.category,
        tags: post.frontmatter.tags || [],
        status: post.status === 'published' ? 'published' : 'draft',
        published_at: post.status === 'published' ? post.createdAt : null,
        author_id: authorId,
        seo_title: post.frontmatter.seoTitle || post.title,
        seo_description: post.frontmatter.seoDescription || post.frontmatter.excerpt || null,
        seo_keywords: post.frontmatter.keywords || []
      }, {
        onConflict: 'slug'
      })

    if (error) {
      console.error(`❌ Error migrating post ${post.title}:`, error)
    } else {
      console.log(`✅ Migrated: ${post.title}`)
    }
  }
}

async function migrateCustomerStories(authorId: string) {
  console.log('\n👥 Migrating customer stories...')

  const stories = await contentManager.getCustomerStories()
  console.log(`Found ${stories.length} customer stories`)

  for (const story of stories) {
    const { data, error } = await supabase
      .from('customer_stories')
      .upsert({
        title: story.title,
        slug: story.slug,
        excerpt: story.frontmatter.excerpt || '',
        content: story.content,
        customer_name: story.frontmatter.customerName || null,
        customer_company: story.frontmatter.company || null,
        customer_avatar: story.frontmatter.avatar || null,
        featured_image: story.frontmatter.image || null,
        tags: story.frontmatter.tags || [],
        status: story.status === 'published' ? 'published' : 'draft',
        published_at: story.status === 'published' ? story.createdAt : null,
        author_id: authorId
      }, {
        onConflict: 'slug'
      })

    if (error) {
      console.error(`❌ Error migrating customer story ${story.title}:`, error)
    } else {
      console.log(`✅ Migrated: ${story.title}`)
    }
  }
}

async function migrateJobs(authorId: string) {
  console.log('\n💼 Migrating jobs...')

  const jobs = await contentManager.getJobs()
  console.log(`Found ${jobs.length} jobs`)

  for (const job of jobs) {
    const { data, error } = await supabase
      .from('jobs')
      .upsert({
        title: job.title,
        slug: job.slug,
        excerpt: job.frontmatter.excerpt || '',
        content: job.content,
        location: job.frontmatter.location || null,
        job_type: job.frontmatter.type || 'full-time',
        salary_range: job.frontmatter.salary || null,
        requirements: job.frontmatter.requirements || [],
        benefits: job.frontmatter.benefits || [],
        status: job.frontmatter.status === 'closed' ? 'closed' : 'open',
        published_at: job.createdAt,
        author_id: authorId
      }, {
        onConflict: 'slug'
      })

    if (error) {
      console.error(`❌ Error migrating job ${job.title}:`, error)
    } else {
      console.log(`✅ Migrated: ${job.title}`)
    }
  }
}

async function migrateSiteSettings() {
  console.log('\n⚙️ Migrating site settings...')

  const settings = await contentManager.getSettings()

  const settingsMap = [
    { key: 'site_name', value: settings.siteName },
    { key: 'site_description', value: settings.siteDescription },
    { key: 'site_url', value: settings.siteUrl },
    { key: 'logo', value: settings.logo },
    { key: 'favicon', value: settings.favicon },
    { key: 'primary_color', value: settings.primaryColor },
    { key: 'secondary_color', value: settings.secondaryColor },
    { key: 'seo', value: settings.seo }
  ]

  for (const setting of settingsMap) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: setting.key,
        setting_value: setting.value
      }, {
        onConflict: 'setting_key'
      })

    if (error) {
      console.error(`❌ Error migrating setting ${setting.key}:`, error)
    } else {
      console.log(`✅ Migrated: ${setting.key}`)
    }
  }
}

async function main() {
  console.log('🚀 Starting migration to Supabase...\n')
  console.log('Supabase URL:', supabaseUrl)

  try {
    // Create default admin user
    const adminId = await createDefaultAdmin()

    // Migrate content
    await migrateServices(adminId)
    await migratePosts(adminId)
    await migrateCustomerStories(adminId)
    await migrateJobs(adminId)
    await migrateSiteSettings()

    console.log('\n✅ Migration completed successfully!')
    console.log('\n📊 Summary:')

    // Get counts
    const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true })
    const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
    const { count: storiesCount } = await supabase.from('customer_stories').select('*', { count: 'exact', head: true })
    const { count: jobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true })

    console.log(`- Services: ${servicesCount}`)
    console.log(`- Posts: ${postsCount}`)
    console.log(`- Customer Stories: ${storiesCount}`)
    console.log(`- Jobs: ${jobsCount}`)

    console.log('\n🎉 Your Supabase backend is ready!')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
