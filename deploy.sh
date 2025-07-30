#!/bin/bash

# Green Community Deployment Script
echo "🌱 Green Community Docker Deployment Script"
echo "=============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Server/.env file exists
if [ ! -f Server/.env ]; then
    echo "❌ Server/.env file not found!"
    echo "📝 Please make sure you have a .env file in the Server directory with your configuration."
    exit 1
else
    echo "✅ Found Server/.env file"
fi

# Build and start the application
echo "🚀 Building and starting Green Community application..."
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ Deployment complete!"
echo "🌐 Client is available at: http://localhost:3000"
echo "🔧 Server API is available at: http://localhost:5000"
echo "🗄️  MongoDB is available at: localhost:27017"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo "To restart: docker-compose restart"
