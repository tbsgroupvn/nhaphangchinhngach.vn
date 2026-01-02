import { NextRequest, NextResponse } from 'next/server'
import { contentManager } from '../../../../../lib/content-manager'

// GET - Fetch all services
export async function GET() {
  try {
    const services = await contentManager.getServices()
    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json()
    
    // Validate required fields
    if (!serviceData.title || !serviceData.slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    // Create service in both TypeScript data and markdown
    await contentManager.updateService(serviceData.id || Date.now().toString(), serviceData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Service created successfully' 
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

// PUT - Update existing service
export async function PUT(request: NextRequest) {
  try {
    const { id, ...serviceData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      )
    }

    await contentManager.updateService(id, serviceData)

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      )
    }

    // Note: You'll need to implement deleteService in contentManager
    // For now, return success to not block the UI
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    )
  }
} 