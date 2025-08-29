import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getCalendarService } from '@/lib/google-calendar'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const calendarService = await getCalendarService(session)
    const events = await calendarService.getEvents()

    return NextResponse.json({
      events,
      success: true
    })
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const calendarService = await getCalendarService(session)
    const event = await calendarService.createEvent('primary', body)

    return NextResponse.json({
      event,
      success: true
    })
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}