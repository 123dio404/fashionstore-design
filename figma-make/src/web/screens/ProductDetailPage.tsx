import { useState } from 'react';
import { C } from '../../ui';
import type { Product } from '../../types';
import { STORES } from '../../data';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

interface Props {
  product: Product;
  isFav: boolean;
  onToggleFav: () => void;
  onAddToCart: (size: string, color: string) => void;
  onBack: () => void;
  onGoToCart: () => void;
}

export default function ProductDetailPage({ product: p, isFav, onToggleFav, onAddToCart, onBack, onGoToCart }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>('desc');

  const handleAdd = () => {
    if (!size) return;
    onAddToCart(size, p.colors[colorIdx].name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted, fontSize: 13, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Catálogo
        </button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{ fontSize: 13, color: C.dark, fontWeight: 600, fontFamily: T.body }}>{p.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, flex: 1 }}>
        {/* Left: image gallery */}
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Thumbnails */}
          {p.images.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 72 }}>
              {p.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: 72, height: 90, borderRadius: 12, overflow: 'hidden', border: `2px solid ${i === imgIdx ? C.dark : 'transparent'}`, padding: 0, cursor: 'pointer', background: C.bg }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', position: 'relative', background: C.bg, maxHeight: 580 }}>
            <img src={p.images[imgIdx]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: 16, left: 16, background: C.accent, color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8, fontFamily: T.body }}>-{p.discount}%</span>
            <button onClick={onToggleFav} style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? C.accent : 'none'} stroke={isFav ? C.accent : C.muted} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>

        {/* Right: purchase panel */}
        <div>
          <div style={{ position: 'sticky', top: 96 }}>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.08em' }}>{p.brand} · {p.category}</p>
            <h1 style={{ fontFamily: T.display, fontSize: 30, color: C.dark, margin: '0 0 12px', lineHeight: 1.15 }}>{p.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(p.rating) ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>)}
              </div>
              <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{p.rating} · {p.reviews} reseñas</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</span>
              <span style={{ fontSize: 16, color: C.mutedLight, textDecoration: 'line-through', fontFamily: T.body }}>${p.oldPrice.toFixed(2)}</span>
              <span style={{ fontSize: 13, color: C.success, fontWeight: 600, fontFamily: T.body }}>Ahorras ${(p.oldPrice - p.price).toFixed(2)}</span>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 10px' }}>
                Color: <span style={{ fontWeight: 400, color: C.muted }}>{p.colors[colorIdx].name}</span>
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.colors.map((c, i) => (
                  <button key={c.hex} onClick={() => setColorIdx(i)} style={{ width: 36, height: 36, borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer', outline: i === colorIdx ? `3px solid ${C.dark}` : '2px solid transparent', outlineOffset: 2, boxShadow: c.hex === '#F8F9FA' ? `0 0 0 1px ${C.border}` : 'none' }} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0 }}>Talla</p>
                <button style={{ fontSize: 12, color: C.accent, border: 'none', background: 'none', cursor: 'pointer', fontFamily: T.body }}>Guía de tallas</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{ minWidth: 48, height: 48, borderRadius: 12, border: `1.5px solid ${size === s ? C.dark : C.border}`, background: size === s ? C.dark : 'white', color: size === s ? 'white' : C.dark, fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer', padding: '0 10px', transition: 'all .15s' }}>{s}</button>
                ))}
              </div>
              {!size && <p style={{ fontSize: 11, color: C.accent, fontFamily: T.body, margin: '6px 0 0' }}>Selecciona una talla para continuar</p>}
            </div>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 48, border: 'none', background: 'white', cursor: 'pointer', fontSize: 18, color: C.dark }}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontSize: 15, fontWeight: 600, fontFamily: T.body, color: C.dark }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 48, border: 'none', background: 'white', cursor: 'pointer', fontSize: 18, color: C.dark }}>+</button>
              </div>
              <button onClick={handleAdd} disabled={!size} style={{ flex: 1, height: 48, borderRadius: 12, border: 'none', background: added ? '#ECFDF5' : !size ? C.borderLight : C.accent, color: !size ? C.mutedLight : added ? C.success : 'white', fontSize: 14, fontWeight: 700, fontFamily: T.body, cursor: size ? 'pointer' : 'not-allowed', transition: 'all .2s' }}>
                {added ? '✓ Añadido al carrito' : 'Agregar al carrito'}
              </button>
            </div>
            <button onClick={onGoToCart} style={{ width: '100%', height: 48, borderRadius: 12, border: `1.5px solid ${C.dark}`, background: 'transparent', color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', marginBottom: 20 }}>
              Ver carrito
            </button>

            {/* Stock por sucursal */}
            <div style={{ background: C.bg, borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 12px', fontFamily: T.body }}>Disponibilidad por sucursal</p>
              {STORES.map(store => {
                const key = store.id.charAt(0).toUpperCase() + store.id.slice(1);
                const qty = p.stock[key] ?? 0;
                return (
                  <div key={store.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                    <span style={{ fontSize: 13, color: C.dark, fontFamily: T.body }}>{store.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: T.body, color: qty === 0 ? C.mutedLight : qty <= 2 ? C.accent : C.success }}>
                      {qty === 0 ? 'Sin stock' : qty <= 2 ? `Últimas ${qty} unid.` : `${qty} disponibles`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Accordions */}
            {[
              { id: 'desc', label: 'Descripción', content: p.description },
              { id: 'care', label: 'Cuidado', content: '60% Lana · 40% Poliéster\nLavar en seco. No usar secadora.\nPlanchar a temperatura baja.' },
            ].map(({ id, label, content }) => (
              <div key={id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                <button onClick={() => setOpenAcc(openAcc === id ? null : id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" style={{ transform: openAcc === id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {openAcc === id && <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 12px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{content}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
