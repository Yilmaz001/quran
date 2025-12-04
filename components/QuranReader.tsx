import React, { useState, useEffect } from 'react';
import { X, BookOpen, ChevronLeft, Youtube, Search, Globe } from 'lucide-react';
import { getAllSurahs, getSurahText, getSurahTranslation } from '../services/quranService';
import { Surah, SurahDetail } from '../types';

interface QuranReaderProps {
  onClose: () => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({ onClose }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [translationSurah, setTranslationSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [language, setLanguage] = useState<string>('none'); // 'none', 'de', 'en', 'fr', 'es'

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      const list = await getAllSurahs();
      setSurahs(list);
      setLoading(false);
    };
    fetchList();
  }, []);

  // When language changes or surah changes, fetch translation if needed
  useEffect(() => {
    const fetchTranslation = async () => {
      if (selectedSurah && language !== 'none') {
        setLoadingText(true);
        const trans = await getSurahTranslation(selectedSurah.number, language);
        setTranslationSurah(trans);
        setLoadingText(false);
      } else {
        setTranslationSurah(null);
      }
    };
    fetchTranslation();
  }, [language, selectedSurah]);

  const handleSelectSurah = async (surah: Surah) => {
    setLoadingText(true);
    const detail = await getSurahText(surah.number);
    setSelectedSurah(detail);
    setLoadingText(false);
    // Reset language when opening new Surah, or keep it? User might want to keep preference.
    // Keeping current language state.
  };

  const handleBackToList = () => {
    setSelectedSurah(null);
    setTranslationSurah(null);
  };

  const openYouTube = () => {
    if (selectedSurah) {
      const query = `Saad Al Ghamdi Surah ${selectedSurah.englishName}`;
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.number.toString().includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full h-full md:max-w-4xl md:h-[90vh] bg-slate-900 md:bg-slate-800 md:border md:border-slate-700 md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/90 z-10">
          <div className="flex items-center gap-3">
             {selectedSurah ? (
               <button onClick={handleBackToList} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
                 <ChevronLeft className="w-6 h-6 text-amber-500" />
               </button>
             ) : (
                <BookOpen className="w-6 h-6 text-amber-500" />
             )}
            <h2 className="text-xl font-bold text-slate-100">
                {selectedSurah ? `${selectedSurah.englishName}` : 'Der Heilige Koran'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          
          {/* View 1: List of Surahs */}
          {!selectedSurah && (
            <div className="p-4 md:p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Suche Sure (Name oder Nummer)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-amber-500/50 outline-none"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSurahs.map((surah) => (
                        <button
                            key={surah.number}
                            onClick={() => handleSelectSurah(surah)}
                            className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500/30 rounded-xl transition-all group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-mono text-sm text-amber-500 font-bold border border-slate-700 group-hover:border-amber-500/50">
                                    {surah.number}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                                        {surah.englishName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {surah.englishNameTranslation}
                                    </div>
                                </div>
                            </div>
                            <div className="font-serif text-xl text-slate-400 font-medium group-hover:text-amber-100">
                                {surah.name}
                            </div>
                        </button>
                        ))}
                    </div>
                )}
            </div>
          )}

          {/* View 2: Text & YouTube & Translation */}
          {selectedSurah && (
             <div className="flex flex-col h-full">
                {/* Action Bar */}
                <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                    {/* Language Selector */}
                    <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <Globe className="w-4 h-4 text-slate-400 ml-2" />
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-slate-200 text-sm focus:outline-none p-1"
                        >
                            <option value="none">Nur Arabisch</option>
                            <option value="de">Deutsch</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                        </select>
                    </div>

                    <button 
                        onClick={openYouTube}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm shadow-lg shadow-red-900/20"
                    >
                        <Youtube className="w-4 h-4" />
                        <span>Saad Al Ghamdi</span>
                    </button>
                </div>

                <div className="flex-grow p-4 md:p-8 overflow-y-auto bg-[#0f172a]">
                    {loadingText ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-12">
                            {/* Bismillah (skip for Surah 9 At-Tawbah) */}
                            {selectedSurah.number !== 9 && (
                                <div className="text-center mb-10 pt-4">
                                    <div className="font-serif text-3xl md:text-4xl text-amber-500/90 leading-loose" dir="rtl">
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                    </div>
                                    {language !== 'none' && (
                                        <div className="text-slate-400 mt-2 text-sm italic">
                                            Im Namen Allahs, des Gnädigen, des Barmherzigen
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Verses */}
                            <div className="space-y-8">
                                {selectedSurah.ayahs.map((ayah, index) => (
                                    <div key={ayah.number} className="relative group border-b border-slate-800/50 pb-8 last:border-0">
                                        {/* Arabic */}
                                        <div className="font-serif text-2xl md:text-4xl text-slate-200 leading-[2.2] text-right mb-4" dir="rtl">
                                            {ayah.text} 
                                            <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-amber-600/40 rounded-full text-sm md:text-lg text-amber-500 mr-2 select-none align-middle font-sans">
                                                {ayah.numberInSurah}
                                            </span>
                                        </div>

                                        {/* Translation */}
                                        {translationSurah && translationSurah.ayahs[index] && (
                                            <div className="text-slate-400 text-lg leading-relaxed px-2 md:px-6 border-l-2 border-slate-700">
                                                {translationSurah.ayahs[index].text}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-12 pb-20 text-center text-slate-600 text-sm">
                                Ende der Sure {selectedSurah.englishName}
                            </div>
                        </div>
                    )}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranReader;