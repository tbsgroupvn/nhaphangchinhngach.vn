// Google Analytics 4 API Integration (Server-side only)
let BetaAnalyticsDataClient: any = null;

// Dynamically import GA client only on server-side
async function importGAClient() {
  if (typeof window === 'undefined' && !BetaAnalyticsDataClient) {
    try {
      const module = await import('@google-analytics/data');
      BetaAnalyticsDataClient = module.BetaAnalyticsDataClient;
    } catch (error) {
      console.warn('Google Analytics package not available:', error);
    }
  }
}

export interface GATrafficData {
  date: string;
  views: number;
  visitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface GAPageData {
  path: string;
  title: string;
  views: number;
  uniqueViews: number;
}

export interface GATrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface GARealTimeData {
  activeUsers: number;
  topPages: GAPageData[];
  timestamp: string;
}

class GoogleAnalyticsService {
  private client: any = null;
  private propertyId: string;
  private isEnabled: boolean;
  private initialized: boolean = false;

  constructor() {
    this.propertyId = process.env.GA4_PROPERTY_ID || '';
    this.isEnabled = !!process.env.GOOGLE_APPLICATION_CREDENTIALS && !!this.propertyId;
  }

  private async initializeClient() {
    if (this.initialized || typeof window !== 'undefined') {
      return;
    }

    if (this.isEnabled) {
      try {
        await importGAClient();
        if (BetaAnalyticsDataClient) {
          this.client = new BetaAnalyticsDataClient({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          });
        }
      } catch (error) {
        console.error('Failed to initialize GA client:', error);
        this.isEnabled = false;
      }
    }
    this.initialized = true;
  }

  // Get traffic data for dashboard
  async getTrafficData(days: number = 7): Promise<GATrafficData[]> {
    await this.initializeClient();
    
    if (!this.isEnabled || !this.client) {
      console.warn('Google Analytics not configured, using fallback data');
      return this.getFallbackTrafficData(days);
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: `${days - 1}daysAgo`,
            endDate: 'today',
          },
        ],
        dimensions: [
          { name: 'date' },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
        orderBys: [
          {
            dimension: {
              dimensionName: 'date',
            },
          },
        ],
      });

      const data: GATrafficData[] = [];
      
      response.rows?.forEach((row: any) => {
        const date = row.dimensionValues?.[0]?.value || '';
        const views = parseInt(row.metricValues?.[0]?.value || '0');
        const visitors = parseInt(row.metricValues?.[1]?.value || '0');
        const sessions = parseInt(row.metricValues?.[2]?.value || '0');
        const bounceRate = parseFloat(row.metricValues?.[3]?.value || '0');
        const avgSessionDuration = parseFloat(row.metricValues?.[4]?.value || '0');

        // Format date to Vietnamese format
        const formattedDate = this.formatDateToVietnamese(date);

        data.push({
          date: formattedDate,
          views,
          visitors,
          sessions,
          bounceRate: bounceRate * 100, // Convert to percentage
          avgSessionDuration: avgSessionDuration / 60, // Convert to minutes
        });
      });

      return data;
    } catch (error) {
      console.error('Error fetching GA traffic data:', error);
      return this.getFallbackTrafficData(days);
    }
  }

  // Get real-time active users
  async getRealTimeData(): Promise<GARealTimeData> {
    await this.initializeClient();
    
    if (!this.isEnabled || !this.client) {
      return this.getFallbackRealTimeData();
    }

    try {
      const [response] = await this.client.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [
          { name: 'activeUsers' },
        ],
      });

      const activeUsers = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');
      const topPages = await this.getPopularPages(3);

      return {
        activeUsers,
        topPages,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching GA real-time data:', error);
      return this.getFallbackRealTimeData();
    }
  }

  // Get popular pages from GA
  async getPopularPages(limit: number = 5): Promise<GAPageData[]> {
    await this.initializeClient();
    
    if (!this.isEnabled || !this.client) {
      return this.getFallbackPopularPages();
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
        ],
        orderBys: [
          {
            metric: {
              metricName: 'screenPageViews',
            },
            desc: true,
          },
        ],
        limit: limit,
      });

      const pages: GAPageData[] = [];
      
      response.rows?.forEach((row: any) => {
        const path = row.dimensionValues?.[0]?.value || '';
        const title = row.dimensionValues?.[1]?.value || '';
        const views = parseInt(row.metricValues?.[0]?.value || '0');
        const uniqueViews = parseInt(row.metricValues?.[1]?.value || '0');

        pages.push({
          path,
          title: title || this.getPageTitleFromPath(path),
          views,
          uniqueViews,
        });
      });

      return pages;
    } catch (error) {
      console.error('Error fetching GA popular pages:', error);
      return this.getFallbackPopularPages();
    }
  }

  // Helper methods
  private formatDateToVietnamese(dateString: string): string {
    // Convert YYYYMMDD to DD/MM format
    if (dateString.length === 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}`;
    }
    return dateString;
  }

  private getPageTitleFromPath(path: string): string {
    const titleMap: { [key: string]: string } = {
      '/': 'Trang chủ - TBS GROUP',
      '/dich-vu': 'Dịch vụ logistics',
      '/dich-vu/nhap-khau-chinh-ngach': 'Dịch vụ nhập khẩu chính ngạch',
      '/gioi-thieu': 'Giới thiệu TBS GROUP',
      '/lien-he': 'Liên hệ',
      '/tin-tuc': 'Tin tức logistics',
    };

    return titleMap[path] || `Trang ${path}`;
  }

  // Fallback data methods (used when GA is not configured)
  private getFallbackTrafficData(days: number): GATrafficData[] {
    const data: GATrafficData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseViews = isWeekend ? 150 : 380;
      const variation = 0.85 + (Math.random() * 0.3);
      const views = Math.floor(baseViews * variation);
      
      data.push({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        views,
        visitors: Math.floor(views * 0.68),
        sessions: Math.floor(views * 0.75),
        bounceRate: 42 + (Math.random() * 8 - 4),
        avgSessionDuration: 2.8 + (Math.random() * 1 - 0.5),
      });
    }
    
    return data;
  }

  private getFallbackPopularPages(): GAPageData[] {
    return [
      {
        path: '/',
        title: 'Trang chủ - TBS GROUP',
        views: 850,
        uniqueViews: 680
      },
      {
        path: '/dich-vu/nhap-khau-chinh-ngach',
        title: 'Dịch vụ nhập khẩu chính ngạch',
        views: 620,
        uniqueViews: 520
      },
      {
        path: '/dich-vu',
        title: 'Dịch vụ logistics',
        views: 480,
        uniqueViews: 410
      }
    ];
  }

  private getFallbackRealTimeData(): GARealTimeData {
    const hour = new Date().getHours();
    let activeUsers = 0;
    
    if (hour >= 8 && hour <= 17) {
      activeUsers = 8 + Math.floor(Math.random() * 6);
    } else if (hour >= 18 && hour <= 22) {
      activeUsers = 2 + Math.floor(Math.random() * 4);
    } else {
      activeUsers = Math.floor(Math.random() * 2);
    }

    return {
      activeUsers,
      topPages: this.getFallbackPopularPages().slice(0, 3),
      timestamp: new Date().toISOString(),
    };
  }

  // Check if GA is properly configured
  isConfigured(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const googleAnalytics = new GoogleAnalyticsService(); 