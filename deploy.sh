#!/bin/bash

# Calendar App Docker Deployment Script
# This script builds and deploys the calendar app using Docker

set -e

echo "🚀 Starting Calendar App Docker Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [[ ! -f .env ]]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.docker .env
    print_error "Please edit .env file with your actual environment variables before running again."
    exit 1
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t cal-app:latest .

# Stop and remove existing container if it exists
print_status "Stopping existing container..."
docker stop calendar-app 2>/dev/null || true
docker rm calendar-app 2>/dev/null || true

# Start the new container using docker-compose
print_status "Starting calendar app container..."
docker-compose up -d cal-app

# Wait for the application to be healthy
print_status "Waiting for application to be ready..."
timeout=60
counter=0

while [ $counter -lt $timeout ]; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "✅ Calendar app is running and healthy!"
        print_status "🌐 Access the app at: http://localhost:3000"
        break
    fi
    
    sleep 2
    counter=$((counter + 2))
    
    if [ $counter -ge $timeout ]; then
        print_error "Application failed to start within $timeout seconds"
        print_error "Check logs with: docker logs calendar-app"
        exit 1
    fi
done

# Show container status
print_status "Container status:"
docker ps --filter name=calendar-app

print_status "🎉 Deployment completed successfully!"
print_status "📊 View logs: docker logs calendar-app"
print_status "🛑 Stop app: docker-compose down"