import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv('Capstone_text_data.csv',encoding='latin1')

# Check data
print(df.head())
print(df.columns)
# Clean text
df['symptoms'] = df['symptoms'].str.lower()
df['symptoms'] = df['symptoms'].str.replace(',', ' ')
df['symptoms'] = df['symptoms'].str.strip()

from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(max_features=5000)

X = vectorizer.fit_transform(df['symptoms'])

from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
y = le.fit_transform(df['disease'])

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = MultinomialNB()
model.fit(X_train, y_train)

from sklearn.metrics import accuracy_score

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

def predict_disease(symptom_text):
    symptom_text = symptom_text.lower()
    symptom_text = symptom_text.replace(',', ' ')

    input_vec = vectorizer.transform([symptom_text])
    pred = model.predict(input_vec)

    return le.inverse_transform(pred)[0]

# Example
print(predict_disease("bleeding if injured"))