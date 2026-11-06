import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from schemas import PredictionRequest, PredictionResponse, DatasetInfoResponse, HealthResponse
from services import ml_service

app = FastAPI(
    title="Resource-Aware Learning Analytics API",
    description="Backend API supporting student performance prediction and explainability.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    is_loaded = ml_service.pipeline is not None
    return HealthResponse(
        status="online",
        model_loaded=is_loaded,
        version="1.0.0",
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

@app.get("/api/dataset/info")
def get_dataset_info():
    info = ml_service.get_dataset_info()
    if not info:
        raise HTTPException(status_code=444, detail="Dataset file not found or unreadable.")
    return info

@app.get("/api/models")
def get_models_comparison():
    if not ml_service.metrics or not ml_service.metadata:
        ml_service.load_artifacts()
    
    return {
        "live_models": ml_service.metrics or {},
        "metadata": ml_service.metadata or {}
    }

@app.get("/api/metrics")
def get_metrics():
    if not ml_service.metrics:
        ml_service.load_artifacts()
    return ml_service.metrics or {}

@app.get("/api/features")
def get_features_info():
    if not ml_service.metadata:
        ml_service.load_artifacts()
    
    cat_fields = ml_service.metadata.get("categorical_fields", {}) if ml_service.metadata else {}
    num_fields = ml_service.metadata.get("numerical_fields", {}) if ml_service.metadata else {}
    
    return {
        "categorical_fields": cat_fields,
        "numerical_fields": num_fields,
        "selected_k": ml_service.metadata.get("selected_k_features", 10) if ml_service.metadata else 10,
        "pca_components": ml_service.metadata.get("pca_components", 20) if ml_service.metadata else 20
    }

@app.get("/api/ablation")
def get_ablation_results():
    if not ml_service.ablation:
        ml_service.load_artifacts()
    return ml_service.ablation or []

@app.get("/api/explainability")
def get_explainability_info():
    return {
        "methodology": "Permutation sensitivity on the loaded model and dataset sample",
        "global_importance": ml_service.get_global_importance()
    }

@app.post("/api/predict", response_model=PredictionResponse)
def predict_student(request: PredictionRequest):
    try:
        data_dict = request.model_dump(by_alias=True)
        res = ml_service.predict(data_dict)
        return PredictionResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error_message": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
