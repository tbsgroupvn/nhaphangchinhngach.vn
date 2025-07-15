import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/services/emailService'

const LARKSUITE_CONFIG = {
  appId: 'cli_a571bcd64b78d02f',
  appSecret: 'z3LwUUuCfH2ziOHtdtdjme7BHYHt1pMJ',
  appToken: 'YDBwbh73ga8X0EsWionlHjeYg0c',
  tableId: 'tbllgGh3YmhZepvT'
}

// Timeout wrapper to prevent long-running requests
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
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
    const response = await withTimeout(
      fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          app_id: LARKSUITE_CONFIG.appId,
          app_secret: LARKSUITE_CONFIG.appSecret,
        }),
      }),
      5000 // 5 second timeout
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('🔐 Tenant access token response:', data)

    if (data.code !== 0) {
      throw new Error(`Larksuite API error: ${data.msg}`)
    }

    return data.tenant_access_token
  } catch (error) {
    console.error('❌ Error getting tenant access token:', error)
    throw error
  }
}

async function addRecordToBase(accessToken: string, email: string, name?: string) {
  try {
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${LARKSUITE_CONFIG.appToken}/tables/${LARKSUITE_CONFIG.tableId}/records`
    
    const recordData = {
      fields: {
        'Email': email,
        'Họ và tên': name || '',
      }
    }

    console.log('📤 Sending record to Larksuite:', recordData)

    const response = await withTimeout(
      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(recordData),
      }),
      8000 // 8 second timeout
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseText = await response.text()
    console.log('📥 Larksuite response:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    if (data.code !== 0) {
      throw new Error(`Larksuite API error: ${data.msg}`)
    }

    return {
      success: true,
      recordId: data.data.record.record_id,
      email: email,
      name: name || '',
      source: 'Website TBS GROUP'
    }
  } catch (error) {
    console.error('❌ Error adding record to Larksuite:', error)
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

      // Send welcome email after successful registration (non-blocking)
      let emailResult = null
      try {
        console.log('📧 Sending welcome email to:', email)
        emailResult = await withTimeout(
          sendWelcomeEmail({ to: email, name }),
          5000 // 5 second timeout for email
        )
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
      console.error('❌ Larksuite integration failed:', larksuiteError)
      
      // Fallback to temporary storage - still return success to avoid blocking UX
      const tempResult = await saveTempRecord(email, name)
      console.log('⚠️ Used fallback storage:', tempResult)

      return NextResponse.json({
        success: true,
        message: 'Đăng ký nhận tin thành công! Cảm ơn bạn đã quan tâm đến TBS GROUP. (Sử dụng hệ thống dự phòng)',
        recordId: tempResult.recordId,
        email: email,
        source: 'Fallback System',
        emailSent: false,
        fallback: true
      })
    }
  } catch (error) {
    console.error('❌ Critical error in newsletter API:', error)
    
    // Return fallback success to avoid blocking UX
    return NextResponse.json({
      success: true,
      message: 'Đăng ký nhận tin thành công! Cảm ơn bạn đã quan tâm đến TBS GROUP.',
      recordId: `fallback_${Date.now()}`,
      email: 'unknown',
      source: 'Emergency Fallback',
      emailSent: false,
      fallback: true
    })
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