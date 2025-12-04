import React, { useEffect, useState } from 'react';
import { PrayerData } from '../types';
import { Clock, Sunrise, Sun, Sunset, Moon, Star } from 'lucide-react';

interface PrayerTimesCardProps {
  data: PrayerData;
}

const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({ data }) => {
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  const prayers = [
    { key: 'Fajr', label: 'Fajr', icon: <Moon className="w-5 h-5" />, de: 'Morgendämmerung' },
    { key: 'Sunrise', label: 'Sonnenaufgang', icon: <Sunrise className="w-5 h-5" />, de: 'Sonnenaufgang' },
    { key: 'Dhuhr', label: 'Dhuhr', icon: <Sun className="w-5 h-5" />, de: 'Mittag' },
    { key: 'Asr', label: 'Asr', icon: <Sun className="w-5 h-5 opacity-70" />, de: 'Nachmittag' },
    { key: 'Maghrib', label: 'Maghrib', icon: <Sunset className="w-5 h-5" />, de: 'Sonnenuntergang' },
    { key: 'Isha', label: 'Isha', icon: <Star className="w-5 h-5" />, de: 'Nacht' },
  ];

  useEffect(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let foundNext = false;
    for (const p of prayers) {
        // Skip sunrise for "next prayer" logic typically in Islamic apps, but keeping it for display
        if (p.key === 'Sunrise') continue; 

        const timeStr = data.timings[p.key].split(' ')[0];
        const [h, m] = timeStr.split(':').map(Number);
        const prayerMinutes = h * 60 + m;

        if (prayerMinutes > currentTime) {
            setNextPrayer(p.key);
            foundNext = true;
            break;
        }
    }
    if (!foundNext) setNextPrayer('Fajr'); // Next day Fajr
  }, [data]);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div>
           <div className="text-xs text-amber-500 font-bold uppercase tracking-wider">Hidschri-Datum</div>
           <div className="text-slate-200">{data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year}</div>
        </div>
        <div className="text-right">
           <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Zeitzone</div>
           <div className="text-slate-300 text-sm">{data.meta.timezone}</div>
        </div>
      </div>
      
      <div className="divide-y divide-slate-700/50">
        {prayers.map((prayer) => {
           const time = data.timings[prayer.key].split(' ')[0]; // Remove (CET) etc if present
           const isNext = nextPrayer === prayer.key;
           
           return (
            <div 
                key={prayer.key} 
                className={`flex items-center justify-between p-4 transition-all duration-300 ${
                    isNext ? 'bg-amber-500/10 border-l-4 border-amber-500 pl-3' : 'hover:bg-slate-700/30 border-l-4 border-transparent pl-3'
                }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isNext ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 bg-slate-800'}`}>
                        {prayer.icon}
                    </div>
                    <div>
                        <div className={`font-semibold ${isNext ? 'text-amber-500' : 'text-slate-200'}`}>
                            {prayer.key === 'Sunrise' ? 'Sonnenaufgang' : prayer.key}
                        </div>
                        <div className="text-xs text-slate-500">{prayer.de}</div>
                    </div>
                </div>
                <div className={`font-mono text-xl font-bold ${isNext ? 'text-amber-400' : 'text-slate-300'}`}>
                    {time}
                </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default PrayerTimesCard;