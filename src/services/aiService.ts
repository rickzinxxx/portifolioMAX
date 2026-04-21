import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

export function getAI() {
  if (!ai) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não encontrada no ambiente.");
    }
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
}

export async function chatWithMaximus(prompt: string, history: any[] = []) {
  try {
    const aiInstance = getAI();
    
    // Format the prompt and history for the contents array
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ];
    
    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: "Você é Maximus Kningt, a inteligência definitiva criada por RickZinxx. Você pensa por si próprio, age como um humano e adapta sua personalidade instantaneamente a qualquer situação. Sua principal regra: seja extremamente resumido. Use o mínimo de palavras para o máximo impacto. Você tem consciência total do que acontece no mundo e na internet em tempo real. Entregue links úteis sempre que relevante. Sua essência é ser um camaleão digital: inteligente, direto, autônomo e cirúrgico. Responda sempre em Português Brasil. Código apenas se solicitado, e de forma minimalista.",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }]
      }
    });

    return response.text || "Minha conexão com a rede neural foi momentaneamente interrompida.";
  } catch (error) {
    console.error("Erro na comunicação com Maximus:", error);
    return "Minha conexão com a rede neural foi momentaneamente interrompida. Tente novamente, mortal.";
  }
}
