set -e

# Print commands and their arguments as they are executed
set -x

docker-compose down

docker-compose up --build

# Print success message
echo "Deployment complete!"
echo "Frontend is running at http://localhost:3000"
echo "Backend API is running at http://localhost:8000"