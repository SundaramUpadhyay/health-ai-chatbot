# HealthAI Frontend

Next.js React application for the HealthAI health management system.

## 📦 What's Inside

- **Authentication**: JWT-based user & admin login
- **AI Health Chat**: Real-time chat with image upload
- **Admin Dashboard**: Analytics, conversation management, reports
- **User Portal**: Personal health dashboard and settings
- **Responsive UI**: Mobile-friendly design with Tailwind CSS
- **Theme Support**: Dark/light mode toggle

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install
# or with pnpm
pnpm install

# Run development server
npm run dev
```

Open http://localhost:3000

### Docker

```bash
# Build image
docker build -f Dockerfile.frontend -t healthai-frontend .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5000 healthai-frontend
```

## 📋 Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/healthai
JWT_SECRET=dev-secret-key-change-in-production
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-api-server.railway.app
```

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── chat/              # Chat interface
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   └── signup/            # Signup page
│
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── admin/            # Admin-specific components
│   ├── ai-chat.tsx       # Main chat component
│   └── ...
│
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── mongodb.ts        # Database connection
│   ├── jwt.ts            # JWT utilities
│   └── utils.ts
│
├── contexts/              # React contexts
│   ├── auth-context.tsx
│   └── language-context.tsx
│
├── hooks/                 # Custom React hooks
├── styles/                # Global CSS
├── public/                # Static files
│
└── package.json
```

## 🎨 UI Components

Built with Radix UI + Tailwind CSS:

- Form handling with React Hook Form
- Toast notifications with Sonner
- Charts with Recharts
- Modals, dropdowns, dialogs
- Theme switching
- Responsive layout system

## 🔐 Authentication

- JWT token stored in cookies
- Role-based access control (User/Admin)
- Protected route components
- Automatic token refresh

## 📱 Key Pages

- **/** - Landing page with hero section
- **/login** - User/Admin login
- **/signup** - User registration
- **/chat** - AI health chat interface
- **/dashboard** - User personal dashboard
- **/admin** - Admin dashboard (protected)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Docker Compose (Local)
```bash
docker-compose up frontend
```

## 🧪 Testing

```bash
npm run lint    # Check code quality
```

## 🔧 Customization

### Change API URL
Update `NEXT_PUBLIC_API_URL` in environment variables.

### Modify Theme Colors
Edit `tailwind.config.ts` or modify CSS variables in `globals.css`.

### Add New Routes
Create new folder in `app/` following Next.js conventions.

## 📦 Dependencies

Key packages:
- **next**: 16.0.0
- **react**: 19.2.0
- **typescript**: 5.x
- **tailwindcss**: 4.1.9
- **react-hook-form**: Form management
- **zod**: Schema validation
- **next-auth**: Authentication
- **mongoose**: Database ORM

## ⚠️ Known Issues

- Build warnings about deprecated baseline-browser-mapping → Update with: `npm install -D baseline-browser-mapping@latest`

## 🚀 Next Steps

1. Set up `.env.local` with backend API URL
2. Ensure backend is running on http://localhost:5000
3. Test login and AI chat features
4. Deploy to Vercel when ready

## 📞 Troubleshooting

**API Connection Error:**
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running
- Check backend CORS is enabled

**Build Fails:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Run: `npm run build`

**Image Upload Not Working:**
- Verify backend health endpoint: `curl http://localhost:5000/health`
- Check browser console for CORS errors
