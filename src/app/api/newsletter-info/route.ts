import { NextRequest, NextResponse } from 'next/server'

const LARKSUITE_CONFIG = {
  appId: 'cli_a571bcd64b78d02f',
  appSecret: 'z3LwUUuCfH2ziOHtdtdjme7BHYHt1pMJ',
  appToken: 'YDBwbh73ga8X0EsWionlHjeYg0c',
  tableId: 'tbllgGh3YmhZepvT'
}

async function getTenantAccessToken() {
  try {
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
    
    if (data.code === 0) {
      return data.tenant_access_token
    } else {
      throw new Error(`Failed to get tenant access token: ${data.msg}`)
    }
  } catch (error) {
    throw error
  }
}

async function getTableFields(accessToken: string) {
  try {
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${LARKSUITE_CONFIG.appToken}/tables/${LARKSUITE_CONFIG.tableId}/fields`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const responseText = await response.text()
    console.log('Table fields response:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

async function getTableRecords(accessToken: string) {
  try {
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${LARKSUITE_CONFIG.appToken}/tables/${LARKSUITE_CONFIG.tableId}/records?page_size=5`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const responseText = await response.text()
    console.log('Table records response:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

export async function GET() {
  try {
    console.log('🔍 Getting table information...')
    
    // Get access token
    const accessToken = await getTenantAccessToken()
    console.log('✅ Got access token')
    
    // Get table fields (schema)
    const fieldsData = await getTableFields(accessToken)
    console.log('✅ Got table fields')
    
    // Get existing records (to see format)
    const recordsData = await getTableRecords(accessToken)
    console.log('✅ Got table records')

    return NextResponse.json({
      success: true,
      config: {
        appToken: LARKSUITE_CONFIG.appToken,
        tableId: LARKSUITE_CONFIG.tableId
      },
      fields: fieldsData,
      sampleRecords: recordsData
    })

  } catch (error) {
    console.error('❌ Error getting table info:', error)
    
    return NextResponse.json(
      { 
        error: 'Có lỗi khi lấy thông tin table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 