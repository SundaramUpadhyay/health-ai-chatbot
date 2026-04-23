@echo off
REM Organized startup scripts for monorepo structure

setlocal enabledelayedexpansion

echo.
echo ====================================
echo    HealthAI - Start All Services
echo ====================================
echo.
echo This script launches all services in separate terminal windows:
echo - Frontend  (Next.js)  on http://localhost:3000
echo - Backend   (Flask)    on http://localhost:5000
echo - Database  (MongoDB)
echo.

REM Start Frontend
echo [1/3] Starting Frontend...
start "HealthAI Frontend" cmd /k "cd /d "%~dp0..\frontend" && npm run dev"
timeout /t 2 /nobreak

REM Start Backend
echo [2/3] Starting Backend...
start "HealthAI Backend" cmd /k "cd /d "%~dp0..\backend" && python app.py"
timeout /t 2 /nobreak

REM Start Database
echo [3/3] Starting Database...
start "HealthAI Database" cmd /k "cd /d "%~dp0" && call start-database.bat"

echo.
echo ====================================
echo All services are starting...
echo ====================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo Database:  localhost:27017
echo.
echo Check opened terminal windows for each service.
echo Close any terminal to stop that service.
echo.
pause
