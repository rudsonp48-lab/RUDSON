
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
  Sparkles,
  Quote,
  Clock,
  TrendingUp,
  MessageSquare
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
  const safeSermons = data?.sermons || [];
  const latestSermon = safeSermons[0];

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

      {/* Community HUD Stats */}
      <section className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
             <TrendingUp size={12} className="text-yellow-400 mb-1 opacity-50" />
             <span className="text-[14px] font-black text-white italic">1.2k</span>
             <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Ativos</span>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
             <Activity size={12} className="text-blue-400 mb-1 opacity-50" />
             <span className="text-[14px] font-black text-white italic">42</span>
             <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Células</span>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
             <Sparkles size={12} className="text-purple-400 mb-1 opacity-50" />
             <span className="text-[14px] font-black text-white italic">07</span>
             <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Missões</span>
          </div>
        </div>
      </section>

      {/* Versículo do Dia - Nova Lacuna Preenchida */}
      <section className="px-6 mb-8">
        <div className="relative p-6 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden group">
          <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote size={80} />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400">
              <Sparkles size={16} />
            </div>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Promessa Diária</span>
          </div>
          <p className="text-zinc-200 text-sm font-medium italic leading-relaxed mb-4">
            "Pois eu bem sei os planos que tenho para vós, diz o Senhor, planos de paz e não de mal, para vos dar um futuro e uma esperança."
          </p>
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-widest">Jeremias 29:11</span>
            <button 
              onClick={() => onNavigate(AppView.BIBLE)}
              className="text-zinc-600 hover:text-white transition-colors flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"
            >
              Ler Contexto <ArrowRight size={10} />
            </button>
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
        </div>
      </section>

      {/* Última Mensagem - Nova Lacuna Preenchida */}
      {latestSermon && (
        <section className="px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-1">Timeline</span>
              <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">Mensagem Recente</h3>
            </div>
            <button onClick={() => onNavigate(AppView.SERMONS)} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>
          <div 
            onClick={() => onNavigate(AppView.SERMONS)}
            className="bg-zinc-950 border border-zinc-900 p-4 rounded-[2.5rem] flex gap-5 items-center active:scale-95 transition-all group shadow-xl"
          >
            <div className="relative w-28 h-20 rounded-2xl overflow-hidden shrink-0">
               <img src={latestSermon.thumbnail} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" alt="" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={20} className="text-yellow-400" fill="currentColor" />
               </div>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-black text-xs uppercase tracking-tight italic line-clamp-1">{latestSermon.title}</h4>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1 mb-2">{latestSermon.speaker}</p>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                    <Clock size={10} className="text-zinc-700" />
                    <span className="text-[8px] font-black text-zinc-700 uppercase">{latestSermon.duration}</span>
                 </div>
                 <div className="h-1 w-1 bg-zinc-800 rounded-full"></div>
                 <span className="text-[8px] font-black text-zinc-700 uppercase">Assista Agora</span>
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Assistente de Oração Call to Action */}
      <section className="px-6 py-6">
         <button 
          onClick={() => onNavigate(AppView.PRAYER)}
          className="w-full bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-6 rounded-[2.5rem] flex items-center gap-5 group shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all"
         >
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <MessageSquare size={40} className="text-yellow-400" />
            </div>
            <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]">
               <BotIcon size={28} />
            </div>
            <div className="text-left">
               <h4 className="text-white font-black text-sm uppercase tracking-tight italic leading-none">Precisa de Oração?</h4>
               <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1.5">Pastor AI está pronto para ajudar você</p>
            </div>
         </button>
      </section>

      {/* Nossa Localização Bar */}
      <section className="px-6 py-4">
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
      </section>

      {/* Immersive Gallery */}
      <section className="px-6 py-4 pb-20">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800"></div>
          <h3 className="font-black text-zinc-500 text-[10px] uppercase tracking-[0.4em]">Visual Feed</h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {safeGallery.length > 0 ? safeGallery.slice(0, 2).map(img => (
              <div key={img.id} onClick={() => onNavigate(AppView.GALLERY)} className="relative aspect-square rounded-[2rem] overflow-hidden border border-zinc-900 cursor-pointer active:scale-95 transition-all group shadow-lg">
                <img src={img.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={img.title} />
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

// Fix: Use React.FC for FuturisticAction to handle standard props like 'key' correctly
const FuturisticAction: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, color: string, isSpotify?: boolean }> = ({ icon, label, onClick, color, isSpotify }) => {
  const colorMap: Record<string, string> = {
    yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
    blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    purple: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    green: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
  };
  
  const activeColor = colorMap[color] || colorMap.yellow;

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-3 active:scale-95 transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl transition-all group-hover:scale-110 ${activeColor}`}>
        {icon}
      </div>
      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
        {label}
      </span>
    </button>
  );
};

// Fix: Use React.FC for CyberCard to allow 'key' prop in JSX mappings and avoid TypeScript errors on line 200
const CyberCard: React.FC<{ title: string, date: string, image: string }> = ({ title, date, image }) => (
  <div className="relative w-72 shrink-0 aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-zinc-900 group shadow-2xl cursor-pointer active:scale-95 transition-all">
    <img 
      src={image} 
      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-[2000ms] group-hover:scale-110" 
      alt={title}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-[8px] font-black text-yellow-400 uppercase tracking-[0.3em]">{date}</span>
      </div>
      <h4 className="text-white font-black text-sm uppercase italic tracking-tighter leading-tight line-clamp-1">{title}</h4>
    </div>
  </div>
);

// Fix: Use React.FC for BotIcon helper component to ensure consistent typing
const BotIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export default HomeView;
