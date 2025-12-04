import React from 'react';
import { Mosque } from '../types';
import { MapPin } from 'lucide-react';

interface MosqueListProps {
  mosques: Mosque[];
  loading: boolean;
  city: string;
}

const MosqueList: React.FC<MosqueListProps> = ({ mosques, loading, city }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-700/50 rounded"></div>
          <div className="h-20 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (mosques.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-amber-500" />
        Moscheen in {city}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mosques.map((mosque, index) => (
          <div 
            key={index} 
            className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-amber-500/30 transition-colors duration-300"
          >
            <h4 className="font-bold text-slate-100 mb-1">{mosque.name}</h4>
            <p className="text-xs text-amber-500/80 mb-2 font-mono uppercase tracking-wide">{mosque.address}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{mosque.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="text-xs text-slate-600">Daten bereitgestellt von Gemini AI</span>
      </div>
    </div>
  );
};

export default MosqueList;