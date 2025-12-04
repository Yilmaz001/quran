import React, { useState, useEffect } from 'react';
import { RotateCcw, X, GripHorizontal } from 'lucide-react';

interface TasbihCounterProps {
  onClose: () => void;
}

const TasbihCounter: React.FC<TasbihCounterProps> = ({ onClose }) => {
  const [count, setCount] = useState<number>(0);

  // Load from local storage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('tasbih-count');
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('tasbih-count', count.toString());
  }, [count]);

  const increment = () => {
    if (count < 20000) {
      // Android Haptic Feedback (Vibration)
      if (navigator.vibrate) {
        navigator.vibrate(30); // Short vibration (30ms)
      }
      setCount(c => c + 1);
    }
  };

  const reset = () => {
    // Haptic feedback for reset
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]); // Double pulse vibration
    }
    // Reset immediately to 0
    setCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200 h-[80vh] max-h-[600px]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <GripHorizontal className="w-5 h-5 text-amber-500" />
            Tasbih (Gebetskette)
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Area */}
        <div className="flex-grow flex flex-col items-center justify-center py-4 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="w-full flex justify-center mb-8">
             <div className="bg-slate-950 border border-slate-700 rounded-xl px-10 py-6 shadow-inner ring-1 ring-slate-800">
                <div className="font-mono text-7xl font-bold text-amber-500 tabular-nums tracking-widest text-center drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    {count.toString().padStart(5, '0')}
                </div>
             </div>
          </div>

          {/* Main Button (Big Touch Area for Mobile) */}
          <button 
            onClick={increment}
            className="w-48 h-48 rounded-full bg-slate-800 border-8 border-slate-700 shadow-[0_0_0_4px_rgba(15,23,42,0.5),_0_15px_35px_rgba(0,0,0,0.6)] active:scale-95 active:border-amber-500/50 transition-all duration-100 flex items-center justify-center group relative overflow-hidden mb-4 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col items-center">
                <span className="text-5xl text-slate-600 group-hover:text-amber-500 transition-colors font-bold select-none">+</span>
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-white/5 group-active:ring-amber-500/30"></div>
          </button>
          
          <p className="text-sm text-slate-500 max-w-[200px] text-center leading-relaxed mt-4 font-medium">
            Drücken Sie den Knopf, um Ihre Gebete zu zählen.
          </p>
        </div>

        {/* Footer / Controls */}
        <div className="p-5 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center shrink-0 pb-safe">
          <div className="text-xs text-slate-500 font-medium">
            Gesichert: {count}
          </div>
          <button 
            onClick={reset}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-red-950/30 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-900/30 transition-colors text-sm font-bold active:scale-95 touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
            RESET
          </button>
        </div>

      </div>
    </div>
  );
};

export default TasbihCounter;