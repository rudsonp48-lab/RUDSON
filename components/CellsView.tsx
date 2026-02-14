
import React from 'react';
import { MapPin, Clock, User, MessageCircle } from 'lucide-react';
import { Cell } from '../types';

interface CellsViewProps {
  data: Cell[];
}

const CellsView: React.FC<CellsViewProps> = ({ data }) => {
  return (
    <div className="animate-fadeIn pb-6 bg-black h-full">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">Nossas Células</h2>
        <p className="text-zinc-500 text-sm font-medium">Encontre um grupo perto de você.</p>
      </div>

      <div className="px-6 space-y-4">
        {data.length > 0 ? data.map((cell) => (
          <div key={cell.id} className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-6 group hover:border-yellow-400/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight italic">{cell.name}</h3>
                <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest">{cell.location}</span>
              </div>
              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black">
                {cell.members} MEMBROS
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-zinc-400 text-xs">
                <User size={14} className="text-yellow-400" />
                <span>Anfitrião: <b className="text-zinc-200">{cell.host}</b></span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-xs">
                <Clock size={14} className="text-yellow-400" />
                <span>Toda <b className="text-zinc-200">{cell.day} às {cell.time}</b></span>
              </div>
            </div>

            <button className="w-full bg-zinc-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all border border-zinc-800 hover:bg-zinc-800">
              <MessageCircle size={18} className="text-emerald-500" />
              <span className="uppercase text-[10px] tracking-widest">Quero Participar</span>
            </button>
          </div>
        )) : (
          <div className="py-20 text-center">
            <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Nenhuma célula cadastrada.</p>
          </div>
        )}

        <div className="p-8 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] mt-8">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Quer abrir sua casa para uma célula?
          </p>
          <button className="mt-4 text-yellow-400 font-black text-sm uppercase tracking-tighter italic border-b-2 border-yellow-400">
            Falar com a Liderança
          </button>
        </div>
      </div>
    </div>
  );
};

export default CellsView;
