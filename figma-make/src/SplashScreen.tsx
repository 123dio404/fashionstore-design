import { useEffect } from 'react';
import { C, T } from './ui';

interface Props { onDone: () => void; }

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#FAF7F5', gap: 12,
    }}>
      {/* Logo mark */}
      <div style={{ animation: 'logoPop .55s cubic-bezier(.34,1.56,.64,1) forwards' }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          {/* Hanger shape */}
          <rect x="8" y="8" width="56" height="56" rx="18" fill={C.dark} />
          <path d="M36 22 C36 22 28 28 24 34 C22 37 24 42 28 42 L44 42 C48 42 50 37 48 34 C44 28 36 22 36 22Z" fill="white" />
          <circle cx="36" cy="20" r="3" stroke="white" strokeWidth="2" fill="none" />
          <line x1="36" y1="17" x2="36" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="13" x2="40" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ textAlign: 'center', animation: 'fadeIn .5s .3s ease-out both' }}>
        <h1 className="font-display" style={{ fontSize: 28, color: C.dark, margin: 0, letterSpacing: '-.5px', lineHeight: 1 }}>
          FashionStore
        </h1>
        <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: T.body, margin: '6px 0 0', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Tu estilo, tu forma
        </p>
      </div>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: 6, marginTop: 32, animation: 'fadeIn .4s .8s ease-out both', opacity: 0 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: C.dark,
            animation: `pulse 1.2s ${i * .2}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
