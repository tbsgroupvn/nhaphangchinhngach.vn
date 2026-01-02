import { NextRequest, NextResponse } from 'next/server'
import { contentManager } from '../../../../../lib/content-manager'

// GET - Fetch website settings
export async function GET() {
  try {
    const settings = await contentManager.getSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update website settings
export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()

    console.log('Received settings update request:', settingsData)

    await contentManager.updateSettings(settingsData)

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating settings:', error)

    // Return detailed error message
    const errorMessage = error?.message || 'Failed to update settings'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
} 