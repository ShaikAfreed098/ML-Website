export interface PredictionRequestData {
  Gender: string;
  Age: number;
  City: string;
  Profession: string;
  "Academic Pressure": number;
  "Work Pressure": number;
  CGPA: number;
  "Study Satisfaction": number;
  "Job Satisfaction": number;
  "Sleep Duration": string;
  "Dietary Habits": string;
  Degree: string;
  "Have you ever had suicidal thoughts ?": string;
  "Work/Study Hours": number;
  "Financial Stress": number;
  "Family History of Mental Illness": string;
}

export interface FeatureContribution {
  feature: string;
  impact: number;
  description: string;
}

export interface PredictionResponseData {
  prediction: number;
  prediction_label: string;
  confidence: number;
  probabilities: Record<string, number>;
  model_used: string;
  inference_time_ms: number;
  explanations: FeatureContribution[];
}

export interface ModelMetric {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  val_accuracy: number;
  train_accuracy: number;
  confusion_matrix: number[][];
  classification_report: Record<string, any>;
  train_time_sec: number;
  inference_time_ms: number;
  param_count: number;
}

export interface ModelMetadata {
  dataset_name: string;
  num_records: number;
  num_features_raw: number;
  num_features_encoded: number;
  pca_variance_ratio: number;
  pca_components: number;
  selected_k_features: number;
  target_variable: string;
  target_distribution: Record<string, number>;
  train_split: number;
  val_split: number;
  test_split: number;
  best_model: string;
  best_accuracy: number;
  best_f1: number;
  version: string;
  categorical_fields: Record<string, string[]>;
  numerical_fields: Record<string, { min: number; max: number; mean: number; default: number }>;
}

export interface DatasetInfo {
  total_rows: number;
  total_columns: number;
  target_column: string;
  target_distribution: Record<string, number>;
  numerical_features: string[];
  categorical_features: string[];
  missing_values: Record<string, number>;
  distributions: {
    academic_pressure: Record<string, number>;
    sleep_duration: Record<string, number>;
  };
  sample_records: Record<string, any>[];
}

export interface ExplainabilityData {
  methodology: string;
  global_importance: { feature: string; importance: number }[];
}

export interface AblationItem {
  configuration: string;
  accuracy: number;
  f1: number;
  params: number;
  description: string;
}
