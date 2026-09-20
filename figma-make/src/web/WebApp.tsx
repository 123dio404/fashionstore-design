import { useState, useCallback } from 'react';
import { C } from '../ui';
import { PRODUCTS, INITIAL_PURCHASES, INITIAL_RESERVATIONS } from '../data';
import type { Product } from '../types';
import WebLayout from './WebLayout';
import LoginPage from './screens/LoginPage';
import CatalogPage from './screens/CatalogPage';
import ProductDetailPage from './screens/ProductDetailPage';
import CartPage from './screens/CartPage';
import CheckoutPage from './screens/CheckoutPage';
import PurchasesPage from './screens/PurchasesPage';
import ReservationsPage from './screens/ReservationsPage';
import AIRecsPage from './screens/AIRecsPage';
import ChatbotPage from './screens/ChatbotPage';
import PromotionsPage from './screens/PromotionsPage';
import DashboardPage from './screens/DashboardPage';
import UsersPage from './screens/UsersPage';
import CatalogAdminPage from './screens/CatalogAdminPage';
import InventoryPage from './screens/InventoryPage';
import ReportsPage from './screens/ReportsPage';
import POSPage from './screens/POSPage';
import BranchesPage from './screens/BranchesPage';
import SuppliersPage from './screens/SuppliersPage';
import ParametersPage from './screens/ParametersPage';
import PromotionsAdminPage from './screens/PromotionsAdminPage';

export type WebRole = 'customer' | 'admin' | 'pos';
export type WebScreen =
  | 'catalog' | 'product-detail' | 'cart' | 'checkout' | 'purchase-success'
  | 'purchases' | 'reservations' | 'ai-recs' | 'chatbot' | 'promotions'
  | 'dashboard' | 'users' | 'catalog-admin' | 'inventory' | 'reports'
  | 'pos' | 'reservations-admin' | 'promotions-admin' | 'suppliers'
  | 'branches' | 'parameters';

export interface WebCartItem {
  productId: number; name: string; brand: string; price: number;
  image: string; size: string; color: string; qty: number;
}

interface Props { onSwitchToMobile: () => void; }

export default function WebApp({ onSwitchToMobile }: Props) {
  const [auth, setAuth] = useState<'login' | 'app'>('login');
  const [role, setRole] = useState<WebRole>('customer');
  const [screen, setScreen] = useState<WebScreen>('catalog');
  const [detailId, setDetailId] = useState<number | null>(null);
  const [cart, setCart] = useState<WebCartItem[]>([]);
  const [favs, setFavs] = useState<number[]>([]);
  const [purchases] = useState(INITIAL_PURCHASES);
  const [reservations] = useState(INITIAL_RESERVATIONS);
  const [toast, setToast] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback((p: Product, size = p.sizes[0], color = p.colors[0].name) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === p.id && i.size === size);
      if (existing) return prev.map(i => i.productId === p.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: p.id, name: p.name, brand: p.brand, price: p.price, image: p.image, size, color, qty: 1 }];
    });
    showToast(`${p.name} añadido al carrito`);
  }, [showToast]);

  const toggleFav = useCallback((id: number) => {
    setFavs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleLogin = (r: WebRole) => {
    setRole(r);
    setAuth('app');
    if (r === 'admin') setScreen('dashboard');
    else if (r === 'pos') setScreen('pos');
    else setScreen('catalog');
  };

  const navigate = (s: WebScreen) => {
    setScreen(s);
    setDetailId(null);
  };

  const openDetail = (id: number) => {
    setDetailId(id);
    setScreen('product-detail');
  };

  if (auth === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToMobile={onSwitchToMobile}
      />
    );
  }

  const renderScreen = () => {
    if (screen === 'product-detail' && detailId) {
      const product = PRODUCTS.find(p => p.id === detailId)!;
      return (
        <ProductDetailPage
          product={product}
          isFav={favs.includes(detailId)}
          onToggleFav={() => toggleFav(detailId)}
          onAddToCart={(size, color) => addToCart(product, size, color)}
          onBack={() => setScreen('catalog')}
          onGoToCart={() => navigate('cart')}
        />
      );
    }
    switch (screen) {
      case 'catalog':
        return <CatalogPage favs={favs} onToggleFav={toggleFav} onProductClick={openDetail} onAddToCart={addToCart} toast={toast} />;
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onQtyInc={(id, size) => setCart(prev => prev.map(i => i.productId === id && i.size === size ? { ...i, qty: i.qty + 1 } : i))}
            onQtyDec={(id, size) => setCart(prev => prev.map(i => i.productId === id && i.size === size ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
            onRemove={(id, size) => setCart(prev => prev.filter(i => !(i.productId === id && i.size === size)))}
            onCheckout={() => navigate('checkout')}
            onGoToCatalog={() => navigate('catalog')}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cart={cart}
            onSuccess={() => { setCart([]); setCheckoutSuccess(true); navigate('purchase-success'); }}
            onBack={() => navigate('cart')}
          />
        );
      case 'purchase-success':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, margin: '0 0 8px', color: C.dark }}>¡Compra exitosa!</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", color: C.muted, margin: 0 }}>Tu orden ha sido confirmada y está siendo procesada.</p>
            </div>
            <button onClick={() => navigate('catalog')} style={{ padding: '12px 32px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Seguir comprando
            </button>
          </div>
        );
      case 'purchases': return <PurchasesPage purchases={purchases} />;
      case 'reservations': return <ReservationsPage reservations={reservations} />;
      case 'ai-recs': return <AIRecsPage onProductClick={openDetail} onAddToCart={addToCart} favs={favs} onToggleFav={toggleFav} />;
      case 'chatbot': return <ChatbotPage />;
      case 'promotions': return <PromotionsPage onProductClick={openDetail} />;
      case 'dashboard': return <DashboardPage />;
      case 'users': return <UsersPage />;
      case 'catalog-admin': return <CatalogAdminPage />;
      case 'inventory': return <InventoryPage />;
      case 'reports': return <ReportsPage />;
      case 'pos': return <POSPage />;
      case 'branches': return <BranchesPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'parameters': return <ParametersPage />;
      case 'promotions-admin': return <PromotionsAdminPage />;
      default: return <CatalogPage favs={favs} onToggleFav={toggleFav} onProductClick={openDetail} onAddToCart={addToCart} toast={toast} />;
    }
  };

  return (
    <WebLayout
      role={role}
      screen={screen}
      onNavigate={navigate}
      cartCount={cartCount}
      onSwitchToMobile={onSwitchToMobile}
      onLogout={() => { setAuth('login'); setRole('customer'); }}
    >
      {renderScreen()}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 999, background: C.dark, color: 'white', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}
    </WebLayout>
  );
}
