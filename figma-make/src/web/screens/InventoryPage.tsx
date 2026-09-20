import { useState } from 'react';
import { C } from '../../ui';
import { PRODUCTS, STORES } from '../../data';
import type { Product } from '../../types';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const MOVEMENTS = [
  { id: 'M001', product: 'Blazer Oversize Lana', type: 'entrada', qty: 20, store: 'Centro', date: '18 Sep 2026', by: 'Carlos G.' },
  { id: 'M002', product: 'Sneakers Clásicas', type: 'salida', qty: 5, store: 'Norte', date: '17 Sep 2026', by: 'POS Turno M' },
  { id: 'M003', product: 'Vestido Midi Fluido', type: 'ajuste', qty: -2, store: 'Sur', date: '16 Sep 2026', by: 'Lucía F.' },
  { id: 'M004', product: 'Chaqueta Denim', type: 'entrada', qty: 15, store: 'Norte', date: '15 Sep 2026', by: 'Carlos G.' },
  { id: 'M005', product: 'Conjunto Punto', type: 'salida', qty: 3, store: 'Centro', date: '14 Sep 2026', by: 'POS Turno T' },
];

export default function InventoryPage() {
  const [tab, setTab] = useState<'stock' | 'movements'>('stock');
  const [storeFilter, setStoreFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showMovModal, setShowMovModal] = useState(false);

  const totalStock = (p: Product) => Object.values(p.stock).reduce((s, v) => s + v, 0);

  const filtered = PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const criticalCount = PRODUCTS.filter(p => totalStock(p) < 5).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Inventario</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{PRODUCTS.length} SKUs · {criticalCount} productos con stock crítico</p>
        </div>
        <button onClick={() => setShowMovModal(true)} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar movimiento
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total unidades', value: PRODUCTS.reduce((s, p) => s + totalStock(p), 0).toString(), color: '#6366F1', sub: 'En todas las sucursales' },
          { label: 'Stock crítico', value: criticalCount.toString(), color: C.accent, sub: 'Menos de 5 unidades' },
          { label: 'Agotados', value: PRODUCTS.filter(p => totalStock(p) === 0).length.toString(), color: '#DC2626', sub: 'Sin stock disponible' },
          { label: 'Valor en inventario', value: '$' + (PRODUCTS.reduce((s, p) => s + p.price * totalStock(p), 0) / 1000).toFixed(0) + 'K', color: C.success, sub: 'Al precio de venta' },
        ].map(c => (
          <div key={c.label} style={{ background: 'white', borderRadius: 14, border: `1px solid ${C.border}`, padding: 18 }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: c.color, fontFamily: T.body, margin: '0 0 4px' }}>{c.value}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{c.label}</p>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: `2px solid ${C.border}` }}>
        {([['stock', 'Stock por producto'], ['movements', 'Movimientos recientes']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: T.body, color: tab === v ? C.dark : C.muted, borderBottom: `2px solid ${tab === v ? C.dark : 'transparent'}`, marginBottom: -2 }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'stock' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 10, padding: '8px 14px', border: `1.5px solid ${C.border}`, flex: 1, maxWidth: 320 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: T.body, background: 'transparent', width: '100%' }} />
            </div>
            <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, background: 'white' }}>
              <option value="all">Todas las sucursales</option>
              {STORES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr repeat(3, 90px) 90px 80px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {['', 'Producto', 'Centro', 'Norte', 'Sur', 'Total', 'Alerta'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
              ))}
            </div>
            {filtered.map((p, i) => {
              const total = totalStock(p);
              return (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr repeat(3, 90px) 90px 80px', gap: 0, padding: '12px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
                  <div style={{ width: 40, height: 50, borderRadius: 8, overflow: 'hidden', background: C.bg }}>
                    <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 1px' }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0 }}>{p.brand}</p>
                  </div>
                  {['Centro', 'Norte', 'Sur'].map(store => {
                    const qty = p.stock[store] ?? 0;
                    return <span key={store} style={{ fontSize: 13, fontWeight: 600, color: qty === 0 ? C.mutedLight : qty <= 2 ? C.accent : C.dark, fontFamily: T.body }}>{qty}</span>;
                  })}
                  <span style={{ fontSize: 14, fontWeight: 800, color: total === 0 ? '#DC2626' : total <= 5 ? C.warning : C.dark, fontFamily: T.body }}>{total}</span>
                  {total === 0 ? <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#FEF2F2', color: '#DC2626', fontFamily: T.body }}>AGOTADO</span>
                   : total <= 5 ? <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: C.warningBg, color: C.warning, fontFamily: T.body }}>CRÍTICO</span>
                   : <span style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body }}>OK</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'movements' && (
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 2fr 80px 80px 120px 80px 100px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
            {['ID', 'Producto', 'Tipo', 'Cantidad', 'Sucursal', 'Fecha', 'Operador'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
            ))}
          </div>
          {MOVEMENTS.map((m, i) => (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '100px 2fr 80px 80px 120px 80px 100px', gap: 0, padding: '14px 20px', alignItems: 'center', borderBottom: i < MOVEMENTS.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.muted }}>{m.id}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: T.body }}>{m.product}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: m.type === 'entrada' ? '#ECFDF5' : m.type === 'salida' ? '#FEF2F2' : '#FEF3C7', color: m.type === 'entrada' ? C.success : m.type === 'salida' ? '#DC2626' : C.warning, fontFamily: T.body }}>
                {m.type}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: m.qty > 0 ? C.success : C.accent, fontFamily: T.body }}>{m.qty > 0 ? `+${m.qty}` : m.qty}</span>
              <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{m.store}</span>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{m.date}</span>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{m.by}</span>
            </div>
          ))}
        </div>
      )}

      {showMovModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowMovModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 440 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 24px' }}>Registrar movimiento</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Producto', el: <select style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>{PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}</select> },
                { label: 'Tipo de movimiento', el: <select style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}><option>Entrada</option><option>Salida</option><option>Ajuste</option></select> },
                { label: 'Sucursal', el: <select style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>{STORES.map(s => <option key={s.id}>{s.name}</option>)}</select> },
                { label: 'Cantidad', el: <input type="number" defaultValue="1" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' as const }} /> },
                { label: 'Observaciones', el: <textarea rows={2} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' as const, resize: 'none' }} /> },
              ].map(({ label, el }) => (
                <div key={label}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 6, fontFamily: T.body }}>{label}</label>
                  {el}
                </div>
              ))}
            </div>
            <button onClick={() => setShowMovModal(false)} style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              Registrar movimiento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
