
import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, QrCode, Lock, Clock, CheckCircle2, ChevronRight, Apple, Smartphone } from 'lucide-react';
import { Product } from '../types';
import { INTEGRATIONS } from '../constants';

interface CheckoutPageProps {
  product: Product;
  onSuccess: (buyerInfo: any) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ product, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'STRIPE'>('PIX');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePay = () => {
    setLoading(true);
    // Simulate payment processing via Integration (Stripe/Asaas)
    console.log(`Processing ${paymentMethod} via ${paymentMethod === 'PIX' ? 'Asaas' : 'Stripe'}`);
    setTimeout(() => {
      setLoading(false);
      onSuccess(formData);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Checkout Area */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-slate-200 overflow-hidden">
            {/* Steps Header */}
            <div className="flex border-b border-slate-100 bg-slate-50/30">
              <div className={`flex-1 py-6 text-center text-xs font-black uppercase tracking-widest border-b-4 transition-all duration-300 ${step === 1 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 opacity-50'}`}>
                1. Identificação
              </div>
              <div className={`flex-1 py-6 text-center text-xs font-black uppercase tracking-widest border-b-4 transition-all duration-300 ${step === 2 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 opacity-50'}`}>
                2. Pagamento
              </div>
            </div>

            <div className="p-10">
              {step === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                        placeholder="Como em seu documento"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail para Recebimento</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp de Suporte</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.whatsapp}
                        onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                        placeholder="(00) 90000-0000"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full gradient-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 group">
                    Ir para o Pagamento
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('PIX')}
                      className={`p-6 border-2 rounded-[24px] flex flex-col items-center gap-3 transition-all ${paymentMethod === 'PIX' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className={`p-3 rounded-xl ${paymentMethod === 'PIX' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <QrCode size={24} />
                      </div>
                      <span className={`text-sm font-black uppercase tracking-widest ${paymentMethod === 'PIX' ? 'text-indigo-900' : 'text-slate-400'}`}>PIX Instantâneo</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('STRIPE')}
                      className={`p-6 border-2 rounded-[24px] flex flex-col items-center gap-3 transition-all ${paymentMethod === 'STRIPE' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className={`p-3 rounded-xl ${paymentMethod === 'STRIPE' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <CreditCard size={24} />
                      </div>
                      <span className={`text-sm font-black uppercase tracking-widest ${paymentMethod === 'STRIPE' ? 'text-indigo-900' : 'text-slate-400'}`}>Cartão de Crédito</span>
                    </button>
                  </div>

                  {paymentMethod === 'PIX' ? (
                    <div className="p-10 bg-slate-50 border border-slate-200 rounded-[32px] text-center space-y-6">
                      <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative w-56 h-56 bg-white mx-auto border-8 border-white shadow-2xl rounded-3xl flex items-center justify-center">
                          <QrCode size={180} className="text-slate-900" />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Escaneie o código acima</p>
                         <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">A liberação é imediata. O processamento é realizado de forma segura via <span className="font-black text-slate-800">ASAAS API</span>.</p>
                      </div>
                      <button className="text-indigo-600 font-bold text-sm hover:underline">Copiar código PIX</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número do Cartão</label>
                        <div className="relative">
                           <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                           <input 
                            className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium focus:border-indigo-600 transition-colors" 
                            placeholder="0000 0000 0000 0000" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Validade</label>
                          <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium focus:border-indigo-600 transition-colors" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CVV</label>
                          <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium focus:border-indigo-600 transition-colors" placeholder="123" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <div className="flex-1 h-12 rounded-xl border border-slate-200 flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                           <Apple size={20} /> <span className="text-xs font-bold uppercase tracking-tighter">Pay</span>
                         </div>
                         <div className="flex-1 h-12 rounded-xl border border-slate-200 flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                           <Smartphone size={18} /> <span className="text-xs font-bold uppercase tracking-tighter">Google Pay</span>
                         </div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-6 rounded-[24px] font-black text-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl shadow-emerald-100 flex items-center justify-center gap-4 active:scale-[0.98]"
                  >
                    {loading ? (
                       <>
                         <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                         Processando Pagamento Seguro...
                       </>
                    ) : 'Confirmar e Finalizar'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">Powered by Stripe & JPVano</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-10 text-slate-400">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={16} className="text-indigo-500" />
              Ambiente Seguro
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Lock size={16} className="text-indigo-500" />
              SSL 256-BIT
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[32px] shadow-xl shadow-indigo-100/50 border border-slate-200 p-10 space-y-8 sticky top-12">
            <div className="flex gap-6">
              <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-200 shrink-0">
                {product.name.charAt(0)}
              </div>
              <div className="pt-2">
                <h3 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{product.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1 line-clamp-2">{product.description}</p>
              </div>
            </div>

            <div className="space-y-5 pt-8 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="font-black text-slate-900">R$ {product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Taxas de Processamento</span>
                <span className="font-black text-emerald-500 uppercase tracking-tighter">Grátis</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total à Pagar</span>
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">R$ {product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Scarcity Timer */}
            <div className="bg-indigo-900 p-6 rounded-[24px] flex items-center gap-4 border border-indigo-800 shadow-xl shadow-indigo-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-800 flex items-center justify-center">
                 <Clock className="text-indigo-400" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Oferta Exclusiva</p>
                <p className="text-lg text-white font-black tracking-tighter">Vagas expiram em <span className="text-amber-400">{formatTime(timeLeft)}</span></p>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-3">
               <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Garantia Incondicional</span>
               </div>
               <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                 Teste o produto por 7 dias. Se não estiver satisfeito, devolvemos 100% do seu investimento sem perguntas.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
