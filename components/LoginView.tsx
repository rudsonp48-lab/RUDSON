
import React, { useState } from 'react';
import { Lock, User, ChevronLeft, Loader2, AlertCircle, Eye, EyeOff, Mail, BadgeCheck } from 'lucide-react';

interface LoginViewProps {
  onSuccess: (isAdmin: boolean) => void;
  onBack: () => void;
  isInitialLogin?: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onBack, isInitialLogin = false }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Branding apenas em texto
  const Logo = () => (
    <div className="flex flex-col items-center animate-fadeIn py-12">
      <div className="text-center space-y-2">
        <h4 className="text-yellow-400 font-black text-sm uppercase tracking-[0.6em] opacity-90">Ministério</h4>
        <div className="flex flex-col items-center">
          <span className="text-white font-black text-4xl uppercase tracking-tighter italic leading-none">Frutos do</span>
          <span className="text-white font-black text-7xl uppercase tracking-[-0.05em] italic leading-[0.8] -mt-1">Espírito</span>
        </div>
        <div className="w-12 h-1 bg-yellow-400 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Verificação específica para Admin
      const isAdmin = username === 'admin' && password === 'pastor123';

      if (mode === 'login') {
        if (isAdmin || (username.length >= 3 && password.length >= 4)) {
          onSuccess(isAdmin);
        } else {
          setError('Credenciais inválidas. Tente novamente.');
          setLoading(false);
        }
      } else {
        if (fullName && email && username && password.length >= 6) {
          onSuccess(isAdmin);
        } else {
          setError('Preencha todos os campos. Senha mín. 6 caracteres.');
          setLoading(false);
        }
      }
    }, 1500);
  };

  return (
    <div className="animate-fadeIn h-full bg-black flex flex-col relative overflow-hidden">
      {/* Luz de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-yellow-400/5 to-transparent rounded-full blur-[140px] -z-10"></div>
      
      {!isInitialLogin && (
        <div className="p-6">
          <button onClick={onBack} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-xl">
            <ChevronLeft size={24} />
          </button>
        </div>
      )}

      <div className={`flex-1 px-8 flex flex-col justify-center ${isInitialLogin ? 'py-6' : 'pb-20'} no-scrollbar overflow-y-auto`}>
        <div className={`${mode === 'register' ? 'mb-4 scale-90' : 'mb-8'} transition-all duration-500`}>
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-slideUp">
          <div className="text-center mb-6">
            <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">
              {mode === 'login' ? 'Bem-vindo de Volta' : 'Criar Nova Conta'}
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
              {mode === 'login' ? 'Acesse o portal do ministério' : 'Junte-se à nossa comunidade digital'}
            </p>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Nome Completo</label>
              <div className="relative">
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 text-xs focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
                  placeholder="Seu nome"
                  required
                />
                <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">E-mail</label>
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 text-xs focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
                  placeholder="exemplo@email.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Nome de Usuário</label>
            <div className="relative">
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 text-xs focus:ring-1 focus:ring-yellow-400 outline-none transition-all placeholder:text-zinc-700"
                placeholder="Ex: joao.silva"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-12 text-xs focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-shake text-[10px] font-bold uppercase">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-yellow-400/20 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{mode === 'login' ? 'Acessando...' : 'Cadastrando...'}</span>
                </>
              ) : (
                mode === 'login' ? 'Acessar Ministério' : 'Criar Minha Conta'
              )}
            </button>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="w-full text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-yellow-400 transition-colors py-2"
            >
              {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
            </button>
            {mode === 'login' && (
              <button type="button" className="w-full text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest py-1">
                Esqueci minha senha
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 text-center opacity-40">
          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.3em]">
            &copy; 2024 Ministério Frutos do Espírito
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
