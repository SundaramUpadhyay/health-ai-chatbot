@echo off
REM Deploy separated Frontend and Backend services

setlocal enabledelayedexpansion

echo.
echo ====================================
echo   HealthAI - Deploy Services
echo ====================================
echo.

REM Check if directories exist
if not exist "frontend\" (
    echo ERROR: frontend/ directory not found
    echo Please ensure project structure:
    echo   - frontend/ (Next.js app)
    echo   - backend/  (Flask server)
    exit /b 1
)

if not exist "backend\" (
    echo ERROR: backend/ directory not found
    exit /b 1
)

echo [1/3] Frontend Deployment (Vercel)
echo.
echo Steps:
echo 1. Go to https://vercel.com
echo 2. Import your repository
echo 3. Set root: ./frontend
echo 4. Add env var: NEXT_PUBLIC_API_URL=[your-backend-url]
echo 5. Deploy
echo.
set /p PROCEED="Ready to deploy frontend? (y/n): "
if /i "!PROCEED!"=="y" (
    cd frontend
    echo Installing Vercel CLI...
    npm install -g vercel
    echo Deploying to Vercel...
    vercel --prod
    cd ..
)

echo.
echo [2/3] Backend Deployment (Railway)
echo.
echo Steps:
echo 1. Go to https://railway.app
echo 2. Create new project
echo 3. Deploy from GitHub
echo 4. Set root: ./backend
echo 5. Add env var: MONGODB_URI=[your-mongodb-uri]
echo 6. Deploy
echo.
set /p PROCEED="Ready to deploy backend? (y/n): "
if /i "!PROCEED!"=="y" (
    cd backend
    echo Installing Railway CLI...
    npm install -g @railway/cli
    echo Deploying to Railway...
    railway up
    cd ..
)

echo.
echo [3/3] Verification
echo.
echo Check deployment status:
echo - Frontend: https://vercel.com/dashboard
echo - Backend:  https://railway.app/dashboard
echo.

pause
