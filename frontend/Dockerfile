# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy frontend content
COPY frontend/ .

# Install dependencies
RUN npm install

# Build the frontend application
RUN npm run build

# Use a lightweight web server to serve the frontend
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the application port
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]