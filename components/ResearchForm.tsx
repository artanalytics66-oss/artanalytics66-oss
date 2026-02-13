
import React, { useState } from 'react';
import { AnalysisDepth, ResearchParameters } from '../types';

interface Props {
  onStart: (params: ResearchParameters) => void;
  isLoading: boolean;
}

const ResearchForm: React.FC<Props> = ({ onStart, isLoading }) => {
  const [params, setParams] = useState<ResearchParameters>({
    rubric: '',
    subthemes: '',
    targetAudience: '',
    depth: AnalysisDepth.BASIC,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (params.rubric.trim()) {
      onStart(params);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-8 glass-effect rounded-2xl shadow-xl">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 block">Рубрика исследования *</label>
        <input
          required
          type="text"
          placeholder="Например: Психология отношений или Рынок электромобилей"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          value={params.rubric}
          onChange={(e) => setParams({ ...params, rubric: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 block">Подтемы (необязательно)</label>
        <textarea
          rows={2}
          placeholder="Перечислите через запятую..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          value={params.subthemes}
          onChange={(e) => setParams({ ...params, subthemes: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 block">Целевая аудитория (необязательно)</label>
        <input
          type="text"
          placeholder="Например: женщины 25-35 лет, живущие в мегаполисах"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          value={params.targetAudience}
          onChange={(e) => setParams({ ...params, targetAudience: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 block">Глубина анализа</label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(AnalysisDepth).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setParams({ ...params, depth: d })}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                params.depth === d
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={isLoading || !params.rubric}
        type="submit"
        className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${
          isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'gradient-bg hover:opacity-90 active:scale-[0.98]'
        }`}
      >
        {isLoading ? 'Идет сбор данных...' : 'Начать исследование'}
      </button>
    </form>
  );
};

export default ResearchForm;
