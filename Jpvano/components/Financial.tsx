
import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Plus, Landmark } from 'lucide-react';
import { User, Withdraw } from '../types';

interface FinancialProps {
  user: User;
  onWithdraw: (amount: number, pixKey: string) => void;
}

const Financial: React.FC<FinancialProps> = ({ user, onWithdraw }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState(user.pixKey || '');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > user.balance) {
      alert('Saldo insuficiente!');
      return;
    }
    if (val < 50) {
      alert('O valor mínimo para saque é R$ 50,00');
      return;
    }
    onWithdraw(val, pixKey);
    setIsModalOpen(false);
    setAmount('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financeiro</h1>
          <p className="text-slate-500 font-medium">Gerencie seu saldo e acompanhe seus recebimentos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Solicitar Saque
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet size={80} className="text-indigo-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo Disponível</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
            <CheckCircle2 size={14} />
            Liberado para Saque
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">A Receber (30 dias)</p>
          <p className="text-4xl font-black text-slate-400 tracking-tighter">R$ 0,00</p>
          <p className="mt-6 text-xs text-slate-400 font-medium">Vendas processadas via cartão/boleto</p>
        </div>

        <div className="bg-indigo-900 p-8 rounded-[32px] shadow-xl shadow-indigo-100 text-white">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Total Sacado</p>
          <p className="text-4xl font-black tracking-tighter">R$ 4.250,00</p>
          <div className="mt-6 flex items-center gap-2 text-indigo-300 font-bold text-xs">
            <Landmark size={14} />
            Conta principal conectada
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900">Extrato Recente</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i === 2 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {i === 2 ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{i === 2 ? 'Saque Realizado' : 'Venda Produto Digital'}</p>
                  <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString()} • {i === 2 ? 'Via PIX' : 'Via Checkout'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${i === 2 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {i === 2 ? '-' : '+'} R$ {i === 2 ? '150,00' : '97,00'}
                </p>
                <span className="text-[10px] font-black uppercase text-slate-400">Confirmado</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Solicitar Saque</h2>
              <p className="text-slate-500 text-sm font-medium">Informe o valor e sua chave PIX.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor (R$)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  min="50"
                  max={user.balance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-xl"
                />
                <p className="text-[10px] text-slate-400 text-right">Mínimo R$ 50,00</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chave PIX (CPF/Email/Telefone)</label>
                <input 
                  required
                  type="text"
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  placeholder="Sua chave pix para recebimento"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Saldo Atual</span>
                  <span className="text-slate-900 font-black">R$ {user.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Saldo Final</span>
                  <span className="text-indigo-600 font-black">R$ {(user.balance - (parseFloat(amount) || 0)).toFixed(2)}</span>
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
                  Confirmar Saque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
