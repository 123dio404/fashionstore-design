import type { Purchase } from './types';
import { C, T, IcCheck, IcTruck, IcStore } from './ui';

interface Props {
  purchase: Purchase;
  onViewPurchases: () => void;
  onContinueShopping: () => void;
}

export default function PurchaseSuccessScreen({ purchase, onViewPurchases, onContinueShopping }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      {/* Top confetti-style banner */}
      <div style={{ background: C.dark, padding: '56px 28px 32px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'scaleIn .4s ease-out' }}>
          <IcCheck size={32} color="#059669" />
        </div>
        <h1 className="font-display" style={{ fontSize: 26, color: 'white', margin: '0 0 6px' }}>¡Compra exitosa!</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', fontFamily: T.body, margin: 0 }}>Tu orden ha sido confirmada</p>
      </div>

      <div className="fade-in no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
        {/* Order number */}
        <div style={{ background: C.card, borderRadius: 16, padding: '16px 20px', marginBottom: 14, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.06)' }}>
          <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.08em' }}>Número de orden</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: C.dark, fontFamily: T.body, letterSpacing: '.12em', margin: 0 }}>{purchase.id}</p>
        </div>

        {/* Details card */}
        <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Detalles del pedido</p>
          {[
            { label: 'Fecha', value: purchase.date },
            { label: 'Total pagado', value: `$${purchase.total.toFixed(2)}` },
            { label: 'Método de pago', value: purchase.paymentMethod },
            { label: 'Estado', value: 'Procesando', success: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${C.borderLight}` }}>
              <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.body, color: row.success ? '#059669' : C.dark }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {purchase.deliveryMethod === 'home' ? <IcTruck size={20} color={C.dark} /> : <IcStore size={20} color={C.dark} />}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>
              {purchase.deliveryMethod === 'home' ? 'Envío a domicilio' : 'Retiro en tienda'}
            </p>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>
              {purchase.deliveryMethod === 'home' ? 'Estimado: 3–5 días hábiles' : `Disponible en 24 hrs · ${purchase.store}`}
            </p>
          </div>
        </div>

        {/* Items */}
        <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{purchase.items.length} artículo{purchase.items.length !== 1 ? 's' : ''}</p>
          {purchase.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < purchase.items.length - 1 ? 10 : 0 }}>
              <div style={{ width: 52, height: 64, borderRadius: 10, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{item.name}</p>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 2px' }}>Talla {item.size} · {item.color}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${item.price.toFixed(2)} ×{item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button onClick={onViewPurchases} style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', marginBottom: 10 }}>
          Ver mis compras
        </button>
        <button onClick={onContinueShopping} style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: `2px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>
          Seguir comprando
        </button>
      </div>
    </div>
  );
}
