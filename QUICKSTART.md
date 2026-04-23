# 🚀 Quick Start Guide - AI Integration

Your AI model from `exported_model/` is now fully integrated with the chatbot!

## 🎯 What's Been Set Up

✅ **Flask AI Server** (`ai-server/app.py`) - Serves your Keras model
✅ **7 Disease Classes** - Actinic Keratoses, Basal Cell Carcinoma, Benign Keratosis, Dermatofibroma, Melanocytic Nevi, Melanoma, Vascular Lesion
✅ **Complete Disease Database** - Prescriptions and recommendations for each condition
✅ **Next.js Integration** - Chatbot automatically calls the AI server

## 📋 Prerequisites

- Python 3.8+ installed
- Node.js and pnpm installed
- All Next.js dependencies installed (`pnpm install`)

## 🏃 Quick Start (3 Steps)

### Step 1: Install Python Dependencies

```bash
cd ai-server
pip install -r requirements.txt
```

**Or use virtual environment (recommended):**
```bash
cd ai-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Start the AI Server

```bash
python app.py
```

You should see:
```
🏥 Skin Disease AI Model Server
Model loaded successfully!
Running on http://localhost:5000
```

### Step 3: Start Next.js (in a new terminal)

```bash
pnpm dev
```

## ✅ That's It!

Your chatbot now uses the real AI model! 

### Chat Features:

**1. Image Analysis Tab** 📸
- Upload skin condition images
- Get instant AI diagnosis with confidence scores
- Receive personalized prescriptions and recommendations

**2. Text Chat** 💬 (NEW!)
- Describe your symptoms in the chat
- AI predicts disease from text using the trained capstone model
- Examples:
  - "Red bumpy rash that itches"
  - "Brown spot with irregular borders"
  - "Bleeding lesion on my arm"

### Test It:
1. Go to http://localhost:3000
2. Login to your account
3. Open the AI Health Chat
4. Try both:
   - **Text**: Type symptoms and press Enter
   - **Image**: Upload a skin image for analysis

## 🧪 Testing Symptoms (Text-Based AI)

Try these symptom descriptions in the chat:

- "I have a brown discolored area with burning sensation and scaling" → Actinic Keratosis
- "Pink lesion with pearly appearance and bleeding" → Basal Cell Carcinoma
- "Asymmetric dark lesion with color variation and rapid growth" → Melanoma
- "Brown mole with regular borders and even color" → Melanocytic Nevi
- "Bleeding if injured red lesion" → Vascular Lesion

## 🧪 Testing the AI Server

Test if the server is working:

```bash
# Terminal 1: Make sure AI server is running
cd ai-server
python app.py

# Terminal 2: Test the endpoint
node test-ai-endpoint.js
```

You should see:
```
✅ Success! AI Response:
{
  "disease": "Melanocytic Nevi",
  "confidence": 0.95,
  "prescription": [...],
  "recommendations": [...]
}
```

## 🌐 Deploying with Ngrok (Optional)

To make your AI model accessible from anywhere:

```bash
# Terminal 1: Start AI server
cd ai-server
python app.py

# Terminal 2: Start ngrok
ngrok http 5000

# Terminal 3: Update and start Next.js
# Copy the ngrok URL (e.g., https://abc123.ngrok-free.app)
# Create .env.local and add:
# AI_MODEL_ENDPOINT=https://abc123.ngrok-free.app/predict

pnpm dev
```

## 📊 API Endpoints

Your AI server exposes:

- `GET /health` - Check if server is running
- `POST /predict` - Predict disease from image
- `GET /classes` - Get list of all disease classes

## 🔧 Troubleshooting

### "Module not found" error
```bash
pip install -r ai-server/requirements.txt
```

### "Model not found" error
Make sure you're in the project root directory when starting the server.

### Port 5000 already in use
Change the port in `ai-server/app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

And update `.env.local`:
```
AI_MODEL_ENDPOINT=http://localhost:5001/predict
```

### CORS errors
Already handled! Flask-CORS is configured in the server.

## 📁 Project Structure

```
code/
├── ai-server/              # AI Model Server
│   ├── app.py             # Flask server
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Server documentation
├── exported_model/         # Your trained model
│   ├── skin_classifier_model.keras
│   ├── class_names.txt
│   └── metadata.json
├── app/
│   └── api/
│       └── ai/
│           └── analyze-disease/
│               └── route.ts  # Calls AI server
└── components/
    └── ai-health-chat.tsx   # Chat interface
```

## 🎓 Supported Diseases

1. **Actinic Keratoses** - Precancerous lesions
2. **Basal Cell Carcinoma** - Common skin cancer
3. **Benign Keratosis** - Harmless growths
4. **Dermatofibroma** - Benign fibrous lesions
5. **Melanocytic Nevi** - Common moles
6. **Melanoma** - Serious skin cancer
7. **Vascular Lesion** - Blood vessel lesions

Each prediction includes:
- Disease name
- Confidence score (0-1)
- Prescription recommendations
- Care instructions

## 🔒 Security Notes

- This is for educational/demo purposes
- Always consult healthcare professionals for medical advice
- Do not use for actual medical diagnosis
- Keep the AI server internal or behind authentication in production

## Complete Backend Setup in 3 Steps

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

1. Download MongoDB Community Server:
   - Windows: https://www.mongodb.com/try/download/community
   - Install with default settings
   - MongoDB Compass (GUI) will also be installed

2. Start MongoDB:
   ```powershell
   net start MongoDB
   ```

3. Verify MongoDB is running:
   ```powershell
   mongo --version
   ```

**Option B: MongoDB Atlas (Cloud - Free Tier Available)**

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0)
3. Create a database user
4. Whitelist your IP (0.0.0.0/0 for development)
5. Get your connection string
6. Update `.env.local` with your Atlas URI

### Step 2: Setup Database

Run the database setup script:

```powershell
pnpm db:setup
```

This will:
- Connect to MongoDB
- Create necessary indexes
- Verify the connection

### Step 3: Seed Sample Data (Optional)

To populate with sample data for testing:

```powershell
pnpm db:seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Sample conversations
- Sample health reports

## 🎯 Running the Application

1. Start the development server:
   ```powershell
   pnpm dev
   ```

2. Open your browser:
   ```
   http://localhost:3000
   ```

3. You can now:
   - Sign up as a new user or admin
   - Or use seeded credentials to login
   - Test all features!

## ✨ What's Working Now

### Frontend ✅
- ✅ Login page (user & admin)
- ✅ Signup page (user & admin)
- ✅ User dashboard
- ✅ Admin dashboard
- ✅ AI Chat widget
- ✅ Protected routes
- ✅ Responsive design

### Backend ✅
- ✅ MongoDB database connection
- ✅ User authentication with JWT
- ✅ Password encryption (bcrypt)
- ✅ RESTful API endpoints
- ✅ Conversation management
- ✅ Report management
- ✅ Statistics API
- ✅ Automated AI responses

### Features ✅
- ✅ User registration & login
- ✅ Admin registration & login (with org code)
- ✅ Real-time chat with AI bot
- ✅ Conversation history
- ✅ Health report submission
- ✅ Admin conversation monitoring
- ✅ Admin report management
- ✅ Dashboard statistics
- ✅ Logout functionality

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- Secure environment variables

## 📱 Testing the Application

### Test User Flow:
1. Go to `/signup`
2. Register as User
3. Login at `/login`
4. Access dashboard at `/dashboard`
5. Click "Start Chat" to test AI assistant
6. Submit a health report

### Test Admin Flow:
1. Go to `/signup`
2. Register as Admin (use code: `ADMIN2024`)
3. Login at `/login`
4. Access admin panel at `/admin`
5. View conversations
6. View and manage reports
7. Check statistics

## 🐛 Troubleshooting

### MongoDB Connection Issues:

**Error: "MongoServerError: connect ECONNREFUSED"**
- Make sure MongoDB is running: `net start MongoDB`
- Check if port 27017 is available
- Verify MONGODB_URI in `.env.local`

**Error: "MongooseServerSelectionError"**
- Check your internet connection (for Atlas)
- Verify connection string is correct
- Whitelist your IP in Atlas

### Application Issues:

**"Unauthorized" errors:**
- Clear browser localStorage
- Login again to get new token

**Chat not working:**
- Check if MongoDB is connected
- Look at browser console for errors
- Verify token is stored in localStorage

## 📊 Database Collections

After setup, you'll have these collections:

1. **users** - User accounts (admin & regular)
2. **conversations** - Chat conversations with messages
3. **reports** - Health incident reports

## 🔄 Resetting the Database

To start fresh:

```powershell
# Connect to MongoDB shell
mongosh

# Switch to database
use healthai

# Drop all collections
db.users.drop()
db.conversations.drop()
db.reports.drop()

# Re-run seed
pnpm db:seed
```

## 📝 Environment Variables

Make sure your `.env.local` has:

```env
MONGODB_URI=mongodb://localhost:27017/healthai
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎉 You're All Set!

Your full-stack HealthAI application is now running with:
- ✨ Beautiful UI
- 🔒 Secure authentication
- 💾 MongoDB database
- 🤖 AI chat assistant
- 📊 Admin dashboard
- 📱 Responsive design

**Need help?** Check the full README.md for detailed documentation!
