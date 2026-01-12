
import React, { useState } from 'react';
import { User as UserIcon, Mail, Shield, Bell, Smartphone, CreditCard, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { User } from '../types';
import { INTEGRATIONS } from '../constants';

interface SettingsProps {
  user: User;
  onUpdateUser: (data: Partial<User>) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    pixKey: user.pixKey || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    alert('Identidade atualizada nos servidores JPVano.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-black tracking-tighter font-serif-brand">Preferências</h1>
        <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.3em]">Gestão de Identidade e Infraestrutura API</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-4 space-y-3">
          <button className="w-full flex items-center gap-4 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-black text-white shadow-2xl transition-all">
            <UserIcon size={18} /> Perfil do Mestre
          </button>
          <button className="w-full flex items-center gap-4 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:bg-black/5 transition-all">
            <Key size={18} /> Chaves de API
          </button>
          <button className="w-full flex items-center gap-4 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:bg-black/5 transition-all">
            <Shield size={18} /> Firewall Global
          </button>
        </div>

        <div className="xl:col-span-8 space-y-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-black/5 luxury-shadow p-12 space-y-10">
            <div className="space-y-8">
              <h3 className="text-xl font-black text-black tracking-tighter uppercase font-serif-brand border-b border-black/5 pb-6">Dados da Conta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Identificação Nome</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-black/5 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-black/10 font-black text-sm uppercase tracking-tighter"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">E-mail de Operações</label>
                  <input 
                    disabled
                    type="email" 
                    value={formData.email}
                    className="w-full px-6 py-4 bg-black/5 border border-black/5 rounded-2xl outline-none opacity-40 cursor-not-allowed font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Chave PIX Global</label>
                <input 
                  type="text" 
                  value={formData.pixKey}
                  onChange={e => setFormData({...formData, pixKey: e.target.value})}
                  placeholder="DIGITE SUA CHAVE..."
                  className="w-full px-6 py-4 bg-black/5 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-black/10 font-black text-sm uppercase tracking-tighter"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-80 transition-all shadow-xl active:scale-95">
              Sincronizar Dados
            </button>
          </form>

          {/* Integrations Display */}
          <div className="bg-zinc-900 rounded-[40px] p-12 space-y-10 shadow-2xl text-white">
            <h3 className="text-xl font-black tracking-tighter uppercase font-serif-brand border-b border-white/10 pb-6">Cloud Integrations</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-white/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tighter">Stripe Enterprise</h4>
                    <p className="text-[10px] text-white/40 font-medium mt-1">Status: Operational • {INTEGRATIONS.STRIPE_PUBLIC.slice(0, 12)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Online
                </div>
              </div>

              <div className="flex items-center justify-between p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-white/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                    <Smartphone size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tighter">Asaas PIX Gateway</h4>
                    <p className="text-[10px] text-white/40 font-medium mt-1">Status: Operational • {INTEGRATIONS.ASAAS_TOKEN.slice(0, 12)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Online
                </div>
              </div>

              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                <p className="text-[11px] text-amber-500/80 font-bold uppercase tracking-widest leading-relaxed">
                  Atenção: Todas as transações são monitoradas pelo protocolo JPVano Secured. O motor Gemini AI está operando sob a licença Alpha via process.env.API_KEY.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
