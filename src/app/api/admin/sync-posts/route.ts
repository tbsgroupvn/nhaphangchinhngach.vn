import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * API để sync tất cả bài viết từ markdown files vào Supabase
 * POST /api/admin/sync-posts
 */
export async function POST(request: NextRequest) {
  try {
    // Get admin user from token
    const token = request.cookies.get('cms_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contentDir = path.join(process.cwd(), 'content', 'news');

    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json(
        { success: false, error: 'Content directory not found' },
        { status: 404 }
      );
    }

    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

    const syncedPosts = [];
    const errors = [];

    for (const file of files) {
      try {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);

        // Generate slug from filename
        const slug = file.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');

        // Get admin user ID (use first super_admin user)
        const { data: adminUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('role', 'super_admin')
          .single();

        if (!adminUser) {
          errors.push({ file, error: 'No admin user found' });
          continue;
        }

        // Prepare post data
        const postData = {
          title: frontmatter.title || slug,
          slug: slug,
          excerpt: frontmatter.description || '',
          content: content,
          featured_image: frontmatter.image || null,
          category: frontmatter.category || 'general',
          tags: frontmatter.tags || [],
          status: frontmatter.status === 'published' ? 'published' : 'draft',
          published_at: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
          views: frontmatter.views || 0,
          author_id: (adminUser as any).id,
          seo_title: frontmatter.title || null,
          seo_description: frontmatter.description || null,
          seo_keywords: frontmatter.tags || [],
        };

        // Upsert post (insert or update based on slug)
        const { data, error } = await (supabaseAdmin as any)
          .from('posts')
          .upsert(postData, {
            onConflict: 'slug',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (error) {
          errors.push({ file, error: error.message });
        } else {
          syncedPosts.push({ file, slug, title: postData.title });
        }
      } catch (error: any) {
        errors.push({ file, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedPosts.length,
      total: files.length,
      posts: syncedPosts,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error('Sync posts error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET - Lấy thông tin sync status
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('cms_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Count markdown files
    const contentDir = path.join(process.cwd(), 'content', 'news');
    const markdownFiles = fs.existsSync(contentDir)
      ? fs.readdirSync(contentDir).filter(file => file.endsWith('.md')).length
      : 0;

    // Count posts in Supabase
    const { count: dbPosts } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      markdown_files: markdownFiles,
      database_posts: dbPosts || 0,
      needs_sync: markdownFiles !== (dbPosts || 0),
    });

  } catch (error: any) {
    console.error('Get sync status error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
