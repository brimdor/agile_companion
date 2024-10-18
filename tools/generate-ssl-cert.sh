#!/bin/bash

# Define the directory and file paths
CERT_DIR="./certs"
KEY_FILE="$CERT_DIR/server.key"
CERT_FILE="$CERT_DIR/server.cert"

# Create the directory if it doesn't exist
mkdir -p $CERT_DIR

# Check if the key and certificate files already exist
if [ ! -f "$KEY_FILE" ] || [ ! -f "$CERT_FILE" ]; then
  echo "Generating self-signed SSL certificate..."

  # Generate the key and certificate
  openssl req -nodes -new -x509 -keyout $KEY_FILE -out $CERT_FILE -days 365 \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

  echo "Self-signed SSL certificate generated at $CERT_DIR"
else
  echo "SSL certificate already exists at $CERT_DIR"
fi
