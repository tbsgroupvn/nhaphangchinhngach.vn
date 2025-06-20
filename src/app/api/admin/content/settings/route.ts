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
    
    await contentManager.updateSettings(settingsData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully' 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 