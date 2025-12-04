import { PrayerData, Coordinates } from "../types";

export const getPrayerTimesByCity = async (city: string, country: string): Promise<PrayerData | null> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=3` // Method 3 is Muslim World League, generally good for Europe
    );
    const data = await response.json();
    if (data.code === 200 && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};

export const getPrayerTimesByCoords = async (coords: Coordinates): Promise<PrayerData | null> => {
  try {
    // Current timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=3`
    );
    const data = await response.json();
    if (data.code === 200 && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times by coords:", error);
    return null;
  }
};