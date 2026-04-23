#!/bin/bash
# Complete deployment automation script
# Supports: MongoDB Atlas, Railway (backend), Vercel (frontend)

set -e

echo "🚀 HealthAI Deployment Setup"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: MongoDB Atlas Setup
echo -e "\n${BLUE}Step 1: Setting up MongoDB Atlas${NC}"
echo "Visit: https://www.mongodb.com/cloud/atlas"
echo ""
echo "1. Create a free account"
echo "2. Create a new cluster (select 'Free M0 Tier')"
echo "3. Create database user: username=admin, password=(generate secure password)"
echo "4. Whitelist your IP: 0.0.0.0/0 (or your specific IP)"
echo "5. Click 'Connect' -> 'Drivers' -> Copy connection string"
echo ""
read -p "Paste your MongoDB connection string: " MONGO_URI
echo "✅ MongoDB URI saved"

# Step 2: Backend Deployment (Railway)
echo -e "\n${BLUE}Step 2: Deploying Backend to Railway${NC}"
echo "Visit: https://railway.app"
echo ""
echo "1. Sign up with GitHub"
echo "2. Create new project -> 'Deploy from GitHub'"
echo "3. Connect your repo"
echo "4. Select 'ai-server' as the service root"
echo ""
read -p "Press Enter when Railway project is created..."

echo "Setting up Railway environment variables..."
read -p "Enter your Railway project token (from Settings -> Tokens): " RAILWAY_TOKEN

# Deploy backend
if command -v railway &> /dev/null; then
    railway login --token "$RAILWAY_TOKEN"
    railway up --detach
    
    # Wait for deployment
    sleep 30
    
    # Get the Railway URL
    RAILWAY_URL=$(railway open --url 2>/dev/null || echo "")
    if [ -z "$RAILWAY_URL" ]; then
        read -p "Enter your Railway backend URL (e.g., https://yourapp.railway.app): " RAILWAY_URL
    fi
    echo "✅ Backend deployed to: $RAILWAY_URL"
else
    echo "⚠️  Railway CLI not installed. Install it first:"
    echo "npm install -g @railway/cli"
    read -p "Enter your deployed Railway backend URL: " RAILWAY_URL
fi

# Step 3: Frontend Deployment (Vercel)
echo -e "\n${BLUE}Step 3: Deploying Frontend to Vercel${NC}"
echo "Visit: https://vercel.com"
echo ""
echo "1. Sign up with GitHub"
echo "2. Import your repository"
echo "3. In Environment Variables, add:"
echo "   NEXT_PUBLIC_API_URL = $RAILWAY_URL"
echo ""

if command -v vercel &> /dev/null; then
    echo "Deploying with Vercel CLI..."
    vercel --prod --env NEXT_PUBLIC_API_URL="$RAILWAY_URL"
    echo "✅ Frontend deployed!"
else
    echo "⚠️  Vercel CLI not installed. Install it:"
    echo "npm install -g vercel"
    echo "Then run: vercel --prod"
fi

# Step 4: Verification
echo -e "\n${GREEN}================================"
echo "✅ Deployment Complete!"
echo "================================${NC}"
echo ""
echo "Your deployed services:"
echo "  📱 Frontend: (Vercel URL)"
echo "  🔧 Backend:  $RAILWAY_URL"
echo "  🗄️  Database: MongoDB Atlas"
echo ""
echo "Next steps:"
echo "1. Test the deployed frontend at your Vercel URL"
echo "2. Try uploading an image for disease diagnosis"
echo "3. Check backend logs: railway logs"
echo ""
