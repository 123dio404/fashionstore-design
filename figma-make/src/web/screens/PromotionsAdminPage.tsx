import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const PROMOTIONS = [
  { id: 'P001', name: 'Otoño · Invierno 2026', code: 'OTOÑO40', discount: 40, type: 'porcentaje', minOrder: 0, uses: 284, maxUses: 1000, starts: '1 Sep 2026', ends: '30 Sep 2026', status: 'activa', categories: ['Mujer', 'Hombre'] },
  { id: 'P002', name: 'Semana del Calzado', code: 'CALZADO30', discount: 30, type: 'porcentaje', minOrder: 0, uses: 156, maxUses: 500, starts: '15 Sep 2026', ends: '22 Sep 2026', status: 'activa', categories: ['Calzado'] },
  { id: 'P003', name: 'Moda Masculina', code: 'HOMBRE25', discount: 25, type: 'porcentaje', minOrder: 50, uses: 89, maxUses: 300, starts: '20 Sep 2026', ends: '28 Sep 2026', status: 'activa', categories: ['Hombre'] },
  { id: 'P004', name: 'Envío gratis verano', code: 'ENVIO0', discount: 0, type: 'envio_gratis', minOrder: 80, uses: 412, maxUses: 0, starts: '1 Dic 2025', ends: '28 Feb 2026', status: 'expirada', categories: [] },
  { id: 'P005', name: 'Bienvenida nueva clienta', code: 'BIENVENIDA15', discount: 15, type: 'porcentaje', minOrder: 0, uses: 0, maxUses: 0, starts: '20 Sep 2026', ends: '31 Dic 2026', status: 'programada', categories: [] },
];

export default function PromotionsAdminPage() {
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<typeof PROMOTIONS[0] | null>(null);

  const filtered = filter === 'all' ? PROMOTIONS : PROMOTIONS.filter(p => p.status === filter);

  const statusColors: Record<string, { bg: string; text: string }> = {
    activa: { bg: '#ECFDF5', text: '#059669' },
    programada: { bg: '#EFF6FF', text: '#3B82F6' },
    expirada: { bg: '#F3F4F6', text: '#9CA3AF' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Gestión de promociones</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{PROMOTIONS.filter(p => p.status === 'activa').length} activas · {PROMOTIONS.length} totales</p>
        </div>
        <button onClick={() => setShowNew(true)} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>
          + Nueva promoción
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { l: 'Usos totales', v: PROMOTIONS.reduce((s, p) => s + p.uses, 0).toString(), color: '#6366F1' },
          { l: 'Descuento promedio', v: '27.5%', color: C.accent },
          { l: 'Promociones activas', v: PROMOTIONS.filter(p => p.status === 'activa').length.toString(), color: C.success },
          { l: 'Expiradas este mes', v: '1', color: C.mutedLight },
        ].map(c => (
          <div key={c.l} style={{ background: 'white', borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: c.color, fontFamily: T.body, margin: '0 0 4px' }}>{c.v}</p>
            <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>{c.l}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['all', 'Todas'], ['activa', 'Activas'], ['programada', 'Programadas'], ['expirada', 'Expiradas']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${filter === v ? C.dark : C.border}`, background: filter === v ? C.dark : 'white', color: filter === v ? 'white' : C.muted, fontSize: 13, fontFamily: T.body, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 2fr 120px 80px 1fr 100px 80px 80px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {['ID', 'Nombre', 'Código', 'Descuento', 'Vigencia', 'Usos', 'Estado', 'Acción'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
          ))}
        </div>
        {filtered.map((p, i) => {
          const sc = statusColors[p.status] ?? statusColors.expirada;
          const usePct = p.maxUses > 0 ? (p.uses / p.maxUses) * 100 : null;
          return (
            <div key={p.id} onClick={() => setSelected(p)} style={{ display: 'grid', gridTemplateColumns: '80px 2fr 120px 80px 1fr 100px 80px 80px', gap: 0, padding: '14px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer', background: selected?.id === p.id ? C.bg : 'white' }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.muted }}>{p.id}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{p.name}</p>
                <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0 }}>{p.categories.length > 0 ? p.categories.join(' · ') : 'Todos los productos'}</p>
              </div>
              <code style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", background: C.bg, padding: '3px 8px', borderRadius: 6, color: C.dark }}>{p.code}</code>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: T.body }}>
                {p.type === 'porcentaje' ? `-${p.discount}%` : 'Envío gratis'}
              </span>
              <div>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 2px' }}>{p.starts} → {p.ends}</p>
                {p.minOrder > 0 && <p style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body, margin: 0 }}>Mín. ${p.minOrder}</p>}
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>
                  {p.uses}{p.maxUses > 0 ? `/${p.maxUses}` : ''}
                </p>
                {usePct !== null && (
                  <div style={{ height: 4, background: C.bg, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${usePct}%`, background: usePct > 80 ? C.accent : C.success, borderRadius: 2 }} />
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: sc.bg, color: sc.text, fontFamily: T.body, width: 'fit-content' }}>{p.status}</span>
              <button onClick={e => { e.stopPropagation(); }} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 11, fontFamily: T.body, cursor: 'pointer' }}>Editar</button>
            </div>
          );
        })}
      </div>

      {(showNew || selected) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => { setShowNew(false); setSelected(null); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 32, width: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: 0 }}>{showNew ? 'Nueva promoción' : selected?.name}</h3>
              <button onClick={() => { setShowNew(false); setSelected(null); }} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['Nombre', 'Código de descuento', 'Tipo', 'Porcentaje / Monto', 'Monto mínimo de orden', 'Máximo de usos (0=ilimitado)', 'Fecha inicio', 'Fecha fin'].map(f => (
                <div key={f}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase' as const, letterSpacing: '.06em', display: 'block', marginBottom: 5, fontFamily: T.body }}>{f}</label>
                  <input defaultValue={selected ? '' : ''} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
            <button onClick={() => { setShowNew(false); setSelected(null); }} style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              {showNew ? 'Crear promoción' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
