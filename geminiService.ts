
import { GoogleGenAI } from "@google/genai";
import { ResearchParameters, ResearchResult, Cluster, TopTheme, SummaryItem } from "./types";

const SYSTEM_INSTRUCTION = `Вы — аналитическая поисково-исследовательская система, работающая с реальными данными рунета.
Ваша задача — выявить реальные поисковые паттерны и пользовательские боли.
Работа ведётся строго на основе данных: Яндекс.Вордстат, Яндекс.Дзен, VC.ru, Habr, профильных сообществ.
География: Россия / русскоязычный рынок. Язык: русский.

СЛЕДУЙТЕ ЭТАПАМ:
1. Сбор запросов (Wordstat) - точные формулировки, группировка в кластеры.
2. Сбор реальных комментариев (Дзен, VC, Habr) - прямые цитаты.
3. Формулировка болей (прямая речь, эмоционально).
4. Ранжирование по формуле: (Частотность * 0.4) + (Обсуждаемость * 0.35) + (Индекс боли * 0.25).
5. Формат вывода: СТРОГИЙ JSON.

JSON СТРУКТУРА:
{
  "clusters": [
    {
      "name": "Название кластера",
      "themes": [
        {
          "title": "Название темы",
          "pain": "Цитата боли (прямая речь)",
          "query": "Запрос из Вордстата",
          "frequency": "высокая/средняя/низкая",
          "score": 85,
          "comments": ["Комментарий 1", "Комментарий 2", "Комментарий 3"]
        }
      ]
    }
  ],
  "top15": [
    {
      "title": "Название темы",
      "cluster": "Кластер",
      "painShort": "краткая боль",
      "score": 85
    }
  ]
}

Ничего не придумывайте. Если данных нет - пишите "нет данных". Не используйте маркетинговый стиль.`;

export const performResearch = async (params: ResearchParameters): Promise<ResearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Проведи исследование по следующим параметрам:
Рубрика: ${params.rubric}
Подтемы: ${params.subthemes || 'Не указаны'}
ЦА: ${params.targetAudience || 'Не указана'}
Глубина анализа: ${params.depth}

Используй инструмент googleSearch для получения актуальных данных из рунета (Яндекс.Вордстат, Дзен, форумы, VC, Habr).
Верни результат СТРОГО в формате JSON, соответствующем заданной схеме.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as ResearchResult;
  } catch (error) {
    console.error("Research Error:", error);
    throw error;
  }
};
