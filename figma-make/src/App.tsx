import { useState, useCallback } from 'react';
import type { Tab, CartItem, Reservation, Product, AppPhase, OverlayScreen, Purchase, UserPreferences } from './types';
import WebApp from './web/WebApp';
import { INITIAL_RESERVATIONS, INITIAL_PURCHASES, DEFAULT_PREFS } from './data';
import { BottomNav, OfflineBanner, C, T } from './ui';

// Screens — auth flow
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

// Screens — main tabs
import HomeScreen from './HomeScreen';
import CatalogScreen from './CatalogScreen';
import ReservationsScreen from './ReservationsScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';

// Screens — overlays
import CheckoutScreen from './CheckoutScreen';
import PurchaseSuccessScreen from './PurchaseSuccessScreen';
import PurchasesScreen from './PurchasesScreen';
import ARFitterScreen from './ARFitterScreen';
import AIRecommendationsScreen from './AIRecommendationsScreen';
import ChatbotScreen from './ChatbotScreen';
import VoiceScreen from './VoiceScreen';
import PreferencesScreen from './PreferencesScreen';
import SupportScreen from './SupportScreen';
import SettingsScreen from './SettingsScreen';
import StateDemoScreen from './StateScreens';

// Product detail (inline, shares App state)
import { useState as useLocalState } from 'react';
import {
  AppBar, IcHeart, IcChevronDown, IcStar, IcMapPin,
} from './ui';
import { PRODUCTS, STORES } from './data';

function ProductDetail({ productId, onBack, onAddToCart, isFav, onToggleFav, onOpenAR }: {
  productId: number;
  onBack: () => void;
  onAddToCart: (p: Product, size: string, color: string) => void;
  isFav: boolean;
  onToggleFav: () => void;
  onOpenAR: (id: number) => void;
}) {
  const product = PRODUCTS.find(p => p.id === productId)!;
  const [imgIdx, setImgIdx] = useLocalState(0);
  const [size, setSize] = useLocalState('');
  const [colorIdx, setColorIdx] = useLocalState(0);
  const [openAccordion, setOpenAccordion] = useLocalState<string | null>(null);
  const [added, setAdded] = useLocalState(false);

  const handleAdd = () => {
    if (!size) return;
    onAddToCart(product, size, product.colors[colorIdx].name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'relative', height: 420, background: '#F3F4F6', flexShrink: 0 }}>
        <img src={product.images[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button onClick={onBack} style={{ position: 'absolute', top: 52, left: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button onClick={onToggleFav} style={{ position: 'absolute', top: 52, right: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
          <IcHeart size={16} filled={isFav} />
        </button>
        <span style={{ position: 'absolute', top: 52, left: 64, background: C.accent, color: 'white', fontSize: 11, fontWeight: 700, fontFamily: T.body, padding: '4px 10px', borderRadius: 8 }}>-{product.discount}%</span>
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {product.images.map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 22 : 7, height: 7, borderRadius: 100, background: i === imgIdx ? C.dark : 'rgba(255,255,255,0.75)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
          ))}
        </div>
        {product.images.length > 1 && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{ width: 46, height: 58, borderRadius: 10, overflow: 'hidden', border: `2px solid ${i === imgIdx ? C.dark : 'transparent'}`, padding: 0, cursor: 'pointer' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }} className="no-scrollbar">
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{product.brand} · {product.category}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IcStar size={12} />
              <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{product.rating} ({product.reviews})</span>
            </div>
          </div>
          <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 10px', lineHeight: 1.2 }}>{product.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${product.price.toFixed(2)}</span>
            <span style={{ fontSize: 14, color: C.mutedLight, fontFamily: T.body, textDecoration: 'line-through' }}>${product.oldPrice.toFixed(2)}</span>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 10px' }}>Color: <span style={{ fontWeight: 400, color: C.muted }}>{product.colors[colorIdx].name}</span></p>
            <div style={{ display: 'flex', gap: 10 }}>
              {product.colors.map((c, i) => (
                <button key={c.hex} onClick={() => setColorIdx(i)} style={{ width: 32, height: 32, borderRadius: '50%', background: c.hex, border: i === colorIdx ? `2px solid ${C.dark}` : '2px solid transparent', outline: i === colorIdx ? '2px solid white' : 'none', outlineOffset: -4, cursor: 'pointer', boxShadow: c.hex === '#F8F9FA' ? `0 0 0 1px ${C.border}` : 'none' }} />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0 }}>Talla</p>
              <button style={{ fontSize: 12, color: C.accent, fontFamily: T.body, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Guía de tallas →</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} style={{ minWidth: 46, height: 46, borderRadius: 12, border: 'none', fontFamily: T.body, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: size === s ? C.dark : '#F3F4F6', color: size === s ? 'white' : '#374151', padding: '0 10px' }}>{s}</button>
              ))}
            </div>
            {!size && <p style={{ fontSize: 11, color: C.accent, fontFamily: T.body, margin: '8px 0 0' }}>Selecciona una talla para continuar</p>}
          </div>

          {/* Stock */}
          <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Disponibilidad por sucursal</p>
            {STORES.map(store => {
              const key = store.id.charAt(0).toUpperCase() + store.id.slice(1);
              const qty = product.stock[key] ?? 0;
              return (
                <div key={store.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 7, marginBottom: 7, borderBottom: `1px solid ${C.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IcMapPin size={11} />
                    <span style={{ fontSize: 12, color: '#374151', fontFamily: T.body }}>{store.name}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: T.body, color: qty === 0 ? C.mutedLight : qty <= 2 ? C.accent : '#059669' }}>
                    {qty === 0 ? 'Sin stock' : qty <= 2 ? `Últimas ${qty} unid.` : `${qty} disponibles`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Accordions */}
          {[
            { id: 'desc', label: 'Descripción del producto', content: product.description },
            { id: 'sizes', label: 'Guía de tallas', content: 'XS: busto 80–84 cm · cintura 60–64 cm\nS: busto 84–88 cm · cintura 64–68 cm\nM: busto 88–92 cm · cintura 68–72 cm\nL: busto 92–96 cm · cintura 72–76 cm\nXL: busto 96–100 cm · cintura 76–80 cm' },
            { id: 'care', label: 'Cuidado y composición', content: '60% Lana · 40% Poliéster\nLavar en seco. No usar secadora.\nPlanchar a temperatura baja con paño húmedo.' },
          ].map(({ id, label, content }) => (
            <div key={id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
              <button onClick={() => setOpenAccordion(openAccordion === id ? null : id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{label}</span>
                <IcChevronDown size={15} open={openAccordion === id} />
              </button>
              {openAccordion === id && <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{content}</p>}
            </div>
          ))}

          {/* AR button */}
          <button onClick={() => onOpenAR(product.id)} style={{ width: '100%', marginTop: 16, padding: '13px 0', borderRadius: 14, border: `1.5px solid ${C.dark}`, background: 'transparent', color: C.dark, fontSize: 13, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2l-4 5-4-5"/></svg>
            Probar con Realidad Aumentada
          </button>
        </div>
      </div>

      {/* Fixed CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${C.borderLight}`, padding: '12px 20px 28px', display: 'flex', gap: 10 }}>
        <button onClick={handleAdd} disabled={!size} style={{ flex: 1, padding: '15px 0', borderRadius: 15, border: 'none', fontFamily: T.body, fontSize: 15, fontWeight: 700, cursor: size ? 'pointer' : 'not-allowed', background: added ? '#059669' : !size ? C.borderLight : C.accent, color: !size ? C.mutedLight : 'white' }}>
          {added ? '¡Agregado!' : 'Agregar al carrito'}
        </button>
        <button style={{ padding: '15px 20px', borderRadius: 15, border: `2px solid ${C.dark}`, fontFamily: T.body, fontSize: 15, fontWeight: 700, cursor: 'pointer', background: 'transparent', color: C.dark }}>
          Comprar
        </button>
      </div>
    </div>
  );
}

// ─── App root ──────────────────────────────────────────────────────
export default function App() {
  const [webMode, setWebMode] = useState(false);

  if (webMode) {
    return <WebApp onSwitchToMobile={() => setWebMode(false)} />;
  }

  return <MobileApp onSwitchToWeb={() => setWebMode(true)} />;
}

function MobileApp({ onSwitchToWeb }: { onSwitchToWeb: () => void }) {
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [tab, setTab] = useState<Tab>('home');
  const [detailId, setDetailId] = useState<number | null>(null);
  const [overlay, setOverlay] = useState<OverlayScreen>(null);
  const [arProductId, setArProductId] = useState<number | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<number[]>([]);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isOffline, setIsOffline] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastPurchase, setLastPurchase] = useState<Purchase | null>(null);

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
  const activeReservations = reservations.filter(r => r.status === 'confirmada' || r.status === 'pendiente').length;

  const openOverlay = (s: OverlayScreen) => { setOverlay(s); setDetailId(null); };
  const closeOverlay = () => setOverlay(null);

  const handleCheckoutSuccess = (purchase: Purchase) => {
    setCart([]);
    setPurchases(prev => [purchase, ...prev]);
    setLastPurchase(purchase);
    setOverlay('purchase-success');
  };

  const W = 390, H = 844;

  // ─── Auth phases ──────────────────────────────────────
  if (phase === 'splash') {
    return (
      <Shell W={W} H={H}>
        <SplashScreen onDone={() => setPhase('onboarding')} />
      </Shell>
    );
  }

  if (phase === 'onboarding') {
    return (
      <Shell W={W} H={H}>
        <OnboardingScreen onDone={() => setPhase('login')} />
      </Shell>
    );
  }

  if (phase === 'login') {
    return (
      <Shell W={W} H={H}>
        <LoginScreen
          onSuccess={() => setPhase('app')}
          onGoRegister={() => setPhase('register')}
        />
      </Shell>
    );
  }

  if (phase === 'register') {
    return (
      <Shell W={W} H={H}>
        <RegisterScreen
          onSuccess={() => setPhase('app')}
          onGoLogin={() => setPhase('login')}
        />
      </Shell>
    );
  }

  // ─── Main app ─────────────────────────────────────────
  return (
    <Shell W={W} H={H} onSwitchToWeb={onSwitchToWeb}>
      {/* Status bar */}
      <div style={{ height: 44, background: detailId ? 'transparent' : C.bg, position: detailId ? 'absolute' : 'relative', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: T.body, color: detailId ? 'transparent' : C.dark }}>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', opacity: detailId ? 0 : 1 }}>
          {[3, 2, 1].map(i => <div key={i} style={{ width: 3, height: 4 + i * 3, background: C.dark, borderRadius: 1 }} />)}
          <div style={{ width: 18, height: 9, border: `1.5px solid ${C.dark}`, borderRadius: 2, marginLeft: 3 }}>
            <div style={{ width: '70%', height: '100%', background: C.dark, borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {isOffline && !detailId && !overlay && <OfflineBanner />}

      {/* Screen content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Overlays */}
        {overlay === 'checkout' ? (
          <CheckoutScreen
            cart={cart}
            onBack={closeOverlay}
            onSuccess={handleCheckoutSuccess}
          />
        ) : overlay === 'purchase-success' && lastPurchase ? (
          <PurchaseSuccessScreen
            purchase={lastPurchase}
            onViewPurchases={() => setOverlay('purchases')}
            onContinueShopping={closeOverlay}
          />
        ) : overlay === 'purchases' ? (
          <PurchasesScreen purchases={purchases} onBack={closeOverlay} />
        ) : overlay === 'ar-fitter' ? (
          <ARFitterScreen onBack={closeOverlay} initialProductId={arProductId} />
        ) : overlay === 'ai-recs' ? (
          <AIRecommendationsScreen
            onBack={closeOverlay}
            onProductClick={p => { closeOverlay(); setDetailId(p.id); }}
            onAddToCart={addToCart}
            favs={favs}
            onToggleFav={toggleFav}
          />
        ) : overlay === 'chatbot' ? (
          <ChatbotScreen onBack={closeOverlay} />
        ) : overlay === 'voice' ? (
          <VoiceScreen onBack={closeOverlay} />
        ) : overlay === 'preferences' ? (
          <PreferencesScreen
            onBack={closeOverlay}
            initial={userPrefs}
            onSave={p => { setUserPrefs(p); }}
          />
        ) : overlay === 'settings' ? (
          <SettingsScreen
            onBack={closeOverlay}
            initial={userPrefs}
            onSave={p => { setUserPrefs(p); }}
            onLogout={() => { setPhase('login'); setOverlay(null); }}
          />
        ) : overlay === 'support' ? (
          <SupportScreen onBack={closeOverlay} />
        ) : overlay === 'state-demo' ? (
          <StateDemoScreen onBack={closeOverlay} />
        ) : detailId ? (
          <ProductDetail
            productId={detailId}
            onBack={() => setDetailId(null)}
            onAddToCart={(p, size, color) => addToCart(p, size, color)}
            isFav={favs.includes(detailId)}
            onToggleFav={() => toggleFav(detailId)}
            onOpenAR={id => { setArProductId(id); openOverlay('ar-fitter'); }}
          />
        ) : tab === 'home' ? (
          <HomeScreen
            isOffline={isOffline}
            favs={favs}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
            onProductClick={p => setDetailId(p.id)}
            onGoToCatalog={() => setTab('catalog')}
            onOpenVoice={() => openOverlay('voice')}
            onOpenChatbot={() => openOverlay('chatbot')}
            toast={toast}
            onDismissToast={() => setToast(null)}
          />
        ) : tab === 'catalog' ? (
          <CatalogScreen
            isOffline={isOffline}
            favs={favs}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
            onProductClick={p => setDetailId(p.id)}
            onOpenVoice={() => openOverlay('voice')}
            onOpenChatbot={() => openOverlay('chatbot')}
            toast={toast}
            onDismissToast={() => setToast(null)}
          />
        ) : tab === 'reservations' ? (
          <ReservationsScreen
            isOffline={isOffline}
            reservations={reservations}
            onAddReservation={r => setReservations(prev => [...prev, r])}
            onCancelReservation={id => setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelada' } : r))}
          />
        ) : tab === 'cart' ? (
          <CartScreen
            cart={cart}
            isOffline={isOffline}
            onQtyInc={(id, size) => setCart(prev => prev.map(i => i.productId === id && i.size === size ? { ...i, qty: i.qty + 1 } : i))}
            onQtyDec={(id, size) => setCart(prev => prev.map(i => i.productId === id && i.size === size ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
            onRemove={(id, size) => setCart(prev => prev.filter(i => !(i.productId === id && i.size === size)))}
            onGoToCatalog={() => setTab('catalog')}
            onCheckout={() => openOverlay('checkout')}
          />
        ) : (
          <ProfileScreen
            isOffline={isOffline}
            setIsOffline={setIsOffline}
            favsCount={favs.length}
            cartCount={cartCount}
            onOpenPurchases={() => openOverlay('purchases')}
            onOpenPreferences={() => openOverlay('preferences')}
            onOpenSettings={() => openOverlay('settings')}
            onOpenSupport={() => openOverlay('support')}
            onOpenAIRecs={() => openOverlay('ai-recs')}
            onOpenChatbot={() => openOverlay('chatbot')}
            onOpenVoice={() => openOverlay('voice')}
            onOpenStateDemo={() => openOverlay('state-demo')}
            onLogout={() => setPhase('login')}
          />
        )}
      </div>

      {/* Toast */}
      {toast && !overlay && !detailId && (
        <div className="toast-in" style={{ position: 'absolute', bottom: 76, left: 16, right: 16, zIndex: 100, background: C.dark, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#F9FAFB', fontFamily: T.body }}>{toast}</span>
        </div>
      )}

      {/* Bottom nav */}
      {!detailId && !overlay && (
        <BottomNav
          active={tab}
          onTab={setTab}
          cartCount={cartCount}
          reservCount={activeReservations}
        />
      )}
    </Shell>
  );
}

function Shell({ W, H, children, onSwitchToWeb }: { W: number; H: number; children: React.ReactNode; onSwitchToWeb?: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0F172A', padding: '24px 0', gap: 16 }}>
      <div style={{
        width: W, height: H, background: C.bg,
        borderRadius: 50, overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 0 8px #1E293B, 0 0 0 9px #334155, 0 40px 90px rgba(0,0,0,0.7)',
      }}>
        {children}
      </div>
      {onSwitchToWeb && (
        <button onClick={onSwitchToWeb} style={{ padding: '9px 20px', borderRadius: 24, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)', fontSize: 12, fontFamily: T.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Ver versión web
        </button>
      )}
    </div>
  );
}
