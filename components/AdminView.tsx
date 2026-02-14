
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
  Image as ImageIcon
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
          className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-yellow-400/10 active:scale-95 transition-all"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
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
            <div className="bg-yellow-400/5 border border-yellow-400/10 p-5 rounded-3xl flex items-start gap-4 mb-6">
              <Info className="text-yellow-400 shrink-0 mt-0.5" size={18} />
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                Importante: O link do vídeo deve ser direto (ex: .mp4). Links de YouTube não são suportados nativamente pelo player customizado.
              </p>
            </div>
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

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <button onClick={addEmptyPhoto} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Adicionar Foto
            </button>
            {safeGallery.map(img => (
              <div key={img.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Foto ID: {img.id.slice(-4)}</span>
                  <button onClick={() => setData({...data, gallery: safeGallery.filter(i => i.id !== img.id)})} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <AdminField label="Título" value={img.title} onChange={(v) => setData({...data, gallery: safeGallery.map(i => i.id === img.id ? {...i, title: v} : i)})} />
                    <AdminField label="URL da Imagem" value={img.url} onChange={(v) => setData({...data, gallery: safeGallery.map(i => i.id === img.id ? {...i, url: v} : i)})} icon={<LinkIcon size={12} />} />
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Categoria</label>
                       <select 
                        value={img.category}
                        onChange={(e) => setData({...data, gallery: safeGallery.map(i => i.id === img.id ? {...i, category: e.target.value} : i)})}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white text-[10px] font-black uppercase px-4 py-3 rounded-xl outline-none"
                       >
                         <option value="Cultos">Cultos</option>
                         <option value="Eventos">Eventos</option>
                         <option value="Comunidade">Comunidade</option>
                       </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cells' && (
          <div className="space-y-4">
            <button onClick={addEmptyCell} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Nova Célula
            </button>
            {safeCells.map(cell => (
              <div key={cell.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-black uppercase italic tracking-tighter">{cell.name}</h4>
                  <button onClick={() => setData({...data, cells: safeCells.filter(c => c.id !== cell.id)})} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <AdminField label="Nome da Célula" value={cell.name} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, name: v} : c)})} />
                <AdminField label="Anfitrião" value={cell.host} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, host: v} : c)})} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Dia" value={cell.day} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, day: v} : c)})} />
                  <AdminField label="Hora" value={cell.time} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, time: v} : c)})} />
                </div>
                <AdminField label="Bairro" value={cell.location} onChange={(v) => setData({...data, cells: safeCells.map(c => c.id === cell.id ? {...c, location: v} : c)})} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <button onClick={addEmptyEvent} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-yellow-400 transition-all">
              <Plus size={14} /> Novo Evento
            </button>
            {safeEvents.map(event => (
              <div key={event.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-black uppercase italic tracking-tighter">{event.title}</h4>
                  <button onClick={() => setData({...data, events: safeEvents.filter(ev => ev.id !== event.id)})} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <AdminField label="Título" value={event.title} onChange={(v) => setData({...data, events: safeEvents.map(ev => ev.id === event.id ? {...ev, title: v} : ev)})} />
                <AdminField label="URL da Imagem" value={event.image} onChange={(v) => setData({...data, events: safeEvents.map(ev => ev.id === event.id ? {...ev, image: v} : ev)})} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Data" value={event.date} onChange={(v) => setData({...data, events: safeEvents.map(ev => ev.id === event.id ? {...ev, date: v} : ev)})} />
                  <AdminField label="Preço" value={event.price} onChange={(v) => setData({...data, events: safeEvents.map(ev => ev.id === event.id ? {...ev, price: v} : ev)})} />
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
