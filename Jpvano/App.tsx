
import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { User, Product, Sale, AuthState, VirtualCard } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import AICopywriter from './components/AICopywriter';
import CheckoutPage from './components/CheckoutPage';
import AdminPanel from './components/AdminPanel';
import Financial from './components/Financial';
import Affiliates from './components/Affiliates';
import Settings from './components/Settings';
import VirtualCards from './components/VirtualCards';
import { Search, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);
  
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const users = db.users();
    const storedAdmin = users.find((u: User) => u.email === 'master@jpvano.com');
    
    if (storedAdmin) {
      setAuthState({ user: storedAdmin, isAuthenticated: true });
    } else {
      const defaultAdmin: User = {
        id: 'master-1',
        name: 'JP Vano Master',
        email: 'master@jpvano.com',
        balance: 999999999999,
        stripeConnected: true,
        role: 'ADMIN',
        pixKey: 'master@jpvano.com'
      };
      db.saveUsers([...users, defaultAdmin]);
      setAuthState({ user: defaultAdmin, isAuthenticated: true });
    }

    setProducts(db.products());
    setSales(db.sales());
    setVirtualCards(db.virtualCards());
  }, []);

  const handleCreateProduct = (p: Partial<Product>) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      userId: authState.user?.id || '',
      name: p.name || 'Sem nome',
      description: p.description || '',
      price: p.price || 0,
      deliveryType: p.deliveryType || 'LINK',
      deliveryContent: p.deliveryContent || '',
      affiliateAllowed: p.affiliateAllowed || false,
      commissionPercent: p.commissionPercent || 0,
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    db.saveProducts(updated);
  };

  const handleUpdateAnyUser = (userId: string, data: Partial<User>) => {
    const allUsers = db.users();
    const updatedUsers = allUsers.map((u: User) => u.id === userId ? { ...u, ...data } : u);
    db.saveUsers(updatedUsers);
    
    if (authState.user?.id === userId) {
      setAuthState(prev => ({ ...prev, user: { ...prev.user!, ...data } }));
    }
  };

  const handleUpdateUser = (data: Partial<User>) => {
    if (!authState.user) return;
    handleUpdateAnyUser(authState.user.id, data);
  };

  const handleIssueVirtualCard = (label: string, initialBalance: number) => {
    if (!authState.user) return;
    const generateNumber = () => Array.from({length: 4}, () => Math.floor(1000 + Math.random() * 9000)).join('');
    
    const newCard: VirtualCard = {
      id: Math.random().toString(36).substr(2, 9),
      userId: authState.user.id,
      label: label,
      number: generateNumber(),
      expiry: '12/29',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      balance: initialBalance,
      status: 'ACTIVE',
      brand: Math.random() > 0.5 ? 'VISA' : 'MASTERCARD',
      createdAt: new Date().toISOString()
    };

    const updatedUser = { ...authState.user };
    if (authState.user.role !== 'ADMIN') {
        updatedUser.balance = authState.user.balance - initialBalance;
    }
    
    const updatedCards = [...virtualCards, newCard];
    setAuthState({ ...authState, user: updatedUser });
    setVirtualCards(updatedCards);
    db.saveUsers(db.users().map((u: User) => u.id === updatedUser.id ? updatedUser : u));
    db.saveVirtualCards(updatedCards);
    alert('Cartão Corporativo emitido instantaneamente!');
  };

  const handleDeleteCard = (id: string) => {
    const card = virtualCards.find(c => c.id === id);
    if (!card) return;
    
    if (authState.user && authState.user.role !== 'ADMIN') {
      const updatedUser = { ...authState.user, balance: authState.user.balance + card.balance };
      setAuthState({ ...authState, user: updatedUser });
      db.saveUsers(db.users().map((u: User) => u.id === updatedUser.id ? updatedUser : u));
    }
    
    const updatedCards = virtualCards.filter(c => c.id !== id);
    setVirtualCards(updatedCards);
    db.saveVirtualCards(updatedCards);
    alert('Cartão desativado.');
  };

  const handleWithdrawRequest = (amount: number, pixKey: string) => {
    if (!authState.user) return;
    const updatedUser = { ...authState.user, pixKey };
    if (authState.user.role !== 'ADMIN') {
      updatedUser.balance = authState.user.balance - amount;
    }
    setAuthState({ ...authState, user: updatedUser });
    db.saveUsers(db.users().map((u: User) => u.id === updatedUser.id ? updatedUser : u));
    alert('Transação em processamento bancário. Liquidação em segundos.');
  };

  const handleSaleSuccess = (productId: string, buyerInfo: any) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newSale: Sale = {
      id: `sale-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      buyerName: buyerInfo.name,
      buyerEmail: buyerInfo.email,
      buyerWhatsApp: buyerInfo.whatsapp,
      amount: product.price,
      method: 'PIX',
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    db.saveSales(updatedSales);

    if (authState.user && authState.user.role !== 'ADMIN') {
      const fee = (product.price * 6) / 100;
      const net = product.price - fee;
      const updatedUser = { ...authState.user, balance: authState.user.balance + net };
      setAuthState({ ...authState, user: updatedUser });
      db.saveUsers(db.users().map((u: User) => u.id === updatedUser.id ? updatedUser : u));
    }

    alert(`Sucesso! O produto ${product.name} foi liberado.`);
    window.location.hash = '#/';
  };

  if (currentRoute.startsWith('#/checkout/')) {
    const productId = currentRoute.split('/').pop();
    const product = products.find(p => p.id === productId);
    if (!product) return <div className="p-20 text-center font-black uppercase tracking-widest">Error 404: Product not found</div>;
    return <CheckoutPage product={product} onSuccess={(info) => handleSaleSuccess(product.id, info)} />;
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white p-16 rounded-[60px] shadow-[0_0_100px_rgba(255,255,255,0.1)] w-full max-w-md text-center space-y-12 animate-in zoom-in-95 duration-700">
          <div className="relative flex items-center justify-center w-28 h-28 bg-black mx-auto shadow-2xl">
            <div className="absolute h-20 w-[1px] bg-white"></div>
            <div className="flex items-baseline gap-1 text-white font-serif-brand text-6xl relative z-10 select-none">
              <span>J</span><span>P</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 py-0.5 border border-white/20 z-20">
              <span className="text-white text-[10px] font-light tracking-[0.4em] uppercase">Vano</span>
            </div>
          </div>
          <button 
            onClick={() => {
               const admin = db.users().find((u: User) => u.role === 'ADMIN') || db.users()[0];
               setAuthState({ user: admin, isAuthenticated: true });
            }}
            className="w-full bg-black text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-80 transition-all shadow-2xl active:scale-95"
          >
            Authenticate Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={authState.user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={() => setAuthState({ user: null, isAuthenticated: false })}
    >
      {activeTab === 'dashboard' && <Dashboard user={authState.user} />}
      {activeTab === 'products' && (
        <Products products={products} onCreateProduct={handleCreateProduct} onDeleteProduct={(id) => {
          const updated = products.filter(p => p.id !== id);
          setProducts(updated);
          db.saveProducts(updated);
        }} />
      )}
      {activeTab === 'ai' && <AICopywriter />}
      {activeTab === 'admin' && authState.user && (
        <AdminPanel adminUser={authState.user} onUpdateUser={handleUpdateAnyUser} />
      )}
      {activeTab === 'cards' && authState.user && (
        <VirtualCards 
          user={authState.user} 
          cards={virtualCards} 
          onIssueCard={handleIssueVirtualCard}
          onDeleteCard={handleDeleteCard}
          onToggleStatus={(id) => {
            const updatedCards = virtualCards.map(c => c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } as VirtualCard : c);
            setVirtualCards(updatedCards);
            db.saveVirtualCards(updatedCards);
          }}
        />
      )}
      {activeTab === 'withdrawals' && authState.user && (
        <Financial user={authState.user} onWithdraw={handleWithdrawRequest} />
      )}
      {activeTab === 'affiliates' && <Affiliates products={products} />}
      {activeTab === 'settings' && authState.user && (
        <Settings user={authState.user} onUpdateUser={handleUpdateUser} />
      )}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-[40px] border border-black/5 luxury-shadow overflow-hidden animate-in fade-in duration-500">
          <div className="p-10 border-b border-black/5 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-black tracking-tighter uppercase font-serif-brand">Relatório de Ordens</h2>
              <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mt-1">Monitoramento em tempo real do fluxo de caixa</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/5 border-b border-black/5">
                <tr>
                  <th className="px-10 py-5 text-[10px] font-black text-black/40 uppercase tracking-widest">Identidade</th>
                  <th className="px-10 py-5 text-[10px] font-black text-black/40 uppercase tracking-widest">Ativo</th>
                  <th className="px-10 py-5 text-[10px] font-black text-black/40 uppercase tracking-widest text-right">Liquidação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-10 py-32 text-center text-black/30">Sem operações registradas</td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-black uppercase tracking-tighter">{sale.buyerName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-xs font-black text-black/60 uppercase tracking-widest">{sale.productName}</td>
                      <td className="px-10 py-6 text-right">
                        <span className="inline-flex px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">Completed</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
