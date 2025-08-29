'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { Calendar, Chrome } from 'lucide-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: true
      })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Calendar App
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your Google account to access your calendar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Chrome className="w-5 h-5 mr-3 text-blue-500" />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Features</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    View your Google Calendar events
                  </p>
                  <p className="text-sm text-gray-500">
                    Access all your calendars and events in one place
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Create and manage events
                  </p>
                  <p className="text-sm text-gray-500">
                    Add, edit, and delete calendar events
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Real-time synchronization
                  </p>
                  <p className="text-sm text-gray-500">
                    Stay synced with your Google Calendar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our terms of service and privacy policy.
            <br />
            We only access your calendar data with your permission.
          </p>
        </div>
      </div>
    </div>
  )
}