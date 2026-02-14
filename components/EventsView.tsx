
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { ChurchEvent } from '../types';

const EventsView: React.FC<{data: ChurchEvent[]}> = ({ data }) => {
  return (
    <div className="animate-fadeIn pb-6 bg-black h-full">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">Eventos</h2>
        <p className="text-zinc-500 text-sm font-medium">Participe da vida da nossa comunidade.</p>
      </div>

      <div className="px-6 space-y-6">
        {data.length > 0 ? data.map((event) => (
          <div key={event.id} className="bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-800 transition-transform active:scale-[0.98]">
            <div className="relative h-48">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute top-4 right-4 bg-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black text-black shadow-xl">
                {event.price}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{event.title}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <Clock size={18} className="text-yellow-400" />
                  <span className="font-bold tracking-tight">{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <MapPin size={18} className="text-yellow-400" />
                  <span className="font-bold tracking-tight">{event.location}</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-300 transition-all uppercase tracking-[0.2em] text-xs shadow-lg shadow-yellow-400/10">
                Garantir Vaga
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center">
             <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">Nenhum evento agendado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsView;
