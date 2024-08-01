#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
for cmd in docker docker-compose git python3 node npm; do
    if ! command_exists "$cmd"; then
        echo "Error: $cmd is not installed. Please install it and try again."
        exit 1
    fi
done

# Create necessary directories
mkdir -p logs backups

# Clone the repository if not already in project directory
if [ ! -d ".git" ]; then
    git clone https://github.com/kylerobertson84/i14-ssiem.git .
fi

# Build and start the Docker containers
docker-compose up -d

# Install backend dependencies
docker-compose exec backend pip install -r requirements.txt

# Run backend migrations
docker-compose exec backend python manage.py migrate

# Install frontend dependencies
docker-compose exec frontend npm install

# Function to check if the superuser exists
superuser_exists() {
    docker-compose exec backend python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(is_superuser=True).exists())"
}

# Create a superuser for Django admin if it doesn't exist
if [ "$(superuser_exists)" = "False" ]; then
    docker-compose exec backend python manage.py createsuperuser
else
    echo "Superuser already exists. Skipping creation."
fi

# Print success message
echo "Development environment setup complete!"
echo "Frontend is running at http://localhost:3000"
echo "Backend API is running at http://localhost:8000"
echo "Use the superuser credentials to access the Django admin at http://localhost:8000/admin"