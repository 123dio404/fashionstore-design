import { useState } from 'react';
import type { Purchase } from './types';
import { C, T, AppBar, EmptyState, IcPackage, IcChevronDown, IcTruck, IcStore, IcCheck } from './ui';

interface Props {
  purchases: Purchase[];
  onBack: () => void;
}

const STATUS: Record<Purchase['status'], { label: string; color: string; bg: string }> = {
  entregado:  { label: 'Entregado',  color: '#059669', bg: '#ECFDF5' },
  en_camino:  { label: 'En camino',  color: '#D97706', bg: '#FEF3C7' },
  procesando: { label: 'Procesando', color: '#6B7280', bg: '#F1F5F9' },
  cancelado:  { label: 'Cancelado',  color: '#E05A47', bg: '#FEF2F2' },
};

const STEPS_MAP: Record<Purchase['status'], number> = {
  procesando: 1, en_camino: 2, entregado: 3, cancelado: 0,
};

export default function PurchasesScreen({ purchases, onBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (purchases.length === 0) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Mis Compras" onBack={onBack} />
      <EmptyState icon={<IcPackage size={28} color={C.mutedLight} />} title="Sin compras" subtitle="Cuando realices tu primera compra, aparecerá aquí." cta="Ir al catálogo" onCta={onBack} />
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Mis Compras" subtitle={`${purchases.length} pedido${purchases.length !== 1 ? 's' : ''}`} onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }} className="no-scrollbar">
        {purchases.map(p => {
          const s = STATUS[p.status];
          const expanded = expandedId === p.id;
          const progress = STEPS_MAP[p.status];

          return (
            <div key={p.id} className="fade-in" style={{ background: C.card, borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
              {/* Header */}
              <div onClick={() => setExpandedId(expanded ? null : p.id)} style={{ padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: '0 0 2px', letterSpacing: '.06em' }}>{p.id}</p>
                    <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{p.date} · {p.items.length} artículo{p.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: T.body, color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 6 }}>{s.label}</span>
                    <IcChevronDown size={15} color={C.mutedLight} open={expanded} />
                  </div>
                </div>

                {/* Item thumbnails + total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: -4 }}>
                    {p.items.slice(0, 3).map((item, i) => (
                      <div key={i} style={{ width: 36, height: 44, borderRadius: 8, overflow: 'hidden', border: '2px solid white', marginLeft: i > 0 ? -10 : 0, background: C.borderLight }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    {p.items.length > 3 && <div style={{ width: 36, height: 44, borderRadius: 8, background: C.dark, border: '2px solid white', marginLeft: -10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, fontWeight: 700, color: 'white', fontFamily: T.body }}>+{p.items.length - 3}</span></div>}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${p.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded && (
                <div className="fade-in" style={{ borderTop: `1px solid ${C.borderLight}`, padding: '14px 16px' }}>
                  {/* Progress bar */}
                  {p.status !== 'cancelado' && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 6 }}>
                        {['Confirmado', 'En camino', 'Entregado'].map((label, i) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: i < progress ? '#059669' : i === progress - 1 ? '#059669' : C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {i < progress ? <IcCheck size={11} color="white" /> : <div style={{ width: 7, height: 7, borderRadius: '50%', background: i === progress - 1 ? 'white' : C.mutedLight }} />}
                              </div>
                              <span style={{ fontSize: 9, fontFamily: T.body, color: i < progress ? '#059669' : C.mutedLight, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
                            </div>
                            {i < 2 && <div style={{ flex: 1, height: 2, background: i < progress - 1 ? '#059669' : C.borderLight, margin: '0 4px', marginBottom: 14, transition: 'background .3s' }} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  {p.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 52, height: 62, borderRadius: 10, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{item.brand} · {item.name}</p>
                        <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 3px' }}>Talla {item.size} · {item.color} · ×{item.qty}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 12, marginTop: 4 }}>
                    {[
                      { label: 'Subtotal', value: `$${p.subtotal.toFixed(2)}` },
                      { label: 'Envío', value: p.shipping === 0 ? 'Gratis' : `$${p.shipping.toFixed(2)}` },
                      { label: 'Pago con', value: p.paymentMethod },
                      { label: 'Entrega', value: p.deliveryMethod === 'home' ? 'Domicilio' : `Retiro · ${p.store}` },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{row.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.borderLight}`, paddingTop: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Total</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${p.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {p.status !== 'cancelado' && (
                    <button style={{ width: '100%', marginTop: 12, padding: '11px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                      Rastrear pedido
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
