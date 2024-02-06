import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf

# Load the dataset
df = pd.read_csv('ds_salaries.csv')

# Dropping the 'salary' column as it's redundant with 'salary_in_usd'
df = df.drop(['salary'], axis=1)

# Separating categorical and numerical columns
categorical_cols = ['work_year', 'experience_level', 'employment_type', 'job_title',
                    'salary_currency', 'employee_residence', 'company_location', 'company_size']
numerical_cols = ['remote_ratio']

# One-Hot Encoding for categorical variables
ohe = OneHotEncoder(sparse_output=False)
print(df.columns)
encoded_features = ohe.fit_transform(df[categorical_cols])

# Normalize numerical features
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[numerical_cols])

# Combine encoded categorical features and scaled numerical features
X = np.concatenate([encoded_features, scaled_features], axis=1)
y = df['salary_in_usd'].values.reshape(-1, 1)

# Normalize target variable
y_scaler = StandardScaler()
y = y_scaler.fit_transform(y).flatten()

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Redefine and retrain the model with the processed data
tf.random.set_seed(42)
model = tf.keras.Sequential([
    # Increase the complexity of the model by adding more layers/neurons
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(1, activation='linear')  # 'linear' activation for regression output
])

# Consider using different optimizers and learning rates
model.compile(loss='huber_loss',  # Huber loss is less sensitive to outliers
              optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
              metrics=["mae"])

# Callbacks for early stopping and potentially learning rate scheduling
early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_mae', patience=10, restore_best_weights=True)
lr_scheduler = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5)

# Fit the model with validation split and callbacks
history = model.fit(X_train, y_train, 
                    epochs=200,  # Further increase epochs if needed
                    batch_size=32,
                    validation_split=0.3,  # Use part of the training set for validation
                    callbacks=[early_stopping, lr_scheduler])

# Evaluate the model on the test set
test_loss, test_mae = model.evaluate(X_test, y_test)
print(f"Test Loss: {test_loss}, Test MAE: {test_mae}")

# Predict and inverse transform the normalization to compare actual values
y_pred = model.predict(X_test)
y_pred_inverse = y_scaler.inverse_transform(y_pred)
print(y_pred)

y_test_inverse = y_scaler.inverse_transform(y_test.reshape(-1, 1))

# # Calculate the mean absolute error on the actual salary values
mae_actual = np.mean(np.abs(y_pred_inverse - y_test_inverse))
print(f"Mean Absolute Error on actual salaries: {mae_actual}")
# Save the TensorFlow model
model.save('salary_prediction_model')

# Save the OneHotEncoder, StandardScalers using joblib
joblib.dump(ohe, 'onehotencoder.joblib')
joblib.dump(scaler, 'features_scaler.joblib')
joblib.dump(y_scaler, 'target_scaler.joblib')
