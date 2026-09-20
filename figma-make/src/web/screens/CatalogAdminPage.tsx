import { useState } from 'react';
import { C } from '../../ui';
import { PRODUCTS } from '../../data';
import type { Product } from '../../types';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

export default function CatalogAdminPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [showNew, setShowNew] = useState(false);

  const filtered = PRODUCTS.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories = ['all', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const totalStock = (p: Product) => Object.values(p.stock).reduce((s, v) => s + v, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 24, flex: 1 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Gestión de catálogo</h2>
            <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{PRODUCTS.length} productos en el sistema</p>
          </div>
          <button onClick={() => setShowNew(true)} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar producto
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 10, padding: '8px 14px', border: `1.5px solid ${C.border}`, flex: 1, maxWidth: 320 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: T.body, background: 'transparent', width: '100%' }} />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, background: 'white' }}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Todas las categorías' : c}</option>)}
          </select>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 80px 80px 80px 100px 80px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
            {['', 'Producto', 'Precio', 'Stock', 'Dto.', 'Categoría', 'Acción'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
            ))}
          </div>
          {filtered.map((p, i) => {
            const stock = totalStock(p);
            return (
              <div key={p.id} onClick={() => { setSelected(p); setMode('view'); }} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 80px 80px 80px 100px 80px', gap: 0, padding: '12px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer', background: selected?.id === p.id ? C.bg : 'white', transition: 'background .12s' }}>
                <div style={{ width: 40, height: 50, borderRadius: 8, overflow: 'hidden', background: C.bg }}>
                  <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{p.brand} · {p.sizes.join(', ')}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: stock === 0 ? C.accent : stock <= 5 ? C.warning : C.success, fontFamily: T.body }}>
                  {stock === 0 ? 'Agotado' : stock}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: T.body }}>-{p.discount}%</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: C.bg, color: C.muted, fontFamily: T.body, width: 'fit-content' }}>{p.category}</span>
                <button onClick={e => { e.stopPropagation(); setSelected(p); setMode('edit'); }} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 11, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                  Editar
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, position: 'sticky', top: 96 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: 0 }}>{mode === 'edit' ? 'Editar' : 'Detalle'}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 11, fontFamily: T.body, cursor: 'pointer' }}>
                {mode === 'edit' ? 'Cancelar' : 'Editar'}
              </button>
              <button onClick={() => setSelected(null)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div style={{ height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 16, background: C.bg }}>
            <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {mode === 'view' ? (
            <div>
              <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 4px', fontFamily: T.body }}>{selected.brand} · {selected.category}</p>
              <h4 style={{ fontFamily: T.display, fontSize: 18, color: C.dark, margin: '0 0 16px' }}>{selected.name}</h4>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, padding: 12, background: C.bg, borderRadius: 10, textAlign: 'center' }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>${selected.price.toFixed(2)}</p>
                  <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0 }}>Precio actual</p>
                </div>
                <div style={{ flex: 1, padding: 12, background: '#FEF2F2', borderRadius: 10, textAlign: 'center' }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: C.accent, fontFamily: T.body, margin: '0 0 2px' }}>-{selected.discount}%</p>
                  <p style={{ fontSize: 10, color: C.accent, fontFamily: T.body, margin: 0 }}>Descuento</p>
                </div>
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 10px', fontFamily: T.body }}>Stock por sucursal</p>
              {Object.entries(selected.stock).map(([branch, qty]) => (
                <div key={branch} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                  <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{branch}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: qty === 0 ? C.accent : qty <= 2 ? C.warning : C.success, fontFamily: T.body }}>{qty === 0 ? 'Agotado' : `${qty} unid.`}</span>
                </div>
              ))}
              <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.07em', margin: '16px 0 8px', fontFamily: T.body }}>Tallas disponibles</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.sizes.map(s => <span key={s} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: C.bg, color: C.dark, fontFamily: T.body }}>{s}</span>)}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Nombre', val: selected.name },
                { label: 'Marca', val: selected.brand },
                { label: 'Precio actual', val: selected.price.toString() },
                { label: 'Precio anterior', val: selected.oldPrice.toString() },
                { label: 'Descuento (%)', val: selected.discount.toString() },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5, fontFamily: T.body }}>{f.label}</label>
                  <input defaultValue={f.val} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                </div>
              ))}
              <button onClick={() => setMode('view')} style={{ padding: '12px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      )}

      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowNew(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: 0 }}>Nuevo producto</h3>
              <button onClick={() => setShowNew(false)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['Nombre', 'Marca', 'Precio', 'Descuento (%)', 'Categoría', 'Descripción'].map(f => (
                <div key={f} style={{ gridColumn: f === 'Descripción' ? '1/-1' : undefined }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 6, fontFamily: T.body }}>{f}</label>
                  {f === 'Descripción'
                    ? <textarea rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const, resize: 'none' }} />
                    : <input style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                  }
                </div>
              ))}
            </div>
            <button onClick={() => setShowNew(false)} style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              Crear producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
