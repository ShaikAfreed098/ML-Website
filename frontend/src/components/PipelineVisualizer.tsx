import React, { useState } from 'react';
import { 
  BrainCircuit, 
  ChevronRight, 
  Cpu, 
  Database, 
  Filter, 
  GitBranch, 
  Layers, 
  Sliders, 
  Sparkles, 
  Split, 
  Zap 
} from 'lucide-react';

interface StageDetail {
  id: number;
  name: string;
  shortName: string;
  icon: any;
  inputDim: string;
  outputDim: string;
  params: string;
  description: string;
  paperReference: string;
}

export const PipelineVisualizer: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(5);

  const stages: StageDetail[] = [
    {
      id: 1,
      name: 'Raw Educational Dataset',
      shortName: 'Raw Data',
      icon: Database,
      inputDim: '27,901 rows x 18 cols',
      outputDim: '27,901 rows x 18 cols',
      params: 'student_depression_dataset.csv',
      description: 'Ingestion of raw student demographic, academic pressure, CGPA, and psychosocial health records.',
      paperReference: 'Educational Data Mining Standard (Section III-A)'
    },
    {
      id: 2,
      name: 'Data Cleaning & Imputation',
      shortName: 'Data Cleaning',
      icon: Filter,
      inputDim: '27,901 rows x 18 cols',
      outputDim: '27,901 rows x 17 cols',
      params: 'Drop ID, Impute NaN, Remove Invalid Target Rows',
      description: 'Filters uninformative primary key IDs and ensures strict non-null integrity across binary targets.',
      paperReference: 'Data Quality Protocol (Section III-B)'
    },
    {
      id: 3,
      name: 'Encoding & Categorical Mapping',
      shortName: 'One-Hot Encoding',
      icon: Layers,
      inputDim: '17 columns (9 Categorical)',
      outputDim: '122 Encoded Columns',
      params: 'OneHotEncoder(handle_unknown="ignore", sparse=False)',
      description: 'Transforms textual categorical variables (Degree, City, Sleep Duration) into one-hot binary matrices.',
      paperReference: 'Data Transformation (Section III-B)'
    },
    {
      id: 4,
      name: 'Normalization & Standard Scaling',
      shortName: 'StandardScaler',
      icon: Sliders,
      inputDim: '122 Encoded Features',
      outputDim: '122 Scaled Features (μ=0, σ=1)',
      params: 'StandardScaler() on continuous numeric columns',
      description: 'Standardizes numerical features (Age, Academic Pressure, CGPA, Work Hours) to zero mean and unit variance.',
      paperReference: 'Feature Normalization (Section III-B)'
    },
    {
      id: 5,
      name: 'PCA (85% Explained Variance Retention)',
      shortName: 'PCA (85% Var)',
      icon: Cpu,
      inputDim: '122 Scaled Features',
      outputDim: '20 Principal Components',
      params: 'PCA(n_components=0.85, random_state=42)',
      description: 'Orthogonal linear transformation that reduces feature dimensionality while preserving 85% total cumulative variance.',
      paperReference: 'Dimensionality Reduction (Section III-C & Fig 1)'
    },
    {
      id: 6,
      name: 'SelectKBest Feature Selection',
      shortName: 'SelectKBest',
      icon: GitBranch,
      inputDim: '20 PCA Components',
      outputDim: '10 Selected Features (k=10)',
      params: 'SelectKBest(score_func=f_classif, k=10)',
      description: 'ANOVA F-value univariate feature selection filtering top k principal components for optimal resource efficiency.',
      paperReference: 'Feature Selection Module (Section III-C)'
    },
    {
      id: 7,
      name: 'Train / Validation / Test Stratified Split',
      shortName: '70 / 15 / 15 Split',
      icon: Split,
      inputDim: '27,901 x 10 Features',
      outputDim: 'Train: 19,530 | Val: 4,185 | Test: 4,186',
      params: 'StratifiedSplit(70% Train, 15% Val, 15% Test)',
      description: 'Class-stratified split allocating data for model fitting, hyperparameter optimization, and final test evaluation.',
      paperReference: 'Table I Dataset Train-Val-Test Split'
    },
    {
      id: 8,
      name: 'Ensemble Model Training',
      shortName: 'Stacking Classifier',
      icon: BrainCircuit,
      inputDim: '19,530 Training Samples',
      outputDim: 'Trained Meta-Learner Pipeline',
      params: 'StackingClassifier(LR + RF + GB, Meta: LR, cv=3)',
      description: 'Trains lightweight base estimators and meta-learner to maximize accuracy while minimizing inference latency.',
      paperReference: 'Resource-Aware Ensemble Architecture (Section III-D)'
    },
    {
      id: 9,
      name: 'Real-Time Prediction',
      shortName: 'Prediction Engine',
      icon: Zap,
      inputDim: 'Single Student Profile Payload',
      outputDim: 'Prediction Label & Confidence Probability',
      params: 'Inference Latency < 1.5ms',
      description: 'Passes preprocessed student features through single serialized pipeline for instantaneous prediction.',
      paperReference: 'Real-Time Support Engine (Section III-F)'
    },
    {
      id: 10,
      name: 'SHAP / XAI Interpretability Layer',
      shortName: 'Explainable AI',
      icon: Sparkles,
      inputDim: 'Prediction Result + Model Weights',
      outputDim: 'Feature Contribution & Local Attribution',
      params: 'Local Feature Impact Scores (+/-)',
      description: 'Surfaces key driving factors behind each prediction to provide actionable insights for educators.',
      paperReference: 'Model Interpretability Insights (Section III-D)'
    }
  ];

  const current = stages.find(s => s.id === selectedStage) || stages[4];

  return (
    <section id="pipeline" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <GitBranch className="w-4 h-4" />
            <span>MACHINE LEARNING PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Data & Preprocessing Pipeline
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Click any stage in the pipeline to inspect exact parameters, input/output dimensions, and methodology.
          </p>
        </div>

        {/* Pipeline Stepper & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stage Buttons */}
          <div className="lg:col-span-6 space-y-2">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = stage.id === selectedStage;
              return (
                <div key={stage.id} className="relative">
                  <button
                    onClick={() => setSelectedStage(stage.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{stage.name}</div>
                        <div className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{stage.outputDim}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isSelected 
                          ? 'bg-slate-800 text-slate-200 border-slate-700' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        Stage {stage.id}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </button>

                  {idx < stages.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <div className="w-0.5 h-2 bg-slate-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Stage Inspector Card */}
          <div className="lg:col-span-6 sticky top-20">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                    <current.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      STAGE {current.id} INSPECTOR
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{current.name}</h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>

              {/* Dimension Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-500">INPUT DIMENSION</div>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">{current.inputDim}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-500">OUTPUT DIMENSION</div>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">{current.outputDim}</div>
                </div>
              </div>

              {/* Execution Rationale & Parameters */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-500">EXECUTION PARAMETERS</div>
                  <div className="p-3 rounded-lg bg-slate-50 font-mono text-xs text-slate-800 border border-slate-200">
                    {current.params}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-500">STAGE DESCRIPTION</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {current.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-500">CONFERENCE PAPER RATIONALE</div>
                  <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-mono">
                    {current.paperReference}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
