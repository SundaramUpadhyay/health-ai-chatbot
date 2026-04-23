"""
AI Model Server for Skin Disease Classification
Serves the exported Keras model via Flask API
"""

# Fix unicode encoding issues on Windows
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import json
import re
from PIL import Image
import io
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Load model and metadata
MODEL_PATH_KERAS = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'skin_classifier_model.keras')
MODEL_PATH_H5 = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'skin_classifier.h5')
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'class_names.txt')
METADATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'exported_model', 'metadata.json')

# Define the preprocessing function that was used during training
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess

def preprocess_input(x):
    """Custom preprocessing function for the model"""
    return efficientnet_preprocess(x)

# Load the model
print("Loading model...")
custom_objects = {'preprocess_input': preprocess_input}
try:
    # Try loading .h5 file first with custom objects
    model = tf.keras.models.load_model(MODEL_PATH_H5, custom_objects=custom_objects, compile=False)
    print("✅ Loaded .h5 model successfully!")
except Exception as e:
    print(f"⚠️  Could not load .h5 file: {e}")
    print("Trying .keras file...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH_KERAS, custom_objects=custom_objects, compile=False)
        print("✅ Loaded .keras model successfully!")
    except Exception as e2:
        print(f"❌ Could not load model: {e2}")
        print("Attempting to load without custom objects...")
        try:
            model = tf.keras.models.load_model(MODEL_PATH_H5, compile=False)
            print("✅ Loaded .h5 model without custom objects!")
        except Exception as e3:
            print(f"❌ Could not load model: {e3}")
            print("Please make sure your model files are in the exported_model/ directory")
            exit(1)

# Load class names
with open(CLASS_NAMES_PATH, 'r') as f:
    class_names = [line.strip() for line in f.readlines() if line.strip()]

# Load metadata
with open(METADATA_PATH, 'r') as f:
    metadata = json.load(f)
    IMG_SIZE = metadata['img_size']

print(f"Classes: {class_names}")
print(f"Image size: {IMG_SIZE}x{IMG_SIZE}")

# ==================== TEXT MODEL INITIALIZATION ====================
# Initialize text vectorizer and label encoder for symptom-based predictions
print("\n📝 Initializing text-based prediction model...")
TEXT_VECTORIZER = TfidfVectorizer(max_features=5000)
TEXT_LABEL_ENCODER = LabelEncoder()

# Disease mapping from symptoms (Colab dataset)
DISEASE_SYMPTOMS_MAP = {
    'Actinic Keratosis': ['brown discoloration', 'burning sensation', 'chronic irritation', 'itching', 'pain', 'red lesion', 'rough surface', 'scaling', 'sun damage', 'tenderness'],
    'Basal Cell Carcinoma': ['bleeding lesion', 'central depression', 'crater-like', 'elevated border', 'pearly appearance', 'pink lesion', 'shiny', 'translucent', 'waxy appearance'],
    'Benign Keratosis-like Lesions': ['brown or black color', 'crumbly edges', 'crusty appearance', 'dry', 'greasy', 'horny plug', 'mamillated surface', 'waxy surface'],
    'Dermatofibroma': ['brown or reddish color', 'darker center', 'dimple sign', 'firm', 'hard', 'painless', 'raised lesion', 'small'],
    'Melanoma': ['asymmetry', 'black or dark lesion', 'bleeding', 'border irregularity', 'color variation', 'diameter > 6mm', 'evolution', 'itching', 'multiple colors', 'rapid growth'],
    'Melanocytic Nevi': ['brown color', 'circular', 'consistent color', 'flat or raised', 'mole', 'round shape', 'symmetric', 'well-defined borders'],
    'Vascular Lesions': ['bleeding if injured', 'blanching', 'bright red', 'hemangioma', 'purple color', 'red angioma', 'reddish', 'vascular'],
}

# Create training data for text model
training_symptoms = []
training_diseases = []

for disease, symptoms in DISEASE_SYMPTOMS_MAP.items():
    for symptom in symptoms:
        training_symptoms.append(symptom)
        training_diseases.append(disease)

# Fit vectorizer and encoder
print("📚 Training text model on symptom data...")
X_train = TEXT_VECTORIZER.fit_transform(training_symptoms)
y_train = TEXT_LABEL_ENCODER.fit_transform(training_diseases)

print("✅ Text-based prediction model initialized!")
print(f"   Symptoms database: {len(training_symptoms)} entries")
print(f"   Diseases: {len(set(training_diseases))}")
# ======================================================================

# Disease information database
DISEASE_INFO = {
    "Actinic_Keratoses": {
        "name": "Actinic Keratoses",
        "description": "Precancerous skin lesions caused by sun damage",
        "prescription": [
            "Fluorouracil cream 5% - Apply twice daily for 2-4 weeks",
            "Imiquimod cream - Apply as directed by physician",
            "Diclofenac gel 3% - Apply twice daily"
        ],
        "recommendations": [
            "Avoid direct sun exposure, especially 10am-4pm",
            "Use broad-spectrum SPF 30+ sunscreen daily",
            "Wear protective clothing and wide-brimmed hat",
            "Regular dermatologist check-ups every 6 months",
            "Consider cryotherapy or photodynamic therapy if lesions persist"
        ]
    },
    "Basal_Cell_Carcinoma": {
        "name": "Basal Cell Carcinoma",
        "description": "Most common type of skin cancer, usually treatable",
        "prescription": [
            "Surgical excision - Primary treatment recommended",
            "Mohs surgery - For high-risk or facial lesions",
            "Imiquimod cream 5% - For superficial lesions (under supervision)"
        ],
        "recommendations": [
            "⚠️ URGENT: Consult dermatologist immediately",
            "Avoid sun exposure and use SPF 50+ sunscreen",
            "Do not attempt self-treatment",
            "Regular skin cancer screenings",
            "Consider genetic testing if multiple occurrences"
        ]
    },
    "Benign_Keratosis": {
        "name": "Benign Keratosis (Seborrheic Keratosis)",
        "description": "Non-cancerous skin growth, usually harmless",
        "prescription": [
            "No treatment required unless cosmetically concerning",
            "Cryotherapy - For removal if desired",
            "Electrosurgery - Alternative removal method"
        ],
        "recommendations": [
            "Monitor for changes in size, color, or shape",
            "Keep skin moisturized",
            "Avoid picking or scratching",
            "Consult dermatologist if it becomes irritated or bleeds",
            "No specific sun protection needed, but general sun safety advised"
        ]
    },
    "Dermatofibroma": {
        "name": "Dermatofibroma",
        "description": "Benign fibrous skin lesion, often following minor injury",
        "prescription": [
            "No treatment typically required",
            "Surgical excision - Only if symptomatic or cosmetically concerning",
            "Hydrocortisone cream 1% - For itching if present"
        ],
        "recommendations": [
            "Usually harmless and requires no treatment",
            "Avoid scratching or trauma to the area",
            "Monitor for changes in size or color",
            "Consult dermatologist if painful or rapidly growing",
            "Apply moisturizer to keep skin healthy"
        ]
    },
    "Melanocytic_Nevi": {
        "name": "Melanocytic Nevi (Moles)",
        "description": "Common benign skin lesions (moles)",
        "prescription": [
            "No treatment required for benign moles",
            "Surgical removal - Only if atypical features present",
            "Regular monitoring using ABCDE rule"
        ],
        "recommendations": [
            "Monitor for changes using ABCDE rule (Asymmetry, Border, Color, Diameter, Evolution)",
            "Photograph moles annually to track changes",
            "Use SPF 30+ sunscreen daily",
            "Avoid excessive sun exposure",
            "See dermatologist annually for skin check, more frequently if high-risk"
        ]
    },
    "Melanoma": {
        "name": "Melanoma",
        "description": "Serious form of skin cancer requiring immediate treatment",
        "prescription": [
            "⚠️ URGENT: Immediate surgical excision required",
            "Wide local excision with margins",
            "Sentinel lymph node biopsy may be needed",
            "Immunotherapy or targeted therapy for advanced cases"
        ],
        "recommendations": [
            "🚨 CRITICAL: See oncologist/dermatologist IMMEDIATELY",
            "Do NOT delay treatment - early intervention is crucial",
            "Avoid all sun exposure",
            "Regular full-body skin examinations",
            "Discuss treatment options including surgery, immunotherapy, radiation"
        ]
    },
    "Vascular_Lesion": {
        "name": "Vascular Lesion",
        "description": "Blood vessel-related skin lesions (hemangiomas, angiomas)",
        "prescription": [
            "Propranolol - For infantile hemangiomas (prescription only)",
            "Laser therapy - For cosmetic removal",
            "Topical timolol gel - For superficial lesions"
        ],
        "recommendations": [
            "Most vascular lesions are benign and harmless",
            "Monitor for changes in size or bleeding",
            "Protect from trauma to prevent bleeding",
            "Consult dermatologist if rapidly growing or symptomatic",
            "Consider laser treatment for cosmetic concerns"
        ]
    }
}

# Map text model labels to DISEASE_INFO keys.
TEXT_DISEASE_TO_INFO_KEY = {
    "Actinic Keratosis": "Actinic_Keratoses",
    "Basal Cell Carcinoma": "Basal_Cell_Carcinoma",
    "Benign Keratosis-like Lesions": "Benign_Keratosis",
    "Dermatofibroma": "Dermatofibroma",
    "Melanoma": "Melanoma",
    "Melanocytic Nevi": "Melanocytic_Nevi",
    "Vascular Lesions": "Vascular_Lesion",
}

STOP_WORDS = {
    "i", "have", "has", "had", "the", "a", "an", "on", "in", "at", "of",
    "my", "is", "are", "it", "this", "that", "and", "with", "for", "to", "from",
}

TOKEN_ALIASES = {
    "moles": "mole",
    "spots": "spot",
    "patches": "patch",
    "rashes": "rash",
    "lesions": "lesion",
    "reddish": "red",
}

DISEASE_KEYWORDS = {
    "Actinic Keratosis": {"red", "rough", "scaling", "sun", "damage", "tender", "irritation", "patch"},
    "Basal Cell Carcinoma": {"bleeding", "pearly", "pink", "shiny", "waxy", "lesion", "depression"},
    "Benign Keratosis-like Lesions": {"black", "brown", "waxy", "crusty", "dry", "greasy", "spot"},
    "Dermatofibroma": {"firm", "hard", "small", "raised", "dimple", "painless"},
    "Melanoma": {"asymmetry", "irregular", "border", "dark", "black", "growth", "bleeding", "color"},
    "Melanocytic Nevi": {"mole", "round", "symmetric", "brown", "spot", "flat", "raised"},
    "Vascular Lesions": {"vascular", "red", "angioma", "hemangioma", "purple", "blanching", "bleeding"},
}

def normalize_symptom_text(symptom_text):
    """Normalize raw symptom text to improve matching for short user phrases."""
    words = re.findall(r"[a-z0-9]+", symptom_text.lower())
    tokens = []

    for word in words:
        if word in STOP_WORDS:
            continue

        normalized = TOKEN_ALIASES.get(word, word)

        # Basic singularization for common plurals.
        if normalized.endswith("es") and len(normalized) > 4:
            normalized = normalized[:-2]
        elif normalized.endswith("s") and len(normalized) > 3:
            normalized = normalized[:-1]

        normalized = TOKEN_ALIASES.get(normalized, normalized)
        tokens.append(normalized)

    return tokens

def preprocess_image(image_data):
    """
    Preprocess base64 image for model prediction
    The model expects EfficientNet preprocessing (not just /255.0)
    """
    # Decode base64
    image_bytes = base64.b64decode(image_data)
    
    # Open image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize((IMG_SIZE, IMG_SIZE))
    
    # Convert to numpy array (0-255 range)
    image_array = np.array(image, dtype=np.float32)
    
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    
    # Apply EfficientNet preprocessing
    # This is what the model was trained with
    from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess
    image_array = efficientnet_preprocess(image_array)
    
    return image_array

def predict_disease_from_text(symptom_text):
    """
    Predict disease from symptom text using TF-IDF vectorizer
    Based on Colab trained model
    """
    try:
        # Clean and normalize text for short user messages (e.g., "moles", "patches").
        symptom_text = symptom_text.lower().strip()
        tokens = normalize_symptom_text(symptom_text)
        normalized_text = " ".join(tokens) if tokens else symptom_text
        
        # Vectorize input
        input_vec = TEXT_VECTORIZER.transform([normalized_text])
        
        # Calculate similarity with training data
        from sklearn.metrics.pairwise import cosine_similarity
        similarities = cosine_similarity(input_vec, X_train)[0]
        
        token_set = set(tokens)
        all_scores = {}

        for disease in set(training_diseases):
            indices = [i for i, d in enumerate(training_diseases) if d == disease]
            disease_sims = [similarities[i] for i in indices]
            tfidf_score = float(np.max(disease_sims)) if disease_sims else 0.0

            keyword_set = DISEASE_KEYWORDS.get(disease, set())
            keyword_hits = len(token_set.intersection(keyword_set))
            keyword_score = keyword_hits / max(len(keyword_set), 1)

            # Blend lexical similarity + explicit symptom keyword hits.
            blended_score = 0.7 * tfidf_score + 0.3 * keyword_score
            all_scores[disease] = float(blended_score)

        best_match_disease = max(all_scores, key=all_scores.get)
        confidence = float(all_scores[best_match_disease])

        return best_match_disease, confidence, all_scores
    except Exception as e:
        print(f"Error in text prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Health AI Chatbot Backend API',
        'status': 'running',
        'endpoints': {
            'health': '/health',
            'predict': '/predict (POST)'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes': len(class_names)
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint
    Expects: 
      - { "image": "<base64-encoded-image>" } for image analysis
      - { "text": "<symptom-description>" } for text-based analysis
    Returns: { "disease": "...", "confidence": 0.95, "prescription": [...], "recommendations": [...], "reply": "..." }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Handle image prediction
        if 'image' in data:
            print("\n🖼️  Processing IMAGE prediction...")
            image_data = data['image']
            
            # Preprocess image
            processed_image = preprocess_image(image_data)
            
            # Make prediction
            predictions = model.predict(processed_image, verbose=0)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get disease name
            disease_key = class_names[predicted_class_idx]
            disease_info = DISEASE_INFO.get(disease_key, {})
            
            # Get all prediction probabilities for debugging
            all_predictions = {
                class_names[i]: float(predictions[0][i]) 
                for i in range(len(class_names))
            }
            
            # Log prediction
            print(f"   Predicted: {disease_info.get('name', disease_key)} ({confidence*100:.1f}%)")
            
            response = {
                'disease': disease_info.get('name', disease_key),
                'confidence': confidence,
                'prescription': disease_info.get('prescription', []),
                'recommendations': disease_info.get('recommendations', []),
                'description': disease_info.get('description', ''),
                'reply': f"Based on image analysis, I detected {disease_info.get('name', disease_key)} with {confidence*100:.1f}% confidence.",
                'all_predictions': all_predictions
            }
            
            return jsonify(response)
        
        # Handle text prediction
        elif 'text' in data:
            print("\n📝 Processing TEXT prediction...")
            symptom_text = data['text']
            
            # Predict disease from symptoms
            disease_name, confidence, all_scores = predict_disease_from_text(symptom_text)
            
            # Get disease info
            disease_key = TEXT_DISEASE_TO_INFO_KEY.get(disease_name, disease_name.replace(' ', '_'))
            disease_info = DISEASE_INFO.get(disease_key, {})
            
            # Log prediction
            print(f"   Predicted: {disease_name} ({confidence*100:.1f}%)")
            print(f"   Symptoms: {symptom_text[:100]}...")
            
            # Create AI reply
            ai_reply = f"Based on your symptoms, I suspect {disease_name}. "
            if confidence > 0.7:
                ai_reply += "I have high confidence in this assessment. "
            elif confidence > 0.5:
                ai_reply += "This is a tentative assessment. "
            else:
                ai_reply += "Please provide more details for accurate diagnosis. "
            
            if disease_key in DISEASE_INFO:
                ai_reply += f"\n\n{disease_info.get('description', '')}\n\nPlease consult a dermatologist for proper diagnosis and treatment."
            
            response = {
                'disease': disease_name,
                'confidence': confidence,
                'prescription': disease_info.get('prescription', []),
                'recommendations': disease_info.get('recommendations', []),
                'description': disease_info.get('description', ''),
                'reply': ai_reply,
                'allScores': all_scores
            }
            
            return jsonify(response)
        
        else:
            return jsonify({'error': 'Either image or text is required'}), 400
        
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get list of all disease classes the model can predict"""
    return jsonify({
        'classes': [DISEASE_INFO.get(cls, {}).get('name', cls) for cls in class_names],
        'count': len(class_names)
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🏥 Skin Disease AI Model Server")
    print("="*50)
    print(f"📊 Model: exported_model/")
    print(f"🏷️  Classes: {len(class_names)}")
    print(f"🖼️  Input size: {IMG_SIZE}x{IMG_SIZE}")
    print("="*50 + "\n")
    
    # Run server without debug mode to avoid reloader issues
    app.run(host='0.0.0.0', port=5000, debug=False)
