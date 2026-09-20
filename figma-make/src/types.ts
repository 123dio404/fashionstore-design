export type Tab = 'home' | 'catalog' | 'reservations' | 'cart' | 'profile';
export type AppPhase = 'splash' | 'onboarding' | 'login' | 'register' | 'app';
export type OverlayScreen =
  | null
  | 'checkout'
  | 'purchase-success'
  | 'purchases'
  | 'ar-fitter'
  | 'ai-recs'
  | 'chatbot'
  | 'voice'
  | 'preferences'
  | 'settings'
  | 'support'
  | 'state-demo';
export type ScreenState = 'loading' | 'success' | 'error' | 'empty' | 'offline';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  stock: Record<string, number>;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  productId: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

export interface Reservation {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  brand: string;
  size: string;
  color: string;
  date: string;
  time: string;
  store: string;
  status: 'confirmada' | 'pendiente' | 'cancelada' | 'completada';
  code: string;
}

export interface Purchase {
  id: string;
  date: string;
  status: 'entregado' | 'en_camino' | 'procesando' | 'cancelado';
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  deliveryMethod: 'home' | 'pickup';
  store?: string;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  productId: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'entregado' | 'en_camino' | 'procesando' | 'cancelado';
  total: number;
  items: number;
  image: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

export interface AIPreferences {
  brands: string[];
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
}

export interface UserPreferences {
  brands: string[];
  favoriteColors: string[];
  sizes: string[];
  notifications: boolean;
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'system';
  currency: 'ARS' | 'USD';
}

export interface GlobalState {
  cart: CartItem[];
  favs: number[];
  reservations: Reservation[];
  purchases: Purchase[];
  isOffline: boolean;
  activeTab: Tab;
  prefs: UserPreferences;
}
