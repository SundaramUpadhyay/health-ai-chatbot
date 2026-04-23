Set-Location "$PSScriptRoot\.."

$venvActivate = Join-Path (Get-Location) ".venv\Scripts\Activate.ps1"
if (-not (Test-Path $venvActivate)) {
    Write-Error "Virtual environment activation script not found at $venvActivate"
    exit 1
}

Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
& $venvActivate

Set-Location "ai-server"
Write-Host "Starting backend (Flask) on http://127.0.0.1:5000 ..." -ForegroundColor Cyan
python app.py
