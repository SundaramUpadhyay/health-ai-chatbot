# HealthAI Deployment Guide

## Quick Start Checklist

### 1️⃣ MongoDB Atlas (Database)
**Time: 5 minutes**

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create M0 (free) cluster
- [ ] Create user: `admin` / `(secure password)`
- [ ] Whitelist IP: `0.0.0.0/0`
- [ ] Get connection string from "Connect" → "Drivers"

**Save this:** `mongodb+srv://admin:PASSWORD@cluster.mongodb.net/healthai`

---

### 2️⃣ Railway Backend (Flask API)
**Time: 10 minutes**

```bash
# Option A: Via Railway Dashboard (Easiest)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "Create New Project" → "Deploy from GitHub"
4. Connect your GitHub repository
5. Select root as: /ai-server (or let auto-detect)
6. Add environment variable:
   - Key: MONGODB_URI
   - Value: (paste MongoDB connection string from Step 1)
7. Deploy button → Wait 2-3 minutes
8. Copy your Railway URL from "Public URL"

# Option B: Via CLI (Advanced)
npm install -g @railway/cli
railway login
railway init
railway variables set MONGODB_URI="your-mongodb-uri"
railway up
```

**Save this:** `https://your-backend.railway.app`

---

### 3️⃣ Vercel Frontend (Next.js)
**Time: 5 minutes**

```bash
# Option A: Via Vercel Dashboard (Easiest)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Add Environment Variable:
   - Name: NEXT_PUBLIC_API_URL
   - Value: (paste Railway URL from Step 2)
6. Deploy → Wait 1-2 minutes
7. Copy your Vercel URL from deployment screen

# Option B: Via CLI (Advanced)
npm install -g vercel
vercel --prod --env NEXT_PUBLIC_API_URL="https://your-backend.railway.app"
```

**Save this:** `https://your-frontend.vercel.app`

---

## Testing After Deployment

1. Open your Vercel frontend URL
2. Navigate to "AI Health Chat"
3. Try typing a health question
4. Try uploading an image of a skin condition
5. Check if responses come back (verify backend connection)

---

## Troubleshooting

### Frontend shows blank / 404
- Check Environment Variable `NEXT_PUBLIC_API_URL` is set in Vercel
- Rebuild & redeploy

### Backend returns 500 error
- Check MongoDB connection string is correct
- Verify MongoDB Atlas cluster is running
- Check Railway logs: `railway logs`

### Images not loading from AI
- Ensure Flask backend is running
- Check CORS is enabled (already done in code)
- Verify MongoDB contains image data

---

## Environment Variables Reference

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Railway (Backend)
```env
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/healthai
FLASK_ENV=production
PORT=5000
```

---

## Automated Deployment Script

Run the automated setup:

**Windows:**
```bash
scripts\deploy.bat
```

**macOS/Linux:**
```bash
bash scripts/deploy.sh
```

---

## Estimated Costs

- **MongoDB Atlas**: Free (500MB storage)
- **Railway**: Free tier available (~5$ when you exceed)
- **Vercel**: Free tier available

**Total startup cost: $0** (if you stay in free tier)

---

## Support

For issues:
1. Check Railway logs: `railway logs`
2. Check Vercel logs: Dashboard → Function Logs
3. Check MongoDB Atlas cluster status: Dashboard → Cluster

