@echo off
cd /d "%~dp0.."
echo Starting backend (Flask) on http://127.0.0.1:5000 ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& '.\.venv\Scripts\Activate.ps1'; Set-Location '.\ai-server'; python app.py"
