import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from typing import Dict

class PlayerPredictionService:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.features = [
            'technical_ability', 'passing_ability', 'shooting_ability',
            'heading_ability', 'defensive_ability', 'ball_control',
            'decision_making', 'vision', 'work_rate', 'leadership',
            'composure', 'speed', 'stamina', 'strength', 'agility'
        ]

    def train_model(self, training_data: pd.DataFrame):
        """Entraîne le modèle avec les données FM"""
        X = training_data[self.features]
        y = training_data['market_value']
        
        # Normalisation des features
        X_scaled = self.scaler.fit_transform(X)
        
        # Entraînement du modèle
        self.model.fit(X_scaled, y)
        print("Modèle entraîné avec succès")

    def predict_value(self, player_data: Dict) -> float:
        """Prédit la valeur marchande d'un joueur"""
        features = pd.DataFrame([player_data])
        features_scaled = self.scaler.transform(features[self.features])
        return self.model.predict(features_scaled)[0]

    def predict_potential(self, player_data: Dict) -> float:
        """Prédit le potentiel d'un joueur"""
        features = pd.DataFrame([player_data])
        features_scaled = self.scaler.transform(features[self.features])
        
        # Utilise le même modèle mais avec un facteur de progression
        current_value = self.model.predict(features_scaled)[0]
        potential_factor = np.mean([
            player_data['technical_ability'],
            player_data['decision_making'],
            player_data['work_rate']
        ]) / 20.0  # Normalisé sur 1
        
        return current_value * (1 + potential_factor)