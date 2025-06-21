import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, productType, email } = body;

    // Validate required fields
    if (!name || !phone || !productType) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Validate phone number (Vietnamese format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send to CRM (like HubSpot, Salesforce)
    // 3. Send notification email
    // 4. Add to email marketing list

    // Placeholder for database save
    console.log('New lead received:', {
      name,
      phone,
      productType,
      email,
      source: 'Landing Page - Nhập khẩu chính ngạch',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // TODO: Implement actual lead processing
    // - Save to database
    // - Send to CRM
    // - Send notification to sales team
    // - Add to email marketing automation

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 15 phút.'
    });

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Lead API endpoint is working' });
} 