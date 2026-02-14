
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Radio, Users, Heart, Share2, Play, Pause, Volume2, Maximize2, Youtube, Loader2 } from 'lucide-react';
import { askBibleQuestion } from '../services/gemini';
import { ChurchConfig } from '../types';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  isIA?: boolean;
}

const LiveView: React.FC<{data: ChurchConfig}> = ({ data }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Pastor AI', content: 'Seja bem-vindo à nossa transmissão! Digite sua dúvida sobre a palavra aqui e eu ajudarei você.', isIA: true },
    { id: '2', user: 'Comunidade', content: 'Amém! Glória a Deus por esse culto.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = { id: Date.now().toString(), user: 'Você', content: input };
    setMessages(prev => [...prev, newMsg]);
    const currentInput = input;
    setInput('');

    if (currentInput.includes('?') || currentInput.length > 20) {
      setIsTyping(true);
      const aiResponse = await askBibleQuestion(currentInput);
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        user: 'Pastor AI', 
        content: aiResponse, 
        isIA: true 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }
  };

  // URL do YouTube Embed para Live
  // Se for um ID de vídeo: embed/ID
  // Se for um ID de canal: embed/live?channel=ID
  const youtubeUrl = data.youtubeLiveId.length > 15 
    ? `https://www.youtube.com/embed/live?channel=${data.youtubeLiveId}&autoplay=1`
    : `https://www.youtube.com/embed/${data.youtubeLiveId}?autoplay=1`;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Video Player Section */}
      <div className="relative aspect-video bg-zinc-950 border-b border-zinc-900 group overflow-hidden">
        {!data.youtubeLiveId ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
             <Youtube size={48} className="text-zinc-800 mb-4" />
             <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
               Nenhuma transmissão configurada no momento.
             </p>
          </div>
        ) : (
          <>
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-950">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mb-4" />
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Iniciando Stream...</span>
              </div>
            )}
            <iframe 
              src={youtubeUrl}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsVideoLoaded(true)}
            ></iframe>
          </>
        )}
        
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
          <div className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-2 shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">AO VIVO</span>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-6 bg-zinc-950 border-b border-zinc-900">
        <h2 className="text-white font-black text-xl uppercase italic tracking-tighter leading-tight">{data.liveTitle || 'Culto Online'}</h2>
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black italic shadow-lg shadow-yellow-400/10">FE</div>
                <div>
                    <p className="text-white text-xs font-bold uppercase tracking-tight">{data.name}</p>
                    <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Canal Oficial da Igreja</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="p-2 text-zinc-400 hover:text-yellow-400 active:scale-90 transition-all"><Heart size={20} /></button>
                <button className="p-2 text-zinc-400 hover:text-yellow-400 active:scale-90 transition-all"><Share2 size={20} /></button>
            </div>
        </div>
      </div>

      {/* Live Chat Section */}
      <div className="flex-1 flex flex-col min-h-0 bg-black">
        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Interatividade Digital</span>
            <div className="flex items-center gap-1.5">
                <Radio size={12} className="text-yellow-400" />
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">Feed em Tempo Real</span>
            </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.isIA ? 'bg-yellow-400/5 border border-yellow-400/10 p-4 rounded-2xl' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        m.isIA ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}>
                        {m.isIA ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-black uppercase tracking-tight ${m.isIA ? 'text-yellow-400' : 'text-zinc-400'}`}>{m.user}</span>
                            {m.isIA && <Sparkles size={10} className="text-yellow-400" />}
                        </div>
                        <p className={`text-xs leading-relaxed font-medium ${m.isIA ? 'text-zinc-200' : 'text-zinc-400'}`}>{m.content}</p>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex gap-3 px-1 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                        <Bot size={14} className="text-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                        <div className="h-2 w-24 bg-zinc-900 rounded"></div>
                        <div className="h-2 w-16 bg-zinc-900 rounded"></div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-zinc-900 bg-zinc-950">
            <div className="flex gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
                    placeholder="Faça uma pergunta bíblica ou comente..."
                    className="flex-1 bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-yellow-400 outline-none placeholder:text-zinc-700 transition-all shadow-inner"
                />
                <button 
                    onClick={handleSend}
                    className="w-12 h-12 bg-yellow-400 text-black rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
