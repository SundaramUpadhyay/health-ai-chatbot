# HealthAI Backend

Flask API server for the HealthAI health management system.

## 📦 What's Inside

- **AI Model Service**: Skin disease classification using EfficientNet
- **REST API**: Complete CRUD endpoints for health data
- **MongoDB Integration**: Conversation and report storage
- **CORS Enabled**: Ready for frontend integration
- **Health Check**: `/health` endpoint for monitoring

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Server runs on `http://127.0.0.1:5000`

### Docker

```bash
# Build image
docker build -t healthai-backend .

# Run container
docker run -p 5000:5000 -e MONGODB_URI=mongodb://... healthai-backend
```

## 🔌 API Endpoints

### Health & Status
- `GET /health` - Health check

### Disease Analysis
- `POST /predict` - Predict disease from image
- `GET /classes` - Get list of disease classes

### Example Request

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image":"base64-encoded-image-data"}'
```

## 📋 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/healthai
FLASK_ENV=development
PORT=5000
```

## 🛠️ Deployment

### Railway (Recommended)
```bash
railway deploy
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Docker Compose (Local)
```bash
docker-compose up backend
```

## 📊 Project Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── exported_model/       # Pre-trained ML models
│   ├── skin_classifier_model.keras
│   ├── skin_classifier.h5
│   └── class_names.txt
└── README.md
```

## 🤖 ML Model

- **Architecture**: EfficientNet (pretrained)
- **Classes**: ~20 skin disease categories
- **Input**: Base64 encoded image
- **Output**: Disease prediction + confidence score

## 📦 Dependencies

- Flask 3.0.0
- TensorFlow 2.16+
- scikit-learn
- Pillow (image processing)
- MongoDB driver (via app integration)

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test prediction (with test image)
python test-ai-endpoint.js
```

## 🔐 Production Notes

- Use production WSGI server (Gunicorn, uWSGI)
- Set `FLASK_ENV=production`
- Use MongoDB Atlas (not local)
- Add environment variable encryption
- Enable HTTPS/TLS

## 📞 Troubleshooting

**Port 5000 already in use:**
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill and restart
```

**TensorFlow warnings:**
Normal on first run - models are being loaded into memory.

**Model loading fails:**
Check `exported_model/` directory exists and contains model files.

## 🚀 Next Steps

1. Update `MONGODB_URI` environment variable
2. Deploy to Railway/Heroku
3. Update frontend `NEXT_PUBLIC_API_URL` to point to deployed backend
4. Test API connectivity from frontend
