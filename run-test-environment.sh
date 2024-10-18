#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for Docker
if ! command_exists docker; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Check for Docker Compose
if ! command_exists docker-compose; then
  echo "Docker Compose is not installed. Please install Docker Compose and try again."
  exit 1
fi

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
else
  echo ".env.local file not found. Please create it with the necessary environment variables."
  exit 1
fi

# Make all .sh files executable
echo "Making all .sh files executable..."
find . -type f -name "*.sh" -exec chmod +x {} \;

# Generate random JWT and Session secrets
source ./tools/generate-secrets.sh

# Build Docker images with the correct context
echo "Building Docker images..."
docker build -t task-tracking-backend -f backend/Dockerfile .
docker build -t task-tracking-frontend -f frontend/Dockerfile .

# Create a Docker Compose file for the test environment
cat <<EOF > docker-compose.test.yml
version: '3.8'
services:
  backend:
    image: task-tracking-backend
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
      - SESSION_SECRET=${SESSION_SECRET}
      - NODE_ENV=${NODE_ENV}
      - DATABASE_HOST=db
      - DATABASE_NAME=${DATABASE_NAME}
      - DATABASE_USER=${DATABASE_USER}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
    ports:
      - "3000:3000"
    depends_on:
      - db
    command: sh -c "./tools/generate-ssl-cert.sh && ./tools/init-database.sh && node index.js"

  frontend:
    image: task-tracking-frontend
    ports:
      - "8080:80"

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_DATABASE: ${DATABASE_NAME}
      MYSQL_USER: ${DATABASE_USER}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
    ports:
      - "3306:3306"
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - ./tools/mysql-init.sql:/docker-entrypoint-initdb.d/init.sql
EOF

# Run Docker Compose
echo "Starting Docker containers..."
docker-compose -f docker-compose.test.yml up --build