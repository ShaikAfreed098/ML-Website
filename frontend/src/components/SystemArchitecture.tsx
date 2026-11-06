import React from 'react';
import { Terminal, ArrowDown } from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  return (
    <section id="architecture" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <Terminal className="w-4 h-4" />
            <span>FULL STACK END-TO-END DATA FLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            System Architecture
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            System architecture diagram depicting the client-server data flow from React UI payload to FastAPI REST API, Scikit-Learn Pipeline, and SHAP Explainability response.
          </p>
        </div>

        {/* Diagram Flow Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col items-center space-y-6">
            
            {/* Level 1: USER UI */}
            <div className="w-full max-w-lg p-4 rounded-xl bg-slate-900 text-white text-center shadow-xs">
              <div className="text-xs font-mono font-semibold uppercase">React 18 + TypeScript + Vite UI</div>
              <div className="text-[11px] text-slate-300 mt-1">Prediction Console / Interactive Dashboard Controls</div>
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400" />

            {/* Level 2: REST API */}
            <div className="w-full max-w-lg p-4 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="text-xs font-mono font-semibold text-slate-900 uppercase">FastAPI REST Server (Uvicorn)</div>
              <div className="text-[11px] text-slate-600 mt-1">Endpoints: /api/predict, /api/dataset/info, /api/models, /api/explainability</div>
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400" />

            {/* Level 3: ML Engine */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-mono font-semibold text-slate-900 uppercase">Scikit-Learn Preprocessing</div>
                <div className="text-[11px] text-slate-600 mt-1">OneHotEncoder + StandardScaler + PCA (85%) + SelectKBest (k=10)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-mono font-semibold text-slate-900 uppercase">Stacking Ensemble Model</div>
                <div className="text-[11px] text-slate-600 mt-1">Logistic Regression + Random Forest + Gradient Boosting</div>
              </div>
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400" />

            {/* Level 4: Explainability & JSON Response */}
            <div className="w-full max-w-lg p-4 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="text-xs font-mono font-semibold text-slate-900 uppercase">SHAP & Explanation Engine</div>
              <div className="text-[11px] text-slate-600 mt-1">Returns Prediction Label, Confidence %, Inference ms, and Top SHAP Factors</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
