
import React, { useState } from 'react';
import { ResearchParameters, ResearchResult } from './types';
import { performResearch } from './geminiService';
import ResearchForm from './components/ResearchForm';
import LoadingScreen from './components/LoadingScreen';
import ResultsView from './components/ResultsView';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [currentRubric, setCurrentRubric] = useState<string>('');

  const handleStartResearch = async (params: ResearchParameters) => {
    setIsLoading(true);
    setError(null);
    setCurrentRubric(params.rubric);
    try {
      const data = await performResearch(params);
      setResult(data);
    } catch (err) {
      setError('Не удалось провести исследование. Пожалуйста, попробуйте позже.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCurrentRubric('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none uppercase italic">PainResearch.AI</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Runet Analytical System</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Powered by Gemini 3 Pro</span>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-700 uppercase">Live Data Feed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!result && !isLoading && (
        <section className="pt-20 pb-12 text-center px-4 animate-fadeIn">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase leading-none">
            Найди настоящие <span className="text-indigo-600">боли</span> <br />своего рынка
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium">
            Аналитическая система на базе ИИ, исследующая реальные паттерны поведения пользователей в рунете через Яндекс, VC, Хабр и форумы.
          </p>
        </section>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!isLoading && !result ? (
          <ResearchForm onStart={handleStartResearch} isLoading={isLoading} />
        ) : isLoading ? (
          <LoadingScreen />
        ) : (
          result && <ResultsView result={result} rubric={currentRubric} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-500">
            &copy; 2024 PainResearch.AI — Система аналитики рунета
          </div>
          <div className="flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Yandex.Wordstat Grounding</span>
            <span>Social Sentiment Analysis</span>
            <span>VC/Habr Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
