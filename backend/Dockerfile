# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the rest of the backend application code
COPY backend/ .

# Install MySQL client tools
RUN apt-get update && apt-get install -y default-mysql-client

# Generate package-lock.json and install dependencies
RUN npm install --package-lock-only && npm install

# Copy the tools directory from the root of the project
COPY tools /app/tools

# Make the SSL certificate and secrets generation scripts executable
RUN chmod +x /app/tools/generate-ssl-cert.sh
RUN chmod +x /app/tools/generate-secrets.sh

# Expose the application port
EXPOSE 3000

# Run the secrets generation script, SSL certificate generation script, and start the application
CMD ["sh", "-c", "./tools/generate-secrets.sh && ./tools/generate-ssl-cert.sh && node index.js"]