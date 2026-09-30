import { NextResponse } from 'next/server'

export function retiredEndpoint() {
  return NextResponse.json(
    {
      error: 'Endpoint cũ đã ngừng hoạt động. Sử dụng TBS Studio.',
      code: 'RETIRED',
    },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  )
}
