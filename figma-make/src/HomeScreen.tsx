import { useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from './data';
import type { Product } from './types';
import {
  C, T, AppBar, SectionHead, ProductCard, SkeletonProductCard, SkeletonBanner,
  ErrorState, OfflineState, Skel, IcSearch, IcBell, IcMic, IcMessageCircle, SuccessToast, IcTag,
} from './ui';

interface Props {
  isOffline: boolean;
  favs: number[];
  onToggleFav: (id: number) => void;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  onGoToCatalog: () => void;
  onOpenVoice: () => void;
  onOpenChatbot: () => void;
  toast: string | null;
  onDismissToast: () => void;
}

type State = 'loading' | 'success' | 'error';

export default function HomeScreen({ isOffline, favs, onToggleFav, onAddToCart, onProductClick, onGoToCatalog, onOpenVoice, onOpenChatbot, toast, onDismissToast }: Props) {
  const [state, setState] = useState<State>('loading');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    if (isOffline) return;
    setState('loading');
    const t = setTimeout(() => setState('success'), 1500);
    return () => clearTimeout(t);
  }, [isOffline]);

  const filtered = activeCategory === 'Todos'
    ? PRODUCTS
    : activeCategory === 'Ofertas'
    ? PRODUCTS.filter(p => p.discount >= 27)
    : PRODUCTS.filter(p => p.category === activeCategory);

  const featured = PRODUCTS.filter(p => p.isFeatured);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      {/* AppBar */}
      <div style={{ padding: '52px 20px 0', background: C.bg, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0, letterSpacing: '0.04em' }}>Bienvenida de nuevo</p>
            <h1 className="font-display" style={{ fontSize: 24, color: C.dark, margin: 0, lineHeight: 1.15 }}>FashionStore</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 38, height: 38, borderRadius: '50%', background: C.card, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <IcBell size={18} />
            </button>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 700, fontFamily: T.body }}>AL</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.card, borderRadius: 14, padding: '11px 14px', border: `1px solid ${C.borderLight}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 16 }}>
          <div onClick={onGoToCatalog} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, cursor: 'pointer' }}>
            <IcSearch size={16} />
            <span style={{ color: C.mutedLight, fontSize: 14, fontFamily: T.body }}>Buscar productos, marcas...</span>
          </div>
          <button onClick={onOpenVoice} style={{ width: 32, height: 32, borderRadius: '50%', background: C.borderLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <IcMic size={15} color={C.muted} />
          </button>
        </div>
      </div>

      {isOffline ? (
        <OfflineState onRetry={() => {}} />
      ) : state === 'error' ? (
        <ErrorState onRetry={() => setState('loading')} message="No pudimos cargar el catálogo. Verifica tu conexión." />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }} className="no-scrollbar">

          {/* Banner */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            {state === 'loading' ? <SkeletonBanner /> : (
              <div className="fade-in" style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 190 }}>
                <img src="https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=700&h=380&fit=crop&auto=format" alt="Colección Otoño-Invierno 2026" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(17,24,39,0.82) 0%, rgba(17,24,39,0.15) 65%)' }}>
                  <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                    <span style={{ background: C.accent, color: 'white', fontSize: 10, fontWeight: 700, fontFamily: T.body, letterSpacing: '0.08em', padding: '3px 9px', borderRadius: 5, display: 'block', marginBottom: 8, width: 'fit-content' }}>NUEVA TEMPORADA</span>
                    <p className="font-display" style={{ color: 'white', fontSize: 22, margin: 0, lineHeight: 1.15 }}>Otoño · Invierno<br />2026</p>
                    <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, fontFamily: T.body, margin: '6px 0 0' }}>Hasta 40% de descuento</p>
                  </div>
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '6px 10px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IcTag size={11} color="white" />
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'white', fontFamily: T.body }}>40% OFF</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category pills */}
          <div style={{ paddingLeft: 20, marginBottom: 24 }}>
            {state === 'loading' ? (
              <div style={{ display: 'flex', gap: 8 }}>
                {[60, 55, 70, 62, 65].map((w, i) => <Skel key={i} w={w} h={34} r={100} />)}
              </div>
            ) : (
              <div className="fade-in no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingRight: 20 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: T.body, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.18s', background: activeCategory === cat ? C.dark : C.card, color: activeCategory === cat ? '#fff' : C.muted, boxShadow: activeCategory === cat ? 'none' : '0 1px 3px rgba(0,0,0,0.08)' }}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Featured */}
          <SectionHead title="Destacados" action="Ver todos" onAction={onGoToCatalog} />
          <div style={{ paddingLeft: 20, marginBottom: 28, overflowX: 'auto' }} className="no-scrollbar">
            <div style={{ display: 'flex', gap: 12, paddingRight: 20 }}>
              {state === 'loading'
                ? [1, 2, 3].map(i => (
                    <div key={i} style={{ minWidth: 152, borderRadius: 16, overflow: 'hidden', background: C.card }}>
                      <Skel h={192} r={0} />
                      <div style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}><Skel h={9} w="50%" /><Skel h={12} w="80%" /><Skel h={12} w="55%" /></div>
                    </div>
                  ))
                : featured.map(p => (
                    <div key={p.id} className="fade-in" style={{ minWidth: 152, borderRadius: 16, overflow: 'hidden', background: C.card, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }} onClick={() => onProductClick(p)}>
                      <div style={{ position: 'relative', height: 192, background: C.borderLight }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: 8, left: 8, background: C.accent, color: 'white', fontSize: 9, fontWeight: 700, fontFamily: T.body, padding: '2px 6px', borderRadius: 5 }}>-{p.discount}%</span>
                      </div>
                      <div style={{ padding: '8px 10px 10px' }}>
                        <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.brand}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Grid */}
          <SectionHead title={activeCategory === 'Todos' ? 'Nuevos arrivals' : activeCategory} action="Filtrar" onAction={onGoToCatalog} />
          <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {state === 'loading'
              ? [1, 2, 3, 4].map(i => <SkeletonProductCard key={i} />)
              : filtered.length === 0
              ? (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ textAlign: 'center', color: C.muted, fontFamily: T.body, fontSize: 14, padding: '32px 0' }}>No hay productos en esta categoría.</p>
                </div>
              )
              : filtered.map(p => (
                  <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => onAddToCart(p)} isFav={favs.includes(p.id)} onToggleFav={() => onToggleFav(p.id)} />
                ))
            }
          </div>
        </div>
      )}

      {toast && <SuccessToast message={toast} onDismiss={onDismissToast} />}

      {/* FAB — Chatbot */}
      <button onClick={onOpenChatbot} style={{ position: 'absolute', bottom: 20, right: 20, width: 52, height: 52, borderRadius: '50%', background: C.dark, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.28)', zIndex: 30 }}>
        <IcMessageCircle size={22} color="white" />
      </button>
    </div>
  );
}
