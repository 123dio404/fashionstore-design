import { useState, useRef, useEffect } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

interface Message { id: number; text: string; from: 'user' | 'bot'; time: string; }

const SUGGESTIONS = [
  '¿Cuándo llega mi pedido?', 'Política de devoluciones', 'Cambio de talla', '¿Tienen envío gratis?', 'Cómo usar el AR', 'Sucursales disponibles',
];

const BOT_RESPONSES: Record<string, string> = {
  default: 'Hola! Soy Aria, tu asistente de FashionStore 👋 Puedo ayudarte con pedidos, envíos, tallas y más. ¿En qué te ayudo?',
  pedido: 'Puedes seguir tu pedido en la sección "Mis Compras". Los envíos a domicilio tardan 3–5 días hábiles. ¿Necesitas el número de seguimiento?',
  devoluci: 'Aceptamos devoluciones hasta 30 días después de la compra. El producto debe estar sin uso y con etiquetas. Te enviamos un rótulo de devolución gratuito.',
  talla: 'Puedes consultar nuestra guía de tallas en cada producto. Si tomaste una talla incorrecta, podemos hacer el cambio sin costo adicional.',
  envío: 'El envío es gratuito en compras mayores a $100. De lo contrario, el costo es $9.99 con entrega en 3–5 días hábiles.',
  ar: 'El Probador AR te permite ver cómo te queda una prenda virtualmente. Abre cualquier producto y toca "Probar con Realidad Aumentada".',
  sucursal: 'Tenemos 3 sucursales: Centro (Av. Corrientes 1234), Norte (Palermo Soho 567) y Sur (San Telmo 890). Horario: Lun–Sáb 10–20 hs.',
};

const QUICK_ACTIONS = [
  { label: 'Estado de mi pedido', icon: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z' },
  { label: 'Política de devoluciones', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m6 0h-6' },
  { label: 'Guía de tallas', icon: 'M3 3h18v4H3zM3 9h18v4H3zM3 15h18v4H3z' },
  { label: 'Horarios de tiendas', icon: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' },
  { label: 'Ofertas del día', icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01' },
  { label: 'Hablar con agente', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
];

const CONVERSATIONS = [
  { id: 1, name: 'Conversación actual', preview: 'Hola! Soy Aria...', time: 'Ahora', unread: 0 },
  { id: 2, name: '14 Sep 2026', preview: '¿Cuándo llega mi pedido?', time: '14 Sep', unread: 0 },
  { id: 3, name: '2 Sep 2026', preview: 'Quiero hacer un cambio de talla', time: '2 Sep', unread: 0 },
];

let msgId = 1;

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: msgId++, text: BOT_RESPONSES.default, from: 'bot', time: 'Ahora' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [activeConvo, setActiveConvo] = useState(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text: string = input.trim()) => {
    if (!text) return;
    const time = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { id: msgId++, text, from: 'user', time }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const key = Object.keys(BOT_RESPONSES).find(k => k !== 'default' && text.toLowerCase().includes(k));
      const reply = key ? BOT_RESPONSES[key] : '¡Gracias por tu consulta! Un agente especializado se pondrá en contacto contigo en los próximos minutos. ¿Hay algo más en que pueda ayudarte?';
      setMessages(m => [...m, { id: msgId++, text: reply, from: 'bot', time }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 0, flex: 1, height: 'calc(100vh - 64px - 64px)', background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      {/* Conversations list */}
      <div style={{ borderRight: `1px solid ${C.borderLight}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Conversaciones</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, borderRadius: 8, padding: '7px 10px', border: `1px solid ${C.border}` }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Buscar..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: T.body, width: '100%' }} />
          </div>
        </div>
        {CONVERSATIONS.map(c => (
          <button key={c.id} onClick={() => setActiveConvo(c.id)} style={{ width: '100%', padding: '12px 16px', border: 'none', background: activeConvo === c.id ? C.bg : 'transparent', cursor: 'pointer', textAlign: 'left', borderBottom: `1px solid ${C.borderLight}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{c.name}</span>
              <span style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body }}>{c.time}</span>
            </div>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.preview}</p>
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.borderLight}` }}>
        {/* Chat header */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M15 9h.01M9 15h6"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>Aria · Asistente IA</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.success }} />
              <span style={{ fontSize: 11, color: C.success, fontFamily: T.body }}>En línea</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }} className="no-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
              {msg.from === 'bot' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>A</span>
                </div>
              )}
              <div style={{ maxWidth: '70%' }}>
                <div style={{ padding: '10px 14px', borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.from === 'user' ? C.dark : C.bg, color: msg.from === 'user' ? 'white' : C.dark }}>
                  <p style={{ fontSize: 13, fontFamily: T.body, margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
                </div>
                <span style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body, display: 'block', marginTop: 3, textAlign: msg.from === 'user' ? 'right' : 'left' }}>{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>A</span>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: C.bg, display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.muted, animation: `pulse 1.2s ${i * .2}s ease-in-out infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div style={{ padding: '8px 16px 0', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }} className="no-scrollbar">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 11, fontFamily: T.body, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Escribe un mensaje..."
            style={{ flex: 1, padding: '11px 16px', borderRadius: 24, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body }}
          />
          <button onClick={() => send()} style={{ width: 42, height: 42, borderRadius: '50%', background: C.dark, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Acciones rápidas</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {QUICK_ACTIONS.map(action => (
            <button key={action.label} onClick={() => send(action.label)} style={{ padding: '11px 14px', borderRadius: 12, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'all .15s' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={action.icon}/></svg>
              </div>
              <span style={{ fontSize: 12, color: C.dark, fontFamily: T.body, fontWeight: 500 }}>{action.label}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: 14, background: C.bg, borderRadius: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>Aria · Asistente IA</p>
          <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.5 }}>Disponible 24/7. Para consultas complejas, un agente humano te atenderá en horario comercial.</p>
        </div>
      </div>
    </div>
  );
}
