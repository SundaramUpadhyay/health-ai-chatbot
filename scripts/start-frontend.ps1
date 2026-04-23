Set-Location "$PSScriptRoot\.."

Write-Host "Starting frontend (Next.js) on http://localhost:3000 ..." -ForegroundColor Cyan
npm run dev
