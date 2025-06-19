import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, phone, email, industry, service, productDetails } = body

    // Validate required fields
    if (!fullName || !phone || !industry || !service) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Send email to info@xuatnhapkhautbs.vn
    // 2. Save to database
    // 3. Send confirmation email to customer
    
    // For now, just log the data (in production, you'd integrate with email service)
    console.log('New contact form submission:', {
      fullName,
      phone,
      email: email || 'Không cung cấp',
      industry,
      service,
      productDetails: productDetails || 'Không cung cấp',
      timestamp: new Date().toISOString(),
    })

    // Simulate sending email (replace with actual email service)
    // Example: await sendEmail({
    //   to: 'info@xuatnhapkhautbs.vn',
    //   subject: `Yêu cầu tư vấn từ ${fullName}`,
    //   body: `
    //     Họ tên: ${fullName}
    //     Điện thoại: ${phone}
    //     Email: ${email || 'Không cung cấp'}
    //     Ngành hàng: ${industry}
    //     Dịch vụ quan tâm: ${service}
    //     Chi tiết hàng hóa: ${productDetails || 'Không cung cấp'}
    //   `
    // })

    return NextResponse.json(
      { message: 'Gửi thông tin thành công!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
} 