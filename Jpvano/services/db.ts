
import { User, Product, Sale, Withdraw, VirtualCard } from '../types';

// This simulates a persistence layer in a real production environment
class StorageService {
  private prefix = 'jpvano_';

  save(key: string, data: any) {
    localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  get(key: string) {
    const data = localStorage.getItem(this.prefix + key);
    return data ? JSON.parse(data) : null;
  }
}

const storage = new StorageService();

export const db = {
  users: () => storage.get('users') || [],
  products: () => storage.get('products') || [],
  sales: () => storage.get('sales') || [],
  withdraws: () => storage.get('withdraws') || [],
  virtualCards: () => storage.get('virtual_cards') || [],

  saveUsers: (data: User[]) => storage.save('users', data),
  saveProducts: (data: Product[]) => storage.save('products', data),
  saveSales: (data: Sale[]) => storage.save('sales', data),
  saveWithdraws: (data: Withdraw[]) => storage.save('withdraws', data),
  saveVirtualCards: (data: VirtualCard[]) => storage.save('virtual_cards', data),
};
