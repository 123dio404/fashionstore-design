import { useState } from 'react';
import { C } from '../../ui';
import type { Reservation } from '../../types';
import { STORES, TIME_SLOTS, PRODUCTS } from '../../data';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  confirmada: { bg: '#ECFDF5', text: '#059669', label: 'Confirmada' },
  pendiente: { bg: '#FEF3C7', text: '#D97706', label: 'Pendiente' },
  cancelada: { bg: '#FEF2F2', text: '#DC2626', label: 'Cancelada' },
};

export default function ReservationsPage({ reservations }: { reservations: Reservation[] }) {
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState(STORES[0].id);
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [created, setCreated] = useState(false);
  const [filter, setFilter] = useState<'all' | 'confirmada' | 'pendiente' | 'cancelada'>('all');

  const displayed = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Reservas de probador</h2>
          <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: 0 }}>Reserva tu turno en cualquier sucursal</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva reserva
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([['all', 'Todas'], ['confirmada', 'Confirmadas'], ['pendiente', 'Pendientes'], ['cancelada', 'Canceladas']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${filter === v ? C.dark : C.border}`, background: filter === v ? C.dark : 'white', color: filter === v ? 'white' : C.muted, fontSize: 13, fontWeight: filter === v ? 600 : 400, fontFamily: T.body, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {displayed.map(r => {
          const product = PRODUCTS.find(p => p.id === r.productId);
          const statusConf = STATUS_MAP[r.status] ?? STATUS_MAP.pendiente;
          return (
            <div key={r.id} style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ height: 140, background: C.bg, position: 'relative', overflow: 'hidden' }}>
                {product && <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,24,39,0.6), transparent)' }} />
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: statusConf.bg, color: statusConf.text, fontFamily: T.body }}>
                  {statusConf.label}
                </span>
                <span style={{ position: 'absolute', bottom: 12, left: 12, fontSize: 13, fontWeight: 700, color: 'white', fontFamily: T.body }}>
                  {product?.name ?? r.productName}
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {[
                    { icon: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z', label: r.store },
                    { icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', label: r.date },
                    { icon: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z', label: r.time },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                      <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                {r.status !== 'cancelada' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.muted, fontSize: 12, fontFamily: T.body, cursor: 'pointer' }}>Ver QR</button>
                    <button style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid #FEE2E2`, background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontFamily: T.body, cursor: 'pointer' }}>Cancelar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: C.muted, fontFamily: T.body }}>No hay reservas para este filtro</p>
          </div>
        )}
      </div>

      {/* New reservation modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => !created && setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 480, maxWidth: '90vw' }}>
            {created ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 8px' }}>¡Reserva confirmada!</h3>
                <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: '0 0 20px' }}>Te enviaremos un recordatorio el día del turno.</p>
                <button onClick={() => { setCreated(false); setShowModal(false); }} style={{ padding: '12px 28px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>Cerrar</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: 0 }}>Nueva reserva</h3>
                  <button onClick={() => setShowModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Producto', el: <select value={productId} onChange={e => setProductId(Number(e.target.value))} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>{PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select> },
                    { label: 'Sucursal', el: <select value={store} onChange={e => setStore(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>{STORES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select> },
                    { label: 'Fecha', el: <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' as const }} /> },
                    { label: 'Horario', el: <select value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>{TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}</select> },
                  ].map(({ label, el }) => (
                    <div key={label}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>{label}</label>
                      {el}
                    </div>
                  ))}
                </div>
                <button onClick={() => setCreated(true)} style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body, marginTop: 24 }}>
                  Confirmar reserva
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
