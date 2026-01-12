
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateSalesCopy(productName: string, description: string) {
    try {
      const prompt = `Você é um copywriter expert focado em conversão. Escreva uma copy de vendas persuasiva para o produto "${productName}". Descrição atual: "${description}". Use gatilhos mentais de escassez, prova social e urgência. Retorne em formato Markdown.`;
      
      // Use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      // The response.text property directly returns the generated string.
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao gerar copy. Tente novamente mais tarde.";
    }
  },

  async generateInstagramBio(productName: string) {
    try {
      const prompt = `Crie 3 opções de bio para Instagram para um perfil que vende o produto "${productName}". Use emojis e chamadas para ação (CTA) fortes.`;
      
      // Use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      // The response.text property directly returns the generated string.
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao gerar bio.";
    }
  }
};
