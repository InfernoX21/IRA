import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

export const getGeminiRecommendation = async (cellData: any, objective: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  try {
    // Use flash-lite for low-latency initial recommendation
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Analyze this urban planning grid cell for ${objective} optimization:
      - Coordinates: ${cellData.coordinates.join(', ')}
      - Tree Score: ${cellData.treeScore}
      - Construction Score: ${cellData.constructionScore}
      - Solar Score: ${cellData.solarScore}
      - Flood Risk: ${cellData.floodRisk}
      - Elevation: ${cellData.elevation}m
      - Solar Irradiance: ${cellData.solarIrradiance}kWh/m²
      
      Provide a concise urban planning recommendation (max 60 words).`,
    });

    return response.text;
  } catch (error: any) {
    handleGeminiError(error);
    throw error;
  }
};

export const getSearchGroundingAnalysis = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  try {
    // Use flash-preview for search grounding as required
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return response.text;
  } catch (error: any) {
    handleGeminiError(error);
    throw error;
  }
};

export const getComplexAnalysis = async (query: string, context: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Context: ${JSON.stringify(context)}\n\nQuery: ${query}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    return response.text;
  } catch (error: any) {
    handleGeminiError(error);
    throw error;
  }
};

export const analyzeSiteImage = async (base64Image: string, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    });

    return response.text;
  } catch (error: any) {
    handleGeminiError(error);
    throw error;
  }
};

const handleGeminiError = (error: any) => {
  if (error.message?.includes("Requested entity was not found") || error.status === "NOT_FOUND") {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      (window as any).aistudio.openSelectKey();
    }
  }
};

export const getMapsGrounding = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }]
      }
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error: any) {
    handleGeminiError(error);
    throw error;
  }
};
