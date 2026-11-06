import React from 'react';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ExplainabilityData } from '../types';

interface ExplainabilityLabProps { data: ExplainabilityData | null; }

export const ExplainabilityLab: React.FC<ExplainabilityLabProps> = ({ data }) => {
  const globalImportance = data?.global_importance || [];

  return (
    <section id="explainability" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>EXPLAINABLE AI (XAI) INTERPRETABILITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explainable AI Laboratory
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Surfacing feature contributions and local SHAP attributions so educators understand prediction factors.
          </p>
        </div>

        {/* Global SHAP Feature Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
              <span>Global SHAP Feature Attribution Weights</span>
              <span className="text-xs font-mono text-slate-500">Permutation Sensitivity</span>
            </h3>

            {globalImportance.length > 0 ? <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={globalImportance} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="feature" type="category" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }} />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {globalImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.importance > 0 ? '#EF4444' : '#10B981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div> : <div className="h-72 flex items-center justify-center text-xs text-slate-500">Feature importance data unavailable.</div>}
          </div>

          {/* Educational Insights Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-700" />
                Interpretable Early Warning Protocol
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Unlike complex black-box neural networks, our framework provides clear, directional feature attributions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                Method
              </div>
              <p className="text-xs text-slate-600">{data?.methodology || 'Waiting for model sensitivity results.'}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
