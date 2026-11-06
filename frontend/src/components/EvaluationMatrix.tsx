import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ModelMetric, ModelMetadata } from '../types';

interface EvaluationMatrixProps {
  metrics: Record<string, ModelMetric> | null;
  metadata: ModelMetadata | null;
}

export const EvaluationMatrix: React.FC<EvaluationMatrixProps> = ({ metrics, metadata }) => {
  const bestName = metadata?.best_model || '';
  const liveMetric = metrics?.[bestName];

  // Confusion matrix layout: [[TN, FP], [FN, TP]]
  const cmActive = liveMetric?.confusion_matrix || [];

  const tn = cmActive[0]?.[0] || 0;
  const fp = cmActive[0]?.[1] || 0;
  const fn = cmActive[1]?.[0] || 0;
  const tp = cmActive[1]?.[1] || 0;

  const total = tn + fp + fn + tp;
  const accuracy = total > 0 ? ((tp + tn) / total * 100).toFixed(2) : '-';

  return (
    <section id="evaluation" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>EVALUATION & CONFUSION MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Model Evaluation & Confusion Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Inspect test-set confusion matrix breakdown and precision-recall trade-offs for the best model.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Confusion Matrix Visual Card */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center justify-between">
              <span>Confusion Matrix (LIVE MODEL)</span>
              <span className="text-xs font-mono text-slate-500">Total Samples: {total.toLocaleString()}</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              {/* Header Empty */}
              <div></div>
              <div className="py-2 text-slate-500 font-semibold">Predicted Low Risk (0)</div>
              <div className="py-2 text-slate-500 font-semibold">Predicted High Risk (1)</div>

              {/* Row 1: Actual Low Risk */}
              <div className="flex items-center justify-center font-semibold text-slate-500 pr-2 text-right">
                Actual Low Risk (0)
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-lg font-bold text-emerald-800">{tn.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-700">True Negative</div>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-lg font-bold text-rose-800">{fp.toLocaleString()}</div>
                <div className="text-[10px] text-rose-700">False Positive</div>
              </div>

              {/* Row 2: Actual High Risk */}
              <div className="flex items-center justify-center font-semibold text-slate-500 pr-2 text-right">
                Actual High Risk (1)
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-lg font-bold text-rose-800">{fn.toLocaleString()}</div>
                <div className="text-[10px] text-rose-700">False Negative</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-lg font-bold text-emerald-800">{tp.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-700">True Positive</div>
              </div>
            </div>
          </div>

          {/* Classification Metrics Summary */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                <span>Classification Report Metrics</span>
                <span className="text-xs font-mono text-emerald-600">Accuracy: {accuracy}%</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500">ACCURACY</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{accuracy}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500">PRECISION</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {(tp / (tp + fp || 1) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500">RECALL</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {(tp / (tp + fn || 1) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500">F1 SCORE</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {(2 * tp / (2 * tp + fp + fn || 1) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-mono text-[10px] text-slate-900 uppercase font-semibold">
                  EVALUATION INTERPRETATION
                </div>
                <p>
                  High recall indicates the model minimizes missed high-risk students, ensuring sensitive early-warning capability.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
