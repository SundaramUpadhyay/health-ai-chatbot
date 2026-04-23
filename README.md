# HealthAI - Complete Full-Stack Health Management System

A comprehensive health management platform with **AI-powered disease diagnosis**, admin dashboard, user portal, intelligent chat assistant, and disease reporting system.

## 🚀 Features

### 🤖 AI Health Assistant (NEW!)
- **Image-Based Disease Diagnosis**: Upload photos of skin conditions, rashes, or wounds for instant AI analysis
- **Smart Prescription Generation**: Get personalized medicine recommendations with dosage
- **Symptom Analysis**: Text-based health queries with intelligent responses
- **Multi-Modal Chat**: Combine text and image inputs for comprehensive diagnosis
- **Treatment Recommendations**: Detailed care instructions and preventive measures

### Authentication System
- **Dual Role System**: Separate login/signup for Users and Admins
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **Password Encryption**: bcrypt hashing for security

### User Features
- **AI Health Chat**: Interactive chat with image upload for disease diagnosis
- **Smart Medicine Recommendations**: Get prescriptions based on symptoms or images
- **Health Reports**: Submit and track disease reports
- **Personal Dashboard**: View statistics, notifications, and settings
- **Real-time Updates**: Live chat with intelligent bot responses

### Admin Features
- **Admin Dashboard**: Complete overview of system statistics
- **Conversation Management**: Monitor all user conversations
- **Report Management**: Review, update, and manage health reports
- **Outbreak Map**: Visualize disease reports geographically
- **User Analytics**: Track user engagement and activity

### Backend
- **MongoDB Database**: Scalable NoSQL database
- **REST API**: Complete CRUD operations
- **Data Models**: Users, Conversations, Reports
- **Real-time Processing**: Automated bot responses

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- MongoDB (local or Atlas)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd code
pnpm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Whitelist your IP address

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/healthai  # or your Atlas connection string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
# Terminal 1: Start the AI Flask server (required for AI features)
cd ai-server
python app.py

# Terminal 2: Start the Next.js development server
pnpm dev
```

The application will be available at `http://localhost:3000`

**⚠️ Important:** The Flask AI server must be running on `http://localhost:5000` for the chat and disease diagnosis features to work properly.

## 🔐 Demo Credentials

### Admin Account
To create an admin account, use the organization code during signup:
- **Organization Code**: `ADMIN2024`

You can also use test credentials after creating accounts through signup.

## 📁 Project Structure

```
code/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── conversations/# Chat endpoints
│   │   ├── reports/      # Report endpoints
│   │   └── stats/        # Statistics endpoints
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/
│   ├── admin/            # Admin components
│   ├── ui/               # UI components
│   └── chat-widget.tsx   # AI chat component
├── lib/
│   ├── api.ts            # API client functions
│   ├── jwt.ts            # JWT utilities
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Helper functions
├── models/
│   ├── User.ts           # User model
│   ├── Conversation.ts   # Conversation model
│   └── Report.ts         # Report model
└── contexts/
    └── auth-context.tsx  # Authentication context
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user/admin
- `POST /api/auth/login` - Login user/admin

### AI Features (NEW!)
- `POST /api/ai/analyze-disease` - Analyze disease from image
- `POST /api/ai/chat` - Get AI health advice for text queries

### Conversations
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get specific conversation
- `POST /api/conversations/[id]` - Add message to conversation
- `PATCH /api/conversations/[id]` - Update conversation status

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `PATCH /api/reports/[id]` - Update report (admin only)
- `DELETE /api/reports/[id]` - Delete report (admin only)

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎯 Usage

### For Users
1. Sign up at `/signup` with user role
2. Login at `/login`
3. Access dashboard at `/dashboard`
4. Use chat widget for health queries
5. Submit health reports
6. Track your conversations

### For Admins
1. Sign up at `/signup` with admin role (requires org code: `ADMIN2024`)
2. Login at `/login` with admin credentials
3. Access admin panel at `/admin`
4. Monitor all conversations
5. Manage reports
6. View analytics and outbreak map

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/healthai` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000` |
| `AI_MODEL_ENDPOINT` | Your deployed AI model URL | Optional |
| `AI_MODEL_API_KEY` | API key for AI model | Optional |

## 🧠 AI Model Integration

The platform supports AI-powered disease diagnosis. See **[AI_INTEGRATION.md](./AI_INTEGRATION.md)** for detailed integration guide.

### Quick Start:
1. Train your model (or use the provided Colab notebook)
2. Deploy model as API endpoint
3. Update `AI_MODEL_ENDPOINT` in `.env.local`
4. Test with image uploads in user dashboard

**Supported Features:**
- Skin condition diagnosis (Acne, Eczema, Psoriasis, etc.)
- Prescription generation based on diagnosis
- Treatment recommendations
- Confidence scoring

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthai
JWT_SECRET=generate-a-strong-secret-key
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## 📦 Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI/ML**: TensorFlow (optional), Custom trained models
- **Image Processing**: Base64 encoding, client-side preview

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 💡 Support

For support, email support@healthai.com or join our community chat.

## 🎉 Credits

Built with ❤️ using Next.js and modern web technologies.
