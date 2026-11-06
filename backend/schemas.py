from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class PredictionRequest(BaseModel):
    Gender: str = Field(..., description="Gender (e.g. Male, Female)")
    Age: float = Field(..., description="Age in years (e.g. 18 to 60)")
    City: str = Field(..., description="City of residence")
    Profession: str = Field(..., description="Profession (e.g. Student)")
    Academic_Pressure: float = Field(..., alias="Academic Pressure", description="Scale 0 to 5")
    Work_Pressure: float = Field(..., alias="Work Pressure", description="Scale 0 to 5")
    CGPA: float = Field(..., description="Cumulative Grade Point Average (0 to 10)")
    Study_Satisfaction: float = Field(..., alias="Study Satisfaction", description="Scale 0 to 5")
    Job_Satisfaction: float = Field(..., alias="Job Satisfaction", description="Scale 0 to 5")
    Sleep_Duration: str = Field(..., alias="Sleep Duration", description="Sleep duration category")
    Dietary_Habits: str = Field(..., alias="Dietary Habits", description="Dietary habit category")
    Degree: str = Field(..., description="Educational degree")
    Suicidal_Thoughts: str = Field(..., alias="Have you ever had suicidal thoughts ?", description="Yes/No")
    Work_Study_Hours: float = Field(..., alias="Work/Study Hours", description="Daily hours")
    Financial_Stress: float = Field(..., alias="Financial Stress", description="Scale 1 to 5")
    Family_History: str = Field(..., alias="Family History of Mental Illness", description="Yes/No")

    model_config = {
        "populate_by_name": True
    }

class FeatureContribution(BaseModel):
    feature: str
    impact: float
    description: str

class PredictionResponse(BaseModel):
    prediction: int  # 0 or 1
    prediction_label: str  # e.g. "Low Academic/Mental Risk" or "High Risk of Student Depression"
    confidence: float
    probabilities: Dict[str, float]
    model_used: str
    inference_time_ms: float
    explanations: List[FeatureContribution]

class DatasetInfoResponse(BaseModel):
    total_rows: int
    total_columns: int
    target_column: str
    target_distribution: Dict[str, int]
    numerical_features: List[str]
    categorical_features: List[str]
    sample_records: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
    timestamp: str
