import { useState } from 'react';
import { C } from '../../ui';
import { PRODUCTS } from '../../data';
import type { Product } from '../../types';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

interface POSItem { productId: number; name: string; price: number; qty: number; size: string; }

export default function POSPage() {
  const [items, setItems] = useState<POSItem[]>([]);
  const [search, setSearch] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'transfer'>('card');
  const [cashReceived, setCashReceived] = useState('');
  const [step, setStep] = useState<'pos' | 'payment' | 'success'>('pos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = search
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    : PRODUCTS.slice(0, 8);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const addItem = (p: Product) => {
    setItems(prev => {
      const ex = prev.find(i => i.productId === p.id);
      if (ex) return prev.map(i => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: p.id, name: p.name, price: p.price, qty: 1, size: p.sizes[0] }];
    });
    setSelectedProduct(null);
  };

  const change = cashReceived ? Number(cashReceived) - total : 0;

  if (step === 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>¡Venta registrada!</h2>
        <p style={{ fontSize: 15, color: C.muted, fontFamily: T.body, margin: '0 0 8px' }}>Total cobrado: <strong>${total.toFixed(2)}</strong></p>
        {payMethod === 'cash' && change >= 0 && (
          <p style={{ fontSize: 18, fontWeight: 700, color: C.success, fontFamily: T.body, margin: '0 0 20px' }}>Cambio: ${change.toFixed(2)}</p>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '12px 24px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 14, fontFamily: T.body, cursor: 'pointer' }}>
            Imprimir comprobante
          </button>
          <button onClick={() => { setItems([]); setStep('pos'); setCashReceived(''); }} style={{ padding: '12px 24px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>
            Nueva venta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, flex: 1 }}>
      {/* Product search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: T.display, fontSize: 26, color: C.dark, margin: 0 }}>Terminal de venta</h2>
          <div style={{ display: 'flex', gap: 8, padding: '6px 12px', background: C.successBg, borderRadius: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.success, marginTop: 3 }} />
            <span style={{ fontSize: 12, color: C.success, fontWeight: 600, fontFamily: T.body }}>Caja abierta · Turno Mañana</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${C.border}` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto por nombre o código..." style={{ border: 'none', outline: 'none', fontSize: 14, fontFamily: T.body, flex: 1 }} />
        </div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flex: 1 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => addItem(p)} style={{ background: 'white', borderRadius: 14, border: `1.5px solid ${C.border}`, cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow .15s' }}>
              <div style={{ height: 120, background: C.bg }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.brand}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${p.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / payment panel */}
      <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, display: 'flex', flexDirection: 'column', position: 'sticky', top: 96, maxHeight: 'calc(100vh - 130px)' }}>
        <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 16px' }}>
          {step === 'payment' ? 'Método de pago' : 'Venta actual'}
        </h3>

        {step === 'pos' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }} className="no-scrollbar">
              {items.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: C.mutedLight, fontFamily: T.body }}>Sin productos. Toca un artículo para agregarlo.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>T. {item.size} · ${item.price.toFixed(2)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => setItems(prev => prev.map(i => i.productId === item.productId ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', fontSize: 14 }}>−</button>
                      <span style={{ width: 22, textAlign: 'center', fontSize: 13, fontWeight: 700, fontFamily: T.body }}>{item.qty}</span>
                      <button onClick={() => setItems(prev => prev.map(i => i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i))} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', fontSize: 14 }}>+</button>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, minWidth: 60, textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => setItems(prev => prev.filter(i => i.productId !== item.productId))} style={{ width: 24, height: 24, borderRadius: 5, border: 'none', background: C.borderLight, cursor: 'pointer', fontSize: 14, color: C.muted }}>✕</button>
                  </div>
                ))
              )}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              {[['Subtotal', `$${subtotal.toFixed(2)}`], ['IVA 21%', `$${tax.toFixed(2)}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${C.borderLight}`, marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${total.toFixed(2)}</span>
              </div>
              <button disabled={items.length === 0} onClick={() => setStep('payment')} style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: items.length === 0 ? C.borderLight : C.dark, color: items.length === 0 ? C.mutedLight : 'white', border: 'none', cursor: items.length === 0 ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, fontFamily: T.body }}>
                Cobrar ${total.toFixed(2)}
              </button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {([['card', 'Tarjeta'], ['cash', 'Efectivo'], ['transfer', 'Transfer.']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setPayMethod(v)} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `2px solid ${payMethod === v ? C.dark : C.border}`, background: payMethod === v ? C.dark : 'white', color: payMethod === v ? 'white' : C.dark, fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{ padding: 16, background: C.bg, borderRadius: 12, marginBottom: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 4px' }}>Total a cobrar</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: 0 }}>${total.toFixed(2)}</p>
            </div>
            {payMethod === 'cash' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 8, fontFamily: T.body }}>Efectivo recibido</label>
                <input type="number" value={cashReceived} onChange={e => setCashReceived(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '14px', borderRadius: 12, border: `2px solid ${C.dark}`, outline: 'none', fontSize: 22, fontWeight: 700, fontFamily: T.body, textAlign: 'center', boxSizing: 'border-box' as const }} />
                {cashReceived && change >= 0 && (
                  <div style={{ marginTop: 10, padding: 12, background: C.successBg, borderRadius: 10, textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.success, fontFamily: T.body, margin: 0 }}>Cambio: ${change.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
            <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('pos')} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 14, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                ← Volver
              </button>
              <button onClick={() => setStep('success')} style={{ flex: 2, padding: '13px 0', borderRadius: 12, background: C.success, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
                ✓ Confirmar cobro
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
