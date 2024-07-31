#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Check if we're on the main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Error: You must be on the main branch to deploy."
    exit 1
fi

# Pull the latest changes
git pull origin main

# Build the Docker images
docker-compose build

# Stop the running containers
docker-compose down

# Start the containers in detached mode
docker-compose up -d

# Run database migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --no-input

# Restart the backend service to apply changes
docker-compose restart backend

# Print success message
echo "Deployment complete!"
echo "Frontend is running at http://localhost:3000"
echo "Backend API is running at http://localhost:8000"