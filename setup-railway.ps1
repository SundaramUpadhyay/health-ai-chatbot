# Copy exported_model to ai-server
Write-Host "Copying exported_model to ai-server..." -ForegroundColor Green
Copy-Item -Path "$PSScriptRoot\backend-new\exported_model" `
          -Destination "$PSScriptRoot\backend-new\ai-server\exported_model" `
          -Recurse -Force

Write-Host "✓ Models copied successfully" -ForegroundColor Green

# Verify
$modelPath = "$PSScriptRoot\backend-new\ai-server\exported_model"
if (Test-Path $modelPath) {
    Write-Host "✓ Verified: exported_model exists at ai-server/" -ForegroundColor Green
    Get-ChildItem $modelPath | ForEach-Object { Write-Host "  - $_" }
} else {
    Write-Host "✗ Error: Models not copied!" -ForegroundColor Red
    exit 1
}

# Commit and push
Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
cd $PSScriptRoot
git add .
git commit -m "Add exported_model to ai-server and fix Dockerfile"
git push origin main

Write-Host "✓ Pushed to GitHub!" -ForegroundColor Green
Write-Host "`nRailway will now auto-redeploy..." -ForegroundColor Yellow
