from flask import Flask, request, jsonify
import json
import tensorflow as tf
import numpy as np
import pandas as pd
import joblib

app = Flask(__name__)

# Load the saved components
model = tf.keras.models.load_model('model_data/salary_prediction_model')
ohe = joblib.load('model_data/onehotencoder.joblib')
scaler = joblib.load('model_data/features_scaler.joblib')
y_scaler = joblib.load('model_data/target_scaler.joblib')

@app.route('/api/predict', methods=['POST'])
def predict_salary():
    # Get the data from the request
    data = request.json 
    #
    print(data)
    df = pd.DataFrame([data])
    
    # Assume data is a dictionary containing the values for the categorical and numerical columns
    # For example: data = {'work_year': '2023', 'experience_level': 'SE', 'employment_type': 'FT', 'job_title': 'Data Engineer', 'salary_currency': 'USD', 'employee_residence': 'US', 'company_location': 'US', 'company_size': 'M', 'remote_ratio': 50}
    categorical_cols = ['work_year', 'experience_level', 'employment_type', 'job_title',
                        'salary_currency', 'employee_residence', 'company_location', 'company_size']
    numerical_cols = ['remote_ratio']

    encoded_features = ohe.transform(df[categorical_cols])
    scaled_features = scaler.transform(df[numerical_cols])

# Combine encoded categorical features and scaled numerical features
    X = np.concatenate([encoded_features, scaled_features], axis=1)
    
    # Predict the salary
    y_pred = model.predict(X)
    y_pred_inverse = y_scaler.inverse_transform(y_pred)
    
    # Return the prediction
    return jsonify({'predicted_salary': [round(y) for y in y_pred_inverse.flatten().tolist()]})
