import { google } from 'googleapis'

export interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  attendees?: Array<{ email: string }>
}

export class GoogleCalendarService {
  private oauth2Client: InstanceType<typeof google.auth.OAuth2>

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    
    this.oauth2Client.setCredentials({
      access_token: accessToken
    })
  }

  async getCalendars() {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    
    try {
      const response = await calendar.calendarList.list()
      return response.data.items || []
    } catch (error) {
      console.error('Error fetching calendars:', error)
      throw error
    }
  }

  async getEvents(calendarId: string = 'primary', maxResults: number = 50) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    
    try {
      const response = await calendar.events.list({
        calendarId,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
        timeMin: new Date().toISOString(),
      })
      return response.data.items || []
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  }

  async createEvent(calendarId: string = 'primary', event: CalendarEvent) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    
    try {
      const response = await calendar.events.insert({
        calendarId,
        requestBody: event
      })
      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  async updateEvent(calendarId: string = 'primary', eventId: string, event: CalendarEvent) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    
    try {
      const response = await calendar.events.update({
        calendarId,
        eventId,
        requestBody: event
      })
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  async deleteEvent(calendarId: string = 'primary', eventId: string) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    
    try {
      await calendar.events.delete({
        calendarId,
        eventId
      })
      return true
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }
}

export async function getCalendarService(session: { accessToken?: string }) {
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }
  
  return new GoogleCalendarService(session.accessToken)
}