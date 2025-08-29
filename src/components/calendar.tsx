'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface CalendarEvent {
  id: string
  summary: string
  start?: {
    dateTime?: string
    date?: string
  }
  end?: {
    dateTime?: string
    date?: string
  }
}

export default function Calendar() {
  const { data: session } = useSession()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const fetchEvents = useCallback(async () => {
    if (!session?.accessToken) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/calendar/events', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.accessToken])

  useEffect(() => {
    if (session?.accessToken) {
      fetchEvents()
    }
  }, [session, currentMonth, fetchEvents])

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>
    )
  }

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    return (
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {days.map(day => (
          <div key={day} className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = event.start?.dateTime 
        ? new Date(event.start.dateTime)
        : event.start?.date 
          ? new Date(event.start.date + 'T00:00:00')
          : null
      
      return eventDate && isSameDay(eventDate, date)
    })
  }

  const renderCells = () => {
    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day)
        const dayEvents = getEventsForDate(cloneDay)
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border-r border-b bg-white hover:bg-gray-50 transition-colors cursor-pointer
              ${!isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : ''}
              ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium
                ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}
                ${!isSameMonth(day, monthStart) ? 'text-gray-400' : 'text-gray-900'}
              `}>
                {format(day, 'd')}
              </span>
            </div>
            
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event.id || index}
                  className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                  title={event.summary}
                >
                  {event.summary}
                </div>
              ))}
              
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }
    
    return rows
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sign in to view your calendar
          </h2>
          <p className="text-gray-600">
            Connect your Google account to access your calendar events
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-100">
      {renderHeader()}
      {renderDaysOfWeek()}
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading events...</div>
          </div>
        ) : (
          <div className="bg-white">
            {renderCells()}
          </div>
        )}
      </div>
    </div>
  )
}