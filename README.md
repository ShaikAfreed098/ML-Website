# A Resource-Aware and Interpretable Learning Analytics Framework for Real-Time Student Performance Prediction

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4-F7931E?logo=scikit-learn)](https://scikit-learn.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 📌 Project Overview

This repository contains the production-quality, research-grade web platform for the conference paper:  
**"A Resource-Aware and Interpretable Learning Analytics Framework for Real-Time Student Performance Prediction"**  
*Authors: S.V.N.Srinivasu, Shaik Khasimmunnisa, K.Sujitha, Kunda Suresh Babu, Y.Krishna Bhargavi, Vallem Danaiah*

The application bridges **high-accuracy machine learning predictions**, **low computational latency**, and **Explainable AI (SHAP / feature attributions)** for real-time educational environments.

---

## 🏗️ System Architecture

```text
                 USER CLIENT
                      │
                      ▼
          React 18 + TypeScript UI
                      │
                      ▼ (Axios REST Calls)
              FastAPI Backend
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
  Scikit-Learn Pipeline      SHAP / XAI Engine
  (Encoding + Scaler +        (Feature Attribution)
   PCA 85% + SelectKBest)           │
        │                           │
        └─────────────┬─────────────┘
                      ▼
           Stacking Ensemble Model
                      │
                      ▼
              Real-Time JSON
```

---

## 📊 Dataset & Model Consistency Audit

| Dimension | Conference Paper | Live Implementation |
| :--- | :--- | :--- |
| **Dataset Source** | Open University Learning Analytics (OULAD) | `student_depression_dataset.csv` (27,901 student records) |
| **Target Variable** | Pass / Fail Outcome | Student Mental Well-being & Academic Risk (`Depression`) |
| **Preprocessing** | Categorical Encoding, StandardScaler | Categorical Encoding, StandardScaler |
| **PCA Reduction** | 85% Explained Variance Retained | 85% Explained Variance Retained (20 Components) |
| **Feature Selection** | SelectKBest (k=10) | SelectKBest (k=10) |
| **Split Strategy** | 70% Train, 15% Validation, 15% Test | 70% Train, 15% Validation, 15% Test (Stratified) |
| **Best Model** | Stacking Classifier (Acc: 92.4%, F1: 92.38%) | Stacking Classifier (Acc: 84.0%, F1: 86.5%) |
| **Badge Label** | `PAPER REPORTED RESULT` | `LIVE MODEL` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+ (npm v9+)

### 2. Backend Setup & Model Training
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Train ML Models & Serialize Pipeline
python ../ml_engine/train_model.py

# Start FastAPI REST Server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🛰️ REST API Endpoints

- `GET /api/health` — Checks backend API and model load status.
- `GET /api/dataset/info` — Retrieves dataset statistics, distributions, and sample records.
- `GET /api/models` — Returns benchmark metrics across all 6 evaluated models.
- `GET /api/metrics` — Returns test-set confusion matrix and classification report data.
- `GET /api/features` — Exposes PCA variance ratio and top SelectKBest features.
- `GET /api/ablation` — Retrieves ablation study results (Full Framework vs. w/o PCA vs. w/o FS vs. w/o Both).
- `POST /api/predict` — Executes real-time prediction pipeline for a student profile payload.

---

## 📁 Repository Structure

```text
c:\Website\
├── backend\
│   ├── main.py                     # FastAPI REST API server
│   ├── schemas.py                  # Pydantic data validation schemas
│   ├── services.py                 # ML pipeline inference service
│   └── requirements.txt            # Python dependencies
├── data\
│   └── student_depression_dataset.csv  # Raw student dataset (27,901 rows)
├── frontend\
│   ├── src\
│   │   ├── components\             # UI section components
│   │   ├── services\api.ts         # Axios API client
│   │   ├── types\index.ts          # TypeScript interfaces
│   │   ├── App.tsx                 # App layout & scroll spy
│   │   └── main.tsx                # Entry point
│   ├── package.json
│   └── vite.config.ts
├── ml_engine\
│   ├── preprocess.py               # Preprocessing utilities
│   └── train_model.py              # Model training & serialization script
├── models\
│   ├── trained_pipeline.pkl        # Serialized ML pipeline
│   ├── metrics.json                # Live evaluation metrics
│   ├── model_metadata.json         # Dataset & hyperparameter metadata
│   └── ablation_results.json       # Ablation metrics
└── README.md
```
