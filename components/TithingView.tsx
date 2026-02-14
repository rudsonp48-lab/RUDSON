
import React, { useState } from 'react';
import { Copy, CheckCircle, Wallet, Heart, Construction, Globe } from 'lucide-react';

// Fix for Error in App.tsx on line 113: Added pixKey prop definition
const TithingView: React.FC<{ pixKey: string }> = ({ pixKey }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn pb-6 bg-black h-full">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">Dízimos e Ofertas</h2>
        <p className="text-zinc-500 text-sm font-medium">Contribute para a expansão do Reino.</p>
      </div>

      <div className="px-6 space-y-4">
        {/* PIX Area */}
        <div className="bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
          <h3 className="text-yellow-400 font-black uppercase text-xs tracking-[0.3em] mb-4">Chave PIX (CNPJ/Email)</h3>
          <div className="bg-black p-4 rounded-2xl border border-zinc-800 mb-6 flex items-center justify-between gap-3">
            <span className="text-white font-bold text-sm truncate">{pixKey}</span>
            <button 
              onClick={handleCopy}
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-black active:scale-90'}`}
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Toque no botão para copiar a chave</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DonationType icon={<Heart className="text-red-400" />} label="Dízimo" />
          <DonationType icon={<Wallet className="text-yellow-400" />} label="Oferta" />
          <DonationType icon={<Globe className="text-blue-400" />} label="Missões" />
          <DonationType icon={<Construction className="text-amber-600" />} label="Construção" />
        </div>

        <div className="bg-yellow-400/5 border border-yellow-400/10 p-6 rounded-3xl mt-6">
           <p className="text-yellow-400/80 text-center text-xs italic font-medium leading-relaxed">
             "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria." - 2 Co 9:7
           </p>
        </div>
      </div>
    </div>
  );
};

const DonationType = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="bg-zinc-950 p-6 rounded-[2rem] border border-zinc-900 flex flex-col items-center gap-3 transition-transform active:scale-95">
    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-zinc-800">
      {icon}
    </div>
    <span className="text-zinc-300 font-black uppercase text-[10px] tracking-widest">{label}</span>
  </div>
);

export default TithingView;
