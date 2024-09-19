#!/bin/sh

set -e

# Function to log messages with timestamps
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Wait for the database
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

log "Waiting for database at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
    sleep 1
done
log "Database started"

# Migration
log "Running migrations..."
python manage.py makemigrations --noinput || {
    log "Makemigrations failed"
    exit 1
}

# Run any pending migrations (this will be skipped if no new migrations are found)
log "Applying migrations..."
if ! python manage.py migrate; then
    log "Migration failed, attempting to reset database schema..."
    python manage.py dbshell <<EOF
    DROP DATABASE siem_db;
    CREATE DATABASE siem_db;
EOF
    log "Retrying migrations..."
    if ! python manage.py migrate --noinput; then
        log "Migration failed again"
        exit 1
    fi
fi

# Create superuser if it doesn't exist
log "Creating superuser..."
if ! python manage.py create_superuser; then
    log "Superuser creation failed or already exists."
fi

# Start UDP parser in the background
log "Starting UDP parser..."
python manage.py udp_parse &

log "Creating rules..."
if ! python manage.py create_rules_preload_reports; then
    log "Failed to create rules"
    exit 1
fi

log "Setting up roles and permissions..."
if ! python manage.py setup_roles_permissions; then
    log "Failed to set up roles and permissions"
    exit 1
fi

# Start Gunicorn
log "Starting Gunicorn server..."
exec gunicorn siem.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120 --access-logfile '-' --error-logfile '-'