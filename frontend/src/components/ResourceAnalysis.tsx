import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { ModelMetadata, ModelMetric } from '../types';

interface ResourceAnalysisProps {
  metadata: ModelMetadata | null;
  metrics: Record<string, ModelMetric> | null;
}

export const ResourceAnalysis: React.FC<ResourceAnalysisProps> = ({ metadata, metrics }) => {
  const bestName = metadata?.best_model || 'Stacking Classifier';
  const bestM = metrics?.[bestName];

  return (
    <section id="resources" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <Cpu className="w-4 h-4" />
            <span>COMPUTATIONAL FOOTPRINT & RESOURCE-AWARENESS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Resource Efficiency Analysis
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Evaluating the trade-off between predictive accuracy and real-time computational footprint.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">INFERENCE LATENCY</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {bestM ? `${bestM.inference_time_ms.toFixed(2)}ms` : '-'}
            </div>
            <div className="text-[10px] text-emerald-600 font-mono mt-1">Sub-Millisecond Response</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">MODEL PARAMETERS</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {bestM ? bestM.param_count : '-'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Hyperparameter Proxies</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">PIPELINE SIZE ON DISK</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              -
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Serialized Joblib Asset</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">MEMORY FOOTPRINT</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              -
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">RAM Peak Inference</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-700" />
            <span>Accuracy vs. Efficiency Trade-off Rationale</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Measurements shown above are loaded from the trained artifact and live inference metrics. Deployment resource measurements are intentionally omitted until collected in the production environment.
          </p>
        </div>

      </div>
    </section>
  );
};
