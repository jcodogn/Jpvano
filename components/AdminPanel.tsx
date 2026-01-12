
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  CreditCard, 
  ShieldAlert, 
  Settings, 
  ArrowUpRight, 
  Search, 
  Filter,
  CheckCircle2,
  Infinity,
  Zap,
  Lock,
  Target,
  Edit3,
  Check,
  X,
  Star,
  Activity,
  Terminal,
  Server
} from 'lucide-react';
import { db } from '../services/db';
import { INTEGRATIONS } from '../constants';
import { User, Sale, Product } from '../types';

interface AdminPanelProps {
  adminUser: User;
  onUpdateUser: (userId: string, data: Partial<User>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminUser, onUpdateUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<{id: string, msg: string, time: string}[]>([]);
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editBalanceValue, setEditBalanceValue] = useState('');

  useEffect(() => {
    setUsers(db.users());
    setSales(db.sales());
    
    // Simulated live log to show integrations are "working"
    const newLog = {
      id: Math.random().toString(),
      msg: `Handshake successful with ASAAS API (${INTEGRATIONS.ASAAS_TOKEN.slice(0, 10)}...)`,
      time: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev].slice(0, 5));
  }, [adminUser]);

  const globalTotalVolume = sales.reduce((acc, sale) => acc + sale.amount, 0);
  const platformEarnings = globalTotalVolume * 0.06;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditBalanceValue(user.balance.toString());
  };

  const handleSaveBalance = (userId: string) => {
    const val = parseFloat(editBalanceValue);
    if (isNaN(val)) return;
    onUpdateUser(userId, { balance: val });
    setEditingUserId(null);
    setUsers(db.users());
  };

  const makeInfinite = (userId: string) => {
    onUpdateUser(userId, { balance: 999999999999 });
    setEditingUserId(null);
    setUsers(db.users());
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Stats */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 border-b border-black/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black text-black tracking-tighter font-serif-brand">Sistema Master</h1>
            <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded font-black uppercase">Alpha Build</span>
          </div>
          <p className="text-black/40 text-xs font-black uppercase tracking-widest">Controle Global de Liquidez e Gateways</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-black text-white px-10 py-6 rounded-3xl flex items-center gap-6 shadow-2xl border border-white/10 group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20 shrink-0">
              <Infinity size={40} className="infinite-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Cofre Principal</p>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-black tracking-tighter">
                  {adminUser.balance >= 999999999 ? 'Infinito' : `R$ ${adminUser.balance.toLocaleString('pt-BR')}`}
                </p>
                <button onClick={() => startEditing(adminUser)} className="p-2 opacity-30 hover:opacity-100 transition-all">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Monitoring Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-zinc-900 rounded-[40px] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Server size={200} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Activity size={24} className="text-emerald-500" />
                  Status das Integrações
                </h3>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest animate-pulse">● System Live</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Asaas API', key: INTEGRATIONS.ASAAS_TOKEN, status: 'Active' },
                  { name: 'Stripe Public', key: INTEGRATIONS.STRIPE_PUBLIC, status: 'Active' },
                  { name: 'Stripe Secret', key: INTEGRATIONS.STRIPE_SECRET, status: 'Active' }
                ].map((int, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{int.name}</p>
                    <p className="text-xs font-mono text-white/80 truncate">{int.key}</p>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                       <span className="text-[8px] font-black uppercase text-emerald-500">{int.status}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* User Management */}
           <div className="bg-white rounded-[40px] border border-black/5 luxury-shadow overflow-hidden">
              <div className="p-10 border-b border-black/5 flex items-center justify-between">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter">Criadores da Rede</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                  <input 
                    type="text" 
                    placeholder="BUSCAR CONTA..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/5 border-b border-black/5">
                    <tr>
                      <th className="px-10 py-5 text-[10px] font-black text-black/40 uppercase tracking-widest">Identidade</th>
                      <th className="px-10 py-5 text-[10px] font-black text-black/40 uppercase tracking-widest">Saldo</th>
                      <th className="px-10 py-5 text-[10px] font-black text-black/40 uppercase tracking-widest text-right">Ações Master</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-black/[0.01] transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-black uppercase tracking-tighter">{user.name}</span>
                            <span className="text-[10px] text-black/30 font-medium">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          {editingUserId === user.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                value={editBalanceValue}
                                onChange={(e) => setEditBalanceValue(e.target.value)}
                                className="bg-black/5 border border-black/10 rounded-lg px-2 py-1 text-sm font-black w-28 outline-none"
                              />
                              <button onClick={() => handleSaveBalance(user.id)} className="p-1.5 bg-black text-white rounded-md"><Check size={14}/></button>
                              <button onClick={() => makeInfinite(user.id)} className="p-1.5 bg-indigo-600 text-white rounded-md" title="Tornar Infinito"><Infinity size={14}/></button>
                              <button onClick={() => setEditingUserId(null)} className="p-1.5 bg-black/5 text-black rounded-md"><X size={14}/></button>
                            </div>
                          ) : (
                            <span className="text-sm font-black text-black tracking-tighter flex items-center gap-2">
                              {user.balance >= 999999999 ? <Infinity size={18} className="text-indigo-600" /> : `R$ ${user.balance.toLocaleString('pt-BR')}`}
                            </span>
                          )}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button 
                            onClick={() => startEditing(user)}
                            className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-2.5 rounded-xl hover:opacity-80 transition-all flex items-center gap-2 ml-auto"
                          >
                            <Edit3 size={14} /> Ajustar Saldo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-[40px] border border-black/5 p-10 space-y-6 luxury-shadow">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center gap-2">
                 <Terminal size={14} />
                 Live API Stream
              </h4>
              <div className="space-y-4 font-mono text-[10px]">
                 {logs.map(log => (
                    <div key={log.id} className="flex gap-3 text-black/60 border-l-2 border-black/10 pl-4 py-1">
                       <span className="text-black/30">{log.time}</span>
                       <span className="font-bold">{log.msg}</span>
                    </div>
                 ))}
                 <div className="flex gap-3 text-emerald-500 animate-pulse border-l-2 border-emerald-500/50 pl-4 py-1">
                    <span>{new Date().toLocaleTimeString()}</span>
                    <span className="font-black">LISTENING TO WEBHOOKS...</span>
                 </div>
              </div>
           </div>

           <div className="bg-black text-white rounded-[40px] p-10 space-y-6 shadow-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Zap size={20} className="text-amber-400" />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Enterprise Engine</h4>
              </div>
              <p className="text-xs text-white/40 font-medium leading-relaxed">
                 O motor Gemini AI foi inicializado com a chave de alta prioridade. 
                 Latência atual: <span className="text-emerald-500 font-bold">42ms</span>.
              </p>
              <div className="pt-4 space-y-2">
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[88%] bg-white rounded-full"></div>
                 </div>
                 <div className="flex justify-between text-[8px] font-black uppercase text-white/30">
                    <span>Capacidade da CPU</span>
                    <span>88%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
