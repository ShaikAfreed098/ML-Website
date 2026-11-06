import React from 'react';
import { AlertTriangle, X, Sparkles, ShieldCheck } from 'lucide-react';
import { PredictionResponseData } from '../types';

interface PredictionResultModalProps {
  result: PredictionResponseData | null;
  onClose: () => void;
}

export const PredictionResultModal: React.FC<PredictionResultModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const isHighRisk = result.prediction === 1;
  const confidencePercent = (result.confidence * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Result Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${isHighRisk ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
            {isHighRisk ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
              REAL-TIME INFERENCE RESULT
            </span>
            <h3 className="text-xl font-bold text-slate-900">{result.prediction_label}</h3>
          </div>
        </div>

        {/* Confidence Ring & Key Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-mono text-slate-500">CONFIDENCE</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${isHighRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
              {confidencePercent}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Model Probability</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-mono text-slate-500">INFERENCE TIME</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {result.inference_time_ms} ms
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Measured per request</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-mono text-slate-500">MODEL USED</div>
            <div className="text-sm font-bold text-slate-900 mt-2 truncate">
              {result.model_used}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Loaded model artifact</div>
          </div>
        </div>

        {/* Model-Derived Feature Sensitivity */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-slate-700" />
            Why Did The Model Make This Prediction?
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {result.explanations.map((exp, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs ${
                  exp.impact > 0 
                    ? 'bg-rose-50 border-rose-200 text-rose-900' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900">{exp.feature}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{exp.description}</div>
                </div>
                <span className={`font-mono font-bold text-xs ${exp.impact > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {exp.impact > 0 ? `+${exp.impact.toFixed(2)}` : exp.impact.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            Close Result
          </button>
        </div>

      </div>
    </div>
  );
};
