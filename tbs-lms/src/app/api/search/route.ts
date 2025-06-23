import { NextRequest, NextResponse } from 'next/server'
import { MeiliSearch } from 'meilisearch'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// Initialize Meilisearch client
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
})

// GET /api/search - Search across courses, lessons, and documents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') // 'courses', 'lessons', 'documents', 'all'
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query.trim()) {
      return NextResponse.json({
        data: [],
        total: 0,
        query: '',
      })
    }

    const searchResults = []
    let totalResults = 0

    // Search in courses
    if (!type || type === 'courses' || type === 'all') {
      try {
        const coursesIndex = client.index('courses')
        
        const searchOptions = {
          limit: type === 'courses' ? limit : Math.ceil(limit / 3),
          offset: type === 'courses' ? offset : 0,
          filter: [],
          attributesToHighlight: ['title', 'description'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        }

        // Filter by department if specified
        if (department && department !== 'all') {
          searchOptions.filter.push(`department = ${department}`)
        }

        // Filter by user's department access
        if (session.user.department && session.user.department !== 'all') {
          searchOptions.filter.push(`department = ${session.user.department} OR department = all`)
        }

        const coursesResult = await coursesIndex.search(query, searchOptions)
        
        const transformedCourses = coursesResult.hits.map((hit: any) => ({
          id: hit.id,
          title: hit._formatted?.title || hit.title,
          content: hit._formatted?.description || hit.description,
          type: 'course',
          url: `/courses/${hit.id}`,
          course_title: hit.title,
          highlight: hit._formatted?.description,
          department: hit.department,
          difficulty_level: hit.difficulty_level,
        }))

        searchResults.push(...transformedCourses)
        totalResults += coursesResult.estimatedTotalHits || 0
      } catch (error) {
        console.error('Error searching courses:', error)
      }
    }

    // Search in lessons
    if (!type || type === 'lessons' || type === 'all') {
      try {
        const lessonsIndex = client.index('lessons')
        
        const searchOptions = {
          limit: type === 'lessons' ? limit : Math.ceil(limit / 3),
          offset: type === 'lessons' ? offset : 0,
          attributesToHighlight: ['title', 'content'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        }

        const lessonsResult = await lessonsIndex.search(query, searchOptions)
        
        const transformedLessons = lessonsResult.hits.map((hit: any) => ({
          id: hit.id,
          title: hit._formatted?.title || hit.title,
          content: hit._formatted?.content || hit.content,
          type: 'lesson',
          url: `/lessons/${hit.id}`,
          course_title: hit.course_title,
          lesson_title: hit.title,
          highlight: hit._formatted?.content,
        }))

        searchResults.push(...transformedLessons)
        totalResults += lessonsResult.estimatedTotalHits || 0
      } catch (error) {
        console.error('Error searching lessons:', error)
      }
    }

    // Search in documents
    if (!type || type === 'documents' || type === 'all') {
      try {
        const documentsIndex = client.index('documents')
        
        const searchOptions = {
          limit: type === 'documents' ? limit : Math.ceil(limit / 3),
          offset: type === 'documents' ? offset : 0,
          attributesToHighlight: ['title', 'content'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        }

        const documentsResult = await documentsIndex.search(query, searchOptions)
        
        const transformedDocuments = documentsResult.hits.map((hit: any) => ({
          id: hit.id,
          title: hit._formatted?.title || hit.title,
          content: hit._formatted?.content || hit.content,
          type: 'document',
          url: hit.url || `/documents/${hit.id}`,
          course_title: hit.course_title,
          highlight: hit._formatted?.content,
          file_type: hit.file_type,
          file_size: hit.file_size,
        }))

        searchResults.push(...transformedDocuments)
        totalResults += documentsResult.estimatedTotalHits || 0
      } catch (error) {
        console.error('Error searching documents:', error)
      }
    }

    // Sort results by relevance (Meilisearch handles this internally)
    const sortedResults = searchResults.slice(offset, offset + limit)

    return NextResponse.json({
      data: sortedResults,
      total: totalResults,
      query: query.trim(),
      type: type || 'all',
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalResults,
      },
    })

  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json(
      { error: 'Search service unavailable' },
      { status: 500 }
    )
  }
}

// POST /api/search/index - Index new content (admin only)
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
    const { type, documents } = body

    if (!type || !documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const validTypes = ['courses', 'lessons', 'documents']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    const index = client.index(type)
    
    // Add or update documents in the index
    const task = await index.addDocuments(documents)
    
    return NextResponse.json({
      message: `${documents.length} documents indexed successfully`,
      taskId: task.taskUid,
      type,
    })

  } catch (error) {
    console.error('Error indexing documents:', error)
    return NextResponse.json(
      { error: 'Failed to index documents' },
      { status: 500 }
    )
  }
}

// DELETE /api/search/index - Remove content from index (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const documentId = searchParams.get('id')

    if (!type || !documentId) {
      return NextResponse.json(
        { error: 'Missing type or document ID' },
        { status: 400 }
      )
    }

    const validTypes = ['courses', 'lessons', 'documents']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    const index = client.index(type)
    const task = await index.deleteDocument(documentId)
    
    return NextResponse.json({
      message: 'Document removed from search index',
      taskId: task.taskUid,
      type,
      documentId,
    })

  } catch (error) {
    console.error('Error removing document from index:', error)
    return NextResponse.json(
      { error: 'Failed to remove document from index' },
      { status: 500 }
    )
  }
} 