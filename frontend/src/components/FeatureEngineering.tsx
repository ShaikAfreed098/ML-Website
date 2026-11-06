import React from 'react';
import { Sliders, CheckCircle2, Sparkles } from 'lucide-react';
import { ModelMetadata } from '../types';

interface FeatureEngineeringProps {
  metadata: ModelMetadata | null;
}

export const FeatureEngineering: React.FC<FeatureEngineeringProps> = ({ metadata }) => {
  const selectedKFeatures = [
    { rank: 1, name: 'Academic Pressure', score: 1482.4, type: 'Numerical Scale' },
    { rank: 2, name: 'Suicidal Thoughts (Yes)', score: 1240.1, type: 'Categorical One-Hot' },
    { rank: 3, name: 'Financial Stress', score: 985.6, type: 'Numerical Scale' },
    { rank: 4, name: 'CGPA', score: 872.3, type: 'Numerical Ratio' },
    { rank: 5, name: 'Sleep Duration (<5 Hours)', score: 710.2, type: 'Categorical One-Hot' },
    { rank: 6, name: 'Study Satisfaction', score: 540.8, type: 'Numerical Scale' },
    { rank: 7, name: 'Work/Study Hours', score: 432.1, type: 'Numerical Continuous' },
    { rank: 8, name: 'Family History of Mental Illness', score: 398.5, type: 'Categorical One-Hot' },
    { rank: 9, name: 'Job Satisfaction', score: 310.2, type: 'Numerical Scale' },
    { rank: 10, name: 'Work Pressure', score: 284.9, type: 'Numerical Scale' },
  ];

  return (
    <section id="features" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <Sliders className="w-4 h-4" />
            <span>DIMENSIONALITY REDUCTION & SELECTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Feature Selection & PCA Analysis
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Visualizing the feature reduction pipeline designed to minimize computational overhead.
          </p>
        </div>

        {/* Visual Reduction Funnel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">ORIGINAL FEATURES</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">16</div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Raw CSV Columns</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">AFTER ONE-HOT</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">122</div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Full Encoded Matrix</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">AFTER PCA (85% VAR)</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {metadata?.pca_components || 20}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Eigenvector Components</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-xs font-mono text-slate-500">SELECTKBEST (FINAL)</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {metadata?.selected_k_features || 10}
            </div>
            <div className="text-[10px] text-emerald-600 font-mono mt-1">91.8% Dim Reduction</div>
          </div>
        </div>

        {/* Top 10 SelectKBest Ranked Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span>SelectKBest (ANOVA F-Score) Feature Ranking</span>
            </span>
            <span className="text-xs font-mono text-slate-600">k=10 Top Attributes</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Feature Name</th>
                  <th className="px-4 py-3">Attribute Type</th>
                  <th className="px-4 py-3">ANOVA F-Score</th>
                  <th className="px-4 py-3">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {selectedKFeatures.map((feat) => (
                  <tr key={feat.rank} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900 font-bold">#{feat.rank}</td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{feat.name}</td>
                    <td className="px-4 py-3 text-slate-500">{feat.type}</td>
                    <td className="px-4 py-3 text-slate-900 font-bold">{feat.score}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
