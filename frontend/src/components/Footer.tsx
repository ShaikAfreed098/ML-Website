import React from 'react';
import { BrainCircuit, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-slate-200 mt-16 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                Resource-Aware & Interpretable Learning Analytics Platform
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Conference Research Prototype • Version 1.0.0
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Reproducible
            </span>
            <span>•</span>
            <span>FastAPI + Scikit-Learn + React</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono">
          <p>© 2026 Academic Research Prototype. Developed for Conference Demonstration.</p>
          <p>Dataset: student_depression_dataset.csv (27,901 records)</p>
        </div>
      </div>
    </footer>
  );
};
