import { useState, useEffect } from 'react';
import { PRODUCTS, STORES, TIME_SLOTS } from './data';
import type { Reservation } from './types';
import {
  C, T, AppBar, EmptyState, ErrorState, OfflineState, SkeletonReservationCard,
  SuccessToast, IcCalendar, IcCheck, IcPlus, IcChevronRight, IcChevronDown,
  IcMapPin, IcClock, IcChevronLeft, IcAlertCircle,
} from './ui';

interface Props {
  isOffline: boolean;
  reservations: Reservation[];
  onAddReservation: (r: Reservation) => void;
  onCancelReservation: (id: string) => void;
}

type LoadState = 'loading' | 'success' | 'error';
type FlowStep = 'list' | 'pick-product' | 'pick-store' | 'pick-datetime' | 'confirm' | 'done';

const STATUS_STYLE: Record<Reservation['status'], { bg: string; color: string; label: string }> = {
  confirmada:  { bg: '#ECFDF5', color: '#059669', label: 'Confirmada' },
  pendiente:   { bg: '#FEF3C7', color: '#D97706', label: 'Pendiente' },
  cancelada:   { bg: '#FEF2F2', color: '#E05A47', label: 'Cancelada' },
  completada:  { bg: '#F1F5F9', color: '#6B7280', label: 'Completada' },
};

const DATES = [
  { short: 'Lun', day: '22', full: '22 sep 2026' },
  { short: 'Mar', day: '23', full: '23 sep 2026' },
  { short: 'Mié', day: '24', full: '24 sep 2026' },
  { short: 'Jue', day: '25', full: '25 sep 2026' },
  { short: 'Vie', day: '26', full: '26 sep 2026' },
  { short: 'Sáb', day: '27', full: '27 sep 2026' },
  { short: 'Dom', day: '28', full: '28 sep 2026' },
];

export default function ReservationsScreen({ isOffline, reservations, onAddReservation, onCancelReservation }: Props) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [step, setStep] = useState<FlowStep>('list');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [selectedStore, setSelectedStore] = useState<typeof STORES[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [newReservation, setNewReservation] = useState<Reservation | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (isOffline) return;
    setLoadState('loading');
    const t = setTimeout(() => setLoadState('success'), 1400);
    return () => clearTimeout(t);
  }, [isOffline]);

  const handleConfirm = () => {
    if (!selectedProduct || !selectedStore || !selectedDate || !selectedTime || !selectedSize) return;
    const r: Reservation = {
      id: `RES-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.images[0],
      brand: selectedProduct.brand,
      size: selectedSize,
      color: selectedProduct.colors[0].name,
      date: selectedDate,
      time: selectedTime,
      store: selectedStore.name,
      status: 'confirmada',
      code: `FS-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    onAddReservation(r);
    setNewReservation(r);
    setStep('done');
  };

  const resetFlow = () => {
    setStep('list');
    setSelectedProduct(null);
    setSelectedStore(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedSize('');
    setNewReservation(null);
  };

  if (isOffline) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Mis Reservas" subtitle="FashionStore" />
      <OfflineState onRetry={() => {}} />
    </div>
  );

  if (step === 'done' && newReservation) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Reserva Confirmada" onBack={resetFlow} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }} className="no-scrollbar">
        <div className="scale-in" style={{ background: C.card, borderRadius: 24, padding: 24, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <IcCheck size={28} color="#059669" />
          </div>
          <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 6px' }}>¡Reserva confirmada!</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 20px', lineHeight: 1.6 }}>Tu turno ha sido reservado exitosamente. Preséntate 5 minutos antes.</p>

          {/* QR mockup */}
          <div style={{ background: C.bg, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ width: 120, height: 120, margin: '0 auto 12px', display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2 }}>
              {Array.from({ length: 100 }, (_, i) => (
                <div key={i} style={{ aspectRatio: '1', background: [0,1,2,10,11,12,20,21,22,7,8,9,17,18,19,27,28,29,70,71,72,80,81,82,90,91,92,77,78,79,87,88,89,97,98,99,35,36,37,45,55,65,44,54,64,33,43,53,63,66,67,68].includes(i) ? C.dark : 'transparent', borderRadius: 1 }} />
              ))}
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, color: C.dark, fontFamily: T.body, letterSpacing: '0.15em', margin: 0 }}>{newReservation.code}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {[
              { label: 'Producto', value: `${newReservation.productName} · Talla ${newReservation.size}` },
              { label: 'Tienda', value: newReservation.store },
              { label: 'Fecha y hora', value: `${newReservation.date} a las ${newReservation.time}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={resetFlow} style={{ width: '100%', padding: '15px 0', borderRadius: 16, background: C.dark, color: 'white', border: 'none', fontFamily: T.body, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Ver mis reservas
        </button>
      </div>
    </div>
  );

  if (step === 'pick-product') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Elegir producto" onBack={() => setStep('list')} subtitle="Paso 1 de 3" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }} className="no-scrollbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PRODUCTS.map(p => (
            <div key={p.id} onClick={() => { setSelectedProduct(p); setSelectedSize(p.sizes[0]); setStep('pick-store'); }} style={{ display: 'flex', gap: 12, background: C.card, borderRadius: 14, padding: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 72, height: 80, borderRadius: 10, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.brand}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>{p.name}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${p.price.toFixed(2)}</p>
              </div>
              <IcChevronRight size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (step === 'pick-store' && selectedProduct) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Elegir sucursal" onBack={() => setStep('pick-product')} subtitle="Paso 2 de 3" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }} className="no-scrollbar">
        {/* Size selector */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 10px' }}>Talla para reservar</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {selectedProduct.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} style={{ width: 44, height: 44, borderRadius: 10, border: 'none', fontFamily: T.body, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: selectedSize === s ? C.dark : C.borderLight, color: selectedSize === s ? 'white' : C.muted, transition: 'all 0.15s' }}>{s}</button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Selecciona una sucursal</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STORES.map(store => {
            const stockVal = selectedProduct.stock[store.id.charAt(0).toUpperCase() + store.id.slice(1)] ?? 0;
            return (
              <div key={store.id} onClick={() => { setSelectedStore(store); setStep('pick-datetime'); }} style={{ background: C.card, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.borderLight}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>{store.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                      <IcMapPin size={11} /><span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{store.address}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IcClock size={11} /><span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{store.hours}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: stockVal > 3 ? '#059669' : stockVal > 0 ? '#D97706' : C.accent, background: stockVal > 3 ? '#ECFDF5' : stockVal > 0 ? '#FEF3C7' : '#FEF2F2', padding: '3px 8px', borderRadius: 6, fontFamily: T.body, whiteSpace: 'nowrap' }}>
                    {stockVal > 3 ? `${stockVal} disp.` : stockVal > 0 ? `Últimas ${stockVal}` : 'Sin stock'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (step === 'pick-datetime') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Fecha y horario" onBack={() => setStep('pick-store')} subtitle="Paso 3 de 3" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }} className="no-scrollbar">
        <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Selecciona una fecha</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' }} className="no-scrollbar">
          {DATES.map(d => (
            <button key={d.full} onClick={() => setSelectedDate(d.full)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 12px', minWidth: 52, borderRadius: 14, border: 'none', cursor: 'pointer', background: selectedDate === d.full ? C.dark : C.card, color: selectedDate === d.full ? 'white' : C.muted, transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 10, fontFamily: T.body, fontWeight: 500 }}>{d.short}</span>
              <span style={{ fontSize: 17, fontFamily: T.body, fontWeight: 700, lineHeight: 1.3 }}>{d.day}</span>
            </button>
          ))}
        </div>

        {selectedDate && (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Selecciona un horario</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TIME_SLOTS.map(time => (
                <button key={time} onClick={() => setSelectedTime(time)} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: T.body, fontSize: 13, fontWeight: 500, background: selectedTime === time ? C.accent : C.card, color: selectedTime === time ? 'white' : C.muted, transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {time}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedDate && selectedTime && (
        <div style={{ padding: '12px 20px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}` }}>
          <div style={{ background: C.bg, borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <IcCalendar size={14} color={C.muted} />
            <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{selectedDate} · {selectedTime} · {selectedStore?.name}</span>
          </div>
          <button onClick={handleConfirm} style={{ width: '100%', padding: '15px 0', borderRadius: 16, background: C.dark, color: 'white', border: 'none', fontFamily: T.body, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      <AppBar
        title="Mis Reservas"
        subtitle="FashionStore"
        rightSlot={
          <button onClick={() => setStep('pick-product')} style={{ width: 36, height: 36, borderRadius: '50%', background: C.dark, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <IcPlus size={16} color="white" />
          </button>
        }
      />

      {loadState === 'loading' ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="no-scrollbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
            {[1, 2, 3].map(i => <SkeletonReservationCard key={i} />)}
          </div>
        </div>
      ) : loadState === 'error' ? (
        <ErrorState onRetry={() => { setLoadState('loading'); setTimeout(() => setLoadState('success'), 1200); }} />
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={<IcCalendar size={28} color={C.mutedLight} />}
          title="Sin reservas"
          subtitle="Reserva un turno para probarte ropa en tienda y asegura tu talla favorita."
          cta="Crear reserva"
          onCta={() => setStep('pick-product')}
        />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="no-scrollbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
            {reservations.map(r => {
              const s = STATUS_STYLE[r.status];
              return (
                <div key={r.id} className="fade-in" style={{ background: C.card, borderRadius: 16, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 72, height: 80, borderRadius: 10, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
                      <img src={r.productImage} alt={r.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.brand}</p>
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 5, fontFamily: T.body }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 6px' }}>{r.productName}</p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <IcCalendar size={11} color={C.muted} />
                          <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{r.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <IcClock size={11} color={C.muted} />
                          <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{r.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 1px' }}>Código de reserva</p>
                      <p style={{ fontSize: 14, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: 0, letterSpacing: '0.1em' }}>{r.code}</p>
                    </div>
                    {r.status !== 'cancelada' && r.status !== 'completada' && (
                      <button onClick={() => setCancelId(r.id)} style={{ padding: '7px 14px', borderRadius: 10, border: `1.5px solid ${C.accent}`, background: 'transparent', color: C.accent, fontSize: 12, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}

      {/* Cancel confirmation modal */}
      {cancelId && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setCancelId(null)}>
          <div className="slide-up" onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '24px 24px 36px' }}>
            <div style={{ width: 36, height: 4, background: '#E5E7EB', borderRadius: 2, margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', fontFamily: "'Inter', sans-serif", margin: '0 0 8px', textAlign: 'center' }}>¿Cancelar reserva?</h3>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: "'Inter', sans-serif", margin: '0 0 24px', textAlign: 'center', lineHeight: 1.55 }}>Esta acción no se puede deshacer.<br />Podrás crear una nueva reserva cuando quieras.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setCancelId(null)} style={{ flex: 1, padding: '14px 0', borderRadius: 14, border: '1.5px solid #E5E7EB', background: 'transparent', color: '#111827', fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: 'pointer' }}>Mantener</button>
              <button onClick={() => { onCancelReservation(cancelId); setCancelId(null); setToast('Reserva cancelada'); }} style={{ flex: 1, padding: '14px 0', borderRadius: 14, border: 'none', background: '#E05A47', color: 'white', fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: 'pointer' }}>Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
