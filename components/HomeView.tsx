
import React from 'react';
import { 
  ArrowRight, 
  Wallet, 
  Users, 
  Book, 
  Music, 
  Play, 
  MapPin, 
  Zap, 
  Activity, 
  Compass, 
  Radio,
  Sparkles
} from 'lucide-react';
import { AppView, AppData } from '../types';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  data: AppData;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, data }) => {
  const openSpotify = () => {
    window.open(data.config.spotifyUrl, '_blank');
  };

  const openMaps = () => {
    window.open(data.config.mapsUrl, '_blank');
  };

  const safeEvents = data?.events || [];
  const safeGallery = data?.gallery || [];

  return (
    <div className="animate-fadeIn pb-10">
      {/* HUD Hero Section */}
      <section className="px-4 py-6">
        <div className="relative rounded-[3rem] overflow-hidden aspect-[16/11] shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-zinc-800 group">
          <img 
            src={data.config.liveUrl} 
            alt="Próximo Culto" 
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 opacity-50 grayscale-[30%]"
          />
          
          {/* Overlay Tecnológico */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
            {/* HUD Elements */}
            <div className="absolute top-6 left-6 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Signal Received: 1080p</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
            </div>

            <div className="absolute top-6 right-6">
              <Activity className="text-yellow-400/20" size={24} />
            </div>

            <div className="absolute inset-x-8 bottom-8">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Radio size={12} className="text-yellow-400" />
                  <span className="text-yellow-400 text-[9px] font-black uppercase tracking-[0.3em]">Live Stream Active</span>
                </div>
                <h2 className="text-white text-2xl font-black leading-tight mb-5 uppercase italic tracking-tighter">{data.config.liveTitle}</h2>
                <button 
                  onClick={() => onNavigate(AppView.LIVE)}
                  className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.3)] uppercase tracking-[0.2em] text-[10px]"
                >
                  <Play size={16} fill="currentColor" />
                  Entrar na Presença
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Icon Dashboard */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          <FuturisticAction icon={<Wallet size={20} />} label="Dizimar" onClick={() => onNavigate(AppView.TITHING)} color="yellow" />
          <FuturisticAction icon={<Users size={20} />} label="Células" onClick={() => onNavigate(AppView.CELLS)} color="blue" />
          <FuturisticAction icon={<Book size={20} />} label="Bíblia" onClick={() => onNavigate(AppView.BIBLE)} color="purple" />
          <FuturisticAction icon={<Music size={20} />} label="Gospel" onClick={openSpotify} color="green" isSpotify />
          
          <div className="col-span-4 mt-2">
             <button 
              onClick={openMaps}
              className="w-full bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-[2rem] flex items-center justify-between group active:scale-95 transition-all"
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-yellow-400/50 transition-colors">
                      <Compass size={22} className="text-yellow-400" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Encontre-nos</span>
                      <h4 className="text-white font-black uppercase text-xs tracking-tight italic">Nossa Localização</h4>
                   </div>
                </div>
                <ArrowRight size={18} className="text-zinc-700 group-hover:text-yellow-400 transform group-hover:translate-x-1 transition-all" />
             </button>
          </div>
        </div>
      </section>

      {/* Cyber-Grid Events */}
      <section className="py-6">
        <div className="flex items-center justify-between px-8 mb-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-1">Agenda Digital</span>
            <h3 className="font-black text-white text-xl tracking-tighter uppercase italic">Expansão do Reino</h3>
          </div>
          <button 
            onClick={() => onNavigate(AppView.EVENTS)}
            className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-400 hover:text-yellow-400 transition-colors"
          >
            <Zap size={18} />
          </button>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-5 px-6">
          {safeEvents.length > 0 ? safeEvents.slice(0, 3).map(event => (
            <CyberCard key={event.id} title={event.title} date={event.date} image={event.image} />
          )) : (
            <div className="w-64 h-32 bg-zinc-900/30 rounded-[2rem] border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 mx-auto">
              <Sparkles className="text-zinc-800" size={24} />
              <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">Aguardando Eventos</span>
            </div>
          )}
        </div>
      </section>

      {/* Immersive Gallery */}
      <section className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800"></div>
          <h3 className="font-black text-zinc-500 text-[10px] uppercase tracking-[0.4em]">Visual Feed</h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {safeGallery.length > 0 ? safeGallery.slice(0, 2).map(img => (
              <div key={img.id} onClick={() => onNavigate(AppView.GALLERY)} className="relative aspect-square rounded-[2rem] overflow-hidden border border-zinc-900 cursor-pointer active:scale-95 transition-all group shadow-lg">
                <img src={img.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="backdrop-blur-md bg-black/40 border border-white/5 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest line-clamp-1">{img.title}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="aspect-square bg-zinc-900/50 rounded-[2rem] border border-zinc-800 animate-pulse"></div>
            )}
        </div>
      </section>
    </div>
  );
};

const FuturisticAction: React.FC<{
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void, 
  color: 'yellow' | 'blue' | 'purple' | 'green',
  isSpotify?: boolean
}> = ({ icon, label, onClick, color, isSpotify = false }) => {
  const colorMap = {
    yellow: 'text-yellow-400 border-yellow-400/20 shadow-yellow-400/5 hover:border-yellow-400/50',
    blue: 'text-blue-400 border-blue-400/20 shadow-blue-400/5 hover:border-blue-400/50',
    purple: 'text-purple-400 border-purple-400/20 shadow-purple-400/5 hover:border-purple-400/50',
    green: 'text-emerald-400 border-emerald-400/20 shadow-emerald-400/5 hover:border-emerald-400/50'
  };

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center transition-all duration-500 active:scale-90 border-2 shadow-2xl bg-zinc-950 ${
        isSpotify ? 'bg-[#1DB954]/5 border-[#1DB954]/20 text-[#1DB954] hover:border-[#1DB954]/60' : colorMap[color]
      }`}>
        <div className="transform group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      </div>
      <span className="text-[8px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.2em] text-center leading-none transition-colors">{label}</span>
    </button>
  );
};

const CyberCard: React.FC<{title: string, date: string, image: string}> = ({ title, date, image }) => (
  <div className="flex-shrink-0 w-72 bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 group transition-all hover:border-yellow-400/30 shadow-2xl active:scale-[0.98]">
    <div className="relative h-40">
        <img src={image} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" alt={title} />
        <div className="absolute top-5 left-5">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-xl">
                <span className="text-yellow-400 font-black text-[9px] uppercase tracking-widest">{date}</span>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
    </div>
    <div className="p-6 pt-0 text-center">
      <h4 className="font-black text-white line-clamp-1 uppercase text-sm tracking-tighter italic group-hover:text-yellow-400 transition-colors">{title}</h4>
      <div className="w-8 h-1 bg-yellow-400/20 mx-auto mt-4 rounded-full group-hover:w-16 group-hover:bg-yellow-400 transition-all duration-500"></div>
    </div>
  </div>
);

export default HomeView;
