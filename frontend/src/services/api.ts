import axios from 'axios';
import {
  DatasetInfo,
  ModelMetric,
  ModelMetadata,
  PredictionRequestData,
  PredictionResponseData,
  AblationItem,
  ExplainabilityData
} from '../types';

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

export const api = {
  async getHealth() {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },

  async getDatasetInfo(): Promise<DatasetInfo> {
    const res = await axios.get(`${API_BASE}/dataset/info`);
    return res.data;
  },

  async getModelsComparison(): Promise<{
    live_models: Record<string, ModelMetric>;
    metadata: ModelMetadata;
    paper_results?: { accuracy: number; f1: number; label: string };
  }> {
    const res = await axios.get(`${API_BASE}/models`);
    return res.data;
  },

  async getMetrics(): Promise<Record<string, ModelMetric>> {
    const res = await axios.get(`${API_BASE}/metrics`);
    return res.data;
  },

  async getFeatures() {
    const res = await axios.get(`${API_BASE}/features`);
    return res.data;
  },

  async getAblation(): Promise<AblationItem[]> {
    const res = await axios.get(`${API_BASE}/ablation`);
    return res.data;
  },

  async getExplainability(): Promise<ExplainabilityData> {
    const res = await axios.get(`${API_BASE}/explainability`);
    return res.data;
  },

  async predictStudent(data: PredictionRequestData): Promise<PredictionResponseData> {
    const res = await axios.post(`${API_BASE}/predict`, data);
    return res.data;
  }
};
