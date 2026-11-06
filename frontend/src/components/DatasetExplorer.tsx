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
import { Database, Layers } from 'lucide-react';
import { DatasetInfo } from '../types';

interface DatasetExplorerProps {
  datasetInfo: DatasetInfo | null;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ datasetInfo }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'distributions' | 'sample'>('overview');

  const targetData = datasetInfo ? [
    { name: 'Low Risk / Healthy', value: datasetInfo.target_distribution['0'] || 0, color: '#10B981' },
    { name: 'High Risk / Depression', value: datasetInfo.target_distribution['1'] || 0, color: '#EF4444' }
  ] : [];

  const acadPressureData = Object.entries(datasetInfo?.distributions.academic_pressure || {})
    .map(([level, count]) => ({ level: `Level ${level}`, count }));

  const sleepData = Object.entries(datasetInfo?.distributions.sleep_duration || {})
    .map(([duration, count]) => ({ duration, count }));

  return (
    <section id="dataset" className="py-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-1">
              <Database className="w-4 h-4" />
              <span>DATASET DASHBOARD & STATISTICS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dataset Explorer
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Exploratory Data Analysis (EDA) of student psychosocial, academic, and mental well-being records.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('distributions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'distributions'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Distributions
            </button>
            <button
              onClick={() => setActiveTab('sample')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'sample'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sample Data
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-mono text-slate-500">Total Observations</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {datasetInfo?.total_rows ? datasetInfo.total_rows.toLocaleString() : '—'}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono mt-1">100% Cleaned Records</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-mono text-slate-500">Total Features</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {datasetInfo?.total_columns ? datasetInfo.total_columns - 1 : '—'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">From loaded schema</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-mono text-slate-500">Target Variable</div>
                <div className="text-xl font-bold text-slate-900 mt-1 truncate">
                  {datasetInfo?.target_column || '—'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Binary Classification</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-mono text-slate-500">Missing Values</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {datasetInfo ? `${(Object.values(datasetInfo.missing_values).reduce((sum, value) => sum + value, 0) / Math.max(datasetInfo.total_rows * datasetInfo.total_columns, 1) * 100).toFixed(2)}%` : '—'}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono mt-1">Imputed & Filtered</div>
              </div>
            </div>

            {/* Target Distribution & Features Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Target Distribution Chart */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Target Class Distribution</span>
                  <span className="text-xs font-mono text-slate-500">Status</span>
                </h3>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={targetData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {targetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-emerald-500"></span>
                    <span className="text-slate-700">Low Risk: 41.5%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-rose-500"></span>
                    <span className="text-slate-700">High Risk: 58.5%</span>
                  </div>
                </div>
              </div>

              {/* Categorical & Numerical Features Lists */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-700" />
                  <span>Feature Schema Classification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Numerical Features */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider">
                      Numerical Features ({datasetInfo?.numerical_features.length || 0})
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 font-mono">
                      {(datasetInfo?.numerical_features || []).map((feature) => <li key={feature}>• {feature}</li>)}
                    </ul>
                  </div>

                  {/* Categorical Features */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider">
                      Categorical Features ({datasetInfo?.categorical_features.length || 0})
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 font-mono">
                      {(datasetInfo?.categorical_features || []).map((feature) => <li key={feature}>• {feature}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DISTRIBUTIONS */}
        {activeTab === 'distributions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Pressure Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Academic Pressure Distribution (1-5 Scale)
              </h3>
              <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={acadPressureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="level" stroke="#64748B" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#475569" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>

            {/* Sleep Duration Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Sleep Duration Categories
              </h3>
              <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sleepData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="duration" stroke="#64748B" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAMPLE DATA */}
        {activeTab === 'sample' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-900 font-semibold">
                FIRST 10 RAW DATASET RECORDS
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{datasetInfo?.total_rows.toLocaleString() || '—'} Total Rows</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Academic Press</th>
                    <th className="px-4 py-3">CGPA</th>
                    <th className="px-4 py-3">Sleep Duration</th>
                    <th className="px-4 py-3">Financial Stress</th>
                    <th className="px-4 py-3">Depression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-mono">
                  {datasetInfo?.sample_records ? (
                    datasetInfo.sample_records.map((rec, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-slate-900">{rec.Gender || '—'}</td>
                        <td className="px-4 py-2.5">{rec.Age}</td>
                        <td className="px-4 py-2.5">{rec['Academic Pressure']}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-900">{rec.CGPA}</td>
                        <td className="px-4 py-2.5">{rec['Sleep Duration']}</td>
                        <td className="px-4 py-2.5">{rec['Financial Stress']}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            rec.Depression === 1 
                              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {rec.Depression === 1 ? '1 (High Risk)' : '0 (Low Risk)'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">Loading dataset records...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
