@echo off
REM Complete deployment setup for Windows
REM Vercel + Railway + MongoDB Atlas

setlocal enabledelayedexpansion

echo.
echo ===================================
echo   HealthAI Deployment Setup
echo ===================================
echo.

REM Step 1: Check prerequisites
echo Checking prerequisites...
where node >nul 2>nul || (
    echo ERROR: Node.js not installed. Download from https://nodejs.org
    exit /b 1
)

where git >nul 2>nul || (
    echo ERROR: Git not installed. Download from https://git-scm.com
    exit /b 1
)

echo [OK] Node.js and Git installed
echo.

REM Step 2: Install global CLIs
echo Installing deployment CLIs...
echo.
call npm install -g @railway/cli vercel

echo.
echo ===================================
echo   STEP 1: MongoDB Atlas Setup
echo ===================================
echo.
echo 1. Go to: https://www.mongodb.com/cloud/atlas
echo 2. Create a FREE account
echo 3. Create a cluster (select "Free M0 Tier")
echo 4. Create database user:
echo    - Username: admin
echo    - Password: (generate and save this!)
echo 5. Whitelist IP: 0.0.0.0/0
echo 6. Click "Connect" ^> "Drivers" ^> Copy connection string
echo.
set /p MONGO_URI="Paste MongoDB connection string: "

if "!MONGO_URI!"=="" (
    echo ERROR: MongoDB URI cannot be empty
    exit /b 1
)

echo [OK] MongoDB URI saved
echo.

REM Step 3: Backend Deployment
echo ===================================
echo   STEP 2: Deploy Backend to Railway
echo ===================================
echo.
echo 1. Go to: https://railway.app
echo 2. Sign up with GitHub
echo 3. Create new project
echo 4. Connect your GitHub repo
echo 5. After deployment, copy the Railway URL
echo.
set /p RAILWAY_URL="Enter your Railway backend URL (e.g., https://yourapp.railway.app): "

if "!RAILWAY_URL!"=="" (
    echo ERROR: Railway URL cannot be empty
    exit /b 1
)

echo [OK] Backend URL saved: !RAILWAY_URL!
echo.

REM Step 4: Frontend Deployment
echo ===================================
echo   STEP 3: Deploy Frontend to Vercel
echo ===================================
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign up with GitHub
echo 3. Import your repository
echo 4. In Environment Variables, add:
echo    NEXT_PUBLIC_API_URL = !RAILWAY_URL!
echo 5. Deploy and save the Vercel URL
echo.
set /p VERCEL_URL="Enter your Vercel frontend URL (e.g., https://yourapp.vercel.app): "

if "!VERCEL_URL!"=="" (
    echo ERROR: Vercel URL cannot be empty
    exit /b 1
)

echo [OK] Frontend URL saved: !VERCEL_URL!
echo.

REM Step 5: Summary
cls
echo.
echo ===================================
echo   DEPLOYMENT COMPLETE!
echo ===================================
echo.
echo Your deployed services:
echo.
echo   [Frontend]  !VERCEL_URL!
echo   [Backend]   !RAILWAY_URL!
echo   [Database]  MongoDB Atlas
echo.
echo ===================================
echo.
echo Next steps:
echo 1. Open your frontend URL in a browser
echo 2. Test the AI health chat feature
echo 3. Try uploading an image for diagnosis
echo 4. Monitor backend logs: railway logs
echo.
pause
