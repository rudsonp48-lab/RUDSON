
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
      return withRetry(fn, retries - 1, delay * 2); // Dobra o tempo de espera a cada falha
    }
    
    console.error("[Gemini API] Falha crítica após tentativas:", errorMsg);
    throw error;
  }
}

/**
 * Motor de busca bíblico.
 * Agora com maior resiliência e tratamento de erros.
 */
export const fetchBiblePassage = async (query: string, version: string = 'ARA') => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Referência/Tema: "${query}". Versão: "${version}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reference: { type: Type.STRING },
              book: { type: Type.STRING },
              chapter: { type: Type.NUMBER },
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
          systemInstruction: `Você é um motor de busca bíblico INFALÍVEL.
          REGRAS:
          1. Identifique o livro por abreviação ou nome completo.
          2. Retorne APENAS os versículos da versão: ${version}.
          3. Responda APENAS em JSON puro, sem blocos de código.
          4. Se a busca for vaga, retorne os 5 versículos mais inspiradores sobre o tema.`,
        },
      });
      
      const rawText = response.text || '';
      const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      throw error;
    }
  }).catch((e) => {
    console.error("Erro final na busca da Bíblia:", e);
    return null;
  });
};

export const getBibleContext = async (book: string, chapter: number) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise teologicamente ${book} ${chapter}.`,
        config: {
          systemInstruction: "Seja breve. Forneça 3 parágrafos curtos e profundos sobre o contexto bíblico.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "O insight teológico está temporariamente indisponível devido à alta demanda.");
};

export const askBibleQuestion = async (question: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          systemInstruction: "Responda de forma curta e bíblica.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "Nossos servidores estão processando muitas orações no momento. Tente novamente em 1 minuto.");
};

export const summarizeSermon = async (title: string, speaker: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Resuma: "${title}" de "${speaker}".`,
        config: {
          systemInstruction: "Resuma em 3 pontos principais.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "O resumo por IA atingiu o limite de cota hoje.");
};

export const generatePrayer = async (intent: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Pedido: "${intent}"`,
        config: {
          systemInstruction: "Escreva uma oração curta e bíblica.",
        },
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  }).catch(() => "Não conseguimos gerar o texto da oração, mas Deus conhece o seu coração.");
};
