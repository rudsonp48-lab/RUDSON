
import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Calendar, 
  Camera, 
  Save, 
  ChevronLeft,
  Loader2,
  Users,
  MapPin,
  Link as LinkIcon,
  PlayCircle,
  Clock,
  User as UserIcon,
  Video,
  Info,
  Type,
  Image as ImageIcon,
  Youtube,
  DollarSign,
  Tag
} from 'lucide-react';
import { loadAppData, saveAppData } from '../services/storage';
import { AppData, ChurchEvent, GalleryImage, Cell, Sermon } from '../types';

const AdminView: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [data, setData] = useState<AppData>(loadAppData());
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'events' | 'gallery' | 'cells' | 'sermons'>('config');

  const handleSave = () => {
    setIsSaving(true);
    saveAppData(data);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const addEmptyEvent = () => {
    const newEvent: ChurchEvent = {
      id: Date.now().toString(),
      title: 'Novo Evento',
      date: 'Definir Data',
      time: '00:00',
      location: 'Templo Sede',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
      price: 'Grátis'
    };
    setData({ ...data, events: [newEvent, ...(data.events || [])] });
  };

  const addEmptySermon = () => {
    const newSermon: Sermon = {
      id: Date.now().toString(),
      title: 'Nova Mensagem',
      speaker: 'Pregador',
      date: 'Recente',
      duration: '00:00',
      thumbnail: 'https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=400',
      videoUrl: ''
    };
    setData({ ...data, sermons: [newSermon, ...(data.sermons || [])] });
  };

  const addEmptyCell = () => {
    const newCell: Cell = {
      id: Date.now().toString(),
      name: 'Nova Célula',
      host: 'Anfitrião',
      day: 'Dia da Semana',
      time: '20:00',
      location: 'Bairro',
      members: 0
    };
    setData({ ...data, cells: [newCell, ...(data.cells || [])] });
  };

  const addEmptyPhoto = () => {
    const newPhoto: GalleryImage = {
      id: Date.now().toString(),
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
      title: 'Nova Foto',
      category: 'Cultos'
    };
    setData({ ...data, gallery: [newPhoto, ...(data.gallery || [])] });
  };

  const safeEvents = data.events || [];
  const safeCells = data.cells || [];
  const safeGallery = data.gallery || [];
  const safeSermons = data.sermons || [];

  return (
    <div className="animate-fadeIn bg-black min-h-full pb-32">
      <div className="p-6 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-zinc-400 bg-zinc-900 rounded-xl active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-white font-black uppercase italic tracking-tighter leading-none">Gestão Pastoral</h2>
            <p className="text-[9px] text-yellow-400 font-black uppercase tracking-widest mt-1">Painel de Controle</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-yellow-400 text-black px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-yellow-400/10 active:scale-95 transition-all"
        >
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Salvar Alterações
        </button>
      </div>

      <div className="flex p-4 gap-2 overflow-x-auto no-scrollbar bg-black/50 backdrop-blur-md sticky top-[81px] z-10 border-b border-zinc-900/50">
        <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={14} />} label="Geral" />
        <TabButton active={activeTab === 'sermons'} onClick={() => setActiveTab('sermons')} icon={<PlayCircle size={14} />} label="Vídeos" />
        <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<Camera size={14} />} label="Galeria" />
        <TabButton active={activeTab === 'cells'} onClick={() => setActiveTab('cells')} icon={<Users size={14} />} label="Células" />
        <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={14} />} label="Agenda" />
      </div>

      <div className="p-6">
        {activeTab === 'config' && (
          <div className="space-y-6">
            <AdminField label="Nome da Igreja" value={data.config?.name || ''} onChange={(v) => setData({ ...data, config: { ...data.config, name: v } })} />
            <AdminField label="Chave PIX (Dízimos)" value={data.config?.pixKey || ''} onChange={(v) => setData({ ...data, config: { ...data.config, pixKey: v } })} />
            
            <div className="pt-6 border-t border-zinc-900 mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Youtube size={16} className="text-red-500" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Transmissão ao Vivo</h3>
              </div>
              <AdminField label="Título da Live Atual" value={data.config?.liveTitle || ''} onChange={(v) => setData({ ...data, config: { ...data.config, liveTitle: v } })} />
              <AdminField label="ID do Vídeo ou Canal YouTube" value={data.config?.youtubeLiveId || ''} onChange={(v) => setData({ ...data, config: { ...data.config, youtubeLiveId: v } })} placeholder="Ex: live ou ID do vídeo" icon={<LinkIcon size={14} />} />
              <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest px-1">
                Dica: Para transmitir o que estiver ao vivo no canal, use o ID do canal ou "live".
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-900 mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-yellow-400" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Localização e Links</h3>
              </div>
              <AdminField label="Endereço (Texto)" value={data.config?.address || ''} onChange={(v) => setData({ ...data, config: { ...data.config, address: v } })} />
              <AdminField label="Link Google Maps" value={data.config?.mapsUrl || ''} onChange={(v) => setData({ ...data, config: { ...data.config, mapsUrl: v } })} icon={<LinkIcon size={14} />} />
            </div>
          </div>
        )}

        {activeTab === 'sermons' && (
          <div className="space-y-6">
            <button onClick={addEmptySermon} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Nova Mensagem
            </button>
            {safeSermons.map(sermon => (
              <div key={sermon.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Pregação</span>
                  <button onClick={() => setData({...data, sermons: safeSermons.filter(s => s.id !== sermon.id)})} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <AdminField label="Título" value={sermon.title} onChange={(v) => setData({...data, sermons: safeSermons.map(s => s.id === sermon.id ? {...s, title: v} : s)})} />
                <AdminField label="Link do Vídeo (MP4/URL)" value={sermon.videoUrl} onChange={(v) => setData({...data, sermons: safeSermons.map(s => s.id === sermon.id ? {...s, videoUrl: v} : s)})} icon={<Video size={14} />} placeholder="https://exemplo.com/video.mp4" />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Pregador" value={sermon.speaker} onChange={(v) => setData({...data, sermons: safeSermons.map(s => s.id === sermon.id ? {...s, speaker: v} : s)})} />
                  <AdminField label="Duração" value={sermon.duration} onChange={(v) => setData({...data, sermons: safeSermons.map(s => s.id === sermon.id ? {...s, duration: v} : s)})} />
                </div>
                <AdminField label="Thumbnail URL" value={sermon.thumbnail} onChange={(v) => setData({...data, sermons: safeSermons.map(s => s.id === sermon.id ? {...s, thumbnail: v} : s)})} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <button onClick={addEmptyEvent} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Novo Evento
            </button>
            {safeEvents.map(event => (
              <div key={event.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Evento Pastoral</span>
                  <button onClick={() => setData({...data, events: safeEvents.filter(e => e.id !== event.id)})} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <AdminField label="Título do Evento" value={event.title} onChange={(v) => setData({...data, events: safeEvents.map(e => e.id === event.id ? {...e, title: v} : e)})} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Data (Ex: 10 Jan)" value={event.date} onChange={(v) => setData({...data, events: safeEvents.map(e => e.id === event.id ? {...e, date: v} : e)})} icon={<Calendar size={14} />} />
                  <AdminField label="Horário" value={event.time} onChange={(v) => setData({...data, events: safeEvents.map(e => e.id === event.id ? {...e, time: v} : e)})} icon={<Clock size={14} />} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Local" value={event.location} onChange={(v) => setData({...data, events: safeEvents.map(e => e.id === event.id ? {...e, location: v} : e)})} icon={<MapPin size={14} />} />
                  <AdminField label="Preço / Valor" value={event.price} onChange={(v) => setData({...data, events: safeEvents.map(e => e.id === event.id ? {...e, price: v} : e)})} icon={<DollarSign size={14} />} />
                </div>
                <AdminField label="URL da Imagem de Capa" value={event.image} onChange={(v) => setData({...data, events: safeEvents.map(e => e.id === event.id ? {...e, image: v} : e)})} icon={<ImageIcon size={14} />} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <button onClick={addEmptyPhoto} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Adicionar Foto
            </button>
            <div className="grid grid-cols-1 gap-4">
              {safeGallery.map(photo => (
                <div key={photo.id} className="bg-zinc-950 border border-zinc-900 p-5 rounded-[2rem] flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-zinc-800">
                    <img src={photo.url} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <AdminField label="Título" value={photo.title} onChange={(v) => setData({...data, gallery: safeGallery.map(p => p.id === photo.id ? {...p, title: v} : p)})} />
                    <div className="grid grid-cols-2 gap-2">
                       <AdminField label="Categoria" value={photo.category} onChange={(v) => setData({...data, gallery: safeGallery.map(p => p.id === photo.id ? {...p, category: v} : p)})} icon={<Tag size={12} />} />
                       <AdminField label="URL Foto" value={photo.url} onChange={(v) => setData({...data, gallery: safeGallery.map(p => p.id === photo.id ? {...p, url: v} : p)})} />
                    </div>
                  </div>
                  <button onClick={() => setData({...data, gallery: safeGallery.filter(p => p.id !== photo.id)})} className="p-3 text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cells' && (
          <div className="space-y-6">
            <button onClick={addEmptyCell} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Nova Célula
            </button>
            {safeCells.map(cell => (
              <div key={cell.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2.5rem] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Grupo Familiar</span>
                  <button onClick={() => setData({...data, cells: safeCells.filter(c => c.id !== cell.id)})} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <AdminField label="Nome da Célula" value={cell.name} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, name: v} : c)})} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Líder / Anfitrião" value={cell.host} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, host: v} : c)})} icon={<UserIcon size={14} />} />
                  <AdminField label="Bairro / Local" value={cell.location} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, location: v} : c)})} icon={<MapPin size={14} />} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Dia" value={cell.day} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, day: v} : c)})} icon={<Calendar size={14} />} />
                  <AdminField label="Hora" value={cell.time} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, time: v} : c)})} icon={<Clock size={14} />} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${active ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
    {icon} {label}
  </button>
);

const AdminField = ({ label, value, onChange, icon, placeholder }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode, placeholder?: string }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</div>}
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-xs focus:ring-1 focus:ring-yellow-400 outline-none transition-all ${icon ? 'pl-10' : ''}`} 
      />
    </div>
  </div>
);

export default AdminView;
