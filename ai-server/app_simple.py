"""
AI Model Server for Skin Disease Classification - Simplified Version
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'skin_classifier_model.keras')
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'class_names.txt')
METADATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'metadata.json')

# Load model
try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
except:
    try:
        model_h5 = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'skin_classifier.h5')
        model = tf.keras.models.load_model(model_h5, compile=False)
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

# Load classes and metadata
import json
with open(CLASS_NAMES_PATH) as f:
    class_names = [line.strip() for line in f if line.strip()]
    
with open(METADATA_PATH) as f:
    metadata = json.load(f)
    IMG_SIZE = metadata.get('img_size', 224)

# Disease information
DISEASE_INFO = {
    "Actinic_Keratoses": {
        "name": "Actinic Keratoses",
        "description": "Precancerous skin lesions caused by sun damage",
        "symptoms": ["brown discoloration", "burning sensation", "itching", "red lesion", "rough surface"],
    },
    "Basal_Cell_Carcinoma": {
        "name": "Basal Cell Carcinoma",
        "description": "Most common type of skin cancer",
        "symptoms": ["bleeding lesion", "waxy appearance", "translucent", "shiny", "pearly"],
    },
    "Benign_Keratosis": {
        "name": "Benign Keratosis",
        "description": "Non-cancerous skin growth",
        "symptoms": ["brown color", "crusty appearance", "dry", "waxy surface"],
    },
    "Dermatofibroma": {
        "name": "Dermatofibroma",
        "description": "Benign fibrous skin lesion",
        "symptoms": ["brown color", "reddish", "firm", "small", "dimple"],
    },
    "Melanocytic_Nevi": {
        "name": "Melanocytic Nevi",
        "description": "Common benign skin moles",
        "symptoms": ["brown color", "mole", "symmetric", "circular", "round"],
    },
    "Melanoma": {
        "name": "Melanoma",
        "description": "Serious form of skin cancer",
        "symptoms": ["asymmetry", "black lesion", "bleeding", "rapid growth", "color variation"],
    },
    "Vascular_Lesion": {
        "name": "Vascular Lesion",
        "description": "Blood vessel-related skin lesions",
        "symptoms": ["red", "bright red", "hemangioma", "vascular", "bleeding"],
    }
}

def match_symptom_to_disease(symptom_text):
    """Simple keyword matching for symptoms"""
    symptom_text = symptom_text.lower()
    scores = {}
    
    for disease_key, info in DISEASE_INFO.items():
        score = 0
        for symptom in info["symptoms"]:
            if symptom.lower() in symptom_text:
                score += 1
        
        scores[disease_key] = score
    
    # Special cases
    if "rash" in symptom_text or ("red" in symptom_text and "lesion" not in symptom_text):
        scores['Actinic_Keratoses'] += 2
    if "mole" in symptom_text:
        scores['Melanocytic_Nevi'] += 2
    if "cancer" in symptom_text or "melanoma" in symptom_text:
        scores['Melanoma'] += 3
    
    # Find best match
    best_disease = max(scores, key=scores.get)
    best_score = scores[best_disease]
    
    # Normalize confidence
    total_scores = sum(1 for s in scores.values() if s > 0)
    confidence = min(0.95, 0.5 + (best_score * 0.1))  # 0.5 base + boost
    
    return best_disease, confidence, scores

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data'}), 400
        
        # Handle text analysis
        if 'text' in data:
            try:
                text = data['text']
                disease_key, confidence, scores = match_symptom_to_disease(text)
                disease_info = DISEASE_INFO.get(disease_key, {})
                
                return jsonify({
                    'disease': disease_info.get('name', disease_key),
                    'confidence': float(confidence),
                    'description': disease_info.get('description', ''),
                    'reply': f"Based on your symptoms, I suspect {disease_info.get('name', disease_key)} with {int(confidence*100)}% confidence. Please consult a healthcare professional.",
                    'prescription': [],
                    'recommendations': [],
                })
            except Exception as te:
                print(f"Text analysis error: {te}")
                return jsonify({'error': f'Text analysis failed: {str(te)}'}), 500
        
        # Handle image analysis
        elif 'image' in data:
            try:
                if model is None:
                    return jsonify({'error': 'Image model not available'}), 503
                    
                image_data = data['image']
                if image_data.startswith('data:'):
                    image_data = image_data.split(',')[1]
                
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
                image = image.resize((IMG_SIZE, IMG_SIZE))
                image_array = np.array(image, dtype=np.float32)
                image_array = np.expand_dims(image_array, axis=0)
                image_array = image_array / 255.0
                
                predictions = model.predict(image_array, verbose=0)
                idx = np.argmax(predictions[0])
                confidence = float(predictions[0][idx])
                disease_key = class_names[idx]
                disease_info = DISEASE_INFO.get(disease_key, {})
                
                return jsonify({
                    'disease': disease_info.get('name', disease_key),
                    'confidence': confidence,
                    'description': disease_info.get('description', ''),
                    'reply': f"Image detected {disease_info.get('name', disease_key)} with {int(confidence*100)}% confidence.",
                    'prescription': [],
                    'recommendations': [],
                })
            except Exception as ie:
                print(f"Image analysis error: {ie}")
                return jsonify({'error': f'Image analysis failed: {str(ie)}'}), 500
        
        return jsonify({'error': 'No image or text provided'}), 400
        
    except Exception as e:
        print(f"Request error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Server...")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
