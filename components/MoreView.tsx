
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Settings, 
  LogOut, 
  Users, 
  ChevronRight, 
  Music,
  StickyNote,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Heart,
  Camera,
  Save,
  X,
  User as UserIcon,
  Mail
} from 'lucide-react';
import { AppData } from '../types';

interface Note {
  id: string;
  text: string;
  date: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  phone: string;
}

interface MoreViewProps {
  onAdminClick: () => void;
  onLogout: () => void;
  isAdmin: boolean;
  data: AppData;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const MoreView: React.FC<MoreViewProps> = ({ onAdminClick, onLogout, isAdmin, data, userProfile, onUpdateProfile }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('church_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('church_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNoteText.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      text: newNoteText,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setNotes([note, ...notes]);
    setNewNoteText('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditForm(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="animate-fadeIn bg-black h-full pb-32">
      {/* Header Perfil */}
      <div className="px-6 py-10 bg-zinc-950 border-b border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div 
            onClick={() => setIsEditing(true)}
            className="w-20 h-20 bg-yellow-400 rounded-[2rem] flex items-center justify-center text-black shrink-0 overflow-hidden border-4 border-zinc-900 shadow-2xl cursor-pointer relative group"
          >
            <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">{isAdmin ? 'Administrador' : 'Membro Oficial'}</span>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none mt-1">
              {userProfile.name}
            </h3>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-zinc-500 text-[9px] font-bold mt-2 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full hover:bg-zinc-900 transition-colors"
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Pastoral Admin - Visível apenas para isAdmin */}
      {isAdmin && (
        <div className="px-6 -mt-6 relative z-20">
          <button 
            onClick={onAdminClick}
            className="w-full bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between group active:scale-95 transition-all shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black">
                <Lock size={22} />
              </div>
              <div className="text-left">
                <h4 className="text-white font-black text-sm uppercase tracking-tight italic">Gestão Pastoral</h4>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">Administrar Igreja</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-700 group-hover:text-yellow-400 transition-colors" />
          </button>
        </div>
      )}

      {/* Notes Section */}
      <div className="p-6">
        <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <StickyNote size={18} className="text-yellow-400" />
                <h4 className="text-white font-black text-sm uppercase tracking-tighter italic">Notas do Culto</h4>
             </div>
             <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{notes.length} SALVAS</span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <input 
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Anotar algo precioso..."
              className="flex-1 bg-black border border-zinc-800 text-white text-xs py-3 px-4 rounded-xl outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
            />
            <button 
              onClick={addNote}
              className="bg-yellow-400 text-black p-3 rounded-xl active:scale-95 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
            {notes.map(note => (
              <div key={note.id} className="bg-zinc-900/50 p-4 rounded-2xl flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-black text-zinc-600 uppercase mb-1 block">{note.date}</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{note.text}</p>
                </div>
                <button onClick={() => deleteNote(note.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-6 space-y-3">
        <MenuItem 
          icon={<Music size={20} className="text-[#1DB954]" />} 
          label="Louvores Gospel (Spotify)" 
          onClick={() => window.open(data.config.spotifyUrl, '_blank')} 
        />
        <MenuItem 
          icon={<MapPin size={20} className="text-blue-500" />} 
          label="Nossa Localização" 
          onClick={() => window.open(data.config.mapsUrl, '_blank')} 
        />
        <MenuItem 
          icon={<Heart size={20} className="text-red-500" />} 
          label="Nossas Células" 
          onClick={() => {}} 
        />
        <MenuItem 
          icon={<Phone size={20} className="text-emerald-500" />} 
          label="Contato da Igreja" 
          onClick={() => {}} 
        />
        
        <div className="pt-6">
          <button 
            onClick={onLogout}
            className="w-full py-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:bg-zinc-800 transition-colors"
          >
            <LogOut size={16} /> Sair do App
          </button>
        </div>
      </div>

      {/* Modal de Edição de Perfil */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden animate-slideUp">
            <div className="p-8 pb-4 flex items-center justify-between border-b border-zinc-900">
               <div>
                  <h3 className="text-white text-xl font-black uppercase italic tracking-tighter">Editar Perfil</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Atualize seus dados pessoais</p>
               </div>
               <button 
                onClick={() => setIsEditing(false)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
               >
                 <X size={24} />
               </button>
            </div>

            <div className="p-8 space-y-6">
               <div className="flex justify-center">
                  <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                    <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-2xl">
                      <img src={editForm.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-black border-4 border-zinc-950 shadow-xl group-hover:scale-110 transition-transform">
                      <Camera size={18} />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Nome Completo</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input 
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                        placeholder="Seu nome"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input 
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input 
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
               </div>

               <button 
                onClick={saveProfile}
                className="w-full bg-yellow-400 text-black font-black py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-yellow-400/20 uppercase tracking-[0.2em] text-[10px]"
               >
                 <Save size={16} /> Salvar Alterações
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-zinc-950 border border-zinc-900 rounded-[2rem] active:scale-[0.98] transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-black rounded-xl border border-zinc-800">{icon}</div>
      <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{label}</span>
    </div>
    <ChevronRight size={16} className="text-zinc-700" />
  </button>
);

export default MoreView;
