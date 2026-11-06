import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { BrainCircuit, Award } from 'lucide-react';
import { ModelMetric, ModelMetadata } from '../types';

interface ModelLaboratoryProps {
  metrics: Record<string, ModelMetric> | null;
  metadata: ModelMetadata | null;
}

export const ModelLaboratory: React.FC<ModelLaboratoryProps> = ({ metrics, metadata }) => {
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'f1' | 'precision' | 'recall'>('f1');

  const modelList = metrics ? Object.keys(metrics) : [];

  const chartData = modelList.map((name) => {
    const m = metrics?.[name];
    return {
      name,
      accuracy: Number(((m?.accuracy || 0) * 100).toFixed(2)),
      f1: Number(((m?.f1 || 0) * 100).toFixed(2)),
      precision: Number(((m?.precision || 0) * 100).toFixed(2)),
      recall: Number(((m?.recall || 0) * 100).toFixed(2)),
      latency: m?.inference_time_ms || 0
    };
  });

  const bestModelName = metadata?.best_model || '';

  return (
    <section id="models" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>ENSEMBLE BENCHMARK LABORATORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Model Performance Laboratory
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Comparative analysis of machine learning architectures evaluated on identical train/val/test splits.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(['f1', 'accuracy', 'precision', 'recall'] as const).map((metricKey) => (
              <button
                key={metricKey}
                onClick={() => setSelectedMetric(metricKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  selectedMetric === metricKey
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {metricKey}
              </button>
            ))}
          </div>
        </div>

        {modelList.length > 0 ? <>
        {/* Chart View */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
            <span>Model Comparison ({selectedMetric.toUpperCase()} Score %)</span>
            <span className="text-xs font-mono text-emerald-600">Best Model: {bestModelName || 'Loading...'}</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[75, 100]} stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }} />
                <Bar dataKey={selectedMetric} radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === bestModelName ? '#059669' : '#475569'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Comprehensive Model Metrics Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Model Architecture</th>
                  <th className="px-4 py-3">Test Acc</th>
                  <th className="px-4 py-3">Precision</th>
                  <th className="px-4 py-3">Recall</th>
                  <th className="px-4 py-3">F1-Score</th>
                  <th className="px-4 py-3">Val Acc</th>
                  <th className="px-4 py-3">Inference (ms)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {modelList.map((name) => {
                  const m = metrics?.[name];
                  const isBest = name === bestModelName;
                  return (
                    <tr key={name} className={`hover:bg-slate-50 ${isBest ? 'bg-emerald-50/50' : ''}`}>
                      <td className="px-4 py-3 text-slate-900 font-semibold flex items-center gap-2">
                        {isBest && <Award className="w-4 h-4 text-emerald-600" />}
                        <span>{name}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {m ? (m.accuracy * 100).toFixed(2) + '%' : '—'}
                      </td>
                      <td className="px-4 py-3">{m ? (m.precision * 100).toFixed(2) + '%' : '—'}</td>
                      <td className="px-4 py-3">{m ? (m.recall * 100).toFixed(2) + '%' : '—'}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        {m ? (m.f1 * 100).toFixed(2) + '%' : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {m ? (m.val_accuracy * 100).toFixed(2) + '%' : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {m ? m.inference_time_ms.toFixed(2) + 'ms' : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {isBest ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                            BEST MODEL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                            Evaluated
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </> : <div className="p-8 text-center text-xs text-slate-500">Model evaluation data unavailable.</div>}

      </div>
    </section>
  );
};
