import React, { useEffect, useState } from 'react';
import { getDailyWisdom } from '../services/geminiService';
import { BookOpen } from 'lucide-react';

const DailyWisdom: React.FC = () => {
  const [data, setData] = useState<{ text: string; source: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWisdom = async () => {
      setLoading(true);
      const result = await getDailyWisdom();
      setData(result);
      setLoading(false);
    };
    fetchWisdom();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[200px] bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-6 flex flex-col justify-center items-center animate-pulse">
        <div className="w-12 h-12 bg-emerald-900/50 rounded-full mb-4"></div>
        <div className="h-4 bg-emerald-900/50 w-3/4 rounded mb-2"></div>
        <div className="h-4 bg-emerald-900/50 w-1/2 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full h-full min-h-[200px] lg:min-h-0 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -ml-12 -mb-12"></div>

        <div className="bg-emerald-900/40 p-3 rounded-full mb-4 text-emerald-400">
            <BookOpen className="w-6 h-6" />
        </div>

        <div className="w-full font-serif text-2xl lg:text-3xl leading-relaxed text-emerald-100 mb-6" dir="rtl">
            "{data.text}"
        </div>

        <div className="text-sm font-bold text-emerald-500 bg-emerald-950/50 px-4 py-1 rounded-full border border-emerald-900/50">
            {data.source}
        </div>
    </div>
  );
};

export default DailyWisdom;