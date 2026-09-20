import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const SUPPLIERS = [
  { id: 1, name: 'Massimo Dutti S.A.', contact: 'Roberto Massimo', email: 'roberto@massimo.com', phone: '+34 91 234 5678', country: 'España', categories: ['Mujer', 'Hombre'], status: 'activo', lastOrder: '15 Sep 2026', balance: 12400 },
  { id: 2, name: 'Zara Studio Group', contact: 'Elena Ortega', email: 'elena@zarastudio.com', phone: '+34 91 345 6789', country: 'España', categories: ['Mujer'], status: 'activo', lastOrder: '10 Sep 2026', balance: 8750 },
  { id: 3, name: 'COS International', contact: 'Lars Petersen', email: 'lars@cos.com', phone: '+46 8 123 4567', country: 'Suecia', categories: ['Mujer', 'Hombre', 'Accesorios'], status: 'activo', lastOrder: '1 Sep 2026', balance: 5200 },
  { id: 4, name: 'Nike Distribution LATAM', contact: 'Andrea López', email: 'andrea@nike.com', phone: '+1 503 671-6453', country: 'EE.UU.', categories: ['Calzado'], status: 'activo', lastOrder: '18 Sep 2026', balance: 31800 },
  { id: 5, name: "Levi's Wholesale", contact: 'John Davis', email: 'john.davis@levis.com', phone: '+1 415 501-6000', country: 'EE.UU.', categories: ['Hombre'], status: 'inactivo', lastOrder: '28 Ago 2026', balance: 0 },
];

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof SUPPLIERS[0] | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = SUPPLIERS.filter(s => search ? s.name.toLowerCase().includes(search.toLowerCase()) : true);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Proveedores</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{SUPPLIERS.filter(s => s.status === 'activo').length} activos · {SUPPLIERS.length} totales</p>
        </div>
        <button onClick={() => setShowNew(true)} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>+ Nuevo proveedor</button>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {[
          { l: 'Balance total pendiente', v: '$' + (SUPPLIERS.reduce((s, p) => s + p.balance, 0) / 1000).toFixed(1) + 'K', color: C.accent },
          { l: 'Proveedores activos', v: SUPPLIERS.filter(s => s.status === 'activo').length.toString(), color: C.success },
          { l: 'Países de origen', v: new Set(SUPPLIERS.map(s => s.country)).size.toString(), color: '#6366F1' },
        ].map(c => (
          <div key={c.l} style={{ flex: 1, background: 'white', borderRadius: 14, border: `1px solid ${C.border}`, padding: 18 }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: c.color, fontFamily: T.body, margin: '0 0 4px' }}>{c.v}</p>
            <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>{c.l}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 10, padding: '9px 14px', border: `1.5px solid ${C.border}`, marginBottom: 16, maxWidth: 320 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar proveedor..." style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: T.body, background: 'transparent', width: '100%' }} />
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 120px 100px 80px 80px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {['Proveedor', 'Contacto', 'País', 'Categorías', 'Última orden', 'Balance', 'Acción'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
          ))}
        </div>
        {filtered.map((s, i) => (
          <div key={s.id} onClick={() => setSelected(s)} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 120px 100px 80px 80px', gap: 0, padding: '14px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer', background: selected?.id === s.id ? C.bg : 'white' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{s.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'activo' ? C.success : C.mutedLight }} />
                <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{s.status}</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: C.dark, fontFamily: T.body, margin: '0 0 1px' }}>{s.contact}</p>
              <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{s.email}</p>
            </div>
            <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{s.country}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {s.categories.map(c => <span key={c} style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: C.bg, color: C.muted, fontFamily: T.body }}>{c}</span>)}
            </div>
            <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{s.lastOrder}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: s.balance > 0 ? C.accent : C.success, fontFamily: T.body }}>{s.balance > 0 ? `$${s.balance.toLocaleString()}` : '$0'}</span>
            <button onClick={e => { e.stopPropagation(); setSelected(s); }} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 11, fontFamily: T.body, cursor: 'pointer' }}>Ver</button>
          </div>
        ))}
      </div>

      {(selected || showNew) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => { setSelected(null); setShowNew(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: 0 }}>{showNew ? 'Nuevo proveedor' : selected?.name}</h3>
              <button onClick={() => { setSelected(null); setShowNew(false); }} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['Nombre empresa', 'Contacto', 'Email', 'Teléfono', 'País', 'Categorías'].map(f => (
                <div key={f}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 5, fontFamily: T.body }}>{f}</label>
                  <input defaultValue={selected ? (f === 'Nombre empresa' ? selected.name : f === 'Contacto' ? selected.contact : f === 'Email' ? selected.email : f === 'Teléfono' ? selected.phone : f === 'País' ? selected.country : selected.categories.join(', ')) : ''} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
            <button onClick={() => { setSelected(null); setShowNew(false); }} style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              {showNew ? 'Crear proveedor' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
