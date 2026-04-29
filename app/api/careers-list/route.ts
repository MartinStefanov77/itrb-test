import { getPayload } from 'payload'
import config from '@payload-config'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get('locale') || 'en'
    const payload = await getPayload({ config })

    const newJobPositions = await payload.find({
      collection: 'new-job-positions',
      locale: locale as 'en' | 'bg',
    })

    return Response.json(newJobPositions, { status: 200 })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return Response.json({ error: 'Failed to fetch tests' }, { status: 500 })
  }
}