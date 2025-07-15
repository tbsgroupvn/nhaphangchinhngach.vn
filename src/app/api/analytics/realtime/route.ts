import { NextResponse } from 'next/server';
import { googleAnalytics } from '../../../../lib/google-analytics';

// Timeout wrapper to prevent long-running requests
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
}

export async function GET() {
  try {
    console.log('🔍 Fetching GA real-time data...');
    
    // Fetch real-time Google Analytics data with timeout
    const realTimeData = await withTimeout(
      googleAnalytics.getRealTimeData(),
      5000 // 5 second timeout
    );
    
    console.log(`✅ GA Real-time data fetched. Active users: ${realTimeData.activeUsers}`);

    return NextResponse.json({
      success: true,
      data: realTimeData,
      isRealData: googleAnalytics.isConfigured(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching GA real-time data:', error);
    
    // Return fallback data instead of error to avoid blocking
    const fallbackData = {
      activeUsers: 0,
      pageViews: 0,
      sessionsPerCountry: [],
      deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
      topPages: [],
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(
      { 
        success: true, // Changed to true to avoid blocking
        data: fallbackData,
        isRealData: false,
        error: 'Using fallback data due to API timeout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 } // Changed to 200 to avoid blocking
    );
  }
} 