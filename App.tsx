import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, GripHorizontal, BookOpen } from 'lucide-react';
import Clock from './components/Clock';
import PrayerTimesCard from './components/PrayerTimesCard';
import MosqueList from './components/MosqueList';
import CountdownTimer from './components/CountdownTimer';
import DailyWisdom from './components/DailyWisdom';
import TasbihCounter from './components/TasbihCounter';
import QuranReader from './components/QuranReader';
import { getPrayerTimesByCity, getPrayerTimesByCoords } from './services/prayerService';
import { getMosquesInCity } from './services/geminiService';
import { PrayerData, Mosque } from './types';

const App: React.FC = () => {
  const [city, setCity] = useState<string>('Berlin');
  const [country, setCountry] = useState<string>('Germany'); // Default focus on Germany
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mosqueLoading, setMosqueLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTasbih, setShowTasbih] = useState<boolean>(false);
  const [showQuran, setShowQuran] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    fetchData(city, country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (searchCity: string, searchCountry: string) => {
    setLoading(true);
    setMosqueLoading(true);
    setError(null);
    setPrayerData(null);
    setMosques([]);

    try {
      const pData = await getPrayerTimesByCity(searchCity, searchCountry);
      if (pData) {
        setPrayerData(pData);
        setLoading(false);
        
        // Fetch mosques in parallel after prayer times are secured
        const mData = await getMosquesInCity(searchCity);
        setMosques(mData);
        setMosqueLoading(false);
      } else {
        setError('Stadt nicht gefunden oder API-Fehler.');
        setLoading(false);
        setMosqueLoading(false);
      }
    } catch (e) {
      setError('Ein Fehler ist aufgetreten.');
      setLoading(false);
      setMosqueLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(city, country);
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          const pData = await getPrayerTimesByCoords(coords);
          if (pData) {
            setPrayerData(pData);
            setLoading(false);
            
            setMosqueLoading(true);
            const mosquesNear = await getMosquesInCity(`${coords.latitude}, ${coords.longitude}`);
            setMosques(mosquesNear);
            setMosqueLoading(false);
            
            setCity("Aktueller Standort"); 
          }
        } catch (err) {
            setError("Standort konnte nicht ermittelt werden.");
            setLoading(false);
        }
      });
    } else {
      setError("Geolocation wird von diesem Browser nicht unterstützt.");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-100 flex flex-col pb-safe">
      
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-20 bg-slate-900/80 pt-safe-top">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="font-bold text-slate-900 text-lg">G</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Gebetszeiten <span className="text-amber-500">Pro</span></h1>
        </div>
        <button 
            onClick={handleGeolocation}
            className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-full transition-colors text-amber-500 touch-manipulation"
            title="Standort ermitteln"
        >
            <Navigation className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col items-center">
        
        {/* Clock Section */}
        <Clock />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2 mb-8 relative group z-10">
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Stadt (z.B. Berlin)"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 pl-10 pr-4 py-3.5 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-base"
              style={{ fontSize: '16px' }} // Prevents iOS zoom on focus
            />
          </div>
          <button 
            type="submit" 
            className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3.5 rounded-r-xl font-medium transition-colors flex items-center gap-2 touch-manipulation active:bg-amber-700"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Suchen</span>
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-8 text-sm w-full max-w-md text-center">
            {error}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="w-full max-w-7xl">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
                    <p className="text-slate-400 animate-pulse">Lade Gebetsdaten...</p>
                </div>
            ) : prayerData ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Left Column: Countdown */}
                    <div className="lg:col-span-1 order-1 lg:order-1 h-full">
                         <div className="sticky top-24">
                            <CountdownTimer timings={prayerData.timings} />
                        </div>
                    </div>

                    {/* Center Column: Prayer Times & Mosques */}
                    <div className="lg:col-span-2 order-2 lg:order-2 flex flex-col items-center gap-6">
                        <PrayerTimesCard data={prayerData} />
                        <MosqueList mosques={mosques} loading={mosqueLoading} city={city} />
                    </div>

                    {/* Right Column: Daily Wisdom */}
                    <div className="lg:col-span-1 order-3 lg:order-3 h-full">
                        <div className="sticky top-24">
                            <DailyWisdom />
                        </div>
                    </div>

                </div>
            ) : (
                <div className="text-slate-500 mt-8 text-center w-full px-4">
                    Bitte geben Sie eine Stadt ein oder nutzen Sie die Standortbestimmung.
                </div>
            )}
        </div>

        {/* Bottom Actions Section - Mobile Optimized Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 mb-8">
            {/* Tasbih Button */}
            <button 
                onClick={() => setShowTasbih(true)}
                className="group relative flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 px-6 py-5 rounded-2xl transition-all duration-150 shadow-xl active:scale-[0.98] touch-manipulation"
            >
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500 text-amber-500 group-hover:text-slate-900 transition-colors duration-300">
                    <GripHorizontal className="w-8 h-8" />
                </div>
                <div className="text-left">
                    <div className="text-slate-100 font-bold text-lg">Elektronische Gebetskette</div>
                    <div className="text-xs text-slate-500 group-hover:text-amber-500/80 transition-colors uppercase tracking-wider font-medium">
                        مسبحة إلكترونية
                    </div>
                </div>
            </button>

            {/* Quran Button */}
            <button 
                onClick={() => setShowQuran(true)}
                className="group relative flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 px-6 py-5 rounded-2xl transition-all duration-150 shadow-xl active:scale-[0.98] touch-manipulation"
            >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 text-emerald-500 group-hover:text-slate-900 transition-colors duration-300">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div className="text-left">
                    <div className="text-slate-100 font-bold text-lg">Koran lesen</div>
                    <div className="text-xs text-slate-500 group-hover:text-emerald-500/80 transition-colors uppercase tracking-wider font-medium">
                        قراءة القرآن الكريم
                    </div>
                </div>
            </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-slate-600 text-xs border-t border-slate-800 mt-auto pb-safe-bottom">
        <p>&copy; {new Date().getFullYear()} Gebetszeiten Pro. Android Optimized.</p>
      </footer>

      {/* Modals */}
      {showTasbih && <TasbihCounter onClose={() => setShowTasbih(false)} />}
      {showQuran && <QuranReader onClose={() => setShowQuran(false)} />}
    </div>
  );
};

export default App;