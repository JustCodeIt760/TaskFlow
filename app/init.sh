#!/bin/sh

# Exit on any error
set -e

echo "Starting initialization script..."

# Wait for database
echo "Waiting for postgres..."
while ! nc -z db 5432; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL started successfully!"

#!------run this sequence for fresh start if docker gives errors-->
#docker-compose down -v
#below items NOT commented out
#docker compose up --build
#docker compose down
#comment out the below 3 chunks
#docker compose up -d
#!---------------------------------------------------------------->

# Clean start - remove old migrations
echo "Cleaning old migrations..."
rm -rf migrations/
flask db init

# Create and run migrations
echo "Creating and running migrations..."
flask db migrate -m "initial migration"
flask db upgrade
echo "Migrations completed!"

# Seeds (no need to undo since we just recreated tables)
echo "Running seeds..."
flask seed all
echo "Seeds completed!"

echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:5000 "__init__:app"