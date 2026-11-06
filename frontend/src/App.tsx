import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DatasetExplorer } from './components/DatasetExplorer';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { FeatureEngineering } from './components/FeatureEngineering';
import { ModelLaboratory } from './components/ModelLaboratory';
import { EvaluationMatrix } from './components/EvaluationMatrix';
import { AblationSection } from './components/AblationSection';
import { ExplainabilityLab } from './components/ExplainabilityLab';
import { PredictionConsole } from './components/PredictionConsole';
import { ResourceAnalysis } from './components/ResourceAnalysis';
import { SystemArchitecture } from './components/SystemArchitecture';
import { Footer } from './components/Footer';

import { api } from './services/api';
import { DatasetInfo, ModelMetric, ModelMetadata, AblationItem, ExplainabilityData } from './types';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [metrics, setMetrics] = useState<Record<string, ModelMetric> | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [ablationData, setAblationData] = useState<AblationItem[] | null>(null);
  const [explainabilityData, setExplainabilityData] = useState<ExplainabilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAllData() {
      try {
        const [modelsRes, dsRes, ablationRes, explainabilityRes] = await Promise.all([
          api.getModelsComparison(),
          api.getDatasetInfo(),
          api.getAblation(),
          api.getExplainability()
        ]);

        if (modelsRes) {
          setMetadata(modelsRes.metadata);
          setMetrics(modelsRes.live_models);
        }
        if (dsRes) setDatasetInfo(dsRes);
        if (ablationRes) setAblationData(ablationRes);
        if (explainabilityRes) setExplainabilityData(explainabilityRes);
      } catch (err) {
        console.error('API load warning:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
      
      {/* Top Clean Header */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="min-h-screen flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-24">
          
          {/* Section 1: Hero */}
          <Hero
            metadata={metadata}
            onRunPrediction={() => scrollToSection('predict')}
            onExploreResearch={() => scrollToSection('pipeline')}
          />

          {/* Section 2: Dataset Explorer */}
          <DatasetExplorer datasetInfo={datasetInfo} />

          {/* Section 3: Pipeline Visualizer */}
          <PipelineVisualizer />

          {/* Section 4: Feature Selection & PCA */}
          <FeatureEngineering metadata={metadata} />

          {/* Section 5: Model Comparison Laboratory */}
          <ModelLaboratory metrics={metrics} metadata={metadata} />

          {/* Section 6: Evaluation Matrix & Confusion Matrix */}
          <EvaluationMatrix metrics={metrics} metadata={metadata} />

          {/* Section 7: Ablation Study */}
          <AblationSection ablationData={ablationData} />

          {/* Section 8: Explainability XAI */}
          <ExplainabilityLab data={explainabilityData} />

          {/* Section 9: Prediction Console */}
          <PredictionConsole metadata={metadata} />

          {/* Section 10: Resource Efficiency Analysis */}
          <ResourceAnalysis metadata={metadata} metrics={metrics} />

          {/* Section 11: Architecture */}
          <SystemArchitecture />

        </div>

        {/* Footer */}
        <Footer />
      </main>

    </div>
  );
};

export default App;
