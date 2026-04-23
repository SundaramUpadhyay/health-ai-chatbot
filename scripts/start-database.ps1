Set-Location "$PSScriptRoot\.."

Write-Host "Starting MongoDB ..." -ForegroundColor Cyan

$service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($null -ne $service) {
    if ($service.Status -ne "Running") {
        try {
            Start-Service -Name "MongoDB"
        }
        catch {
            Write-Warning "MongoDB service failed to start: $($_.Exception.Message)"
        }
    }

    $service = Get-Service -Name "MongoDB"
    if ($service.Status -eq "Running") {
        Write-Host "MongoDB service is running." -ForegroundColor Green
        exit 0
    }
}

$commonCfg = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"
$commonExe = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

if ((Test-Path $commonExe) -and (Test-Path $commonCfg)) {
    Write-Host "Launching mongod using config: $commonCfg" -ForegroundColor Yellow
    & $commonExe --config $commonCfg
    exit $LASTEXITCODE
}

Write-Error "Could not start MongoDB. Install MongoDB service or update paths in scripts/start-database.ps1"
exit 1
