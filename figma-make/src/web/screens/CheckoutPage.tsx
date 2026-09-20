import { useState } from 'react';
import { C } from '../../ui';
import type { WebCartItem } from '../WebApp';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

type Step = 'data' | 'delivery' | 'payment';
const STEPS: { id: Step; label: string }[] = [
  { id: 'data', label: 'Datos personales' },
  { id: 'delivery', label: 'Método de entrega' },
  { id: 'payment', label: 'Pago' },
];

interface Props { cart: WebCartItem[]; onSuccess: () => void; onBack: () => void; }

export default function CheckoutPage({ cart, onSuccess, onBack }: Props) {
  const [step, setStep] = useState<Step>('data');
  const [delivery, setDelivery] = useState<'home' | 'store'>('home');
  const [payment, setPayment] = useState<'card' | 'mercadopago' | 'transfer'>('card');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: 'Ana López', email: 'ana.lopez@email.com', phone: '+54 9 11 2345-6789', address: 'Av. Santa Fe 1234, CABA', city: 'Buenos Aires', zip: 'C1059' });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = delivery === 'home' ? 9.99 : 0;
  const total = subtotal + shipping;

  const steps = ['data', 'delivery', 'payment'] as const;
  const stepIdx = steps.indexOf(step);

  const handleNext = () => {
    if (step === 'data') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else {
      setProcessing(true);
      setTimeout(() => { setProcessing(false); onSuccess(); }, 1500);
    }
  };

  const Field = ({ label, field }: { label: string; field: keyof typeof formData }) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: T.body }}>{label}</label>
      <input value={formData[field]} onChange={e => setFormData(d => ({ ...d, [field]: e.target.value }))} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' }} />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted, fontSize: 13, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Carrito
        </button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>Checkout</span>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36, alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: stepIdx >= i ? C.dark : C.bg, border: `2px solid ${stepIdx >= i ? C.dark : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stepIdx > i ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: T.body, color: stepIdx >= i ? 'white' : C.muted }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: stepIdx === i ? 700 : 400, color: stepIdx === i ? C.dark : C.muted, fontFamily: T.body, whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: stepIdx > i ? C.dark : C.border, margin: '0 16px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
        {/* Form area */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 28 }}>
          {step === 'data' && (
            <div>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 20px' }}>Datos personales</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Nombre completo" field="name" />
                <Field label="Correo electrónico" field="email" />
                <Field label="Teléfono" field="phone" />
                <Field label="Código postal" field="zip" />
                <div style={{ gridColumn: '1/-1' }}><Field label="Dirección" field="address" /></div>
                <Field label="Ciudad / Provincia" field="city" />
              </div>
            </div>
          )}

          {step === 'delivery' && (
            <div>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 20px' }}>Método de entrega</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'home' as const, label: 'Envío a domicilio', sub: 'Llega en 3–5 días hábiles · $9.99', icon: 'M1 3h15v13H1zM16 8l5 2v6h-5zM1 21h6M17 21h4M8 16h2' },
                  { id: 'store' as const, label: 'Retiro en tienda', sub: 'Disponible en 24 hrs · Sin costo', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, border: `2px solid ${delivery === opt.id ? C.dark : C.border}`, cursor: 'pointer', background: delivery === opt.id ? C.bg : 'white', transition: 'all .15s' }}>
                    <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} style={{ display: 'none' }} />
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: delivery === opt.id ? C.dark : C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={delivery === opt.id ? 'white' : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={opt.icon}/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{opt.label}</p>
                      <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>{opt.sub}</p>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${delivery === opt.id ? C.dark : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {delivery === opt.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.dark }} />}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: '0 0 20px' }}>Método de pago</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { id: 'card' as const, label: 'Tarjeta' },
                  { id: 'mercadopago' as const, label: 'Mercado Pago' },
                  { id: 'transfer' as const, label: 'Transferencia' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setPayment(opt.id)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: `2px solid ${payment === opt.id ? C.dark : C.border}`, background: payment === opt.id ? C.dark : 'white', color: payment === opt.id ? 'white' : C.dark, fontSize: 13, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                    {opt.label}
                  </button>
                ))}
              </div>

              {payment === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: T.body }}>Número de tarjeta</label>
                    <input defaultValue="4539 1488 0343 6467" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: T.body }}>Vencimiento</label>
                      <input defaultValue="09/28" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: T.body }}>CVV</label>
                      <input defaultValue="123" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>
              )}
              {payment !== 'card' && (
                <div style={{ padding: 24, background: C.bg, borderRadius: 14, textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: 0 }}>Serás redirigido a {payment === 'mercadopago' ? 'Mercado Pago' : 'tu banco'} para completar el pago de <strong>${total.toFixed(2)}</strong></p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.borderLight}` }}>
            {stepIdx > 0 ? (
              <button onClick={() => setStep(steps[stepIdx - 1])} style={{ padding: '12px 24px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 14, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                ← Anterior
              </button>
            ) : <div />}
            <button onClick={handleNext} disabled={processing} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: C.dark, color: 'white', fontSize: 14, fontWeight: 700, fontFamily: T.body, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              {processing ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Procesando…</>
              ) : step === 'payment' ? 'Confirmar pago' : 'Continuar →'}
            </button>
          </div>
        </div>

        {/* Summary sidebar */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, position: 'sticky', top: 96 }}>
          <h4 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 16px' }}>Resumen del pedido</h4>
          {cart.map(item => (
            <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 48, height: 60, borderRadius: 8, overflow: 'hidden', background: C.bg, flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{item.name}</p>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 3px' }}>T. {item.size} · x{item.qty}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>${(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.borderLight}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>Subtotal</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.body, color: C.dark }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>Envío</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.body, color: shipping === 0 ? C.success : C.dark }}>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: `1px solid ${C.borderLight}` }}>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: T.body, color: C.dark }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: T.body, color: C.dark }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
