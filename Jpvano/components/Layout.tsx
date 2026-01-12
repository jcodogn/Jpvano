
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Wallet, 
  Users, 
  Sparkles, 
  Settings, 
  LogOut,
  Menu,
  ShieldCheck,
  CreditCard,
  Zap,
  Infinity
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const Logo = () => (
  <div className="relative flex items-center justify-center w-24 h-24 bg-black select-none">
    {/* Vertical Line */}
    <div className="absolute h-16 w-[1px] bg-white left-1/2 -translate-x-1/2"></div>
    
    {/* J and P */}
    <div className="flex items-baseline gap-1 text-white font-serif-brand text-5xl relative z-10">
      <span className="translate-x-[-2px]">J</span>
      <span className="translate-x-[2px]">P</span>
    </div>
    
    {/* Vano Box */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-1.5 py-0.5 border-[0.5px] border-white/20 z-20">
      <span className="text-white text-[9px] font-light tracking-[0.3em] uppercase">Vano</span>
    </div>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'sales', label: 'Vendas', icon: TrendingUp },
    { id: 'withdrawals', label: 'Financeiro', icon: Wallet },
    { id: 'cards', label: 'Cartões Virtuais', icon: CreditCard },
    { id: 'affiliates', label: 'Afiliados', icon: Users },
    { id: 'ai', label: 'JPVano AI', icon: Sparkles },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-8 flex flex-col items-center">
            <Logo />
            <div className="mt-4 text-center">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] leading-none">Enterprise</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 pt-4 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300
                  ${activeTab === item.id 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile Area */}
          <div className="p-6 bg-white/5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black text-xs font-black">
                {user?.name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Master account</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={14} />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Header */}
        <header className="h-24 bg-white border-b border-black/5 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
          <button 
            className="lg:hidden p-3 text-black bg-black/5 rounded-xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          
          <div className="hidden md:flex items-center gap-4 text-black/30 text-[10px] font-black uppercase tracking-widest">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
             <span>Network status: <span className="text-black">Secured</span></span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-black/40 font-black uppercase tracking-widest">Saldo Líquido</span>
              <div className="flex items-center gap-3">
                {user?.role === 'ADMIN' ? (
                  <div className="flex items-center gap-2 text-3xl font-black tracking-tighter infinite-pulse">
                    <Infinity size={28} />
                    <span>Infinite</span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-black tracking-tighter">
                    R$ {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-black text-white text-[8px] font-black tracking-widest uppercase">Enterprise</span>
              </div>
            </div>
            <button className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
              Retirada
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
