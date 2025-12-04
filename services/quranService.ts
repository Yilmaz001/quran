import { Surah, SurahDetail } from "../types";

const BASE_URL = "https://api.alquran.cloud/v1";

export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching Surahs:", error);
    return [];
  }
};

export const getSurahText = async (surahNumber: number): Promise<SurahDetail | null> => {
  try {
    // Fetching Uthmani script
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/quran-uthmani`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Surah text:", error);
    return null;
  }
};

export const getSurahTranslation = async (surahNumber: number, langCode: string): Promise<SurahDetail | null> => {
  try {
    // Map simplified language codes to specific API editions
    let edition = 'de.aburida'; // Default fallback
    switch(langCode) {
      case 'de': edition = 'de.aburida'; break;
      case 'en': edition = 'en.sahih'; break;
      case 'fr': edition = 'fr.hamidullah'; break;
      case 'es': edition = 'es.bornez'; break;
      default: edition = 'de.aburida';
    }

    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching translation:", error);
    return null;
  }
};