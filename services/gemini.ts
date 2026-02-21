
import { GoogleGenAI, Type } from "@google/genai";

// Inicializa o cliente da API Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper para executar chamadas de API com backoff exponencial.
 * Projetado para ser resiliente a limites de cota (429) e erros de servidor (500).
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 4, delay = 4000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorString = typeof error === 'string' ? error : JSON.stringify(error);
    const errorMsg = (error?.message || errorString || "").toUpperCase();
    
    const isRetryable = 
      errorMsg.includes('429') || 
      errorMsg.includes('500') || 
      errorMsg.includes('QUOTA') || 
      errorMsg.includes('EXHAUSTED') ||
      errorMsg.includes('RATE_LIMIT') ||
      errorMsg.includes('RESOURCE_EXHAUSTED');
    
    if (isRetryable && retries > 0) {
      console.warn(`[Gemini API] Limite de Cota detectado. Aguardando ${delay}ms para re-tentativa... (${retries} restantes)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    
    console.error("[Gemini API] Falha crítica após tentativas:", errorMsg);
    throw error;
  }
}

/**
 * Motor de busca bíblico ultra-otimizado.
 * Fix: Upgraded to 'gemini-3-pro-preview' for complex reasoning and structure accuracy.
 */
export const fetchBiblePassage = async (query: string, version: string = 'ARA') => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Consulta: "${query}". Tradução: "${version}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reference: { type: Type.STRING, description: "Referência formatada (Ex: João 3:16)" },
              book: { type: Type.STRING, description: "Nome completo do livro na Bíblia" },
              chapter: { type: Type.NUMBER, description: "Número do capítulo" },
              verses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    num: { type: Type.NUMBER },
                    text: { type: Type.STRING }
                  },
                  required: ["num", "text"]
                }
              }
            },
            required: ["reference", "book", "chapter", "verses"]
          },
          systemInstruction: `Você é um motor de busca bíblico de alta precisão.
          REGRAS:
          1. Interprete abreviações (Ex: Jo = João, Jó = Jó, 1co = 1 Coríntios).
          2. Se a consulta for um tema (Ex: 'ansiedade'), retorne os 10 versículos mais relevantes.
          3. Use estritamente a versão: ${version}.
          4. Retorne apenas o JSON. Se a referência não existir, tente encontrar a mais próxima ou retorne o livro/capítulo 1.`,
        },
      });
      
      const rawText = response.text || '';
      return JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
      throw error;
    }
  }).catch((e) => {
    console.error("Falha final na busca:", e);
    return null;
  });
};

/**
 * Fornece contexto teológico profundo.
 * Fix: Upgraded to 'gemini-3-pro-preview' for theological insight complexity.
 */
export const getBibleContext = async (book: string, chapter: number) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Forneça contexto teológico de ${book} capítulo ${chapter}.`,
        config: {
          systemInstruction: "Seja pastoral e profundo. Forneça 3 parágrafos curtos explicando o contexto histórico e espiritual.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "O insight teológico está indisponível agora.");
};

/**
 * Responde perguntas bíblicas com profundidade pastoral.
 * Fix: Upgraded to 'gemini-3-pro-preview' for advanced reasoning about scriptures.
 */
export const askBibleQuestion = async (question: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: question,
        config: {
          systemInstruction: "Responda de forma curta e pastoral com base nas Escrituras.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "O sistema está com alta demanda. Tente novamente em breve.");
};

/**
 * Resumo de pregações - Basic text task uses 'gemini-3-flash-preview'.
 */
export const summarizeSermon = async (title: string, speaker: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Resumo de: ${title} por ${speaker}`,
        config: {
          systemInstruction: "Resuma os pontos fundamentais da pregação.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "Resumo indisponível.");
};

/**
 * Geração de orações - Basic text task uses 'gemini-3-flash-preview'.
 */
export const generatePrayer = async (intent: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Oração para: ${intent}`,
        config: {
          systemInstruction: "Escreva uma oração bíblica e curta.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "Deus conhece seu coração, fale com Ele em oração.");
};
