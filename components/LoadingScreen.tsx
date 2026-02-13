
import React, { useState, useEffect } from 'react';

const messages = [
  "Подключаемся к Яндекс.Вордстат...",
  "Анализируем частотность запросов в рунете...",
  "Ищем статьи на VC.ru и Habr по вашей теме...",
  "Парсим комментарии в Яндекс.Дзен...",
  "Выявляем эмоциональные паттерны и боли...",
  "Рассчитываем интегральный приоритет тем...",
  "Группируем результаты в кластеры...",
  "Почти готово, структурируем данные...",
  "Завершаем глубокий анализ болей..."
];

const LoadingScreen: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full animate-pulse flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900 animate-pulse">
          {messages[currentMessage]}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Это может занять до 1-2 минут, так как мы проводим глубокое исследование реальных публикаций и обсуждений.
        </p>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full bg-indigo-600 animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }}></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
