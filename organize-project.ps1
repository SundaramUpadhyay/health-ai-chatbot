# Separate Frontend and Backend

$root = 'c:\Users\Sundaram Upadhyay\Downloads\code'
$frontendDir = "$root\frontend-new"
$backendDir = "$root\backend-new"

# Create new directories
New-Item -ItemType Directory -Path $frontendDir -Force | Out-Null
New-Item -ItemType Directory -Path $backendDir -Force | Out-Null

Write-Host "=== FRONTEND STRUCTURE ===" -ForegroundColor Green
# Copy frontend files
$frontendFiles = @('app', 'components', 'contexts', 'hooks', 'styles', 'public')
foreach ($file in $frontendFiles) {
    $srcPath = "$root\$file"
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination "$frontendDir\$file" -Recurse -Force
        Write-Host "Copied: $file"
    }
}

# Copy frontend config files
$configFiles = @('package.json', 'pnpm-lock.yaml', 'next.config.mjs', 'tsconfig.json', 'postcss.config.mjs', 'next-env.d.ts')
foreach ($file in $configFiles) {
    $srcPath = "$root\$file"
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination "$frontendDir\$file" -Force
        Write-Host "Copied: $file"
    }
}

Write-Host "`n=== BACKEND STRUCTURE ===" -ForegroundColor Cyan
# Copy backend files
$aiServerPath = "$root\ai-server"
if (Test-Path $aiServerPath) {
    Copy-Item -Path $aiServerPath -Destination "$backendDir\ai-server" -Recurse -Force
    Write-Host "Copied: ai-server"
}

# Copy shared backend files
$backendFiles = @('models', 'lib', 'capstone.py')
foreach ($file in $backendFiles) {
    $srcPath = "$root\$file"
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination "$backendDir\$file" -Recurse -Force
        Write-Host "Copied: $file"
    }
}

Write-Host "`nDone! New structure created:" -ForegroundColor Green
Write-Host "  Frontend: $frontendDir"
Write-Host "  Backend:  $backendDir"
