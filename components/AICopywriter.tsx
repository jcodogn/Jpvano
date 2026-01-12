
import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Send } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const AICopywriter: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [type, setType] = useState<'copy' | 'bio'>('copy');

  const handleGenerate = async () => {
    if (!productName) return;
    setLoading(true);
    try {
      let text = '';
      if (type === 'copy') {
        text = await geminiService.generateSalesCopy(productName, description) || '';
      } else {
        text = await geminiService.generateInstagramBio(productName) || '';
      }
      setResult(text);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('Texto copiado!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          Inteligência Artificial JPVano
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Aumente suas vendas com IA</h1>
        <p className="text-slate-500">Gere copys de alta conversão e bios persuasivas em segundos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setType('copy')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'copy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              Sales Copy
            </button>
            <button 
              onClick={() => setType('bio')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'bio' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              Instagram Bio
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nome do seu Produto</label>
              <input 
                type="text" 
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="Ex: Guia do Tráfego Pago"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {type === 'copy' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Breve descrição (Opcional)</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Diga do que se trata para um resultado melhor..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                />
              </div>
            )}

            <button 
              disabled={loading || !productName}
              onClick={handleGenerate}
              className="w-full gradient-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Gerando...' : 'Gerar Agora'}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            {result && (
              <button 
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Copy size={20} />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {result ? (
              <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-8">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p>O resultado da sua IA aparecerá aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICopywriter;
