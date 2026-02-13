
import React, { useState } from 'react';
import { ResearchResult, Cluster, SummaryItem } from '../types';
import { exportToWord } from '../utils/wordExport';

interface Props {
  result: ResearchResult;
  rubric: string;
  onReset: () => void;
}

const ResultsView: React.FC<Props> = ({ result, rubric, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToWord(result, rubric);
    } catch (err) {
      console.error("Export failed", err);
      alert("Не удалось создать Word файл. Попробуйте еще раз.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Результаты исследования</h2>
          <p className="text-sm text-gray-500 font-medium">Рубрика: {rubric}</p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={isExporting}
            onClick={handleExport}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              isExporting 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isExporting ? 'Создание...' : 'Скачать в Word'}
          </button>
          <button 
            onClick={onReset}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
          >
            Новый поиск
          </button>
        </div>
      </div>

      {/* Summary Table */}
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 px-6 py-4">
          <h3 className="text-white font-bold text-lg uppercase">ОБЩИЙ ИТОГ: ТОП-15 САМЫХ ВОСТРЕБОВАННЫХ ТЕМ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Тема</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Кластер</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Боль</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Балл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.top15.map((item, idx) => (
                <tr key={idx} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.cluster}</td>
                  <td className="px-6 py-4 text-sm italic text-gray-600">"{item.painShort}"</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.score > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Clusters */}
      <div className="space-y-8">
        {result.clusters.map((cluster, cIdx) => (
          <div key={cIdx} className="space-y-6">
            <h3 className="text-2xl font-black text-gray-900 border-l-8 border-indigo-600 pl-4 uppercase tracking-tighter">
              Кластер: {cluster.name}
            </h3>
            <div className="grid grid-cols-1 gap-8">
              {cluster.themes.map((theme, tIdx) => (
                <div key={tIdx} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-gray-900">{tIdx + 1}. {theme.title}</h4>
                        <div className="text-right">
                          <div className="text-xs font-bold text-gray-400 uppercase">Итоговый балл</div>
                          <div className="text-3xl font-black text-indigo-600">{theme.score}</div>
                        </div>
                      </div>

                      <div className="bg-rose-50 p-4 rounded-xl border-l-4 border-rose-500">
                        <div className="text-xs font-bold text-rose-600 uppercase mb-1">Боль аудитории:</div>
                        <p className="text-lg italic font-medium text-gray-800 leading-relaxed">
                          «{theme.pain}»
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Запрос (Wordstat)</div>
                          <div className="text-sm font-mono font-medium text-gray-700">«{theme.query}»</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Частотность</div>
                          <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">{theme.frequency}</div>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                        Голоса из Рунета (Цитаты)
                      </div>
                      <div className="space-y-4">
                        {theme.comments.map((comment, comIdx) => (
                          <div key={comIdx} className="text-sm text-gray-600 leading-snug relative pl-4 border-l-2 border-gray-200">
                            «{comment}»
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView;
