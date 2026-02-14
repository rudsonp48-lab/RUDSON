
import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { GalleryImage } from '../types';

const GalleryView: React.FC<{data: GalleryImage[]}> = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todas');

  const galleryData = data || [];
  const categories = ['Todas', 'Cultos', 'Eventos', 'Comunidade'];
  
  const filteredData = activeCategory === 'Todas' 
    ? galleryData 
    : galleryData.filter(img => img.category === activeCategory);

  return (
    <div className="animate-fadeIn min-h-full bg-black">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-400">
            <Camera size={20} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Momentos Preciosos</h2>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Nossa história através das lentes</p>
      </div>

      <div className="flex gap-2 px-6 mb-8 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' 
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-6 grid grid-cols-2 gap-4 pb-24">
        {filteredData.length > 0 ? filteredData.map((img) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-square rounded-[2rem] overflow-hidden border border-zinc-900 bg-zinc-900 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <img 
              src={img.url} 
              alt={img.title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">{img.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-[8px] font-black uppercase tracking-tighter">{img.category}</span>
                </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 py-20 text-center">
            <p className="text-zinc-700 font-black uppercase tracking-widest text-xs">Nenhuma foto encontrada nesta categoria.</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fadeIn">
          <div className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-zinc-900">
             <div>
                <h3 className="text-white font-black uppercase italic tracking-tighter leading-none">{selectedImage.title}</h3>
                <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest mt-1">{selectedImage.category}</p>
             </div>
             <button onClick={() => setSelectedImage(null)} className="p-3 bg-zinc-900 text-white rounded-2xl border border-zinc-800 active:scale-90 transition-all"><X size={20} /></button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={selectedImage.url} 
              decoding="async"
              className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
              alt={selectedImage.title} 
            />
          </div>
          <div className="p-8 bg-zinc-950/50 border-t border-zinc-900 text-center">
             <button onClick={() => setSelectedImage(null)} className="px-12 py-4 bg-yellow-400 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95 transition-all">Fechar Visualização</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
