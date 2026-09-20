import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from './types';
import { C, T, AppBar, IcSend, IcMessageCircle } from './ui';

interface Props { onBack: () => void; }

const BOT_RESPONSES: Record<string, string> = {
  talla: 'Para encontrar tu talla ideal, te recomendamos usar nuestra Guía de Tallas disponible en cada producto. También puedes reservar un turno en el Probador Virtual.',
  envío: 'El envío estándar tarda 3–5 días hábiles con un costo de $4.99. El retiro en tienda está disponible en 24 horas sin costo adicional.',
  pago: 'Aceptamos Visa, Mastercard, American Express, Apple Pay y Google Pay. Todos los pagos se procesan de forma segura mediante Stripe.',
  devolucion: 'Puedes devolver o cambiar un producto dentro de los 30 días desde la compra. El artículo debe estar sin uso y con sus etiquetas originales.',
  reserva: 'Para reservar un probador, ve a la pestaña "Reservas" en la navegación inferior, elige el producto, la sucursal y el horario disponible.',
  descuento: '¡Claro! Usa el código FASHION10 en tu carrito para obtener un 10% de descuento en tu próxima compra.',
  horario: 'Nuestras sucursales abren de lunes a sábado de 10:00 a 21:00 hs. La Sucursal Sur cierra a las 20:00 hs.',
  default: 'Entiendo tu consulta. Para más información, puedes revisar nuestra sección de Ayuda y Soporte o contactarnos por correo a soporte@fashionstore.com',
};

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }
  if (lower.includes('hola') || lower.includes('buenos')) return '¡Hola! Soy el asistente virtual de FashionStore. ¿En qué puedo ayudarte hoy?';
  if (lower.includes('gracias')) return '¡De nada! ¿Hay algo más en lo que pueda ayudarte?';
  return BOT_RESPONSES.default;
}

const QUICK = ['¿Cómo devuelvo un producto?', '¿Tienen envío gratis?', 'Código de descuento', '¿Cómo reservo un probador?'];

const INITIAL: ChatMessage[] = [
  { id: 'init', role: 'assistant', text: '¡Hola! Soy el asistente de FashionStore 👗 ¿En qué puedo ayudarte hoy?', ts: Date.now() - 5000 },
];

export default function ChatbotScreen({ onBack }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: text.trim(), ts: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const botMsg: ChatMessage = { id: `b-${Date.now()}`, role: 'assistant', text: getBotResponse(text), ts: Date.now() };
      setMessages(m => [...m, botMsg]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  };

  const fmt = (ts: number) => new Date(ts).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar
        title="Asistente FashionStore"
        onBack={onBack}
        rightSlot={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            <span style={{ fontSize: 11, color: '#059669', fontFamily: T.body, fontWeight: 600 }}>En línea</span>
          </div>
        }
      />

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }} className="no-scrollbar">
        {messages.map((msg, i) => (
          <div key={msg.id} className="fade-in" style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, marginBottom: 14, alignItems: 'flex-end' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IcMessageCircle size={15} color="white" />
              </div>
            )}
            <div style={{ maxWidth: '75%' }}>
              <div style={{ background: msg.role === 'user' ? C.dark : C.card, borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '11px 14px', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                <p style={{ fontSize: 13, color: msg.role === 'user' ? 'white' : C.dark, fontFamily: T.body, margin: 0, lineHeight: 1.55 }}>{msg.text}</p>
              </div>
              <p style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body, margin: '3px 4px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{fmt(msg.ts)}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="fade-in" style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IcMessageCircle size={15} color="white" />
            </div>
            <div style={{ background: C.card, borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, .2, .4].map(delay => (
                  <div key={delay} style={{ width: 7, height: 7, borderRadius: '50%', background: C.mutedLight, animation: `pulse 1.2s ${delay}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick replies */}
        {messages.length <= 2 && !typing && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '0 0 8px' }}>Preguntas frecuentes:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)} style={{ padding: '7px 12px', borderRadius: 100, border: `1px solid ${C.border}`, background: C.card, color: C.dark, fontSize: 11, fontFamily: T.body, fontWeight: 500, cursor: 'pointer' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 16px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}`, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div style={{ flex: 1, background: C.bg, borderRadius: 20, padding: '10px 14px', border: `1px solid ${C.border}`, minHeight: 42, display: 'flex', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Escribe tu mensaje…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: T.body, color: C.dark }}
          />
        </div>
        <button onClick={() => send(input)} disabled={!input.trim()} style={{ width: 42, height: 42, borderRadius: '50%', background: input.trim() ? C.dark : C.borderLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'background .2s', flexShrink: 0 }}>
          <IcSend size={16} color={input.trim() ? 'white' : C.mutedLight} />
        </button>
      </div>
    </div>
  );
}
