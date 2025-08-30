#!/bin/bash

# Calendar App Fly.io Deployment Script
# Deploy to stech-cal.fly.dev

set -e

echo "🚀 Deploying Calendar App to Fly.io..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    print_error "flyctl is not installed. Install it from https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Check if authenticated
if ! flyctl auth whoami &> /dev/null; then
    print_error "You are not authenticated with Fly.io. Run: flyctl auth login"
    exit 1
fi

print_status "✅ Fly.io CLI is installed and authenticated"

# Check if app exists, create if not
print_step "Checking if app 'stech-cal' exists..."
if ! flyctl apps list | grep -q "stech-cal"; then
    print_status "Creating new Fly.io app: stech-cal"
    flyctl apps create stech-cal --generate-name=false
else
    print_status "App 'stech-cal' already exists"
fi

# Set up secrets/environment variables
print_step "Setting up environment variables..."

if [[ -f .env.fly ]]; then
    print_status "Found .env.fly file. Please set these environment variables manually:"
    echo
    cat .env.fly | grep -E "^[A-Z]" | while IFS='=' read -r key value; do
        if [[ "$value" == *"your_"* ]] || [[ "$value" == *"here"* ]]; then
            print_warning "Please set: flyctl secrets set $key=<your_actual_value>"
        else
            print_status "Setting: $key"
            flyctl secrets set "$key=$value" || true
        fi
    done
    echo
    print_warning "Make sure to set the following with your actual values:"
    print_warning "  flyctl secrets set NEXTAUTH_SECRET=\$(openssl rand -base64 32)"
    print_warning "  flyctl secrets set GOOGLE_CLIENT_ID=your_client_id"
    print_warning "  flyctl secrets set GOOGLE_CLIENT_SECRET=your_client_secret"
else
    print_error ".env.fly file not found. Please create it from template."
    exit 1
fi

# Create volume if needed
print_step "Ensuring persistent volume exists..."
if ! flyctl volumes list | grep -q "cal_app_data"; then
    print_status "Creating persistent volume..."
    flyctl volumes create cal_app_data --region dfw --size 1
else
    print_status "Volume 'cal_app_data' already exists"
fi

# Deploy the application
print_step "Deploying to Fly.io..."
flyctl deploy

# Check deployment status
print_step "Checking deployment status..."
flyctl status

# Open the app
print_step "Testing deployment..."
sleep 10  # Wait for app to be ready

if curl -f https://stech-cal.fly.dev/api/health > /dev/null 2>&1; then
    print_status "✅ Deployment successful!"
    print_status "🌐 App URL: https://stech-cal.fly.dev"
    print_status "📊 Health Check: https://stech-cal.fly.dev/api/health"
    
    # Open in browser
    read -p "Open app in browser? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        flyctl open
    fi
else
    print_error "Health check failed. Check logs with: flyctl logs"
    exit 1
fi

print_status "🎉 Calendar app successfully deployed to stech-cal.fly.dev!"
print_status "📋 Useful commands:"
print_status "  View logs: flyctl logs"
print_status "  SSH to app: flyctl ssh console"
print_status "  Scale app: flyctl scale count 2"
print_status "  Check status: flyctl status"