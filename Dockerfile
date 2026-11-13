# ==========================================
# Multi-stage Dockerfile for Production
# Ardistore Digital Landing Page & CRM
# ==========================================

# Stage 1: Build the React + Vite static bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install clean production and build dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# Stage 2: Serve using high-performance lightweight Nginx Alpine
FROM nginx:alpine-slim

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
