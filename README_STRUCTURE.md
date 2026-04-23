# HealthAI - Full Stack Health Management System

A monorepo containing separate frontend and backend services.

## 📁 Project Structure

```
healthai/
├── frontend/          # Next.js React application
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── backend/           # Flask Python API server
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── scripts/           # Deployment scripts
│   ├── deploy.bat
│   ├── deploy.sh
│   ├── start-frontend.bat
│   ├── start-backend.bat
│   └── start-database.bat
│
└── docker-compose.yml # Local development with all services
```

## 🚀 Quick Start

### Option 1: Run Both Services Locally

```bash
# Frontend (Terminal 1)
cd frontend
npm install
npm run dev

# Backend (Terminal 2)
cd backend
pip install -r requirements.txt
python app.py

# Database (Terminal 3)
cd scripts
./start-database.bat  # Windows
bash start-database.sh # macOS/Linux
```

### Option 2: Run Everything with Docker Compose

```bash
docker-compose up
```

Runs:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: MongoDB on port 27017

## 📦 Independent Deployment

Each service can be deployed independently:

- **Frontend → Vercel** (or Netlify, AWS S3)
- **Backend → Railway** (or Heroku, AWS, Azure)
- **Database → MongoDB Atlas** (cloud)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📚 Detailed Docs

- [Frontend README](./frontend/README.md) - Next.js specific setup and commands
- [Backend README](./backend/README.md) - Flask API setup and endpoints
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment

## 🛠️ Development

### Frontend
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py      # Start server (port 5000)
```

## 🌐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/healthai
JWT_SECRET=your-secret-key
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/healthai
FLASK_ENV=development
PORT=5000
```

## 📋 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Flask, TensorFlow, Keras
- **Database**: MongoDB
- **Auth**: JWT + bcrypt
- **AI Model**: EfficientNet (skin disease classification)

## 🚢 Deployment Paths

### Monorepo Deployment (Recommended)
Keep both in one repo, deploy from branches:
- Push to `main` → auto-deploy both
- Separate CI/CD pipelines for each

### Split Repositories
For team collaboration, split into:
1. `github.com/yourorg/healthai-frontend`
2. `github.com/yourorg/healthai-backend`

Instructions in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📞 Support

For issues, check the respective README files:
- Frontend issues → [frontend/README.md](./frontend/README.md)
- Backend issues → [backend/README.md](./backend/README.md)
- Deployment issues → [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
