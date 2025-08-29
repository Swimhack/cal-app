# Calendar App - Google Calendar Integration

A modern calendar application built with Next.js 15.5.2 that integrates with Google Calendar API to provide seamless calendar management.

## Features

- 🔐 Google OAuth 2.0 authentication
- 📅 View Google Calendar events in a beautiful month view
- ➕ Create, edit, and delete calendar events
- 🔄 Real-time synchronization with Google Calendar
- 📱 Responsive design for mobile and desktop
- ⚡ Built with Next.js 15 and TypeScript

## Prerequisites

Before you begin, you need to set up a Google Cloud Project and enable the Calendar API:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to APIs & Services > Library
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

4. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > OAuth client ID
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
   - Save your Client ID and Client Secret

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd cal-app
   npm install
   ```

2. **Configure environment variables:**
   
   Update the `.env.local` file with your credentials:
   ```env
   # Google Cloud Platform API Configuration  
   GOOGLE_CLOUD_API_KEY=AIzaSyD0zAxSq03Pos8gaLcB160hBf2yueph80M
   
   # Google OAuth 2.0 Configuration (replace with your credentials)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here
   
   # Application Configuration
   NODE_ENV=development
   ```

   **Important:** Replace the placeholder values with your actual Google OAuth credentials.

3. **Generate a NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```
   Use the output as your `NEXTAUTH_SECRET`.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts    # NextAuth configuration
│   ├── api/calendar/events/route.ts       # Calendar API endpoints
│   ├── auth/signin/page.tsx              # Sign-in page
│   ├── layout.tsx                        # Root layout with providers
│   └── page.tsx                          # Main calendar page
├── components/
│   ├── calendar.tsx                      # Main calendar component
│   └── session-provider.tsx             # Session provider wrapper
├── lib/
│   └── google-calendar.ts               # Google Calendar service layer
└── types/
    └── next-auth.d.ts                   # NextAuth type extensions
```

## How It Works

1. **Authentication:** Uses NextAuth.js with Google OAuth 2.0 to authenticate users and obtain calendar access permissions.

2. **Calendar Integration:** The `GoogleCalendarService` class handles all interactions with the Google Calendar API, including:
   - Fetching calendar events
   - Creating new events
   - Updating existing events
   - Deleting events

3. **UI Components:** The main `Calendar` component renders a month view with:
   - Navigation between months
   - Event display on appropriate dates
   - Responsive design for different screen sizes

## Security Features

- 🔐 OAuth 2.0 authentication with Google
- 🛡️ Secure token management with NextAuth.js
- 🔒 Environment variables for sensitive data
- ✅ Proper error handling and validation

## Development

To modify the calendar app:

1. **Add new API endpoints:** Create files in `src/app/api/calendar/`
2. **Extend calendar features:** Modify `src/components/calendar.tsx`
3. **Update Google Calendar service:** Edit `src/lib/google-calendar.ts`

## Deployment

For production deployment:

1. Update `NEXTAUTH_URL` in your environment variables to your production domain
2. Add your production domain to Google OAuth authorized redirect URIs
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Troubleshooting

**"Invalid redirect URI" error:**
- Make sure your redirect URI in Google Cloud Console matches your NextAuth configuration
- For development: `http://localhost:3000/api/auth/callback/google`
- For production: `https://yourdomain.com/api/auth/callback/google`

**"Calendar API not enabled" error:**
- Ensure you've enabled the Google Calendar API in Google Cloud Console
- Check that you're using the correct project

**Authentication issues:**
- Verify your Google Client ID and Secret are correct
- Ensure NEXTAUTH_SECRET is set and secure
- Check that your OAuth consent screen is properly configured

## License

This project is licensed under the MIT License.
