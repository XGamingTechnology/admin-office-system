# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# ✅ Accept build args
ARG VITE_API_URL
ARG NODE_ENV=production
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=${NODE_ENV}

# ✅ Build dengan mode yang sesuai
# Development mode: no minify, with source maps, readable errors
# Production mode: minified, optimized
RUN if [ "$NODE_ENV" = "development" ]; then \
      echo "Building in DEVELOPMENT mode..." && \
      npm run build -- --mode development; \
    else \
      echo "Building in PRODUCTION mode..." && \
      npm run build; \
    fi

# Stage 2: Production dengan Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]