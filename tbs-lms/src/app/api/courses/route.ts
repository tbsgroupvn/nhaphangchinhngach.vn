import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/client'
import { hasPermissionForCourse } from '@/lib/utils'

// GET /api/courses - Get courses for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const department = searchParams.get('department')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const type = searchParams.get('type') // 'all', 'enrolled', 'completed', 'in-progress'

    const offset = (page - 1) * limit

    // Base query for published courses
    let query = supabase
      .from('courses')
      .select(`
        *,
        lessons:lessons(count),
        user_progress:user_progress(
          lessons_completed,
          total_lessons,
          progress_percentage,
          started_at,
          completed_at,
          last_accessed
        )
      `)
      .eq('is_published', true)

    // Filter by user access (department-based)
    if (session.user.department && session.user.department !== 'all') {
      query = query.or(`department.cs.{${session.user.department}},department.cs.{all}`)
    }

    // Apply filters
    if (department && department !== 'all') {
      query = query.contains('department', [department])
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply type filters
    if (type === 'enrolled') {
      query = query.not('user_progress', 'is', null)
    } else if (type === 'completed') {
      query = query.eq('user_progress.progress_percentage', 100)
    } else if (type === 'in-progress') {
      query = query.and('user_progress.progress_percentage.gt.0')
        .and('user_progress.progress_percentage.lt.100')
    }

    // Apply pagination
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data: courses, error, count } = await query

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }

    // Transform data to include computed fields
    const transformedCourses = courses?.map(course => ({
      ...course,
      lessons_count: course.lessons?.[0]?.count || 0,
      enrolled_count: 0, // Would need separate query
      user_progress: course.user_progress?.[0] || null,
    })) || []

    return NextResponse.json({
      data: transformedCourses,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })

  } catch (error) {
    console.error('Error in GET /api/courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      department,
      difficulty_level,
      duration_hours,
      thumbnail_url,
      is_published = false,
    } = body

    // Validation
    if (!title || !department || !difficulty_level) {
      return NextResponse.json(
        { error: 'Missing required fields: title, department, difficulty_level' },
        { status: 400 }
      )
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty_level)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        department,
        difficulty_level,
        duration_hours,
        thumbnail_url,
        is_published,
        created_by: session.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: course,
      message: 'Course created successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 