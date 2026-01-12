
import React, { useState } from 'react';
import { CreditCard, Plus, ShieldCheck, Lock, Eye, EyeOff, Trash2, Ban, CheckCircle2, Zap, Info } from 'lucide-react';
import { VirtualCard, User } from '../types';

interface VirtualCardsProps {
  user: User;
  cards: VirtualCard[];
  onIssueCard: (label: string, initialBalance: number) => void;
  onDeleteCard: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const CardVisual = ({ card, showDetails }: { card: VirtualCard, showDetails: boolean }) => (
  <div className={`relative w-full h-52 rounded-[24px] p-6 text-white overflow-hidden shadow-2xl transition-all duration-500 ${card.status === 'BLOCKED' ? 'grayscale opacity-75' : 'gradient-primary'}`}>
    <div className="absolute top-0 right-0 p-6 opacity-20">
      <Zap size={100} strokeWidth={1} />
    </div>
    
    <div className="relative h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Cartão Virtual</span>
          <span className="text-sm font-bold tracking-tight">{card.label}</span>
        </div>
        <div className="italic font-black text-xl italic">{card.brand}</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xl font-mono tracking-[0.2em]">
          {showDetails ? (
            card.number.match(/.{1,4}/g)?.join(' ')
          ) : (
            <>•••• •••• •••• {card.number.slice(-4)}</>
          )}
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Validade</span>
            <span className="text-sm font-bold">{card.expiry}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">CVV</span>
            <span className="text-sm font-bold">{showDetails ? card.cvv : '•••'}</span>
          </div>
        </div>
      </div>
    </div>
    
    {card.status === 'BLOCKED' && (
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
        <div className="bg-white text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Bloqueado</div>
      </div>
    )}
  </div>
);

const VirtualCards: React.FC<VirtualCardsProps> = ({ user, cards, onIssueCard, onDeleteCard, onToggleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > user.balance) {
      alert('Saldo insuficiente na plataforma JPVano!');
      return;
    }
    if (val < 10) {
      alert('O valor mínimo para carga inicial é R$ 10,00');
      return;
    }
    onIssueCard(label, val);
    setIsModalOpen(false);
    setLabel('');
    setAmount('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cartões Corporativos</h1>
          <p className="text-slate-500 font-medium">Crie cartões virtuais para anúncios e ferramentas usando seu saldo.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Emitir Novo Cartão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
              <CreditCard className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Nenhum cartão ativo</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">Emita seu primeiro cartão corporativo JPVano para gerenciar seus gastos.</p>
          </div>
        ) : (
          cards.map(card => (
            <div key={card.id} className="space-y-4 group">
              <CardVisual card={card} showDetails={showDetailsId === card.id} />
              
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo do Cartão</span>
                  <span className="text-lg font-black text-slate-900">R$ {card.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => setShowDetailsId(showDetailsId === card.id ? null : card.id)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all"
                    title="Ver Detalhes"
                  >
                    {showDetailsId === card.id ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button 
                    onClick={() => onToggleStatus(card.id)}
                    className={`p-2.5 rounded-xl hover:bg-slate-50 transition-all ${card.status === 'BLOCKED' ? 'text-emerald-500' : 'text-slate-400 hover:text-amber-600'}`}
                    title={card.status === 'BLOCKED' ? 'Desbloquear' : 'Bloquear'}
                  >
                    <Ban size={20} />
                  </button>
                  <button 
                    onClick={() => onDeleteCard(card.id)}
                    className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Como funciona?</h4>
          <p className="text-xs text-indigo-600 font-medium leading-relaxed">
            Nossos cartões virtuais são aceitos em plataformas como Facebook Ads, Google Ads e ferramentas SaaS internacionais. 
            O valor é deduzido do seu <strong>saldo JPVano</strong> no momento da emissão ou recarga.
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Novo Cartão Corporativo</h2>
              <p className="text-slate-500 text-sm font-medium">Os dados do cartão serão gerados instantaneamente.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação do Cartão</label>
                <input 
                  required
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="Ex: Facebook Ads Contingência"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Carga Inicial (R$)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  min="10"
                  max={user.balance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-black text-xl"
                />
                <div className="flex justify-between px-1">
                  <p className="text-[10px] text-slate-400">Saldo Disponível: <span className="font-bold">R$ {user.balance.toFixed(2)}</span></p>
                  <p className="text-[10px] text-slate-400">Taxa de Emissão: <span className="text-emerald-500 font-bold">Grátis</span></p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Gerar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualCards;
