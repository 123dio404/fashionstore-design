import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const BRANCHES = [
  { id: 'centro', name: 'Sucursal Centro', address: 'Av. Corrientes 1234, CABA', city: 'Buenos Aires', phone: '+54 11 4321-5678', email: 'centro@fashionstore.com', staff: 8, status: 'activa', hours: 'Lun–Sáb 10–20 · Dom 11–18', manager: 'María Torres' },
  { id: 'norte', name: 'Sucursal Norte', address: 'Palermo Soho, Thames 567', city: 'Buenos Aires', phone: '+54 11 4322-5679', email: 'norte@fashionstore.com', staff: 6, status: 'activa', hours: 'Lun–Sáb 10–20', manager: 'Diego Martínez' },
  { id: 'sur', name: 'Sucursal Sur', address: 'San Telmo, Defensa 890', city: 'Buenos Aires', phone: '+54 11 4323-5680', email: 'sur@fashionstore.com', staff: 5, status: 'mantenimiento', hours: 'Lun–Vie 10–18', manager: 'Valentina Ruiz' },
];

const IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1525562723836-dca67a71d5f1?w=400&h=200&fit=crop&auto=format',
];

export default function BranchesPage() {
  const [selected, setSelected] = useState<typeof BRANCHES[0] | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Sucursales</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{BRANCHES.length} sucursales configuradas</p>
        </div>
        <button onClick={() => setShowNew(true)} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>
          + Nueva sucursal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {BRANCHES.map((b, i) => (
          <div key={b.id} onClick={() => setSelected(b)} style={{ background: 'white', borderRadius: 16, border: `2px solid ${selected?.id === b.id ? C.dark : C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'all .15s' }}>
            <div style={{ height: 160, position: 'relative', background: C.bg }}>
              <img src={IMAGES[i]} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: b.status === 'activa' ? '#ECFDF5' : '#FEF3C7', color: b.status === 'activa' ? C.success : C.warning, fontFamily: T.body }}>
                {b.status === 'activa' ? 'Activa' : 'Mantenimiento'}
              </span>
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 18, color: C.dark, margin: '0 0 8px' }}>{b.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {[
                  { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6', text: b.address },
                  { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.92 9.6 19.79 19.79 0 0 1 1.07 1A2 2 0 0 1 3.07 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', text: b.phone },
                  { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', text: `${b.staff} empleados · Ger. ${b.manager}` },
                ].map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d={item.icon}/></svg>
                    <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body, lineHeight: 1.4 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px 12px', background: C.bg, borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>🕐 {b.hours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: 0 }}>{selected.name}</h3>
              <button onClick={() => setSelected(null)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { l: 'Dirección', v: selected.address },
                { l: 'Ciudad', v: selected.city },
                { l: 'Teléfono', v: selected.phone },
                { l: 'Email', v: selected.email },
                { l: 'Horario', v: selected.hours },
                { l: 'Gerente', v: selected.manager },
                { l: 'Personal', v: `${selected.staff} empleados` },
              ].map(r => (
                <div key={r.l}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 4, fontFamily: T.body }}>{r.l}</label>
                  <input defaultValue={r.v} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowNew(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 480 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 24px' }}>Nueva sucursal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['Nombre', 'Ciudad', 'Dirección', 'Teléfono', 'Email', 'Gerente'].map(f => (
                <div key={f}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 5, fontFamily: T.body }}>{f}</label>
                  <input style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
            <button onClick={() => setShowNew(false)} style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              Crear sucursal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
