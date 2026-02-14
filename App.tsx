
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Home as HomeIcon, 
  Calendar, 
  BookOpen, 
  Video, 
  Menu, 
  X,
  Wallet,
  Users,
  ChevronRight,
  MessageSquare,
  Lock,
  Camera,
  LogOut,
  AlertTriangle,
  Radio,
  User,
  Loader2
} from 'lucide-react';
import { AppView, AppData } from './types';
import { loadAppData } from './services/storage';

// Lazy loading de componentes para code-splitting
const HomeView = lazy(() => import('./components/HomeView'));
const EventsView = lazy(() => import('./components/EventsView'));
const BibleView = lazy(() => import('./components/BibleView'));
const SermonsView = lazy(() => import('./components/SermonsView'));
const MoreView = lazy(() => import('./components/MoreView'));
const PrayerAssistant = lazy(() => import('./components/PrayerAssistant'));
const TithingView = lazy(() => import('./components/TithingView'));
const CellsView = lazy(() => import('./components/CellsView'));
const LiveView = lazy(() => import('./components/LiveView'));
const AdminView = lazy(() => import('./components/AdminView'));
const LoginView = lazy(() => import('./components/LoginView'));
const GalleryView = lazy(() => import('./components/GalleryView'));

const ViewSkeleton = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 animate-pulse h-full">
    <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mb-4" />
    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Carregando Módulo...</p>
  </div>
);

const SidebarSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
  <div className="space-y-2">
    <h5 className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">{title}</h5>
    <div className="space-y-1">{children}</div>
  </div>
);

const SidebarItem = ({ icon, label, active = false, onClick, variant = 'default' }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, variant?: 'default' | 'danger' }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' 
        : variant === 'danger'
          ? 'text-zinc-500 hover:text-red-500 hover:bg-red-500/5'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`}
  >
    <div className={active ? 'text-black' : variant === 'danger' ? 'text-red-500/50' : 'text-yellow-400/60'}>{icon}</div>
    <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
  </button>
);

const NavItem: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-yellow-400' : 'text-zinc-600'}`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-yellow-400/10' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  phone: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Comunidade FE',
  email: '',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [appData, setAppData] = useState<AppData>(loadAppData());
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('church_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    if (currentView) {
      setAppData(loadAppData());
    }
  }, [currentView]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('church_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile, isAuthenticated]);

  const navigateTo = (view: AppView) => {
    if (view === AppView.ADMIN && !isAdmin) {
      setCurrentView(AppView.HOME);
    } else {
      setCurrentView(view);
    }
    setIsSidebarOpen(false);
  };

  const handleLoginSuccess = (adminStatus: boolean) => {
    setIsAuthenticated(true);
    setIsAdmin(adminStatus);
    if (adminStatus && userProfile.name === 'Comunidade FE') {
      setUserProfile(prev => ({ ...prev, name: 'Pastor Admin' }));
    }
  };

  const confirmLogout = () => {
    // Se não for admin, apaga os dados. Se for admin, preserva.
    if (!isAdmin) {
      localStorage.removeItem('church_user_profile');
      localStorage.removeItem('church_notes');
      setUserProfile(DEFAULT_PROFILE);
    }
    
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowLogoutModal(false);
    setIsSidebarOpen(false);
    setCurrentView(AppView.HOME);
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-yellow-400" /></div>}>
        <LoginView onSuccess={handleLoginSuccess} onBack={() => {}} isInitialLogin={true} />
      </Suspense>
    );
  }

  const renderViewContent = () => {
    const events = appData.events || [];
    const sermons = appData.sermons || [];
    const gallery = appData.gallery || [];
    const cells = appData.cells || [];

    switch (currentView) {
      case AppView.HOME: return <HomeView onNavigate={navigateTo} data={appData} />;
      case AppView.EVENTS: return <EventsView data={events} />;
      case AppView.BIBLE: return <BibleView />;
      case AppView.SERMONS: return <SermonsView data={sermons} />;
      case AppView.GALLERY: return <GalleryView data={gallery} />;
      case AppView.MORE: return (
        <MoreView 
          onAdminClick={() => navigateTo(AppView.ADMIN)} 
          onLogout={() => setShowLogoutModal(true)} 
          isAdmin={isAdmin} 
          data={appData}
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
        />
      );
      case AppView.PRAYER: return <PrayerAssistant />;
      case AppView.TITHING: return <TithingView pixKey={appData.config.pixKey} />;
      case AppView.CELLS: return <CellsView data={cells} />;
      case AppView.LIVE: return <LiveView data={appData.config} />;
      case AppView.ADMIN: return isAdmin ? <AdminView onBack={() => {
        setAppData(loadAppData());
        navigateTo(AppView.MORE);
      }} /> : <HomeView onNavigate={navigateTo} data={appData} />;
      default: return <HomeView onNavigate={navigateTo} data={appData} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black shadow-2xl overflow-hidden relative border-x border-zinc-800">
      
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 animate-slideUp">
            <div className={`w-16 h-16 ${isAdmin ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-500/10 text-red-500'} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-white text-xl font-black text-center uppercase italic tracking-tighter mb-2">
              {isAdmin ? 'Encerrar Sessão?' : 'Encerrar e Limpar?'}
            </h3>
            <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest leading-relaxed mb-8">
              {isAdmin 
                ? 'Você será desconectado do painel administrativo, mas suas preferências locais serão mantidas neste dispositivo.' 
                : 'Suas informações de perfil e anotações privadas serão removidas permanentemente deste dispositivo.'}
            </p>
            <div className="space-y-3">
              <button 
                onClick={confirmLogout} 
                className={`w-full py-4 ${isAdmin ? 'bg-zinc-100 text-black' : 'bg-red-600 text-white'} font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all`}
              >
                {isAdmin ? 'Encerrar Sessão' : 'Limpar e Sair'}
              </button>
              <button onClick={() => setShowLogoutModal(false)} className="w-full py-4 bg-zinc-900 text-zinc-400 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-4/5 max-w-[320px] bg-zinc-950 z-50 border-r border-zinc-900 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-900 bg-black flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] leading-none">Ministério</span>
              <span className="text-white font-black uppercase text-base tracking-tight italic">{appData.config.name}</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            <SidebarSection title="Geral">
              <SidebarItem icon={<HomeIcon size={18} />} label="Início" active={currentView === AppView.HOME} onClick={() => navigateTo(AppView.HOME)} />
              <SidebarItem icon={<Radio size={18} />} label="Ao Vivo" active={currentView === AppView.LIVE} onClick={() => navigateTo(AppView.LIVE)} />
              <SidebarItem icon={<Camera size={18} />} label="Galeria" active={currentView === AppView.GALLERY} onClick={() => navigateTo(AppView.GALLERY)} />
              <SidebarItem icon={<Calendar size={18} />} label="Eventos" active={currentView === AppView.EVENTS} onClick={() => navigateTo(AppView.EVENTS)} />
            </SidebarSection>
            <SidebarSection title="Espiritual">
              <SidebarItem icon={<BookOpen size={18} />} label="Bíblia Sagrada" active={currentView === AppView.BIBLE} onClick={() => navigateTo(AppView.BIBLE)} />
              <SidebarItem icon={<Video size={18} />} label="Mensagens" active={currentView === AppView.SERMONS} onClick={() => navigateTo(AppView.SERMONS)} />
              <SidebarItem icon={<Users size={18} />} label="Células" active={currentView === AppView.CELLS} onClick={() => navigateTo(AppView.CELLS)} />
              <SidebarItem icon={<MessageSquare size={18} />} label="Oração" active={currentView === AppView.PRAYER} onClick={() => navigateTo(AppView.PRAYER)} />
            </SidebarSection>
            {isAdmin ? (
              <SidebarSection title="Administração">
                <SidebarItem icon={<Lock size={18} />} label="Painel Gestão" active={currentView === AppView.ADMIN} onClick={() => navigateTo(AppView.ADMIN)} />
                <SidebarItem icon={<Wallet size={18} />} label="Dízimos e Ofertas" active={currentView === AppView.TITHING} onClick={() => navigateTo(AppView.TITHING)} />
              </SidebarSection>
            ) : (
               <SidebarSection title="Financeiro">
                 <SidebarItem icon={<Wallet size={18} />} label="Dízimos e Ofertas" active={currentView === AppView.TITHING} onClick={() => navigateTo(AppView.TITHING)} />
               </SidebarSection>
            )}
            <SidebarSection title="Configurações">
              <SidebarItem icon={<LogOut size={18} />} label="Sair da Conta" onClick={() => setShowLogoutModal(true)} variant="danger" />
            </SidebarSection>
          </div>

          <div className="p-6 border-t border-zinc-900 bg-zinc-950/50">
            <button onClick={() => navigateTo(AppView.MORE)} className="w-full flex items-center justify-between p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={userProfile.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-white leading-none">{userProfile.name}</span>
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">Meu Perfil</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-600" />
            </button>
          </div>
        </div>
      </aside>

      <header className="px-6 py-4 bg-black border-b border-zinc-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-yellow-400 transition-colors active:scale-90"><Menu size={24} /></button>
          <div className="flex flex-col cursor-pointer" onClick={() => navigateTo(AppView.HOME)}>
            <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.2em] leading-none">Ministério</span>
            <span className="font-black text-lg tracking-tight text-white uppercase italic">{appData.config.name}</span>
          </div>
        </div>
        <button onClick={() => navigateTo(AppView.MORE)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 active:scale-90 transition-all bg-zinc-900 shadow-lg shadow-black/40">
          <img src={userProfile.avatar} className="w-full h-full object-cover" alt="" />
        </button>
      </header>

      <main className={`flex-1 overflow-y-auto no-scrollbar bg-black pb-24`}>
        <Suspense fallback={<ViewSkeleton />}>
          {renderViewContent()}
        </Suspense>
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-zinc-950 border-t border-zinc-900 flex justify-around items-center py-3 px-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <NavItem active={currentView === AppView.HOME} onClick={() => navigateTo(AppView.HOME)} icon={<HomeIcon size={20} />} label="Início" />
        <NavItem active={currentView === AppView.GALLERY} onClick={() => navigateTo(AppView.GALLERY)} icon={<Camera size={20} />} label="Galeria" />
        <NavItem active={currentView === AppView.BIBLE} onClick={() => navigateTo(AppView.BIBLE)} icon={<BookOpen size={20} />} label="Bíblia" />
        <NavItem active={currentView === AppView.SERMONS} onClick={() => navigateTo(AppView.SERMONS)} icon={<Video size={20} />} label="Vídeos" />
        <NavItem active={currentView === AppView.MORE} onClick={() => navigateTo(AppView.MORE)} icon={<User size={20} />} label="Perfil" />
      </nav>
    </div>
  );
};

export default App;
