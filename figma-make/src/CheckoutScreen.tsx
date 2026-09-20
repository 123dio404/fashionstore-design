import { useState } from 'react';
import type { CartItem, Purchase } from './types';
import { STORES } from './data';
import { C, T, AppBar, IcCheck, IcCreditCard, IcTruck, IcStore, IcMapPin, IcChevronRight } from './ui';

interface Props {
  cart: CartItem[];
  onBack: () => void;
  onSuccess: (purchase: Purchase) => void;
}

type Step = 'summary' | 'delivery' | 'payment' | 'processing';
type DeliveryMode = 'home' | 'pickup';
type PayMethod = 'card' | 'apple' | 'google';

const CARDS = [
  { id: 'visa', label: 'Visa •••• 4242', brand: 'Visa', color: '#1A1F71' },
  { id: 'mc',   label: 'Mastercard •••• 8821', brand: 'Mastercard', color: '#EB001B' },
];

export default function CheckoutScreen({ cart, onBack, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('summary');
  const [delivery, setDelivery] = useState<DeliveryMode>('home');
  const [storeId, setStoreId] = useState('centro');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [cardId, setCardId] = useState('visa');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = delivery === 'home' ? 4.99 : 0;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  const selectedStore = STORES.find(s => s.id === storeId)!;

  const STEPS: Step[] = ['summary', 'delivery', 'payment'];
  const stepIdx = STEPS.indexOf(step === 'processing' ? 'payment' : step);

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      const p: Purchase = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'procesando',
        total, subtotal, shipping,
        paymentMethod: payMethod === 'card' ? CARDS.find(c => c.id === cardId)?.label ?? '' : payMethod === 'apple' ? 'Apple Pay' : 'Google Pay',
        deliveryMethod: delivery,
        store: delivery === 'pickup' ? selectedStore.name : undefined,
        items: cart.map(i => ({ productId: i.productId, name: i.name, brand: i.brand, price: i.price, image: i.image, size: i.size, color: i.color, qty: i.qty })),
      };
      onSuccess(p);
    }, 2500);
  };

  // Processing screen
  if (step === 'processing') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: C.bg, padding: 32 }}>
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px solid ${C.borderLight}`, borderTop: `3px solid ${C.dark}`, animation: 'spin .85s linear infinite' }} />
        <IcCreditCard size={24} color={C.muted} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 6px' }}>Procesando pago</h2>
        <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Conectando con Stripe… por favor espera.</p>
      </div>
      {/* Stripe badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.card, borderRadius: 10, padding: '8px 14px', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#059669', fontFamily: T.body }}>Powered by Stripe · Pago seguro SSL</span>
      </div>
    </div>
  );

  const StepBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', background: C.card, borderBottom: `1px solid ${C.borderLight}` }}>
      {['Resumen', 'Entrega', 'Pago'].map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: i <= stepIdx ? C.dark : C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}>
              {i < stepIdx
                ? <IcCheck size={13} color="white" />
                : <span style={{ fontSize: 11, fontWeight: 700, color: i <= stepIdx ? 'white' : C.mutedLight, fontFamily: T.body }}>{i + 1}</span>}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: i <= stepIdx ? C.dark : C.mutedLight, fontFamily: T.body }}>{label}</span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 1, background: i < stepIdx ? C.dark : C.borderLight, margin: '0 8px', transition: 'background .2s' }} />}
        </div>
      ))}
    </div>
  );

  const Card = ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
      {title && <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{title}</p>}
      {children}
    </div>
  );

  const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.body, color: highlight ? '#059669' : C.dark }}>{value}</span>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Checkout" onBack={onBack} />
      <StepBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }} className="no-scrollbar">

        {/* STEP 1: Summary */}
        {step === 'summary' && (
          <div className="fade-in">
            <Card title="Tu pedido">
              {cart.map(item => (
                <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 56, height: 68, borderRadius: 10, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 3px' }}>Talla {item.size} · {item.color} · ×{item.qty}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </Card>
            <Card title="Código de descuento">
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="FASHION10" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${couponApplied ? '#059669' : C.border}`, fontFamily: T.body, fontSize: 13, color: C.dark, outline: 'none', background: couponApplied ? '#ECFDF5' : C.card }} />
                {!couponApplied
                  ? <button onClick={() => { if (coupon.toLowerCase() === 'fashion10') setCouponApplied(true); }} style={{ padding: '10px 16px', borderRadius: 10, background: C.dark, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>Aplicar</button>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IcCheck size={16} color="#059669" /><span style={{ fontSize: 12, fontWeight: 700, color: '#059669', fontFamily: T.body }}>Aplicado</span></div>
                }
              </div>
            </Card>
          </div>
        )}

        {/* STEP 2: Delivery */}
        {step === 'delivery' && (
          <div className="fade-in">
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              {[
                { id: 'home', label: 'Envío a domicilio', sub: '3–5 días hábiles · $4.99', icon: <IcTruck size={18} color={delivery === 'home' ? C.dark : C.mutedLight} /> },
                { id: 'pickup', label: 'Retiro en tienda', sub: 'Disponible en 24 hrs · Gratis', icon: <IcStore size={18} color={delivery === 'pickup' ? C.dark : C.mutedLight} /> },
              ].map(opt => (
                <button key={opt.id} onClick={() => setDelivery(opt.id as DeliveryMode)} style={{ flex: 1, padding: '12px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', border: `2px solid ${delivery === opt.id ? C.dark : C.borderLight}`, background: delivery === opt.id ? C.borderLight : C.card, transition: 'all .15s' }}>
                  <div style={{ marginBottom: 6 }}>{opt.icon}</div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{opt.label}</p>
                  <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.4 }}>{opt.sub}</p>
                </button>
              ))}
            </div>
            {delivery === 'pickup' && (
              <Card title="Sucursal de retiro">
                {STORES.map(store => (
                  <div key={store.id} onClick={() => setStoreId(store.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.borderLight}`, cursor: 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${storeId === store.id ? C.dark : C.border}`, background: storeId === store.id ? C.dark : 'transparent', flexShrink: 0, transition: 'all .15s' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{store.name}</p>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <IcMapPin size={10} /><span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{store.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 'payment' && (
          <div className="fade-in">
            <Card title="Método de pago">
              {[
                { id: 'card',   label: 'Tarjeta guardada' },
                { id: 'apple',  label: 'Apple Pay' },
                { id: 'google', label: 'Google Pay' },
              ].map(opt => (
                <div key={opt.id}>
                  <div onClick={() => setPayMethod(opt.id as PayMethod)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', cursor: 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payMethod === opt.id ? C.dark : C.border}`, background: payMethod === opt.id ? C.dark : 'transparent', flexShrink: 0, transition: 'all .15s' }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: C.dark, fontFamily: T.body }}>{opt.label}</span>
                  </div>
                  {opt.id === 'card' && payMethod === 'card' && (
                    <div style={{ marginLeft: 32, marginBottom: 8 }}>
                      {CARDS.map(card => (
                        <div key={card.id} onClick={() => setCardId(card.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', background: cardId === card.id ? C.borderLight : 'transparent', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', marginBottom: 4 }}>
                          <div style={{ width: 32, height: 20, borderRadius: 4, background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><rect width="16" height="10" rx="2" fill="white" fillOpacity=".3"/></svg>
                          </div>
                          <span style={{ fontSize: 13, fontFamily: T.body, color: C.dark }}>{card.label}</span>
                          {cardId === card.id && <IcCheck size={14} color="#059669" />}
                        </div>
                      ))}
                      <button style={{ fontSize: 12, color: C.accent, fontWeight: 600, fontFamily: T.body, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px' }}>+ Agregar tarjeta</button>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Cost breakdown always visible */}
        <Card title="Resumen de costos">
          <Row label={`Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} artículos)`} value={`$${subtotal.toFixed(2)}`} />
          <Row label="Envío" value={shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`} highlight={shipping === 0} />
          {couponApplied && <Row label="Descuento FASHION10" value={`-$${discount.toFixed(2)}`} highlight />}
          <div style={{ height: 1, background: C.borderLight, margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${total.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 20px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}` }}>
        {step === 'summary' && (
          <button onClick={() => setStep('delivery')} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>
            Continuar con entrega
          </button>
        )}
        {step === 'delivery' && (
          <button onClick={() => setStep('payment')} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>
            Continuar con pago
          </button>
        )}
        {step === 'payment' && (
          <button onClick={handlePay} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: C.accent, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <IcCreditCard size={18} color="white" />
            Pagar ${total.toFixed(2)}
          </button>
        )}
      </div>
    </div>
  );
}
