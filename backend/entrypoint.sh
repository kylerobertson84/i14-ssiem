#!/bin/sh

set -e

# Function to log messages with timestamps
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Wait for the database
log "Waiting for database..."
while ! nc -z db 3306; do
    sleep 1
done
log "Database started"


# Run any pending migrations (this will be skipped if no new migrations are found)
log "Applying migrations..."
if ! python manage.py migrate; then
    log "Migration failed, attempting to reset database schema..."
    python manage.py dbshell <<EOF
    DROP DATABASE siem_db;
    CREATE DATABASE siem_db;
EOF
    log "Retrying migrations..."
    python manage.py migrate --noinput
fi

log "Starting server..."
exec "$@"