import { NextRequest, NextResponse } from 'next/server'
import { contentManager } from '../../../../lib/content-manager'

// POST - Trigger manual content sync
export async function POST(request: NextRequest) {
  try {
    const { syncType } = await request.json()
    
    let result
    
    switch (syncType) {
      case 'all':
        result = await contentManager.syncAll()
        break
      case 'services':
        await contentManager.getServices()
        result = { success: true, errors: [] }
        break
      case 'posts':
        await contentManager.getPosts()
        result = { success: true, errors: [] }
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid sync type. Use: all, services, posts' },
          { status: 400 }
        )
    }
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `${syncType} sync completed successfully`,
        errors: result.errors 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `${syncType} sync completed with errors`,
        errors: result.errors 
      }, { status: 207 }) // Multi-status
    }
  } catch (error) {
    console.error('Error during sync:', error)
    return NextResponse.json(
      { success: false, error: 'Sync operation failed' },
      { status: 500 }
    )
  }
}

// GET - Check sync status and content health
export async function GET() {
  try {
    const [services, posts, settings] = await Promise.all([
      contentManager.getServices().then(data => ({ type: 'services', count: data.length, status: 'ok' })).catch(() => ({ type: 'services', count: 0, status: 'error' })),
      contentManager.getPosts().then(data => ({ type: 'posts', count: data.length, status: 'ok' })).catch(() => ({ type: 'posts', count: 0, status: 'error' })),
      contentManager.getSettings().then(() => ({ type: 'settings', status: 'ok' })).catch(() => ({ type: 'settings', status: 'error' }))
    ])
    
    return NextResponse.json({ 
      success: true, 
      data: {
        lastSync: new Date().toISOString(),
        contentHealth: [services, posts, settings],
        overallStatus: [services, posts, settings].every(item => item.status === 'ok') ? 'healthy' : 'needs_attention'
      }
    })
  } catch (error) {
    console.error('Error checking sync status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check sync status' },
      { status: 500 }
    )
  }
} 