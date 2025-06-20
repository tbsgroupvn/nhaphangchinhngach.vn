import { NextRequest, NextResponse } from 'next/server'
import { contentManager } from '../../../../lib/content-manager'

// POST - Trigger manual content sync
export async function POST(request: NextRequest) {
  try {
    const { syncType } = await request.json()
    
    // Get environment info
    const envInfo = contentManager.getEnvironmentInfo()
    
    let result
    
    switch (syncType) {
      case 'all':
        result = await contentManager.syncAll()
        break
      case 'services':
        try {
          await contentManager.getServices()
          result = { success: true, errors: [] }
        } catch (error) {
          result = { success: false, errors: [`Services sync failed: ${error}`] }
        }
        break
      case 'posts':
        try {
          await contentManager.getPosts()
          result = { success: true, errors: [] }
        } catch (error) {
          result = { success: false, errors: [`Posts sync failed: ${error}`] }
        }
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid sync type. Use: all, services, posts' },
          { status: 400 }
        )
    }
    
    // Include environment info in response
    const response = {
      success: result.success,
      message: result.success 
        ? `${syncType} sync completed successfully`
        : `${syncType} sync completed with errors`,
      errors: result.errors,
      environmentInfo: envInfo,
      timestamp: new Date().toISOString()
    }
    
    if (result.success) {
      return NextResponse.json(response)
    } else {
      return NextResponse.json(response, { status: 207 }) // Multi-status
    }
  } catch (error) {
    console.error('Error during sync:', error)
    
    // Get environment info for error response
    const envInfo = contentManager.getEnvironmentInfo()
    
    return NextResponse.json({
      success: false, 
      error: 'Sync operation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      environmentInfo: envInfo,
      timestamp: new Date().toISOString()
    }, { status: 500 })
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
    
    // Get environment information
    const environmentInfo = contentManager.getEnvironmentInfo()
    
    const response = {
      success: true, 
      data: {
        lastSync: new Date().toISOString(),
        contentHealth: [services, posts, settings],
        overallStatus: [services, posts, settings].every(item => item.status === 'ok') ? 'healthy' : 'needs_attention',
        environmentInfo
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error checking sync status:', error)
    
    // Still try to get environment info even on error
    let environmentInfo
    try {
      environmentInfo = contentManager.getEnvironmentInfo()
    } catch (envError) {
      environmentInfo = { error: 'Could not determine environment' }
    }
    
    return NextResponse.json({
      success: false, 
      error: 'Failed to check sync status',
      details: error instanceof Error ? error.message : 'Unknown error',
      environmentInfo,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 