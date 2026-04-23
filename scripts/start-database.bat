@echo off
cd /d "%~dp0.."
echo Starting MongoDB ...
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start-database.ps1"
