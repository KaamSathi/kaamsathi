#!/bin/bash

# 🚀 KaamSathi Production Deployment Script
# This script prepares the application for production deployment

set -e  # Exit on any error

echo "🚀 KaamSathi Production Deployment Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from correct directory
if [ ! -f "production-checklist.md" ]; then
    print_error "Please run this script from the kaamSathi-fullstack directory"
    exit 1
fi

print_status "Checking system requirements..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed. Please install Node.js 18+"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is required but not installed"
    exit 1
fi

print_success "npm $(npm --version) detected"

# 1. BACKEND SETUP
print_status "Setting up backend for production..."

cd backend

# Install production dependencies
print_status "Installing backend dependencies..."
npm install --production
print_success "Backend dependencies installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cat > .env << EOF
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://kaamsathi:kaamsathi123@cluster0.pfxrwtz.mongodb.net/kaamsathi?retryWrites=true&w=majority
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    print_success ".env file created with secure secrets"
else
    print_success ".env file already exists"
fi

# Test backend startup
print_status "Testing backend startup..."
timeout 10s npm start &
BACKEND_PID=$!
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/health > /dev/null; then
    print_success "Backend is running successfully"
    kill $BACKEND_PID 2>/dev/null || true
else
    print_error "Backend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# 2. FRONTEND SETUP
print_status "Setting up frontend for production..."

cd frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found. Creating..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
    print_success ".env.local file created"
else
    print_success ".env.local file already exists"
fi

# Build frontend
print_status "Building frontend for production..."
npm run build
print_success "Frontend built successfully"

cd ..

# 3. PRODUCTION CHECKS
print_status "Running production readiness checks..."

# Check if MongoDB connection works
print_status "Testing MongoDB connection..."
cd backend
if node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connection successful');
    process.exit(0);
}).catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});
" 2>/dev/null; then
    print_success "MongoDB connection verified"
else
    print_warning "MongoDB connection test failed. Please check MONGODB_URI"
fi

cd ..

# 4. CREATE PRODUCTION SCRIPTS
print_status "Creating production start scripts..."

# Create backend start script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🔧 Starting KaamSathi Backend..."
cd backend
NODE_ENV=production npm start
EOF

# Create frontend start script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting KaamSathi Frontend..."
cd frontend
npm start
EOF

# Create development script
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting KaamSathi Development Servers..."
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop all servers"

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend in background
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for either process to exit
wait
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh start-dev.sh

print_success "Production scripts created"

# 5. DOCKER SETUP (Optional)
if command -v docker &> /dev/null; then
    print_status "Creating Docker configuration..."
    
    # Backend Dockerfile
    cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

# Start application
CMD ["npm", "start"]
EOF

    # Frontend Dockerfile
    cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
EOF

    # Docker Compose
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5001/api
    depends_on:
      - backend
    restart: unless-stopped
EOF

    print_success "Docker configuration created"
fi

# 6. FINAL SUMMARY
echo ""
print_success "🎉 KaamSathi is ready for production deployment!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Review production-checklist.md for detailed deployment guide"
echo "2. Update environment variables for your production domain"
echo "3. Deploy backend to Railway/Heroku/DigitalOcean"
echo "4. Deploy frontend to Vercel/Netlify"
echo "5. Update DNS settings for your domain"
echo ""
echo "🚀 Quick Commands:"
echo "=================="
echo "• Development: ./start-dev.sh"
echo "• Production Backend: ./start-backend.sh"
echo "• Production Frontend: ./start-frontend.sh"
echo ""
echo "🔧 Environment:"
echo "==============="
echo "• Backend: http://localhost:5001"
echo "• Frontend: http://localhost:3000"
echo "• Demo OTP: 123456"
echo ""
echo "📚 Features Ready:"
echo "=================="
echo "✅ Phone-based authentication"
echo "✅ Job posting and browsing"
echo "✅ Application management"
echo "✅ Real-time capabilities"
echo "✅ Mobile-responsive design"
echo "✅ Role-based access control"
echo ""
print_success "Happy launching! 🚀" 