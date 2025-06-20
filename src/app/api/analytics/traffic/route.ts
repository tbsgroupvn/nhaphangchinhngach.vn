import { NextResponse } from 'next/server';
import { googleAnalytics } from '../../../../lib/google-analytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Validate days parameter
    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'Days parameter must be between 1 and 365' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching GA traffic data for ${days} days...`);
    
    // Fetch real Google Analytics data
    const trafficData = await googleAnalytics.getTrafficData(days);
    
    // Calculate summary statistics
    const totalViews = trafficData.reduce((sum, day) => sum + day.views, 0);
    const totalVisitors = trafficData.reduce((sum, day) => sum + day.visitors, 0);
    const totalSessions = trafficData.reduce((sum, day) => sum + day.sessions, 0);
    const avgBounceRate = trafficData.reduce((sum, day) => sum + day.bounceRate, 0) / trafficData.length;
    const avgSessionDuration = trafficData.reduce((sum, day) => sum + day.avgSessionDuration, 0) / trafficData.length;

    const summary = {
      totalViews,
      totalVisitors,
      totalSessions,
      avgBounceRate: Math.round(avgBounceRate * 10) / 10,
      avgSessionDuration: Math.round(avgSessionDuration * 10) / 10,
      isRealData: googleAnalytics.isConfigured()
    };

    console.log(`✅ GA Traffic data fetched successfully. Real data: ${summary.isRealData}`);

    return NextResponse.json({
      success: true,
      data: trafficData,
      summary,
      period: `${days} days`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching GA traffic data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch traffic data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { days = 7 } = body;

    // Same logic as GET but supports POST for more complex requests
    const trafficData = await googleAnalytics.getTrafficData(days);
    
    return NextResponse.json({
      success: true,
      data: trafficData,
      isRealData: googleAnalytics.isConfigured(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in POST traffic route:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch traffic data' },
      { status: 500 }
    );
  }
} 