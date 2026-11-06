import React from 'react';
import { 
  ArrowRight, 
  BrainCircuit, 
  Cpu, 
  Database, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { ModelMetadata } from '../types';

interface HeroProps {
  metadata: ModelMetadata | null;
  onRunPrediction: () => void;
  onExploreResearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  metadata,
  onRunPrediction,
  onExploreResearch
}) => {
  return (
    <section id="overview" className="pt-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                CONFERENCE RESEARCH PROTOTYPE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                REAL-TIME PIPELINE
              </span>
            </div>

            {/* Paper Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                A Resource-Aware & Interpretable Learning Analytics Framework
              </h1>
              <p className="text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
                Bridging high-accuracy student prediction, low-latency computational footprint, and Explainable AI (XAI) feature interpretability for real-time educational environments.
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Dataset</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {metadata?.num_records ? `${(metadata.num_records).toLocaleString()} rows` : '-'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Student Records</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Best Model</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {metadata?.best_model || '-'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Classifier</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Live Accuracy</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {metadata?.best_accuracy ? `${(metadata.best_accuracy * 100).toFixed(1)}%` : '-'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Loaded test-set metric</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Explainability</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  Model sensitivity
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Feature Impact</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onRunPrediction}
                className="px-6 py-3 rounded-xl font-medium text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                Run Student Prediction
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreResearch}
                className="px-6 py-3 rounded-xl font-medium text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                Explore Methodology
              </button>
            </div>

          </div>

          {/* Right Column: Clean Minimal Architecture Diagram Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-mono font-medium text-slate-700 uppercase">INFERENCE PIPELINE</span>
                </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {metadata ? `${(metadata.pca_variance_ratio * 100).toFixed(0)}% PCA Retained` : 'Loading pipeline'}
                </span>
              </div>

              {/* Pipeline Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Input Feature Space</div>
                      <div className="text-[10px] font-mono text-slate-500">16 Academic & Psychosocial Features</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 font-semibold">100% Raw</span>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-3 bg-slate-200"></div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">PCA (85% Var) + SelectKBest</div>
                      <div className="text-[10px] font-mono text-slate-500">122 Encoded → 10 Features</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 font-semibold">-91.8% Dim</span>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-3 bg-slate-200"></div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white shadow-xs">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold">Stacking Ensemble Classifier</div>
                      <div className="text-[10px] font-mono text-slate-400">Logistic Reg + RF + Gradient Boost</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">&lt;1.2ms</span>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-3 bg-slate-200"></div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">SHAP Interpretability Layer</div>
                      <div className="text-[10px] font-mono text-slate-500">Top positive & negative feature impacts</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 font-semibold">Verified</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
