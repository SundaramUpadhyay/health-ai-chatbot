@echo off
REM Directory structure setup helper
REM This script helps organize the project into proper monorepo structure

setlocal enabledelayedexpansion

echo.
echo ====================================
echo   HealthAI - Project Structure
echo ====================================
echo.

echo Current structure:
echo   - frontend/  (Next.js app)
echo   - backend/   (Flask server)
echo   - scripts/   (Deployment scripts)
echo   - docker-compose.yml
echo.

echo ====================================
echo   How to Use Separated Services
echo ====================================
echo.

echo Option 1: Run Locally (Development)
echo   Frontend: cd frontend ^&^& npm run dev
echo   Backend:  cd backend ^&^ python app.py
echo   Database: scripts\start-database.bat
echo.

echo Option 2: Run With Docker
echo   docker-compose up
echo.

echo Option 3: Deploy to Cloud
echo   Frontend ^-^> Vercel:  scripts\deploy-separate.bat
echo   Backend  ^-^> Railway: scripts\deploy-separate.bat
echo.

echo ====================================
echo   Directory Reference
echo ====================================
echo.

echo Frontend Files (Next.js):
echo   - frontend/app/          ^(Route handlers, pages^)
echo   - frontend/components/   ^(React components^)
echo   - frontend/lib/          ^(Utilities, API client^)
echo   - frontend/package.json  ^(Dependencies^)
echo.

echo Backend Files (Flask):
echo   - backend/app.py         ^(Main Flask application^)
echo   - backend/requirements.txt ^(Python dependencies^)
echo   - backend/Dockerfile     ^(Container configuration^)
echo.

echo.
echo ====================================
echo   Next Steps
echo ====================================
echo.
echo 1. Review documentation:
echo    - DEPLOYMENT_GUIDE.md       ^(Production deployment^)
echo    - MONOREPO_STRUCTURE.md     ^(This structure^)
echo    - frontend/README.md        ^(Frontend specifics^)
echo    - backend/README.md         ^(Backend specifics^)
echo.

echo 2. Test locally:
echo    Run: scripts\start-all.bat
echo.

echo 3. Deploy to cloud:
echo    Run: scripts\deploy-separate.bat
echo.

pause
