# Health AI Chatbot - Backend

Python-based AI backend for disease analysis and health consultation using machine learning models.

## Tech Stack

- **Runtime**: Python 3.8+
- **Framework**: Flask/FastAPI (AI Server)
- **ML/AI**: TensorFlow, Keras
- **Database**: MongoDB
- **API**: RESTful API

## Project Structure

```
backend/
├── ai-server/              # AI server application
│   ├── app.py             # Main AI server
│   ├── app_simple.py      # Simplified version
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Docker configuration
│   └── README.md          # AI server docs
├── lib/                    # Shared libraries
├── models/                 # TypeScript/Node.js models
├── capstone.py            # Capstone project code
└── README.md              # This file
```

## AI Server

The AI server is located in the `ai-server/` directory and provides:
- Disease classification and analysis
- Health consultation recommendations
- Medical image processing
- ML model serving

## Installation

### Prerequisites

- Python 3.8 or higher
- pip or conda
- MongoDB (for database)

### Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ai-server/requirements.txt
```

## Running the AI Server

```bash
# Start the AI server
python ai-server/app.py

# Or use the simple version for testing
python ai-server/app_simple.py

# Server will run on http://localhost:5000 (or configured port)
```

## API Endpoints

### Disease Analysis
- `POST /api/analyze-disease` - Analyze disease from symptoms or images
- `GET /api/diseases` - Get list of supported diseases
- `GET /api/disease/<id>` - Get disease details

### Health Consultation
- `POST /api/consultation` - Get health consultation
- `GET /api/consultation/history` - Get consultation history

### Models
- `GET /api/models` - Get available ML models
- `POST /api/models/predict` - Make predictions

## Environment Variables

Create a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/health-ai
FLASK_ENV=development
FLASK_DEBUG=1
AI_MODEL_PATH=./exported_model/
API_PORT=5000
```

## ML Models

The project includes pre-trained models in `exported_model/`:
- `skin_classifier_model.keras` - Keras model for skin disease classification
- `skin_classifier.h5` - H5 format model backup
- `metadata.json` - Model metadata
- `class_names.txt` - Classification labels

## Docker

### Build Docker Image

```bash
docker build -t health-ai-backend:latest .
```

### Run Container

```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/health-ai \
  health-ai-backend:latest
```

## Testing

```bash
# Run tests
pytest

# Run specific test
pytest tests/test_api.py
```

## Database

### MongoDB Collections

- `users` - User accounts
- `conversations` - Chat conversations
- `reports` - Generated reports
- `analysis_results` - Disease analysis results

### Seed Database

```bash
# Seed initial data
node scripts/seed-db.js

# Setup database
node scripts/setup-db.js
```

## Deployment

For deployment to Azure or other cloud platforms, see the main [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md).

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

## Performance

- Model inference time: ~100-200ms
- API response time: <500ms
- Concurrent users: 100+

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## License

MIT
