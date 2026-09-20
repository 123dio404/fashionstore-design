import { C } from '../../ui';
import type { WebCartItem } from '../WebApp';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

interface Props {
  cart: WebCartItem[];
  onQtyInc: (id: number, size: string) => void;
  onQtyDec: (id: number, size: string) => void;
  onRemove: (id: number, size: string) => void;
  onCheckout: () => void;
  onGoToCatalog: () => void;
}

export default function CartPage({ cart, onQtyInc, onQtyDec, onRemove, onCheckout, onGoToCatalog }: Props) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const discount = subtotal > 150 ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - discount;

  if (cart.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.bg, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="1.5" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: T.display, fontSize: 24, color: C.dark, margin: '0 0 8px' }}>Tu carrito está vacío</h2>
          <p style={{ fontSize: 14, color: C.muted, margin: 0, fontFamily: T.body }}>Agrega productos desde el catálogo para comenzar</p>
        </div>
        <button onClick={onGoToCatalog} style={{ padding: '12px 28px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, flex: 1, alignItems: 'start' }}>
      {/* Items table */}
      <div>
        <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 20px' }}>Tu carrito</h2>
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 40px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
            {['Producto', 'Precio unit.', 'Cantidad', 'Subtotal', ''].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
            ))}
          </div>
          {cart.map((item, idx) => (
            <div key={`${item.productId}-${item.size}`} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 40px', gap: 0, padding: '16px 20px', alignItems: 'center', borderBottom: idx < cart.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
              {/* Product info */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 64, height: 80, borderRadius: 10, overflow: 'hidden', background: C.bg, flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{item.brand}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>{item.name}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, color: C.muted, background: C.bg, padding: '2px 8px', borderRadius: 5, fontFamily: T.body }}>Talla {item.size}</span>
                    <span style={{ fontSize: 11, color: C.muted, background: C.bg, padding: '2px 8px', borderRadius: 5, fontFamily: T.body }}>{item.color}</span>
                  </div>
                </div>
              </div>
              {/* Unit price */}
              <span style={{ fontSize: 15, fontWeight: 600, color: C.dark, fontFamily: T.body }}>${item.price.toFixed(2)}</span>
              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${C.border}`, borderRadius: 8, width: 'fit-content', overflow: 'hidden' }}>
                <button onClick={() => onQtyDec(item.productId, item.size)} style={{ width: 30, height: 30, border: 'none', background: 'white', cursor: 'pointer', fontSize: 14, color: C.dark }}>−</button>
                <span style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 600, fontFamily: T.body, color: C.dark }}>{item.qty}</span>
                <button onClick={() => onQtyInc(item.productId, item.size)} style={{ width: 30, height: 30, border: 'none', background: 'white', cursor: 'pointer', fontSize: 14, color: C.dark }}>+</button>
              </div>
              {/* Subtotal */}
              <span style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${(item.price * item.qty).toFixed(2)}</span>
              {/* Remove */}
              <button onClick={() => onRemove(item.productId, item.size)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Continue shopping */}
        <button onClick={onGoToCatalog} style={{ marginTop: 16, padding: '10px 20px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 13, fontFamily: T.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Seguir comprando
        </button>
      </div>

      {/* Order summary */}
      <div style={{ position: 'sticky', top: 96 }}>
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
          <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 20px' }}>Resumen</h3>

          {/* Coupon */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input placeholder="Código de descuento" style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body }} />
            <button style={{ padding: '10px 16px', borderRadius: 10, background: C.bg, border: `1.5px solid ${C.border}`, color: C.dark, fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>Aplicar</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16, borderBottom: `1px solid ${C.borderLight}` }}>
            {[
              { l: `Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} artículos)`, v: `$${subtotal.toFixed(2)}` },
              { l: 'Envío', v: shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`, ok: shipping === 0 },
              ...(discount > 0 ? [{ l: 'Descuento 5%', v: `-$${discount.toFixed(2)}`, ok: true }] : []),
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{row.l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.body, color: row.ok ? C.success : C.dark }}>{row.v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: T.body }}>${total.toFixed(2)}</span>
          </div>

          {subtotal < 100 && (
            <div style={{ background: C.warningBg, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: C.warning, fontFamily: T.body, margin: 0 }}>
                Agrega <strong>${(100 - subtotal).toFixed(2)}</strong> más para obtener envío gratuito
              </p>
            </div>
          )}

          <button onClick={onCheckout} style={{ width: '100%', padding: '15px 0', borderRadius: 14, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>
            Proceder al pago →
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            {['Visa', 'Mastercard', 'PayPal', 'Mercado Pago'].map(m => (
              <span key={m} style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
