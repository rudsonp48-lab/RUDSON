
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, X, Loader2, Mic } from 'lucide-react';
import { askBibleQuestion, generatePrayer } from '../services/gemini';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
}

const PrayerAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: 'Olá! Sou o seu Assistente Frutos do Espírito. Como posso ajudar na sua caminhada de fé hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let response = "";
    if (textToSend.toLowerCase().includes('ore') || textToSend.toLowerCase().includes('oração') || textToSend.toLowerCase().includes('reza')) {
        response = await generatePrayer(textToSend);
    } else {
        response = await askBibleQuestion(textToSend);
    }

    const botMsg: Message = { id: (Date.now() + 1).toString(), type: 'bot', content: response };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full bg-black">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-950 flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-xl shrink-0">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="font-black text-white uppercase italic tracking-tighter">Pastor AI</h3>
          <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Atendimento 24h</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[90%] ${m.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                m.type === 'user' ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-zinc-900 border-zinc-800 text-yellow-400'
              }`}>
                {m.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                m.type === 'user' 
                  ? 'bg-yellow-400 text-black font-bold rounded-tr-none' 
                  : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-yellow-400/50">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Buscando orientação...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 border-t border-zinc-900 bg-zinc-950">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Fale ou digite seu pedido..."
              className="w-full bg-black border border-zinc-800 text-white rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all shadow-inner placeholder:text-zinc-700"
            />
            <button 
              onClick={startVoiceInput}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-yellow-400 text-black' : 'text-zinc-500 hover:text-yellow-400'}`}
            >
              <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
            </button>
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={loading}
            className="w-14 h-14 bg-yellow-400 text-black rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={22} />
          </button>
        </div>
        <p className="text-[9px] text-zinc-700 font-bold text-center mt-4 uppercase tracking-[0.2em]">Pesquisa de Sintaxe e Voz Ativada</p>
      </div>
    </div>
  );
};

export default PrayerAssistant;
