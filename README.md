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

## Netlify Deployment

### Environment Variables Required for Netlify:

In your Netlify dashboard, go to Site Settings > Environment Variables and add:

```env
NEXTAUTH_URL=https://stechcal.netlify.app
NEXTAUTH_SECRET=your_32_character_random_secret
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Google OAuth Setup for Netlify:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add to Authorized redirect URIs:
   - `https://stechcal.netlify.app/api/auth/callback/google`
5. Save changes

## Troubleshooting

**"Configuration" error on Netlify:**
- Check that all required environment variables are set in Netlify dashboard
- Ensure NEXTAUTH_URL matches your Netlify domain exactly
- Verify Google OAuth redirect URIs include your Netlify domain

**"Invalid redirect URI" error:**
- Make sure your redirect URI in Google Cloud Console matches your domain
- For development: `http://localhost:3000/api/auth/callback/google`
- For production: `https://stechcal.netlify.app/api/auth/callback/google`

**"Calendar API not enabled" error:**
- Ensure you've enabled the Google Calendar API in Google Cloud Console
- Check that you're using the correct project

**Environment Variables:**
- All required variables must be set in Netlify's environment variables section
- Use `.env.example` as a template for required variables
- Never commit actual credentials to the repository

## Docker Deployment

### Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Swimhack/cal-app.git
   cd cal-app
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.docker .env
   # Edit .env with your actual Google OAuth credentials
   ```

3. **Deploy with the automated script:**
   ```bash
   ./deploy.sh
   ```

### Manual Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t cal-app:latest .
   ```

2. **Run with docker-compose:**
   ```bash
   docker-compose up -d
   ```

3. **Check health status:**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Production Deployment

For production deployment with HTTPS and reverse proxy:

1. **Create external network:**
   ```bash
   docker network create traefik-network
   ```

2. **Set production environment variables:**
   ```bash
   export NEXTAUTH_URL=https://your-domain.com
   export ACME_EMAIL=your-email@domain.com
   # Set other environment variables...
   ```

3. **Deploy with production compose:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Docker Commands Reference

```bash
# View logs
docker logs calendar-app

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Health check
docker exec calendar-app node -e "require('http').get('http://localhost:3000/api/health', console.log)"

# Shell access
docker exec -it calendar-app sh
```

### Container Features

- **Multi-stage build** for optimized production image
- **Non-root user** for security
- **Health checks** for monitoring
- **Standalone Next.js output** for minimal runtime
- **Automatic SSL** with Traefik (production)

## Fly.io Deployment

### Quick Deploy to stech-cal.fly.dev

1. **Install Fly.io CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   export PATH="$HOME/.fly/bin:$PATH"
   ```

2. **Authenticate with Fly.io:**
   ```bash
   flyctl auth login
   ```

3. **Set up environment variables:**
   - Generate NextAuth secret: `openssl rand -base64 32`
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

4. **Deploy with automated script:**
   ```bash
   ./deploy-fly.sh
   ```

5. **Set required secrets manually:**
   ```bash
   flyctl secrets set NEXTAUTH_SECRET=your_generated_secret
   flyctl secrets set GOOGLE_CLIENT_ID=your_google_client_id
   flyctl secrets set GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### Manual Fly.io Deployment

1. **Create the app:**
   ```bash
   flyctl apps create stech-cal
   ```

2. **Set environment variables:**
   ```bash
   flyctl secrets set NEXTAUTH_URL=https://stech-cal.fly.dev
   flyctl secrets set NEXTAUTH_SECRET=$(openssl rand -base64 32)
   flyctl secrets set GOOGLE_CLIENT_ID=your_client_id
   flyctl secrets set GOOGLE_CLIENT_SECRET=your_client_secret
   ```

3. **Deploy:**
   ```bash
   flyctl deploy
   ```

### Google OAuth Setup for Fly.io

1. Go to [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://stech-cal.fly.dev/api/auth/callback/google`
4. Save changes

### Fly.io Management Commands

```bash
# View application status
flyctl status

# View logs
flyctl logs

# SSH into the application
flyctl ssh console

# Scale the application
flyctl scale count 2

# View secrets
flyctl secrets list

# Open app in browser
flyctl open
```

### Fly.io Configuration Features

- **Automatic HTTPS** with Let's Encrypt certificates
- **Health checks** via `/api/health` endpoint
- **Auto-restart** on failures with rollback capability
- **Persistent storage** with mounted volumes
- **Global edge locations** for low latency
- **Zero-downtime deployments** with blue-green strategy

## License

This project is licensed under the MIT License.
