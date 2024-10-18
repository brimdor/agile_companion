#!/bin/bash

# Add a delay before attempting to connect to the database
echo "Waiting for 5 seconds before attempting to connect to the database..."
sleep 5

# Maximum number of attempts
MAX_ATTEMPTS=5

# Wait for MySQL to be ready
attempt=0
until mysqladmin ping -h"$DATABASE_HOST" -u"$DATABASE_USER" -p"$DATABASE_PASSWORD" --silent; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $MAX_ATTEMPTS ]; then
    echo "MySQL server is not ready after $MAX_ATTEMPTS attempts. Proceeding to database creation..."
    break
  fi
  echo "Waiting for database connection... (Attempt $attempt/$MAX_ATTEMPTS)"
  sleep 2
done

# Create the database if it doesn't exist
attempt=0
while [ $attempt -lt $MAX_ATTEMPTS ]; do
  echo "Checking if database exists..."
  DB_EXISTS=$(mysql -h"$DATABASE_HOST" -u"$DATABASE_USER" -p"$DATABASE_PASSWORD" -e "SHOW DATABASES LIKE '$DATABASE_NAME';" | grep "$DATABASE_NAME" > /dev/null; echo "$?")

  if [ "$DB_EXISTS" -eq 1 ]; then
    echo "Database does not exist. Creating database..."
    mysql -h"$DATABASE_HOST" -u"$DATABASE_USER" -p"$DATABASE_PASSWORD" -e "CREATE DATABASE $DATABASE_NAME;"
    if [ $? -eq 0 ]; then
      echo "Database created."
      exit 0
    else
      echo "Failed to create database. Retrying... (Attempt $((attempt + 1))/$MAX_ATTEMPTS)"
    fi
  else
    echo "Database already exists."
    exit 0
  fi

  attempt=$((attempt + 1))
  sleep 2
done

echo "Database could not be found or created after $MAX_ATTEMPTS attempts."
exit 1