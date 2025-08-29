'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Settings } from 'lucide-react'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return {
          title: 'Authentication Configuration Error',
          description: 'There is a problem with the authentication configuration. This usually means environment variables are missing or incorrect.',
          details: [
            'Check that GOOGLE_CLIENT_ID is set',
            'Check that GOOGLE_CLIENT_SECRET is set', 
            'Check that NEXTAUTH_SECRET is set',
            'Verify NEXTAUTH_URL matches your domain'
          ]
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to access this application.',
          details: ['Contact your administrator for access']
        }
      case 'Verification':
        return {
          title: 'Verification Error',
          description: 'The verification token has expired or has already been used.',
          details: ['Try signing in again']
        }
      default:
        return {
          title: 'Authentication Error',
          description: 'An error occurred during authentication.',
          details: ['Please try again or contact support']
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {errorInfo.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {errorInfo.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <Settings className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Details
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {errorInfo.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {error === 'Configuration' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="text-sm text-blue-700">
                  <p className="font-medium">For developers:</p>
                  <p className="mt-1">
                    This error occurs when the Google OAuth credentials or NextAuth configuration 
                    are not properly set up. Please check your environment variables in your 
                    deployment platform (Netlify, Vercel, etc.).
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Link>
            
            <Link
              href="/auth/signin"
              className="w-full flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Error Code: {error || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  )
}