import { useState } from 'react';
import type { CartItem } from './types';
import {
  C, T, AppBar, EmptyState, OfflineState, CartRow, SuccessToast,
  IcBag, IcTruck, IcStore, IcCreditCard, IcCheck, IcTag,
} from './ui';

interface Props {
  cart: CartItem[];
  isOffline: boolean;
  onQtyInc: (id: number, size: string) => void;
  onQtyDec: (id: number, size: string) => void;
  onRemove: (id: number, size: string) => void;
  onGoToCatalog: () => void;
  onCheckout?: () => void;
}

type Delivery = 'home' | 'pickup';
type CheckoutState = 'cart' | 'processing' | 'done';

export default function CartScreen({ cart, isOffline, onQtyInc, onQtyDec, onRemove, onGoToCatalog, onCheckout }: Props) {
  const [delivery, setDelivery] = useState<Delivery>('home');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('cart');
  const [orderId] = useState(() => `ORD-${Math.floor(1000 + Math.random() * 9000)}`);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = delivery === 'home' ? 4.99 : 0;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const handleCoupon = () => {
    if (coupon.trim().toLowerCase() === 'fashion10') setCouponApplied(true);
  };

  const handleCheckout = () => {
    if (isOffline) return;
    setCheckoutState('processing');
    setTimeout(() => setCheckoutState('done'), 2200);
  };

  if (isOffline) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Mi Carrito" subtitle="FashionStore" />
      <OfflineState onRetry={() => {}} />
    </div>
  );

  if (checkoutState === 'processing') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px solid ${C.borderLight}`, borderTop: `3px solid ${C.dark}`, animation: 'spin 0.8s linear infinite' }} />
      </div>
      <p className="font-display" style={{ fontSize: 20, color: C.dark, margin: 0 }}>Procesando pago…</p>
      <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Esto tomará solo un momento</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (checkoutState === 'done') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar title="Pedido Confirmado" subtitle="FashionStore" />
      <div className="fade-in no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
        <div style={{ background: C.card, borderRadius: 24, padding: 24, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <IcCheck size={32} color="#059669" />
          </div>
          <h2 className="font-display" style={{ fontSize: 24, color: C.dark, margin: '0 0 8px' }}>¡Pedido realizado!</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 20px', lineHeight: 1.6 }}>Tu orden ha sido confirmada. Recibirás un email con el seguimiento.</p>

          <div style={{ background: C.bg, borderRadius: 14, padding: '14px 16px', marginBottom: 8 }}>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Número de orden</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: C.dark, fontFamily: T.body, letterSpacing: '0.1em', margin: 0 }}>{orderId}</p>
          </div>

          {[
            { label: 'Total pagado', value: `$${total.toFixed(2)}` },
            { label: 'Método de entrega', value: delivery === 'home' ? 'Envío a domicilio (3–5 días)' : 'Retiro en tienda (24 hrs)' },
            { label: 'Estado', value: 'Procesando' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.borderLight}` }}>
              <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{value}</span>
            </div>
          ))}
        </div>

        <button onClick={onGoToCatalog} style={{ width: '100%', padding: '15px 0', borderRadius: 16, background: C.dark, color: 'white', border: 'none', fontFamily: T.body, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Seguir comprando
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      <AppBar
        title="Mi Carrito"
        subtitle={totalItems > 0 ? `${totalItems} artículo${totalItems !== 1 ? 's' : ''}` : 'FashionStore'}
      />

      {cart.length === 0 ? (
        <EmptyState
          icon={<IcBag size={28} color={C.mutedLight} />}
          title="Tu carrito está vacío"
          subtitle="Agrega productos desde el catálogo y aparecerán aquí."
          cta="Explorar catálogo"
          onCta={onGoToCatalog}
        />
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="no-scrollbar">
            {/* Cart items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
              {cart.map(item => (
                <CartRow
                  key={`${item.productId}-${item.size}`}
                  item={item}
                  onQtyInc={() => onQtyInc(item.productId, item.size)}
                  onQtyDec={() => onQtyDec(item.productId, item.size)}
                  onRemove={() => onRemove(item.productId, item.size)}
                />
              ))}
            </div>

            {/* Coupon */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: C.card, borderRadius: 12, padding: '10px 14px', border: couponApplied ? `1.5px solid #059669` : `1.5px solid ${C.borderLight}` }}>
                <IcTag size={13} color={couponApplied ? '#059669' : C.accent} />
                {couponApplied ? (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#059669', fontFamily: T.body }}>FASHION10 aplicado · 10% OFF</span>
                ) : (
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Código de descuento" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: T.body, color: C.dark }} />
                )}
              </div>
              {!couponApplied && (
                <button onClick={handleCoupon} style={{ padding: '10px 16px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Aplicar
                </button>
              )}
            </div>

            {/* Delivery method */}
            <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Método de entrega</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { id: 'home', label: 'Envío a domicilio', sub: '3–5 días hábiles', price: '$4.99', icon: <IcTruck size={18} color={delivery === 'home' ? C.dark : C.mutedLight} /> },
                { id: 'pickup', label: 'Retiro en tienda', sub: 'Disponible en 24 hrs.', price: 'Gratis', icon: <IcStore size={18} color={delivery === 'pickup' ? C.dark : C.mutedLight} /> },
              ].map(opt => (
                <button key={opt.id} onClick={() => setDelivery(opt.id as Delivery)} style={{ flex: 1, padding: '12px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', border: `2px solid ${delivery === opt.id ? C.dark : C.borderLight}`, background: delivery === opt.id ? C.borderLight : C.card, transition: 'all 0.15s' }}>
                  <div style={{ marginBottom: 6 }}>{opt.icon}</div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{opt.label}</p>
                  <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 5px' }}>{opt.sub}</p>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: T.body, color: delivery === opt.id ? C.accent : C.dark }}>{opt.price}</span>
                </button>
              ))}
            </div>

            {/* Cost breakdown */}
            <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resumen del pedido</p>
              {[
                { label: `Subtotal (${totalItems} artículo${totalItems !== 1 ? 's' : ''})`, value: `$${subtotal.toFixed(2)}` },
                { label: 'Envío', value: delivery === 'pickup' ? 'Gratis' : '$4.99', success: delivery === 'pickup' },
                couponApplied ? { label: 'Descuento FASHION10', value: `-$${discount.toFixed(2)}`, success: true } : null,
              ].filter(Boolean).map((row, i) => row && (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.body, color: row.success ? '#059669' : C.dark }}>{row.value}</span>
                </div>
              ))}
              <div style={{ height: 1, background: C.borderLight, margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: '12px 20px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}` }}>
            <button onClick={onCheckout ?? handleCheckout} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: C.dark, color: 'white', fontSize: 16, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IcCreditCard size={18} color="white" />
              Ir al checkout
            </button>
            <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, textAlign: 'center', margin: '8px 0 0' }}>Pago seguro con cifrado SSL · Datos protegidos</p>
          </div>
        </>
      )}
    </div>
  );
}
