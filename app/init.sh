#!/bin/sh

# Exit on any error
set -e

echo "Starting initialization script..."

# Function to retry commands
retry() {
    local -r -i max_attempts="$1"; shift
    local -i attempt_num=1
    until "$@"
    do
        if ((attempt_num==max_attempts))
        then
            echo "Attempt $attempt_num failed and there are no more attempts left!"
            return 1
        else
            echo "Attempt $attempt_num failed! Trying again in $attempt_num seconds..."
            sleep $((attempt_num++))
        fi
    done
}

# Wait for database to be ready
echo "Waiting for postgres..."
while ! nc -z db 5432; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
done
echo "PostgreSQL started successfully!"

# Check if database is initialized by trying to connect and query the users table
if ! psql -h db -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1 FROM users LIMIT 1" > /dev/null 2>&1; then
    echo "Database tables not found. Running initial setup..."

    # Run migrations with retry
    echo "Running database migrations..."
    retry 3 flask --app __init__.py db upgrade
    echo "Migrations completed!"

    # Run seeds with retry
    echo "Running database seeds..."
    retry 3 flask --app __init__.py seed all
    echo "Seeds completed!"
else
    echo "Database already initialized, skipping setup..."
fi

echo "Starting Gunicorn server..."
# Run with multiple workers and timeout settings
exec gunicorn --bind 0.0.0.0:5000 \
    --workers=4 \
    --timeout=60 \
    --keep-alive=5 \
    --max-requests=1000 \
    --max-requests-jitter=50 \
    --log-level=info \
    "__init__:app"