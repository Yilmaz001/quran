import { GoogleGenAI, Type } from "@google/genai";
import { Mosque } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getMosquesInCity = async (city: string): Promise<Mosque[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List 3 to 5 popular mosques in or near ${city}. If the city is small, list the nearest ones. Provide the output in German.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "Name of the mosque"
              },
              address: {
                type: Type.STRING,
                description: "Approximate address or district"
              },
              description: {
                type: Type.STRING,
                description: "A very short description (1 sentence) in German"
              }
            },
            required: ["name", "address", "description"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Mosque[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching mosques:", error);
    return [];
  }
};

export const getDailyWisdom = async (): Promise<{ text: string; source: string } | null> => {
  try {
    // Adding a random seed or parameter to the prompt to encourage variety
    const randomSeed = Math.floor(Math.random() * 1000);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a short, inspiring Sahih Hadith or Quranic verse about prayer, patience, manners, or time in Arabic. It must be in Arabic script. Random seed: ${randomSeed}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { 
              type: Type.STRING,
              description: "The Arabic text of the verse or hadith."
            },
            source: { 
              type: Type.STRING, 
              description: "The source in Arabic (e.g. Sahih Bukhari, Surat Al-Baqarah)."
            },
          },
          required: ["text", "source"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error fetching wisdom:", error);
    return null;
  }
};