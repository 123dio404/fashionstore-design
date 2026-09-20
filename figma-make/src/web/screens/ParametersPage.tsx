import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

type ParamTab = 'general' | 'taxes' | 'shipping' | 'notifications' | 'integrations';

export default function ParametersPage() {
  const [tab, setTab] = useState<ParamTab>('general');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Field = ({ label, defaultValue, type = 'text', hint }: { label: string; defaultValue: string; type?: string; hint?: string }) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>{label}</label>
      <input defaultValue={defaultValue} type={type} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' as const }} />
      {hint && <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );

  const Toggle = ({ label, defaultOn, sub }: { label: string; defaultOn: boolean; sub?: string }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.borderLight}` }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{label}</p>
          {sub && <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{sub}</p>}
        </div>
        <div onClick={() => setOn(v => !v)} style={{ width: 46, height: 24, borderRadius: 12, background: on ? C.dark : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'background .2s' }}>
          <div style={{ position: 'absolute', top: 2, left: on ? 24 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
        </div>
      </div>
    );
  };

  const TABS: [ParamTab, string][] = [['general', 'General'], ['taxes', 'Impuestos'], ['shipping', 'Envíos'], ['notifications', 'Notificaciones'], ['integrations', 'Integraciones']];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Parámetros del sistema</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Configuración global de la plataforma</p>
        </div>
        {saved && (
          <div style={{ padding: '10px 18px', background: '#ECFDF5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.success, fontFamily: T.body }}>Guardado correctamente</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
        {/* Tab sidebar */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 8, height: 'fit-content' }}>
          {TABS.map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', background: tab === v ? C.bg : 'transparent', color: tab === v ? C.dark : C.muted, fontSize: 13, fontWeight: tab === v ? 600 : 400, fontFamily: T.body, cursor: 'pointer', textAlign: 'left', marginBottom: 2 }}>
              {l}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 28 }}>
          {tab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 4px' }}>Configuración general</h3>
              <Field label="Nombre de la tienda" defaultValue="FashionStore Argentina" />
              <Field label="Email de contacto" defaultValue="contacto@fashionstore.com" type="email" />
              <Field label="Teléfono principal" defaultValue="+54 11 4321-5678" />
              <Field label="Dirección fiscal" defaultValue="Av. Corrientes 1234, CABA, Argentina" />
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>Zona horaria</label>
                <select style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>
                  <option>America/Argentina/Buenos_Aires (UTC-3)</option>
                  <option>America/Bogota (UTC-5)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>Moneda principal</label>
                <select style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>
                  <option>ARS — Peso Argentino</option>
                  <option>USD — Dólar Estadounidense</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'taxes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 4px' }}>Configuración de impuestos</h3>
              <Field label="IVA general (%)" defaultValue="21" type="number" hint="Tasa de IVA aplicada a todos los productos por defecto" />
              <Field label="IVA reducido (%)" defaultValue="10.5" type="number" hint="Para productos con tasa diferenciada" />
              <Field label="CUIT / RUT" defaultValue="30-71234567-0" />
              <Toggle label="Mostrar precios con IVA incluido" defaultOn={true} sub="Los precios en la tienda incluirán el IVA automáticamente" />
              <Toggle label="Emitir factura electrónica automáticamente" defaultOn={false} sub="Requiere integración con AFIP" />
              <Toggle label="Calcular retenciones automáticamente" defaultOn={false} />
            </div>
          )}

          {tab === 'shipping' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 4px' }}>Configuración de envíos</h3>
              <Field label="Costo de envío estándar ($)" defaultValue="9.99" type="number" />
              <Field label="Monto mínimo para envío gratuito ($)" defaultValue="100" type="number" />
              <Field label="Días estimados de entrega" defaultValue="3-5" hint="Número de días hábiles" />
              <Toggle label="Ofrecer envío exprés" defaultOn={false} sub="El cliente puede elegir entre envío estándar y exprés" />
              <Toggle label="Retiro en tienda habilitado" defaultOn={true} sub="Los clientes pueden retirar sus pedidos en cualquier sucursal" />
              <Toggle label="Seguimiento de envíos en tiempo real" defaultOn={true} />
            </div>
          )}

          {tab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 16px' }}>Notificaciones y alertas</h3>
              <Toggle label="Email de confirmación de orden" defaultOn={true} sub="Enviar al cliente cuando se confirme su pedido" />
              <Toggle label="Email de envío" defaultOn={true} sub="Notificar cuando el pedido sea despachado" />
              <Toggle label="Alertas de stock bajo" defaultOn={true} sub="Alertar cuando un producto llega a 5 unidades" />
              <Toggle label="Resumen diario por email" defaultOn={false} sub="Enviar reporte de ventas diarias al administrador" />
              <Toggle label="Notificaciones push (admin)" defaultOn={true} />
              <Toggle label="SMS para envíos" defaultOn={false} sub="Requiere integración con Twilio o proveedor SMS" />
              <Toggle label="Alertas de devoluciones" defaultOn={true} />
            </div>
          )}

          {tab === 'integrations' && (
            <div>
              <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 20px' }}>Integraciones externas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { name: 'Mercado Pago', desc: 'Pasarela de pago principal', status: 'conectado', color: '#009EE3' },
                  { name: 'Stripe', desc: 'Pagos internacionales con tarjeta', status: 'no configurado', color: '#6772E5' },
                  { name: 'AFIP Factura Electrónica', desc: 'Facturación automática', status: 'no configurado', color: '#1B4F72' },
                  { name: 'MailChimp', desc: 'Email marketing y campañas', status: 'conectado', color: '#FFE01B' },
                  { name: 'Google Analytics 4', desc: 'Analítica web avanzada', status: 'conectado', color: '#F57C00' },
                  { name: 'WhatsApp Business', desc: 'Atención al cliente por WhatsApp', status: 'no configurado', color: '#25D366' },
                ].map(int => (
                  <div key={int.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 12, border: `1px solid ${C.border}`, background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${int.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, background: int.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{int.name}</p>
                        <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{int.desc}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: int.status === 'conectado' ? C.success : C.muted, fontFamily: T.body }}>{int.status}</span>
                      <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 12, fontFamily: T.body, cursor: 'pointer' }}>
                        {int.status === 'conectado' ? 'Configurar' : 'Conectar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab !== 'integrations' && (
            <button onClick={save} style={{ marginTop: 24, padding: '13px 28px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
              Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
