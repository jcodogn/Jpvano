
import React, { useState } from 'react';
import { Plus, Search, ExternalLink, MoreVertical, Edit2, Trash2, Copy } from 'lucide-react';
import { Product } from '../types';

interface ProductsProps {
  products: Product[];
  onCreateProduct: (p: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const Products: React.FC<ProductsProps> = ({ products, onCreateProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    deliveryType: 'LINK',
    deliveryContent: '',
    description: '',
    affiliateAllowed: true,
    commissionPercent: 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProduct(newProduct);
    setIsModalOpen(false);
    setNewProduct({
      name: '',
      price: 0,
      deliveryType: 'LINK',
      deliveryContent: '',
      description: '',
      affiliateAllowed: true,
      commissionPercent: 50
    });
  };

  const copyCheckoutLink = (id: string) => {
    const url = `${window.location.origin}/#/checkout/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link de checkout copiado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seus Produtos</h1>
          <p className="text-slate-500">Gerencie seus infoprodutos e links de pagamento.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Afiliados</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Você ainda não criou nenhum produto.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">R$ {product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                        {product.deliveryType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.affiliateAllowed ? (
                        <span className="text-xs font-medium text-emerald-600">{product.commissionPercent}% Comis.</span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Desativado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => copyCheckoutLink(product.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Copiar checkout"
                        >
                          <Copy size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Criar Novo Produto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Ebook Grátis"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Preço (R$)</label>
                  <input 
                    required
                    type="number" 
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Descrição curta</label>
                <textarea 
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                  placeholder="Explique o que o cliente vai receber..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Entrega</label>
                  <select 
                    value={newProduct.deliveryType}
                    onChange={e => setNewProduct({...newProduct, deliveryType: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LINK">Link Externo</option>
                    <option value="FILE">Arquivo (PDF/ZIP)</option>
                    <option value="MEMBERS_AREA">Área de Membros JPVano</option>
                    <option value="WHATSAPP">Grupo de WhatsApp</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Conteúdo da Entrega</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.deliveryContent}
                    onChange={e => setNewProduct({...newProduct, deliveryContent: e.target.value})}
                    placeholder="Link ou instrução de acesso"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-900">Permitir Afiliados?</p>
                  <p className="text-xs text-indigo-600">Outras pessoas podem vender seu produto.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={newProduct.affiliateAllowed}
                  onChange={e => setNewProduct({...newProduct, affiliateAllowed: e.target.checked})}
                  className="w-6 h-6 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Criar Produto e Gerar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
