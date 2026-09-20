import { useState } from 'react';
import { C } from '../../ui';
import type { Purchase } from '../../types';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Entregado': { bg: '#ECFDF5', text: '#059669' },
  'En camino': { bg: '#EFF6FF', text: '#3B82F6' },
  'Procesando': { bg: '#FEF3C7', text: '#D97706' },
  'Cancelado': { bg: '#FEF2F2', text: '#DC2626' },
};

export default function PurchasesPage({ purchases }: { purchases: Purchase[] }) {
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? purchases : purchases.filter(p => p.status === filter);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 24, flex: 1, alignItems: 'start' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: 0 }}>Mis compras</h2>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, background: 'white', cursor: 'pointer' }}>
            <option value="all">Todos los estados</option>
            <option value="Entregado">Entregado</option>
            <option value="En camino">En camino</option>
            <option value="Procesando">Procesando</option>
          </select>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 100px 120px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
            {['Orden', 'Productos', 'Fecha', 'Total', 'Estado'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
            ))}
          </div>
          {filtered.map((p, i) => {
            const sc = STATUS_COLORS[p.status ?? 'Procesando'] ?? STATUS_COLORS['Procesando'];
            return (
              <div key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 100px 120px', gap: 0, padding: '16px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer', background: selected?.id === p.id ? C.bg : 'white', transition: 'background .12s' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body }}>{p.id}</span>
                <div style={{ display: 'flex', gap: -6 }}>
                  {p.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ width: 36, height: 44, borderRadius: 8, overflow: 'hidden', border: '2px solid white', background: C.bg, marginLeft: idx > 0 ? -10 : 0 }}>
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                  {p.items.length > 3 && <div style={{ width: 36, height: 44, borderRadius: 8, background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -10, border: '2px solid white' }}><span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>+{p.items.length - 3}</span></div>}
                </div>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{p.date}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.total.toFixed(2)}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: sc.bg, color: sc.text, fontFamily: T.body, display: 'inline-block', width: 'fit-content' }}>{p.status ?? 'Procesando'}</span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body }}>Sin compras para este filtro</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, position: 'sticky', top: 96 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: 0 }}>Pedido {selected.id}</h3>
            <button onClick={() => setSelected(null)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, padding: 14, background: C.bg, borderRadius: 12 }}>
            {[
              { l: 'Fecha', v: selected.date },
              { l: 'Pago', v: selected.paymentMethod },
              { l: 'Entrega', v: selected.deliveryMethod === 'home' ? 'A domicilio' : 'Retiro en tienda' },
              { l: 'Total', v: `$${selected.total.toFixed(2)}` },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{row.l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{row.v}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 12px', fontFamily: T.body }}>Artículos</p>
          {selected.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 52, height: 64, borderRadius: 8, overflow: 'hidden', background: C.bg }}>
                <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{item.name}</p>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 4px' }}>T. {item.size} · {item.color} · ×{item.qty}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
