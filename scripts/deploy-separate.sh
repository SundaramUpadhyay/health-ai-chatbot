#!/bin/bash
# Deploy separated Frontend and Backend services

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "===================================="
echo "   HealthAI - Deploy Services"
echo "===================================="
echo ""

# Check if directories exist
if [ ! -d "frontend" ]; then
    echo "ERROR: frontend/ directory not found"
    exit 1
fi

if [ ! -d "backend" ]; then
    echo "ERROR: backend/ directory not found"
    exit 1
fi

# Frontend Deployment
echo -e "${BLUE}[1/3] Frontend Deployment (Vercel)${NC}"
echo ""
echo "Steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your repository"
echo "3. Set root directory: ./frontend"
echo "4. Add environment variable: NEXT_PUBLIC_API_URL=[your-backend-url]"
echo "5. Deploy"
echo ""

read -p "Ready to deploy frontend? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd frontend
    npm install -g vercel
    vercel --prod
    cd ..
fi

# Backend Deployment
echo ""
echo -e "${BLUE}[2/3] Backend Deployment (Railway)${NC}"
echo ""
echo "Steps:"
echo "1. Go to https://railway.app"
echo "2. Create new project"
echo "3. Deploy from GitHub"
echo "4. Set root directory: ./backend"
echo "5. Add environment variable: MONGODB_URI=[your-mongodb-uri]"
echo "6. Deploy"
echo ""

read -p "Ready to deploy backend? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd backend
    npm install -g @railway/cli
    railway up
    cd ..
fi

# Database Setup
echo ""
echo -e "${BLUE}[3/3] Database Setup (MongoDB Atlas)${NC}"
echo ""
echo "Go to: https://www.mongodb.com/cloud/atlas"
echo "1. Create free cluster"
echo "2. Create database user"
echo "3. Get connection string"
echo "4. Add to backend environment variables"
echo ""

echo ""
echo "===================================="
echo -e "${GREEN}Deployment Setup Complete!${NC}"
echo "===================================="
echo ""
echo "Check deployment dashboards:"
echo "- Frontend:  https://vercel.com/dashboard"
echo "- Backend:   https://railway.app/dashboard"
echo "- Database:  https://cloud.mongodb.com"
echo ""
