## HealthAI - Monorepo Structure Guide

This document explains how the project is organized and how to work with the separate frontend and backend.

### Current Structure

```
project-root/
├── frontend/          ← Next.js React app (deploy to Vercel)
├── backend/           ← Flask API server (deploy to Railway)  
├── ai-server/         ← (legacy - can be removed after migration)
└── scripts/           ← Deployment and startup scripts
```

### How to Set Up Separate Deployments

#### Step 1: Frontend (Vercel)

Your frontend code will be in the `frontend/` directory.

**To deploy to Vercel:**

1. Push `frontend/` to a GitHub repository (or use as subfolder in monorepo)
2. In Vercel dashboard: Import the repo, select `frontend` as root
3. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
4. Deploy

**Or push as separate repo:**

```bash
# Create new frontend repo
cd frontend
git init
git remote add origin https://github.com/yourusername/healthai-frontend
git push -u origin main
```

#### Step 2: Backend (Railway)

Your backend code will be in the `backend/` directory.

**To deploy to Railway:**

1. Push `backend/` to a GitHub repository
2. In Railway: Create new project → Deploy from GitHub
3. Select the repo, set root to `backend/`
4. Add environment variables:
   - `MONGODB_URI=mongodb+srv://...`
   - `FLASK_ENV=production`
5. Deploy

**Or push as separate repo:**

```bash
# Create new backend repo
cd backend
git init
git remote add origin https://github.com/yourusername/healthai-backend
git push -u origin main
```

### File Migration Path

If you're migrating from the current structure to separate `frontend/` and `backend/`:

**Files to move to `frontend/`:**
- `app/` → `frontend/app/`
- `components/` → `frontend/components/`
- `lib/` → `frontend/lib/`
- `contexts/` → `frontend/contexts/`
- `hooks/` → `frontend/hooks/`
- `public/` → `frontend/public/`
- `styles/` → `frontend/styles/`
- `package.json` → `frontend/package.json`
- `tsconfig.json` → `frontend/tsconfig.json`
- `next.config.mjs` → `frontend/next.config.mjs`
- `.env.local` → `frontend/.env.local`

**Files to move to `backend/`:**
- `ai-server/app.py` → `backend/app.py`
- `ai-server/requirements.txt` → `backend/requirements.txt`
- `ai-server/Dockerfile` → `backend/Dockerfile`
- `exported_model/` → `backend/exported_model/`

### Deployment Strategy

#### Option 1: Monorepo (Current)
Keep both in one Git repo:
- Easier local development
- Shared documentation
- Single deployment command deploys both

```bash
# Monorepo deployment (both services)
scripts/deploy.bat
```

#### Option 2: Polyrepo (Separate Repos)
Split into two independent repos:
- Better for team collaboration
- Independent versioning
- Separate CI/CD pipelines

```bash
# Each has its own repo
git clone https://github.com/yourorg/healthai-frontend
git clone https://github.com/yourorg/healthai-backend
```

### Environment Variables

**Frontend** needs:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url  # Points to deployed backend
```

**Backend** needs:
```env
MONGODB_URI=mongodb+srv://...  # MongoDB Atlas connection
FLASK_ENV=production
PORT=5000
```

### Testing Separate Services

**Start frontend only:**
```bash
cd frontend
npm run dev
# Opens http://localhost:3000
```

**Start backend only:**
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

**Test connection:**
```bash
# From frontend, verify API is reachable
curl http://localhost:5000/health
```

### CI/CD Pipeline Setup

For automated deployment:

**GitHub Actions Example:**

```yaml
# .github/workflows/deploy.yml
name: Deploy All Services

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          cd backend
          # Deploy to Railway/Heroku/AWS

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend
        run: |
          cd frontend
          # Deploy to Vercel
```

### Troubleshooting Separated Services

**Frontend can't reach backend:**
- Check `NEXT_PUBLIC_API_URL` env var in Vercel
- Verify backend is running
- Check CORS is enabled in Flask

**Backend can't connect to MongoDB:**
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure connection string has correct credentials

**Deployment fails:**
- Check logs in Vercel/Railway dashboards
- Verify all environment variables are set
- Ensure root directory is correct in platform settings

### Next Steps

1. Review [frontend/README.md](../frontend/README.md) for frontend-specific commands
2. Review [backend/README.md](../backend/README.md) for backend-specific commands
3. Follow [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for production deployment
4. Decide between monorepo or polyrepo based on your team needs
