#!/bin/bash

echo "Starting deployment on Raspberry Pi..."

# Load environment variables
set -a
source .env
set +a

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        log "✅ $1 succeeded"
    else
        log "❌ $1 failed"
        exit 1
    fi
}

# Stop running containers
log "Stopping running containers..."
docker-compose down
check_status "Container shutdown"

# Pull latest images
log "Pulling latest images..."
docker-compose pull
check_status "Image pull"

# Build containers
log "Building containers..."
docker-compose build
check_status "Container build"

# Start containers
log "Starting containers..."
docker-compose up -d
check_status "Container startup"

# Wait for services to be ready
log "Waiting for services to be ready..."
sleep 10

# Check if services are running
log "Checking service health..."
if docker-compose ps | grep -q "Up"; then
    log "✅ Services are running"
else
    log "❌ Services failed to start"
    docker-compose logs
    exit 1
fi

# Run database migrations
log "Running database migrations..."
docker-compose exec -T backend flask --app __init__.py db upgrade
check_status "Database migration"

# Run database seeds if needed
if [ "$SEED_ON_DEPLOY" = "true" ]; then
    log "Running database seeds..."
    docker-compose exec -T backend flask --app __init__.py seed all
    check_status "Database seeding"
fi

log "🎉 Deployment completed successfully!"