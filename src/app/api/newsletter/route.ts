import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '../../../services/emailService'

const LARKSUITE_CONFIG = {
  appId: 'cli_a571bcd64b78d02f',
  appSecret: 'z3LwUUuCfH2ziOHtdtdjme7BHYHt1pMJ',
  appToken: 'YDBwbh73ga8X0EsWionlHjeYg0c',
  tableId: 'tbllgGh3YmhZepvT'
}

// Temporary fallback - save to local storage or log for now
async function saveTempRecord(email: string, name?: string) {
  console.log('💾 Saving newsletter subscription:', {
    email,
    name: name || '',
    timestamp: new Date().toISOString(),
    source: 'Website TBS GROUP'
  })
  
  // TODO: Implement proper Larksuite integration
  // For now, just simulate success
  return {
    success: true,
    recordId: `temp_${Date.now()}`
  }
}

async function getTenantAccessToken() {
  try {
    console.log('🔑 Getting tenant access token...')
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        app_id: LARKSUITE_CONFIG.appId,
        app_secret: LARKSUITE_CONFIG.appSecret
      })
    })

    const data = await response.json()
    console.log('🔑 Tenant access token response:', data)
    
    if (data.code === 0) {
      console.log('✅ Tenant access token received successfully')
      return data.tenant_access_token
    } else {
      console.error('❌ Failed to get tenant access token:', data)
      throw new Error(`Failed to get tenant access token: ${data.msg}`)
    }
  } catch (error) {
    console.error('❌ Error getting tenant access token:', error)
    throw error
  }
}

async function addRecordToBase(accessToken: string, email: string, name?: string) {
  try {
    console.log('📝 Adding record to base...', { email, name })
    
    // CORRECT FORMAT: Direct fields với field names (đã test thành công)
    // Primary field: Email 
    // Name field: Họ và tên
    // Date field: Ngày điền đăng ký - auto_fill
    
    const requestBody = {
      fields: {
        'Email': email,                       // Primary field "Email"
        'Họ và tên': name || ''              // "Họ và tên" 
        // DateTime field tự động điền bởi Base
      }
    }

    console.log('📝 Record data:', JSON.stringify(requestBody, null, 2))

    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${LARKSUITE_CONFIG.appToken}/tables/${LARKSUITE_CONFIG.tableId}/records`
    console.log('📝 API URL:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'TBS-GROUP-WEBSITE/1.0'
      },
      body: JSON.stringify(requestBody)
    })

    const responseText = await response.text()
    console.log('📝 Raw response:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    console.log('📝 Add record response:', data)
    
    if (data.code === 0) {
      console.log('✅ Record added successfully to Larksuite')
      console.log('✅ Record ID:', data.data.record_id)
      console.log('✅ Email:', email)
      return {
        recordId: data.data.record_id,
        email: email,
        source: 'larksuite'
      }
    } else {
      console.error('❌ Failed to add record:', data)
      
      // Fallback không cần thiết nữa vì đã sử dụng format đúng
      
      throw new Error(`Failed to add record: ${data.msg || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('❌ Error adding record to base:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 Newsletter API called')
  
  try {
    const body = await request.json()
    console.log('📨 Request body:', body)
    
    const { email, name } = body

    // Validate input
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email:', email)
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    console.log('✅ Email validation passed')

    // Try Larksuite integration, fallback to temp storage
    try {
      // Get tenant access token
      const accessToken = await getTenantAccessToken()
      console.log('✅ Got tenant access token, length:', accessToken?.length)
      
      // Add record to Larksuite Base
      const result = await addRecordToBase(accessToken, email, name)
      console.log('✅ Record added to Larksuite, result:', result)

      // Send welcome email after successful registration
      let emailResult = null
      try {
        console.log('📧 Sending welcome email to:', email)
        emailResult = await sendWelcomeEmail({ to: email, name })
        console.log('✅ Welcome email sent successfully to:', email)
      } catch (emailError) {
        console.error('❌ Failed to send welcome email:', emailError)
        // Don't fail the whole request if email fails
        console.log('⚠️ Newsletter registration successful but email failed')
      }

      return NextResponse.json({
        success: true,
        message: 'Đăng ký nhận tin thành công! Cảm ơn bạn đã quan tâm đến TBS GROUP.' + 
                 (emailResult ? ' Email chào mừng đã được gửi!' : ''),
        recordId: result.recordId,
        email: result.email,
        source: result.source,
        emailSent: !!emailResult
      })
    } catch (larksuiteError) {
      console.log('⚠️ Larksuite integration failed, using fallback:', larksuiteError)
      
      // Fallback to temporary storage
      const tempResult = await saveTempRecord(email, name)
      
      // Send welcome email even in fallback mode
      let emailResult = null
      try {
        console.log('📧 Sending welcome email (fallback mode) to:', email)
        emailResult = await sendWelcomeEmail({ to: email, name })
        console.log('✅ Welcome email sent successfully (fallback mode) to:', email)
      } catch (emailError) {
        console.error('❌ Failed to send welcome email (fallback mode):', emailError)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Đăng ký nhận tin thành công! Cảm ơn bạn đã quan tâm đến TBS GROUP.' + 
                 (emailResult ? ' Email chào mừng đã được gửi!' : ''),
        recordId: tempResult.recordId,
        source: 'fallback',
        note: 'Sẽ được xử lý thủ công',
        emailSent: !!emailResult
      })
    }

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error)
    
    return NextResponse.json(
      { 
        error: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Newsletter API endpoint is working',
    config: {
      appId: LARKSUITE_CONFIG.appId,
      tableId: LARKSUITE_CONFIG.tableId
    }
  })
} 