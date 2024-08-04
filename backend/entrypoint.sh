#!/bin/sh

echo "Waiting for database..."
while ! nc -z db 3306; do
  sleep 0.1
done
echo "Database started"

# Function to check if a table exists
table_exists() {
    mysql -h db -u $DATABASE_USER -p$DATABASE_PASSWORD $DATABASE_NAME -e "DESCRIBE $1" > /dev/null 2>&1
    return $?
}

# Check if core Django tables exist
if table_exists "django_admin_log" && table_exists "auth_user" && table_exists "django_content_type"; then
    echo "Core Django tables already exist, skipping initial migrations"
else
    echo "Core Django tables do not exist, running migrations"
    python manage.py migrate --noinput
fi

# Run any pending migrations (this will be skipped if no new migrations are found)
python manage.py migrate --noinput


# If migrations fail, try to reset the database schema
if [ $? -ne 0 ]; then
    echo "Migration failed, attempting to reset database schema..."
    python manage.py dbshell <<EOF
    DROP DATABASE siem_db;
    CREATE DATABASE siem_db;
EOF
    echo "Retrying migrations..."
    python manage.py migrate --noinput
fi

echo "Starting server..."
exec "$@"