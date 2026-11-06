import React from 'react';
import { Layers, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AblationItem } from '../types';

interface AblationSectionProps {
  ablationData: AblationItem[] | null;
}

export const AblationSection: React.FC<AblationSectionProps> = ({ ablationData }) => {
  const items = ablationData || [];

  const chartData = items.map(item => ({
    name: item.configuration,
    accuracy: Number((item.accuracy * 100).toFixed(2)),
    f1: Number((item.f1 * 100).toFixed(2))
  }));

  return (
    <section id="ablation" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <Layers className="w-4 h-4" />
            <span>COMPONENT CONTRIBUTION STUDY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ablation Experiment Analysis
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Proving causation: evaluating framework performance degradation when removing PCA dimensionality reduction and SelectKBest feature selection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Performance Degradation Chart */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
              <span>Ablation Study (Accuracy & F1 %)</span>
              <span className="text-xs font-mono text-slate-500">4 Configurations</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis domain={[75, 90]} stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }} />
                  <Bar dataKey="f1" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ablation Cards Breakdown */}
          <div className="lg:col-span-6 space-y-3">
            {items.map((item, idx) => (
              <div 
                key={item.configuration}
                className={`p-4 rounded-xl border transition-all ${
                  idx === 0
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {idx === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-600" />
                    )}
                    <span className="text-xs font-bold text-slate-900">{item.configuration}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-500">Acc: {(item.accuracy * 100).toFixed(2)}%</span>
                    <span className={`font-bold ${idx === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      F1: {(item.f1 * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-normal mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
