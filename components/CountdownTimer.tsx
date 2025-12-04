import React, { useState, useEffect } from 'react';
import { PrayerTimes } from '../types';
import { Hourglass } from 'lucide-react';

interface CountdownTimerProps {
  timings: PrayerTimes;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timings }) => {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [nextPrayerName, setNextPrayerName] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let upcomingPrayer = null;
      let upcomingPrayerName = '';

      for (const name of prayerNames) {
        const timeStr = timings[name].split(' ')[0];
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        if (prayerDate > now) {
          upcomingPrayer = prayerDate;
          upcomingPrayerName = name;
          break;
        }
      }

      // If no prayer left today, next is Fajr tomorrow
      if (!upcomingPrayer) {
        const timeStr = timings['Fajr'].split(' ')[0];
        const [hours, minutes] = timeStr.split(':').map(Number);
        upcomingPrayer = new Date();
        upcomingPrayer.setDate(upcomingPrayer.getDate() + 1);
        upcomingPrayer.setHours(hours, minutes, 0, 0);
        upcomingPrayerName = 'Fajr';
      }

      const diff = upcomingPrayer.getTime() - now.getTime();
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      setNextPrayerName(upcomingPrayerName);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [timings]);

  return (
    <div className="w-full h-full min-h-[150px] lg:min-h-0 bg-cyan-950/30 border border-cyan-800/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <div className="bg-cyan-900/40 p-3 rounded-full mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors">
            <Hourglass className="w-6 h-6 animate-pulse" />
        </div>

        <div className="text-sm font-medium text-cyan-500 uppercase tracking-widest mb-1">
            Nächstes Gebet
        </div>
        
        <div className="text-2xl font-bold text-cyan-100 mb-2">
            {nextPrayerName}
        </div>

        <div className="text-4xl lg:text-5xl font-mono font-bold text-white tracking-wider tabular-nums">
            {timeLeft}
        </div>
        
        <div className="text-xs text-cyan-600/70 mt-2">
            Verbleibende Zeit
        </div>
    </div>
  );
};

export default CountdownTimer;