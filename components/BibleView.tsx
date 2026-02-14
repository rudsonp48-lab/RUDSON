
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  Loader2, 
  Sparkles, 
  Mic, 
  ChevronLeft, 
  Book as BookIcon, 
  Check, 
  ChevronRight,
  Type as TypeIcon,
  X,
  Languages,
  RotateCcw,
  Copy,
  WifiOff,
  AlertCircle,
  History
} from 'lucide-react';
import { fetchBiblePassage, getBibleContext } from '../services/gemini';
import { BibleBook, BiblePassage } from '../types';

const BIBLE_BOOKS: BibleBook[] = [
  { name: 'Gênesis', chapters: 50, testament: 'AT' }, { name: 'Êxodo', chapters: 40, testament: 'AT' },
  { name: 'Levítico', chapters: 27, testament: 'AT' }, { name: 'Números', chapters: 36, testament: 'AT' },
  { name: 'Deuteronômio', chapters: 34, testament: 'AT' }, { name: 'Josué', chapters: 24, testament: 'AT' },
  { name: 'Juízes', chapters: 21, testament: 'AT' }, { name: 'Rute', chapters: 4, testament: 'AT' },
  { name: '1 Samuel', chapters: 31, testament: 'AT' }, { name: '2 Samuel', chapters: 24, testament: 'AT' },
  { name: '1 Reis', chapters: 22, testament: 'AT' }, { name: '2 Reis', chapters: 25, testament: 'AT' },
  { name: '1 Crônicas', chapters: 29, testament: 'AT' }, { name: '2 Crônicas', chapters: 36, testament: 'AT' },
  { name: 'Esdras', chapters: 10, testament: 'AT' }, { name: 'Neemias', chapters: 13, testament: 'AT' },
  { name: 'Ester', chapters: 10, testament: 'AT' }, { name: 'Jó', chapters: 42, testament: 'AT' },
  { name: 'Salmos', chapters: 150, testament: 'AT' }, { name: 'Provérbios', chapters: 31, testament: 'AT' },
  { name: 'Eclesiastes', chapters: 12, testament: 'AT' }, { name: 'Cantares', chapters: 8, testament: 'AT' },
  { name: 'Isaías', chapters: 66, testament: 'AT' }, { name: 'Jeremias', chapters: 52, testament: 'AT' },
  { name: 'Lamentações', chapters: 5, testament: 'AT' }, { name: 'Ezequiel', chapters: 48, testament: 'AT' },
  { name: 'Daniel', chapters: 12, testament: 'AT' }, { name: 'Oseias', chapters: 14, testament: 'AT' },
  { name: 'Joel', chapters: 3, testament: 'AT' }, { name: 'Amós', chapters: 9, testament: 'AT' },
  { name: 'Obadias', chapters: 1, testament: 'AT' }, { name: 'Jonas', chapters: 4, testament: 'AT' },
  { name: 'Miqueias', chapters: 7, testament: 'AT' }, { name: 'Naum', chapters: 3, testament: 'AT' },
  { name: 'Habacuque', chapters: 3, testament: 'AT' }, { name: 'Sofonias', chapters: 3, testament: 'AT' },
  { name: 'Ageu', chapters: 2, testament: 'AT' }, { name: 'Zacarias', chapters: 14, testament: 'AT' },
  { name: 'Malaquias', chapters: 4, testament: 'AT' },
  { name: 'Mateus', chapters: 28, testament: 'NT' }, { name: 'Marcos', chapters: 16, testament: 'NT' },
  { name: 'Lucas', chapters: 24, testament: 'NT' }, { name: 'João', chapters: 21, testament: 'NT' },
  { name: 'Atos', chapters: 28, testament: 'NT' }, { name: 'Romanos', chapters: 16, testament: 'NT' },
  { name: '1 Coríntios', chapters: 16, testament: 'NT' }, { name: '2 Coríntios', chapters: 13, testament: 'NT' },
  { name: 'Gálatas', chapters: 6, testament: 'NT' }, { name: 'Efésios', chapters: 6, testament: 'NT' },
  { name: 'Filipenses', chapters: 4, testament: 'NT' }, { name: 'Colossenses', chapters: 4, testament: 'NT' },
  { name: '1 Tessalonicenses', chapters: 5, testament: 'NT' }, { name: '2 Tessalonicenses', chapters: 3, testament: 'NT' },
  { name: '1 Timóteo', chapters: 6, testament: 'NT' }, { name: '2 Timóteo', chapters: 4, testament: 'NT' },
  { name: 'Tito', chapters: 3, testament: 'NT' }, { name: 'Filemom', chapters: 1, testament: 'NT' },
  { name: 'Hebreus', chapters: 13, testament: 'NT' }, { name: 'Tiago', chapters: 5, testament: 'NT' },
  { name: '1 Pedro', chapters: 5, testament: 'NT' }, { name: '2 Pedro', chapters: 3, testament: 'NT' },
  { name: '1 João', chapters: 5, testament: 'NT' }, { name: '2 João', chapters: 1, testament: 'NT' },
  { name: '3 João', chapters: 1, testament: 'NT' }, { name: 'Judas', chapters: 1, testament: 'NT' },
  { name: 'Apocalipse', chapters: 22, testament: 'NT' }
];

const BIBLE_VERSIONS = [
  { id: 'ARA', name: 'Almeida Revista e Atualizada' },
  { id: 'ARC', name: 'Almeida Revista e Corrigida' },
  { id: 'NVI', name: 'Nova Versão Internacional' },
  { id: 'NVT', name: 'Nova Versão Transformadora' },
  { id: 'KJA', name: 'King James Atualizada' }
];

const CACHE_PREFIX = 'bible_v3_';

const BibleView: React.FC = () => {
  // Estado inicial baseado no último acesso
  const [viewMode, setViewMode] = useState<'reader' | 'books' | 'chapters' | 'versions'>('reader');
  const [selectedBook, setSelectedBook] = useState<BibleBook>(() => {
    const last = localStorage.getItem('last_read_book');
    return last ? JSON.parse(last) : BIBLE_BOOKS[18];
  });
  const [selectedChapter, setSelectedChapter] = useState(() => {
    const last = localStorage.getItem('last_read_chapter');
    return last ? parseInt(last) : 23;
  });
  const [selectedVersion, setSelectedVersion] = useState(() => {
    return localStorage.getItem('selected_version') || 'ARA';
  });

  const [passage, setPassage] = useState<BiblePassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showControls, setShowControls] = useState(false);
  const [context, setContext] = useState<string | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sincroniza estado offline
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadProgress(progress);
    }
  };

  const loadPassage = useCallback(async (book: string = selectedBook.name, chapter: number = selectedChapter, version: string = selectedVersion) => {
    const cacheKey = `${CACHE_PREFIX}${book.toLowerCase()}_${chapter}_${version.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    
    // Persistência do último lido
    localStorage.setItem('last_read_book', JSON.stringify(selectedBook));
    localStorage.setItem('last_read_chapter', chapter.toString());
    localStorage.setItem('selected_version', version);

    if (cached) {
      setPassage(JSON.parse(cached));
      setHasError(false);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
      return;
    }

    if (!navigator.onLine) {
      setHasError(true);
      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      const result = await fetchBiblePassage(`${book} ${chapter}`, version);
      if (result) {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        setPassage(result);
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
      } else {
        setHasError(true);
      }
    } catch (e) {
      setHasError(true);
    } finally {
      setLoading(false);
      setContext(null);
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

  useEffect(() => {
    if (viewMode === 'reader') loadPassage();
  }, [selectedBook, selectedChapter, selectedVersion, loadPassage, viewMode]);

  const handleSearch = async (forcedQuery?: string) => {
    const q = forcedQuery || searchQuery;
    if (!q.trim()) return;

    // Tenta carregar do cache se for uma busca de capítulo simples
    const cacheKey = `${CACHE_PREFIX}search_${q.toLowerCase().replace(/\s/g, '')}_${selectedVersion.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const result = JSON.parse(cached);
      setPassage(result);
      const foundBook = BIBLE_BOOKS.find(b => b.name.toLowerCase() === result.book?.toLowerCase());
      if (foundBook) {
        setSelectedBook(foundBook);
        setSelectedChapter(result.chapter || 1);
      }
      setSearchQuery('');
      setViewMode('reader');
      return;
    }

    if (!navigator.onLine) {
      alert("Busca offline limitada ao que já foi lido. Tente navegar pelos livros.");
      return;
    }

    setLoading(true);
    setHasError(false);
    const result = await fetchBiblePassage(q, selectedVersion);
    if (result) {
      localStorage.setItem(cacheKey, JSON.stringify(result));
      const bookName = result.book || "";
      const foundBook = BIBLE_BOOKS.find(b => b.name.toLowerCase() === bookName.toLowerCase());
      if (foundBook) {
        setSelectedBook(foundBook);
        setSelectedChapter(result.chapter || 1);
      }
      setPassage(result);
      setSearchQuery('');
      setViewMode('reader');
    } else {
      setHasError(true);
    }
    setLoading(false);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'pt-BR';
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  if (viewMode === 'versions') {
    return (
      <div className="animate-fadeIn bg-black h-full flex flex-col">
        <div className="p-8 border-b border-zinc-900 bg-zinc-950 flex items-center gap-4">
          <button onClick={() => setViewMode('reader')} className="p-3 text-zinc-400 bg-zinc-900 rounded-2xl"><ChevronLeft /></button>
          <h2 className="text-white font-black uppercase italic tracking-tighter text-xl">Traduções</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {BIBLE_VERSIONS.map(v => (
            <button 
              key={v.id}
              onClick={() => { setSelectedVersion(v.id); setViewMode('reader'); }}
              className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all border-2 ${
                selectedVersion === v.id ? 'bg-yellow-400 text-black border-yellow-400 shadow-xl' : 'bg-zinc-900/50 text-zinc-500 border-zinc-800'
              }`}
            >
              <div className="text-left">
                <span className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${selectedVersion === v.id ? 'opacity-80' : 'opacity-40'}`}>{v.id}</span>
                <span className="font-black text-sm uppercase italic">{v.name}</span>
              </div>
              {selectedVersion === v.id && <Check size={20} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'books') {
    return (
      <div className="animate-fadeIn bg-black h-full flex flex-col">
        <div className="p-8 border-b border-zinc-900 bg-zinc-950 flex items-center gap-4">
          <button onClick={() => setViewMode('reader')} className="p-3 text-zinc-400 bg-zinc-900 rounded-2xl"><ChevronLeft /></button>
          <h2 className="text-white font-black uppercase italic tracking-tighter text-xl">Escrituras</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-12 no-scrollbar pb-32">
          {['AT', 'NT'].map(testament => (
            <div key={testament}>
              <h3 className="text-[10px] font-black text-yellow-400/40 uppercase tracking-[0.5em] mb-6 px-2">{testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</h3>
              <div className="grid grid-cols-1 gap-2">
                {BIBLE_BOOKS.filter(b => b.testament === testament).map(book => (
                  <button 
                    key={book.name} 
                    onClick={() => { setSelectedBook(book); setViewMode('chapters'); }}
                    className="w-full flex items-center justify-between bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-2xl group active:scale-[0.98] transition-all"
                  >
                    <span className="text-zinc-300 font-black uppercase text-xs italic tracking-tight group-hover:text-yellow-400">{book.name}</span>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{book.chapters} cap.</span>
                       <ChevronRight size={14} className="text-zinc-800" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'chapters') {
    return (
      <div className="animate-fadeIn bg-black h-full flex flex-col">
        <div className="p-8 border-b border-zinc-900 bg-zinc-950 flex items-center gap-4">
          <button onClick={() => setViewMode('books')} className="p-3 text-zinc-400 bg-zinc-900 rounded-2xl"><ChevronLeft /></button>
          <h2 className="text-white font-black uppercase italic tracking-tighter text-xl leading-none">{selectedBook.name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-4 gap-4 no-scrollbar pb-32">
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chap => (
            <button key={chap} onClick={() => { setSelectedChapter(chap); setViewMode('reader'); }} className={`aspect-square rounded-[1.5rem] flex items-center justify-center font-black text-base transition-all border-2 ${selectedChapter === chap ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg' : 'bg-zinc-900/50 text-zinc-600 border-zinc-800'}`}>
              {chap}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn flex flex-col h-full bg-black relative overflow-hidden">
      {/* HUD Reading Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 z-[100]">
        <div className="h-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all duration-300" style={{ width: `${readProgress}%` }}></div>
      </div>

      {/* Futuristic Header HUD */}
      <div className="px-6 pt-10 pb-6 bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-900 z-20">
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative group">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="Referência ou Tema... (Ex: Jo 3 ou Amor)"
              className="w-full bg-zinc-900/40 border-2 border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-12 text-xs font-bold focus:ring-1 focus:ring-yellow-400/50 outline-none transition-all placeholder:text-zinc-700"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-yellow-400 transition-colors" size={18} />
            <button onClick={startVoiceSearch} className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-700 hover:text-yellow-400'}`}>
              <Mic size={20} />
            </button>
          </div>
          <button onClick={() => setShowControls(!showControls)} className={`p-4 rounded-2xl active:scale-95 transition-all border-2 ${showControls ? 'bg-yellow-400 text-black border-yellow-400 shadow-xl' : 'bg-zinc-900 text-yellow-400 border-zinc-800'}`}>
            <TypeIcon size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setViewMode('books')} className="flex-1 flex items-center justify-between bg-zinc-900/60 px-6 py-4 rounded-[1.5rem] border border-zinc-800 active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <BookIcon size={18} className="text-yellow-400" />
              <span className="font-black text-white uppercase text-[11px] tracking-[0.1em] truncate italic">
                {passage?.reference || `${selectedBook.name} ${selectedChapter}`}
              </span>
            </div>
            <ChevronDown size={14} className="text-zinc-600" />
          </button>
          <button onClick={() => setViewMode('versions')} className="bg-zinc-900/60 border border-zinc-800 px-5 py-4 rounded-[1.5rem] flex items-center gap-3 active:scale-95 transition-all">
            <Languages size={16} className="text-yellow-400" />
            <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">{selectedVersion}</span>
          </button>
        </div>

        {isOfflineMode && (
          <div className="mt-4 flex items-center justify-center gap-2">
             <WifiOff size={10} className="text-zinc-600" />
             <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Arquivo Local: Modo Offline</span>
          </div>
        )}
      </div>

      {/* Reader Engine */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-8 space-y-12 no-scrollbar overflow-y-auto pb-48 scroll-smooth bg-[radial-gradient(circle_at_top,_#0a0a0a_0%,_#000000_100%)]"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-8 py-24">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-yellow-400/5 rounded-full animate-ping"></div>
              <Loader2 className="absolute inset-0 m-auto animate-spin text-yellow-400" size={48} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.6em] mb-2 animate-pulse">Sintonizando</p>
              <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Neural Bible Engine</p>
            </div>
          </div>
        ) : hasError ? (
          <div className="h-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-4">Sinal Interrompido</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs mb-10">
              {isOfflineMode ? "Conecte-se à internet para acessar novos capítulos." : "Muitas requisições. O sistema está aguardando para sintonizar novamente."}
            </p>
            <button onClick={() => loadPassage()} className="px-10 py-5 bg-yellow-400 text-black font-black rounded-3xl text-[11px] uppercase tracking-widest flex items-center gap-4 active:scale-95 transition-all shadow-xl shadow-yellow-400/20">
               <RotateCcw size={18} /> Forçar Sintonização
            </button>
          </div>
        ) : passage ? (
          <>
            <div className="text-center pb-12 pt-10">
              {/* @ts-ignore passage.book now exists on the interface */}
              <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">{passage.book || selectedBook.name}</h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-yellow-400/20"></div>
                {/* @ts-ignore passage.chapter now exists on the interface */}
                <span className="text-yellow-400 font-black text-lg tracking-[0.2em] uppercase italic bg-yellow-400/5 px-6 py-2 rounded-full border border-yellow-400/10">Capítulo {passage.chapter || selectedChapter}</span>
                <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-yellow-400/20"></div>
              </div>
            </div>
            
            <div className="space-y-10 max-w-xl mx-auto pb-10 border-b border-zinc-900/50">
              {passage.verses.map((v) => (
                <div key={v.num} className="group relative">
                  <div className="flex gap-8">
                    <span className="text-yellow-400/20 font-black text-xs shrink-0 mt-3 group-hover:text-yellow-400 transition-colors w-8 text-right tabular-nums italic">{v.num}</span>
                    <p 
                      className="text-zinc-300 leading-[1.9] font-medium group-hover:text-zinc-100 transition-all text-justify"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {v.text}
                    </p>
                  </div>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(`${v.text} (${passage.reference})`); }}
                    className="absolute -right-4 top-0 p-3 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-yellow-400 transition-all"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="py-24 flex flex-col items-center gap-6">
               <button onClick={async () => {
                 setLoadingContext(true);
                 setShowContextModal(true);
                 const result = await getBibleContext(selectedBook.name, selectedChapter);
                 setContext(result);
                 setLoadingContext(false);
               }} className="px-12 py-6 bg-zinc-900/30 border-2 border-zinc-800 rounded-[2.5rem] text-yellow-400 font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-5 active:scale-95 transition-all hover:bg-zinc-900 hover:border-yellow-400/30 shadow-2xl">
                  <Sparkles size={20} /> Insight Teológico IA
               </button>
               <div className="flex flex-col items-center gap-1 opacity-20">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.5em]">Powered by Gemini 3 Flash</p>
                  <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest italic">Offline Cache V3 Activated</p>
               </div>
            </div>
          </>
        ) : (
          <div className="text-center py-32 flex flex-col items-center">
            <BookIcon size={80} className="text-zinc-900 mb-10 animate-pulse" />
            <p className="text-zinc-700 text-[12px] font-black uppercase tracking-[0.4em] max-w-[260px] leading-relaxed italic">Inicie sua jornada nas Escrituras.</p>
            <button onClick={() => loadPassage()} className="mt-12 text-yellow-400 flex items-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] border-2 border-yellow-400/10 px-10 py-5 rounded-[2rem] hover:bg-yellow-400/5 transition-all active:scale-95">
              <RotateCcw size={18} /> Recarregar Último Lindo
            </button>
          </div>
        )}
      </div>

      {/* Floating UI Navigation HUD */}
      {!loading && !hasError && passage && (
        <div className="absolute bottom-10 left-0 w-full px-8 flex justify-between gap-5 z-30">
          <button 
            onClick={() => {
              if (selectedChapter > 1) setSelectedChapter(prev => prev - 1);
              else {
                const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
                if (idx > 0) {
                  const prevBook = BIBLE_BOOKS[idx - 1];
                  setSelectedBook(prevBook);
                  setSelectedChapter(prevBook.chapters);
                }
              }
            }}
            className="flex-1 py-6 bg-zinc-950/80 backdrop-blur-3xl rounded-[2.5rem] border-2 border-zinc-900 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all"
          >
            <ChevronLeft size={24} strokeWidth={3} /> <span className="hidden xs:inline">Voltar</span>
          </button>
          <button 
            onClick={() => {
              if (selectedChapter < selectedBook.chapters) setSelectedChapter(prev => prev + 1);
              else {
                const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
                if (idx < BIBLE_BOOKS.length - 1) {
                  setSelectedBook(BIBLE_BOOKS[idx + 1]);
                  setSelectedChapter(1);
                }
              }
            }}
            className="flex-1 py-6 bg-yellow-400 text-black font-black rounded-[2.5rem] text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(250,204,21,0.3)] active:scale-95 transition-all"
          >
            <span className="hidden xs:inline">Próximo</span> <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Control Modal HUD */}
      {showControls && (
        <div className="absolute top-[200px] left-8 right-8 z-30 bg-zinc-950/95 backdrop-blur-3xl border-2 border-zinc-900 p-10 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] animate-slideUp">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-400/10 rounded-xl">
                  <TypeIcon size={20} className="text-yellow-400" />
                </div>
                <h4 className="text-white font-black text-[11px] uppercase tracking-[0.4em] italic">Otimização Visual</h4>
             </div>
             <button onClick={() => setShowControls(false)} className="p-2 text-zinc-700 hover:text-white transition-colors"><X size={28} /></button>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-zinc-600 font-black text-[10px] uppercase tracking-widest">
                <span>Intensidade da Fonte</span>
                <span className="text-yellow-400 bg-yellow-400/5 px-5 py-2 rounded-full border border-yellow-400/10">{fontSize}px</span>
              </div>
              <input 
                type="range"
                min="16"
                max="36"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setFontSize(18)} className="py-5 bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl text-zinc-600 font-black text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all">Resetar Visual</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Intelligence Modal */}
      {showContextModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl animate-fadeIn" onClick={() => setShowContextModal(false)}>
           <div className="w-full max-w-sm bg-zinc-950 border-2 border-zinc-900 rounded-[4rem] p-12 animate-slideUp shadow-[0_50px_100px_rgba(0,0,0,1)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-yellow-400 text-black rounded-3xl shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-2xl">Insight IA</h4>
                    <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] mt-1.5">Deep Scripture Scan</p>
                  </div>
                </div>
                <button onClick={() => setShowContextModal(false)} className="text-zinc-800 hover:text-white transition-colors"><X size={32} /></button>
              </div>

              {loadingContext ? (
                <div className="py-24 flex flex-col items-center justify-center gap-8">
                  <div className="w-16 h-16 border-4 border-yellow-400/5 border-t-yellow-400 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.6em] animate-pulse">Processando Teologia...</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="bg-zinc-900/40 p-10 rounded-[3rem] border-2 border-zinc-800/50 max-h-[45vh] overflow-y-auto no-scrollbar">
                    <p className="text-zinc-300 text-base leading-[1.8] whitespace-pre-line font-medium italic text-justify">
                      {context}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowContextModal(false)} 
                    className="w-full py-6 bg-yellow-400 text-black font-black rounded-3xl text-[12px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                  >
                    Confirmar Leitura
                  </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default BibleView;
