
import React from 'react';
import { Users, Link2, TrendingUp, DollarSign, Award, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface AffiliatesProps {
  products: Product[];
}

const Affiliates: React.FC<AffiliatesProps> = ({ products }) => {
  const affiliateProducts = products.filter(p => p.affiliateAllowed);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Afiliados</h1>
        <p className="text-slate-500 font-medium">Acompanhe seus links de afiliado e comissões.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <DollarSign size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comissões Acumuladas</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ 1.240,00</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
            <TrendingUp size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cliques nos Links (7d)</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">482</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden">
          <Award className="absolute -bottom-2 -right-2 text-white/5" size={100} />
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Seu Nível</p>
          <p className="text-3xl font-black tracking-tighter">Afiliado Elite</p>
          <p className="mt-4 text-[10px] font-bold uppercase text-indigo-300">Próxima meta: +R$ 500,00</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900">Seus Links de Afiliado</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {affiliateProducts.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Nenhum produto disponível para afiliação.</p>
              <p className="text-sm">Habilite a afiliação nos seus produtos para vê-los aqui.</p>
            </div>
          ) : (
            affiliateProducts.map(p => (
              <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-black text-xl">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{p.commissionPercent}% de Comissão</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto">
                    <Link2 size={16} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500 truncate max-w-[150px]">jpvano.com/#/af/{p.id}</span>
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    Copiar Link
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Affiliates;
