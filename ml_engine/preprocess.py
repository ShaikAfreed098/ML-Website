import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

def load_and_clean_dataset(filepath: str):
    """
    Loads student depression dataset and performs data cleaning.
    """
    df = pd.read_csv(filepath)
    
    # Strip column names
    df.columns = [c.strip() for c in df.columns]
    
    # Drop ID column if exists
    if 'id' in df.columns:
        df = df.drop(columns=['id'])
        
    # Drop rows missing target
    target_col = 'Depression'
    df = df.dropna(subset=[target_col])
    
    # Convert target to int
    df[target_col] = df[target_col].astype(int)
    
    # Fill or drop missing values in features
    df = df.dropna()
    
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    return df, X, y, target_col
