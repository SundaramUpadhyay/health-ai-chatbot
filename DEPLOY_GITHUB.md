# Deploy Frontend and Backend to GitHub Separately

This guide helps you push the frontend and backend to separate GitHub repositories.

## Prerequisites

1. Git installed and configured
2. GitHub account
3. Created two empty repositories:
   - Frontend repository (e.g., `health-ai-chatbot-frontend`)
   - Backend repository (e.g., `health-ai-chatbot-backend`)

## Steps

### 1. Deploy Frontend to GitHub

```bash
# Navigate to frontend directory
cd frontend-new

# Initialize git repository (if not already done)
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Health AI Chatbot Frontend"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/health-ai-chatbot-frontend.git

# Rename branch to main (if using main instead of master)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 2. Deploy Backend to GitHub

```bash
# Navigate to backend directory
cd backend-new

# Initialize git repository (if not already done)
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Health AI Chatbot Backend"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/health-ai-chatbot-backend.git

# Rename branch to main (if using main instead of master)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Using PowerShell Script (Automated)

Alternatively, use the provided script:

```bash
powershell -ExecutionPolicy RemoteSigned -File deploy-to-github.ps1
```

You'll be prompted for:
- GitHub username
- Frontend repository URL
- Backend repository URL

## After Deployment

### Add GitHub Secrets (for CI/CD)

For each repository, add these secrets in GitHub:
- Settings → Secrets and variables → Actions
- Add secrets like `DEPLOY_KEY`, `DOCKERHUB_TOKEN`, etc.

### Setup GitHub Actions

Add workflow files for:
- Automated testing
- Docker builds
- Deployments to cloud providers

### Update Repository Settings

1. Add branch protection rules
2. Setup PR reviews
3. Enable auto-delete head branches

## Next Steps

1. **Frontend**: Link to backend API
   - Update `NEXT_PUBLIC_API_URL` environment variable
   - Test API connections

2. **Backend**: Deploy to cloud
   - Push Docker image to container registry
   - Deploy to Azure/AWS/GCP

3. **CI/CD Pipeline**: 
   - Setup GitHub Actions
   - Automate testing and deployment

## Troubleshooting

### Remote URL Issues
```bash
# Check current remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/new-repo.git
```

### Authentication Issues
```bash
# Use personal access token (recommended)
# Replace https://github.com with https://YOUR_TOKEN@github.com

# Or configure SSH
ssh-keygen -t ed25519 -C "your-email@example.com"
# Then add public key to GitHub
```

### Large Files
```bash
# Check for large files
git ls-files --size

# If needed, setup Git LFS for large files
git lfs install
git lfs track "*.h5"
```

## Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Git SCM Documentation](https://git-scm.com/doc)
- [GitHub Actions](https://github.com/features/actions)

---

**Note**: Replace `YOUR_USERNAME`, repository URLs, and email with your actual values.
