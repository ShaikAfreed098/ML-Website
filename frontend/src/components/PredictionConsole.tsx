import React, { useEffect, useState } from 'react';
import { Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { PredictionRequestData, PredictionResponseData, ModelMetadata } from '../types';
import { PredictionResultModal } from './PredictionResultModal';

interface PredictionConsoleProps {
  metadata: ModelMetadata | null;
}

export const PredictionConsole: React.FC<PredictionConsoleProps> = ({ metadata }) => {
  const [formData, setFormData] = useState<PredictionRequestData>({
    Gender: '', Age: 0, City: '', Profession: '', 'Academic Pressure': 0,
    'Work Pressure': 0, CGPA: 0, 'Study Satisfaction': 0, 'Job Satisfaction': 0,
    'Sleep Duration': '', 'Dietary Habits': '', Degree: '',
    'Have you ever had suicidal thoughts ?': '', 'Work/Study Hours': 0,
    'Financial Stress': 0, 'Family History of Mental Illness': ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponseData | null>(null);

  useEffect(() => {
    if (!metadata) return;
    const category = (field: string) => metadata.categorical_fields[field]?.[0] || '';
    const number = (field: string) => metadata.numerical_fields[field]?.default || 0;
    setFormData({
      Gender: category('Gender'), Age: number('Age'), City: category('City'), Profession: category('Profession'),
      'Academic Pressure': number('Academic Pressure'), 'Work Pressure': number('Work Pressure'),
      CGPA: number('CGPA'), 'Study Satisfaction': number('Study Satisfaction'), 'Job Satisfaction': number('Job Satisfaction'),
      'Sleep Duration': category('Sleep Duration'), 'Dietary Habits': category('Dietary Habits'), Degree: category('Degree'),
      'Have you ever had suicidal thoughts ?': category('Have you ever had suicidal thoughts ?'),
      'Work/Study Hours': number('Work/Study Hours'), 'Financial Stress': number('Financial Stress'),
      'Family History of Mental Illness': category('Family History of Mental Illness')
    });
  }, [metadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.predictStudent(formData);
      setResult(res);
    } catch (err: any) {
      console.error('Prediction API Error:', err);
      setError(err.response?.data?.detail || 'Failed to generate real-time student prediction. Ensure backend API is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="predict" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
            <Zap className="w-4 h-4" />
            <span>REAL-TIME INFERENCE CONSOLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Student Performance & Risk Console
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Input student attributes to execute real-time model inference through the preprocessor and Stacking Classifier.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid 1: Demographics & Academic Indicators */}
            <div>
              <h3 className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
                1. Demographics & Academic Attributes
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.Gender}
                    onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Age: {formData.Age} years</label>
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={formData.Age}
                    onChange={(e) => setFormData({ ...formData, Age: Number(e.target.value) })}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CGPA: {formData.CGPA}</label>
                  <input
                    type="range"
                    min={0.0}
                    max={10.0}
                    step={0.1}
                    value={formData.CGPA}
                    onChange={(e) => setFormData({ ...formData, CGPA: Number(e.target.value) })}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* Degree */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Degree Program</label>
                  <select
                    value={formData.Degree}
                    onChange={(e) => setFormData({ ...formData, Degree: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="BSc">BSc</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Com">B.Com</option>
                    <option value="BA">BA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid 2: Stress & Psychosocial Factors */}
            <div>
              <h3 className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
                2. Psychological & Stress Indicators
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Academic Pressure */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Academic Pressure: {formData['Academic Pressure']}/5.0
                  </label>
                  <input
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={1.0}
                    value={formData['Academic Pressure']}
                    onChange={(e) => setFormData({ ...formData, 'Academic Pressure': Number(e.target.value) })}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* Financial Stress */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Financial Stress: {formData['Financial Stress']}/5.0
                  </label>
                  <input
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={1.0}
                    value={formData['Financial Stress']}
                    onChange={(e) => setFormData({ ...formData, 'Financial Stress': Number(e.target.value) })}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* Sleep Duration */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Sleep Duration</label>
                  <select
                    value={formData['Sleep Duration']}
                    onChange={(e) => setFormData({ ...formData, 'Sleep Duration': e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                  >
                    <option value="Less than 5 hours">Less than 5 hours</option>
                    <option value="5-6 hours">5-6 hours</option>
                    <option value="7-8 hours">7-8 hours</option>
                    <option value="More than 8 hours">More than 8 hours</option>
                  </select>
                </div>

                {/* Suicidal Thoughts */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Suicidal Ideation History</label>
                  <select
                    value={formData['Have you ever had suicidal thoughts ?']}
                    onChange={(e) => setFormData({ ...formData, 'Have you ever had suicidal thoughts ?': e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Student Profile...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Analyze Student Profile</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Prediction Result Modal */}
        <PredictionResultModal result={result} onClose={() => setResult(null)} />

      </div>
    </section>
  );
};
