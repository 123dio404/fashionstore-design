import { useState } from 'react';
import { C, T, AppBar, IcChevronDown } from './ui';
import { FAQ } from './data';

interface Props { onBack: () => void; }

export default function SupportScreen({ onBack }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactMsg, setContactMsg] = useState('');

  const sendContact = () => {
    if (!contactMsg.trim()) return;
    setContactSent(true);
    setContactMsg('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <AppBar title="Ayuda y Soporte" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }} className="no-scrollbar">

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #111827, #1F2937)', borderRadius: 20, padding: '20px 20px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/></svg>
          </div>
          <h2 className="font-display" style={{ fontSize: 20, color: 'white', margin: '0 0 6px' }}>¿En qué podemos ayudarte?</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', fontFamily: T.body, margin: 0 }}>Respuestas rápidas a las preguntas más frecuentes</p>
        </div>

        {/* FAQ */}
        <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Preguntas frecuentes</p>

        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '15px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, lineHeight: 1.4, flex: 1 }}>{item.q}</span>
                <IcChevronDown size={16} color={C.mutedLight} open={openIdx === i} />
              </button>
              {openIdx === i && (
                <div className="fade-in" style={{ padding: '0 16px 15px' }}>
                  <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.65 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact channels */}
        <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Contacto directo</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', sub: 'soporte@fashionstore.com', time: 'Responde en 24 hs' },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.82-1.82a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'WhatsApp', sub: '+54 9 11 0000-0000', time: 'Lun–Vie 9:00–18:00' },
          ].map(ch => (
            <div key={ch.label} style={{ flex: 1, background: C.card, borderRadius: 14, padding: '14px 14px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ marginBottom: 8 }}>{ch.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{ch.label}</p>
              <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 4px', wordBreak: 'break-all' }}>{ch.sub}</p>
              <p style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body, margin: 0 }}>{ch.time}</p>
            </div>
          ))}
        </div>

        {/* Message form */}
        <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Enviar mensaje</p>

        <div style={{ background: C.card, borderRadius: 16, padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          {contactSent ? (
            <div className="scale-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '12px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#059669', fontFamily: T.body, margin: 0 }}>¡Mensaje enviado!</p>
              <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0, textAlign: 'center' }}>Te responderemos dentro de las próximas 24 horas.</p>
              <button onClick={() => setContactSent(false)} style={{ marginTop: 4, fontSize: 12, color: C.muted, fontFamily: T.body, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Enviar otro mensaje</button>
            </div>
          ) : (
            <>
              <textarea
                value={contactMsg}
                onChange={e => setContactMsg(e.target.value)}
                placeholder="Describe tu consulta o problema…"
                rows={4}
                style={{ width: '100%', borderRadius: 12, border: `1.5px solid ${C.border}`, padding: '11px 13px', fontSize: 13, fontFamily: T.body, color: C.dark, background: C.bg, resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.55 }}
              />
              <button onClick={sendContact} disabled={!contactMsg.trim()} style={{ marginTop: 10, width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: contactMsg.trim() ? C.dark : C.borderLight, color: contactMsg.trim() ? 'white' : C.mutedLight, fontSize: 14, fontWeight: 700, fontFamily: T.body, cursor: contactMsg.trim() ? 'pointer' : 'not-allowed', transition: 'all .2s' }}>
                Enviar consulta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
