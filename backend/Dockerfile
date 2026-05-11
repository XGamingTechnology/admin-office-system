# ========== STAGE 1: BUILD ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (termasuk dev untuk build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript ke JavaScript
# Output akan ke dist/main.js (sesuai nest-cli.json / tsconfig.json default)
RUN npm run build

# ========== STAGE 2: PRODUCTION ==========
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install HANYA production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy hasil build dari builder stage
# ✅ Output NestJS default: dist/main.js (sesuai package.json "start:prod": "node dist/main")
COPY --from=builder /app/dist/ ./dist/

# Expose port
EXPOSE 3000

# ✅ JALANKAN PRODUCTION BUILD
CMD ["npm", "run", "start:prod"]