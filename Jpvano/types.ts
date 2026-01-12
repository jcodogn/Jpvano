
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  stripeConnected: boolean;
  pixKey?: string;
  role: UserRole;
}

export type DeliveryType = 'LINK' | 'FILE' | 'MEMBERS_AREA' | 'WHATSAPP';

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  deliveryType: DeliveryType;
  deliveryContent: string;
  affiliateAllowed: boolean;
  commissionPercent: number;
  imageUrl?: string;
}

export type SaleStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'PIX' | 'STRIPE' | 'PAYPAL';

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  buyerWhatsApp: string;
  amount: number;
  method: PaymentMethod;
  status: SaleStatus;
  createdAt: string;
  affiliateId?: string;
}

export interface VirtualCard {
  id: string;
  userId: string;
  label: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED';
  brand: 'VISA' | 'MASTERCARD';
  createdAt: string;
}

export type WithdrawStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Withdraw {
  id: string;
  userId: string;
  amount: number;
  status: WithdrawStatus;
  createdAt: string;
  pixKey: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
