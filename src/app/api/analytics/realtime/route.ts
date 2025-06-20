import { NextResponse } from 'next/server';
import { googleAnalytics } from '../../../../lib/google-analytics';

export async function GET() {
  try {
    console.log('🔍 Fetching GA real-time data...');
    
    // Fetch real-time Google Analytics data
    const realTimeData = await googleAnalytics.getRealTimeData();
    
    console.log(`✅ GA Real-time data fetched. Active users: ${realTimeData.activeUsers}`);

    return NextResponse.json({
      success: true,
      data: realTimeData,
      isRealData: googleAnalytics.isConfigured(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching GA real-time data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch real-time data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 