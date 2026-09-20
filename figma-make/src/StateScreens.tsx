import { useState } from 'react';
import { C, T } from './ui';

interface Props { onBack?: () => void; onRetry?: () => void; }

const Wrapper = ({ children, onBack }: { children: React.ReactNode; onBack?: () => void }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
    {onBack && (
      <div style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.muted, fontFamily: T.body }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Volver
        </button>
      </div>
    )}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 36px', textAlign: 'center' }}>
      {children}
    </div>
  </div>
);

/** NoResults — shown when search or filter yields 0 items */
export function NoResultsState({ onBack, onRetry }: Props) {
  return (
    <Wrapper onBack={onBack}>
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 20 }}>
        <circle cx="40" cy="40" r="38" stroke={C.borderLight} strokeWidth="2" fill={C.card} />
        <circle cx="34" cy="34" r="14" stroke={C.muted} strokeWidth="2.5" strokeDasharray="4 3" />
        <line x1="44" y1="44" x2="56" y2="56" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="34" x2="40" y2="34" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 10px' }}>Sin resultados</h2>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: '0 0 28px', lineHeight: 1.65 }}>
        No encontramos productos que coincidan con tu búsqueda.<br />Intenta con otros términos o ajusta los filtros.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        {onBack && <button onClick={onBack} style={{ padding: '11px 20px', borderRadius: 100, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>Limpiar filtros</button>}
        {onRetry && <button onClick={onRetry} style={{ padding: '11px 22px', borderRadius: 100, border: 'none', background: C.dark, color: 'white', fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>Nueva búsqueda</button>}
      </div>
    </Wrapper>
  );
}

/** NetworkError — shown when an API call fails */
export function NetworkErrorState({ onBack, onRetry }: Props) {
  return (
    <Wrapper onBack={onBack}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
          <path d="M1 6s4-4 11-4 11 4 11 4"/>
          <path d="M5 10s2.5-2.5 7-2.5 7 2.5 7 2.5"/>
          <path d="M9 14s1-1 3-1 3 1 3 1"/>
          <line x1="3" y1="3" x2="21" y2="21"/>
        </svg>
      </div>
      <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 10px' }}>Error de red</h2>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: '0 0 6px', lineHeight: 1.65 }}>
        No pudimos conectarnos con el servidor.<br />Verifica tu conexión a internet e inténtalo de nuevo.
      </p>
      <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '0 0 28px', fontStyle: 'italic' }}>Error: Network request failed (ERR_NETWORK)</p>
      <button onClick={onRetry} style={{ padding: '13px 28px', borderRadius: 14, border: 'none', background: C.dark, color: 'white', fontSize: 14, fontFamily: T.body, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Reintentar
      </button>
    </Wrapper>
  );
}

/** PermissionDenied — shown when camera / mic / location is blocked */
export function PermissionDeniedState({ onBack, onRetry }: Props & { permission?: string }) {
  return (
    <Wrapper onBack={onBack}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 10px' }}>Permiso denegado</h2>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: '0 0 20px', lineHeight: 1.65 }}>
        Esta función requiere acceso que no ha sido autorizado.<br />Por favor, habilítalo en la configuración de tu dispositivo.
      </p>
      <div style={{ background: C.borderLight, borderRadius: 14, padding: '14px 16px', width: '100%', marginBottom: 28, textAlign: 'left' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 8px' }}>Cómo habilitarlo:</p>
        {['Abre Configuración en tu dispositivo', 'Ve a Privacidad y seguridad', 'Busca FashionStore y activa el permiso'].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: i < 2 ? 6 : 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'white', fontFamily: T.body }}>{i + 1}</span>
            </div>
            <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{step}</span>
          </div>
        ))}
      </div>
      <button onClick={onRetry} style={{ padding: '13px 28px', borderRadius: 14, border: 'none', background: C.dark, color: 'white', fontSize: 14, fontFamily: T.body, fontWeight: 700, cursor: 'pointer' }}>
        Intentar de nuevo
      </button>
    </Wrapper>
  );
}

/** ServiceNotConfigured — shown when a feature is disabled / not available in region */
export function ServiceNotConfiguredState({ onBack }: Props) {
  return (
    <Wrapper onBack={onBack}>
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M5 4.93a10 10 0 0 0 0 14.14"/>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49"/>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
      </div>
      <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 10px' }}>Servicio no disponible</h2>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: '0 0 8px', lineHeight: 1.65 }}>
        Esta funcionalidad no está habilitada en tu región o requiere una versión más reciente de la app.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', borderRadius: 10, padding: '8px 14px', marginBottom: 28 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5"/></svg>
        <span style={{ fontSize: 12, color: C.accent, fontFamily: T.body, fontWeight: 600 }}>Código: SERVICE_UNAVAILABLE</span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {onBack && <button onClick={onBack} style={{ padding: '11px 22px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>Volver</button>}
        <button onClick={() => {}} style={{ padding: '11px 22px', borderRadius: 14, border: 'none', background: C.dark, color: 'white', fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>Actualizar app</button>
      </div>
    </Wrapper>
  );
}

/** StateDemoScreen — wraps all four states for demo / testing purposes */
export default function StateDemoScreen({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<'menu' | 'no-results' | 'network-error' | 'permission' | 'not-configured'>('menu');

  if (active === 'no-results') return <NoResultsState onBack={() => setActive('menu')} onRetry={() => setActive('menu')} />;
  if (active === 'network-error') return <NetworkErrorState onBack={() => setActive('menu')} onRetry={() => setActive('menu')} />;
  if (active === 'permission') return <PermissionDeniedState onBack={() => setActive('menu')} onRetry={() => setActive('menu')} />;
  if (active === 'not-configured') return <ServiceNotConfiguredState onBack={() => setActive('menu')} />;

  const screens = [
    { id: 'no-results' as const, label: 'Sin resultados', sub: 'Búsqueda vacía', emoji: '🔍' },
    { id: 'network-error' as const, label: 'Error de red', sub: 'Sin conexión', emoji: '📡' },
    { id: 'permission' as const, label: 'Permiso denegado', sub: 'Cámara / Micrófono', emoji: '🔐' },
    { id: 'not-configured' as const, label: 'Servicio no disponible', sub: 'Función deshabilitada', emoji: '⚙️' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <div style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.muted, fontFamily: T.body, marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Volver
        </button>
        <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 4px' }}>Pantallas de estado</h2>
        <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 20px' }}>Demo de los cuatro estados de error del sistema</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }} className="no-scrollbar">
        {screens.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{ width: '100%', textAlign: 'left', background: C.card, borderRadius: 16, padding: '16px 18px', marginBottom: 10, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{s.label}</p>
              <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>{s.sub}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
