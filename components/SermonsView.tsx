
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Search, 
  X, 
  Share2, 
  Loader2, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Video as VideoIcon,
  RotateCcw,
  RotateCw,
  Sparkles,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { Sermon } from '../types';
import { summarizeSermon } from '../services/gemini';

const SermonsView: React.FC<{ data: Sermon[] }> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Sermon | null>(null);
  
  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Gemini AI States
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sermonsList = data || [];
  const filteredSermons = sermonsList.filter(s => 
    (s.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.speaker || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedVideo) {
      setIsLoading(true);
      setVideoError(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setSummary(null);
      resetControlsTimeout();
      document.body.style.overflow = 'hidden';
      
      // Validação rigorosa de URL
      if (!selectedVideo.videoUrl || typeof selectedVideo.videoUrl !== 'string' || selectedVideo.videoUrl.trim() === '') {
        setVideoError(true);
        setIsLoading(false);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedVideo]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.error("Auto-play blocked or source issue:", err);
          setVideoError(true);
        });
      }
      setIsPlaying(!isPlaying);
      resetControlsTimeout();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      setVideoError(false);
    }
  };

  const handleVideoError = (e: any) => {
    console.error("Erro detectado no elemento de vídeo:", e);
    setIsLoading(false);
    setVideoError(true);
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      resetControlsTimeout();
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      resetControlsTimeout();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuteState = !isMuted;
      videoRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      const muted = vol === 0;
      videoRef.current.muted = muted;
      setIsMuted(muted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullscreen) {
      if (playerContainerRef.current?.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedVideo) return;
    setIsSummarizing(true);
    setShowSummaryModal(true);
    const result = await summarizeSermon(selectedVideo.title, selectedVideo.speaker);
    setSummary(result);
    setIsSummarizing(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
    <div className="animate-fadeIn pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-400">
            <VideoIcon size={20} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Mensagens</h2>
        </div>

        <div className="relative mb-8">
          <input 
            type="text"
            placeholder="Buscar pregação ou pastor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 text-xs focus:ring-1 focus:ring-yellow-400 outline-none transition-all placeholder:text-zinc-600"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
        </div>

        <div className="space-y-10">
          {filteredSermons.length > 0 ? filteredSermons.map((vid) => (
            <div key={vid.id} className="group cursor-pointer" onClick={() => setSelectedVideo(vid)}>
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-5 border border-zinc-800 shadow-2xl">
                <img src={vid.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" alt={vid.title} />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity">
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-90 group-hover:scale-110 transition-transform">
                    <Play size={28} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-6 bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
                  {vid.duration}
                </div>
              </div>
              <div className="px-1">
                <h4 className="font-black text-white text-lg uppercase tracking-tight italic group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">{vid.title}</h4>
                <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  <span className="text-yellow-400/80">{vid.speaker}</span>
                  <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                  <span>{vid.date}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center">
               <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Nenhuma mensagem encontrada.</p>
            </div>
          )}
        </div>
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black animate-fadeIn flex flex-col overflow-hidden">
          <div className={`p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent absolute top-0 w-full z-20 transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
             <div className="flex-1 pr-4">
                <h3 className="text-white font-black uppercase italic tracking-tighter leading-none line-clamp-1 text-sm">{selectedVideo.title}</h3>
                <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest mt-1.5">{selectedVideo.speaker}</p>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={handleSummarize} className="p-2.5 bg-yellow-400 text-black rounded-xl active:scale-90 transition-all flex items-center gap-2 shadow-lg shadow-yellow-400/20">
                  <Sparkles size={16} />
                  <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">Resumo IA</span>
                </button>
                <button onClick={() => setSelectedVideo(null)} className="p-2.5 bg-zinc-900/80 backdrop-blur-md text-white rounded-xl border border-white/10 active:scale-90 transition-all">
                  <X size={18} />
                </button>
             </div>
          </div>

          <div ref={playerContainerRef} className={`flex-1 flex items-center justify-center bg-black relative ${showControls ? 'cursor-default' : 'cursor-none'}`} onMouseMove={resetControlsTimeout} onClick={resetControlsTimeout}>
            {isLoading && !videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mb-4" />
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Preparando Transmissão...</p>
              </div>
            )}
            
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black p-10 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-4">Vídeo Indisponível</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs">
                  Não conseguimos carregar o vídeo. A fonte do arquivo pode estar corrompida ou inacessível no momento.
                </p>
                <button onClick={() => setSelectedVideo(null)} className="mt-8 px-8 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-800">
                  Voltar para Mensagens
                </button>
              </div>
            )}
            
            {selectedVideo.videoUrl && !videoError && (
              <video 
                ref={videoRef}
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnail}
                className="w-full h-full object-contain block"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => setIsLoading(false)}
                onEnded={() => setIsPlaying(false)}
                onError={handleVideoError}
                playsInline
                onClick={togglePlay}
              >
                <p>Seu navegador não suporta este formato de vídeo.</p>
              </video>
            )}

            {!isLoading && showControls && !videoError && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-8 sm:gap-16">
                  <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="p-4 text-white/40 hover:text-white transition-colors pointer-events-auto active:scale-90">
                    <RotateCcw size={32} />
                  </button>
                  <div onClick={togglePlay} className={`w-20 h-20 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 rounded-full flex items-center justify-center text-yellow-400 transition-all transform pointer-events-auto cursor-pointer hover:scale-110 active:scale-90 shadow-[0_0_50px_rgba(250,204,21,0.2)] ${isPlaying ? 'scale-90 opacity-40' : 'scale-100 opacity-100'}`}>
                     {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="p-4 text-white/40 hover:text-white transition-colors pointer-events-auto active:scale-90">
                    <RotateCw size={32} />
                  </button>
               </div>
            )}

            <div className={`absolute bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-black via-black/40 to-transparent transition-all duration-500 z-20 ${showControls && !videoError ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative group/progress mb-6 flex items-center">
                <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 z-10 hover:h-2 transition-all" />
                <div className="absolute top-0 left-0 h-1.5 bg-yellow-400 rounded-lg pointer-events-none shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-8">
                  <button onClick={togglePlay} className="text-white hover:text-yellow-400 transition-colors active:scale-90">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <div className="hidden sm:flex items-center gap-3 group/volume">
                    <button onClick={toggleMute} className="text-white hover:text-yellow-400 transition-colors">
                      {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 opacity-40 group-hover/volume:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest tabular-nums">
                    {formatTime(currentTime)} <span className="mx-1 text-zinc-700">/</span> {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button className="p-2 text-white/60 hover:text-yellow-400 transition-colors active:scale-90"><Share2 size={18} /></button>
                  <button onClick={toggleFullscreen} className="p-2 text-white/60 hover:text-yellow-400 transition-colors active:scale-90"><Maximize size={18} /></button>
                </div>
              </div>
            </div>
          </div>

          {showSummaryModal && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowSummaryModal(false)}>
              <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 animate-slideUp shadow-[0_20px_60px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 text-black rounded-xl"><Sparkles size={20} /></div>
                    <div>
                      <h4 className="text-white font-black uppercase italic tracking-tighter leading-none">Resumo Pastoral</h4>
                      <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mt-1">Inteligência Artificial Gemini</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSummaryModal(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                {isSummarizing ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <Loader2 className="animate-spin text-yellow-400" size={40} />
                      <Sparkles className="absolute inset-0 m-auto text-yellow-400/40 animate-pulse" size={16} />
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Extraindo Essência...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50 max-h-[40vh] overflow-y-auto no-scrollbar">
                      <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-line font-medium italic">{summary}</p>
                    </div>
                    <button onClick={() => setShowSummaryModal(false)} className="w-full py-4.5 bg-yellow-400 text-black font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-yellow-400/10 active:scale-95 transition-all">Continuar Assistindo</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SermonsView;
