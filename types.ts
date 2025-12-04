export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface PrayerData {
  timings: PrayerTimes;
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      month: {
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    timezone: string;
  };
}

export interface Mosque {
  name: string;
  address: string;
  description: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}