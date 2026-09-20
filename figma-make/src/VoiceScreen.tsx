import { useState, useEffect, useRef } from 'react';
import { C, T, AppBar, IcMic } from './ui';

interface Props { onBack: () => void; onSearch?: (q: string) => void; }

type VoiceState = 'idle' | 'listening' | 'processing' | 'done' | 'error';

const DEMO_TRANSCRIPTIONS = [
  'Buscar blazer negro talla M',
  'Mostrar ofertas de calzado',
  'Quiero ver vestidos de la marca Zara Studio',
  'Buscar pantalones de tiro alto',
  'Zapatillas blancas talla 39',
];

const HISTORY = [
  { query: 'Blazer oversize negro', ts: 'Hace 2 horas' },
  { query: 'Vestidos de verano en oferta', ts: 'Ayer 15:30' },
  { query: 'Sneakers talla 40', ts: 'Hace 3 días' },
];

export default function VoiceScreen({ onBack, onSearch }: Props) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcription, setTranscription] = useState('');
  const [pulseRings, setPulseRings] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const startListening = () => {
    setVoiceState('listening');
    setTranscription('');
    setPulseRings(true);

    // Simulate progressive transcription
    const demo = DEMO_TRANSCRIPTIONS[Math.floor(Math.random() * DEMO_TRANSCRIPTIONS.length)];
    let chars = 0;
    const typeInterval = setInterval(() => {
      chars++;
      setTranscription(demo.slice(0, chars));
      if (chars >= demo.length) {
        clearInterval(typeInterval);
        timerRef.current = setTimeout(() => {
          setVoiceState('processing');
          timerRef.current = setTimeout(() => {
            setVoiceState('done');
            setPulseRings(false);
          }, 900);
        }, 600);
      }
    }, 60);
  };

  const reset = () => { setVoiceState('idle'); setTranscription(''); setPulseRings(false); };

  const handleSearch = () => { onSearch?.(transcription); onBack(); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FAF7F5' }}>
      <AppBar title="Búsqueda por Voz" onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px 32px' }}>
        {/* Main mic button area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          {/* Pulse rings */}
          <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            {pulseRings && [1, 2, 3].map(i => (
              <div key={i} style={{
                position: 'absolute', width: 140 + i * 28, height: 140 + i * 28,
                borderRadius: '50%', border: `2px solid ${C.accent}`,
                opacity: 0, animation: `ripple 1.8s ${i * .5}s ease-out infinite`,
              }} />
            ))}

            {/* Mic button */}
            <button
              onClick={voiceState === 'idle' || voiceState === 'done' || voiceState === 'error' ? startListening : reset}
              disabled={voiceState === 'processing'}
              style={{
                width: 110, height: 110, borderRadius: '50%', border: 'none', cursor: voiceState === 'processing' ? 'not-allowed' : 'pointer',
                background: voiceState === 'listening' ? C.accent : voiceState === 'done' ? '#059669' : C.dark,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 32px rgba(0,0,0,${voiceState === 'listening' ? '.35' : '.2'})`,
                transition: 'all .3s ease',
                animation: voiceState === 'listening' ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}>
              {voiceState === 'processing'
                ? <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(255,255,255,.3)', borderTop: '3px solid white', animation: 'spin .7s linear infinite' }} />
                : voiceState === 'done'
                ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <IcMic size={36} color="white" />
              }
            </button>
          </div>

          {/* Wave bars (listening) */}
          {voiceState === 'listening' && (
            <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 0, marginBottom: 16 }}>
              {Array.from({ length: 7 }, (_, i) => <div key={i} className="wave-bar" />)}
            </div>
          )}

          {/* State label */}
          <p style={{ fontSize: 15, fontWeight: 600, color: voiceState === 'done' ? '#059669' : C.dark, fontFamily: T.body, margin: '0 0 12px', textAlign: 'center' }}>
            {voiceState === 'idle' ? 'Toca para hablar' :
             voiceState === 'listening' ? 'Escuchando…' :
             voiceState === 'processing' ? 'Procesando…' :
             voiceState === 'done' ? 'Búsqueda lista' : 'Inténtalo de nuevo'}
          </p>

          {/* Transcription display */}
          {transcription && (
            <div className="scale-in" style={{ background: C.card, borderRadius: 16, padding: '14px 18px', width: '100%', maxWidth: 300, boxShadow: '0 4px 16px rgba(0,0,0,.08)', marginBottom: 8, textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0, lineHeight: 1.4 }}>
                "{transcription}"
                {voiceState === 'listening' && <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>}
              </p>
            </div>
          )}

          {/* Done actions */}
          {voiceState === 'done' && transcription && (
            <div className="fade-in" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={reset} style={{ padding: '10px 20px', borderRadius: 100, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
                Reintentar
              </button>
              <button onClick={handleSearch} style={{ padding: '10px 24px', borderRadius: 100, border: 'none', background: C.dark, color: 'white', fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
                Buscar →
              </button>
            </div>
          )}

          {/* Idle hint */}
          {voiceState === 'idle' && (
            <p style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
              Di algo como: "Blazer negro talla M"<br />o "Mostrar ofertas de calzado"
            </p>
          )}
        </div>

        {/* Search history */}
        {voiceState === 'idle' && (
          <div style={{ width: '100%' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Búsquedas recientes</p>
            <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
              {HISTORY.map((item, i) => (
                <div key={item.query} onClick={() => { setTranscription(item.query); setVoiceState('done'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < HISTORY.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IcMic size={15} color={C.muted} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: T.body, margin: '0 0 1px' }}>{item.query}</p>
                    <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: 0 }}>{item.ts}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
