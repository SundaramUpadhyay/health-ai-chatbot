#!/usr/bin/env pwsh
# Deploy Frontend and Backend to GitHub Separately

$root = 'c:\Users\Sundaram Upadhyay\Downloads\code'
$frontendDir = "$root\frontend-new"
$backendDir = "$root\backend-new"

Write-Host "=== Health AI Chatbot - GitHub Deployment ===" -ForegroundColor Cyan
Write-Host "This script will push frontend and backend to separate GitHub repositories`n" -ForegroundColor Yellow

# Get GitHub credentials
$gitUsername = Read-Host "Enter your GitHub username"
$gitEmail = Read-Host "Enter your email address"

Write-Host "`n=== FRONTEND DEPLOYMENT ===" -ForegroundColor Green
$frontendRepoUrl = Read-Host "Enter frontend repository URL (e.g., https://github.com/$gitUsername/health-ai-chatbot-frontend.git)"

if ($frontendRepoUrl -ne "") {
    try {
        Write-Host "Setting up frontend repository..." -ForegroundColor Yellow
        Push-Location $frontendDir
        
        git config user.email $gitEmail
        git config user.name $gitUsername
        
        if (-not (Test-Path ".git")) {
            git init
            Write-Host "Initialized git repository"
        }
        
        git add .
        Write-Host "Staged all files"
        
        if (git diff --cached --quiet) {
            Write-Host "No changes to commit"
        } else {
            git commit -m "Initial commit: Health AI Chatbot Frontend"
            Write-Host "Created commit" -ForegroundColor Green
        }
        
        git remote remove origin 2>$null
        git remote add origin $frontendRepoUrl
        Write-Host "Added remote origin"
        
        $branch = git symbolic-ref --short HEAD
        if ($branch -ne "main") {
            git branch -M main
        }
        
        git push -u origin main --force
        Write-Host "Pushed frontend to $frontendRepoUrl" -ForegroundColor Green
        
        Pop-Location
    } catch {
        Write-Host "Error deploying frontend: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== BACKEND DEPLOYMENT ===" -ForegroundColor Green
$backendRepoUrl = Read-Host "Enter backend repository URL (e.g., https://github.com/$gitUsername/health-ai-chatbot-backend.git)"

if ($backendRepoUrl -ne "") {
    try {
        Write-Host "Setting up backend repository..." -ForegroundColor Yellow
        Push-Location $backendDir
        
        git config user.email $gitEmail
        git config user.name $gitUsername
        
        if (-not (Test-Path ".git")) {
            git init
            Write-Host "Initialized git repository"
        }
        
        git add .
        Write-Host "Staged all files"
        
        if (git diff --cached --quiet) {
            Write-Host "No changes to commit"
        } else {
            git commit -m "Initial commit: Health AI Chatbot Backend"
            Write-Host "Created commit" -ForegroundColor Green
        }
        
        git remote remove origin 2>$null
        git remote add origin $backendRepoUrl
        Write-Host "Added remote origin"
        
        $branch = git symbolic-ref --short HEAD
        if ($branch -ne "main") {
            git branch -M main
        }
        
        git push -u origin main --force
        Write-Host "Pushed backend to $backendRepoUrl" -ForegroundColor Green
        
        Pop-Location
    } catch {
        Write-Host "Error deploying backend: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== DEPLOYMENT COMPLETE ===" -ForegroundColor Green
Write-Host "Frontend: $frontendRepoUrl"
Write-Host "Backend: $backendRepoUrl"
Write-Host "`nYou can now clone these repositories to start working on them separately!"
