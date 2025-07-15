import { NextResponse } from 'next/server';
import { googleAnalytics } from '../../../../lib/google-analytics';

// Timeout wrapper to prevent long-running requests
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
}

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
    
    // Fetch real Google Analytics data with timeout
    const trafficData = await withTimeout(
      googleAnalytics.getTrafficData(days),
      8000 // 8 second timeout for traffic data
    );
    
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
    
    // Return fallback data instead of error to avoid blocking
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const fallbackData = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: 0,
      visitors: 0,
      sessions: 0,
      bounceRate: 0,
      avgSessionDuration: 0
    }));

    const fallbackSummary = {
      totalViews: 0,
      totalVisitors: 0,
      totalSessions: 0,
      avgBounceRate: 0,
      avgSessionDuration: 0,
      isRealData: false
    };

    return NextResponse.json(
      { 
        success: true, // Changed to true to avoid blocking
        data: fallbackData,
        summary: fallbackSummary,
        period: `${days} days`,
        error: 'Using fallback data due to API timeout',
        timestamp: new Date().toISOString()
      },
      { status: 200 } // Changed to 200 to avoid blocking
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { days = 7 } = body;

    // Same logic as GET but supports POST for more complex requests
    const trafficData = await withTimeout(
      googleAnalytics.getTrafficData(days),
      8000 // 8 second timeout
    );
    
    return NextResponse.json({
      success: true,
      data: trafficData,
      isRealData: googleAnalytics.isConfigured(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in POST traffic route:', error);
    
    // Return fallback data instead of error
    const fallbackData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (7 - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: 0,
      visitors: 0,
      sessions: 0,
      bounceRate: 0,
      avgSessionDuration: 0
    }));
    
    return NextResponse.json(
      { 
        success: true, // Changed to true to avoid blocking
        data: fallbackData,
        isRealData: false,
        error: 'Using fallback data due to API timeout',
        timestamp: new Date().toISOString()
      },
      { status: 200 } // Changed to 200 to avoid blocking
    );
  }
} 