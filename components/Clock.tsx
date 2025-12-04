import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const hours = formatNumber(time.getHours());
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-sm text-slate-400 font-medium tracking-widest uppercase mb-2">
        Aktuelle Uhrzeit
      </div>
      <div className="flex items-baseline space-x-2 font-mono text-slate-100">
        <span className="text-6xl md:text-8xl font-bold tracking-tighter">{hours}:{minutes}</span>
        <span className="text-3xl md:text-4xl text-amber-500 font-medium">{seconds}</span>
      </div>
      <div className="mt-2 text-slate-500 text-sm">
        {time.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

export default Clock;