#!/bin/bash

# Generate a random JWT secret
export JWT_SECRET=$(openssl rand -base64 32)

# Generate a random Session secret
export SESSION_SECRET=$(openssl rand -base64 32)

# Print the generated secrets (for debugging purposes, can be removed in production)
echo "Generated JWT_SECRET"
echo "Generated SESSION_SECRET"