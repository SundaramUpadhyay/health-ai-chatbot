# AI Model Server

Flask API server for the skin disease classification model.

## Setup

1. **Install Python dependencies:**
```bash
cd ai-server
pip install -r requirements.txt
```

2. **Start the server:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

## Endpoints

- `GET /health` - Health check
- `POST /predict` - Predict disease from image
- `GET /classes` - Get list of disease classes

## Using with Ngrok

To expose the server publicly:

```bash
# In a separate terminal
ngrok http 5000
```

Then update the endpoint URL in your Next.js app's `.env.local`:
```
AI_MODEL_ENDPOINT=https://your-ngrok-url.ngrok-free.app/predict
```

## Testing

Test with curl:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image":"<base64-encoded-image>"}'
```

Or use the test script:
```bash
node test-ai-endpoint.js
```
