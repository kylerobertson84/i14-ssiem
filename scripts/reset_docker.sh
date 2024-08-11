
#!/bin/bash

# Warning message
echo "WARNING: This script will stop all Docker containers, remove all containers, images, volumes, networks, and prune the Docker system."
echo "This action is irreversible and will delete all Docker data on your system."

# Prompt for confirmation
read -p "Are you sure you want to continue? (y/n): " confirm

# Check if the user confirmed with 'y' or 'Y'
if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "Operation canceled."
    exit 1
fi

# Stop all running containers
echo "Stopping all running containers..."
docker stop $(docker ps -aq)

# Remove all containers
echo "Removing all containers..."
docker rm $(docker ps -aq)

# Remove all images
echo "Removing all images..."
docker rmi $(docker images -q)

# Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q)

# Remove all networks
echo "Removing all networks..."
docker network rm $(docker network ls -q)

# Prune everything else
echo "Pruning system..."
docker system prune -a --volumes -f

# Optionally, stop Docker service (uncomment if needed)
# echo "Stopping Docker service..."
# sudo systemctl stop docker

# Optionally, remove Docker data directory (uncomment if needed)
# echo "Removing Docker data directory..."
# sudo rm -rf /var/lib/docker

# Optionally, start Docker service (uncomment if needed)
# echo "Starting Docker service..."
# sudo systemctl start docker

echo "Docker reset complete."