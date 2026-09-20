import { useState } from 'react';
import { C } from '../../ui';
import type { WebRole } from '../WebApp';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

interface Props {
  onLogin: (role: WebRole) => void;
  onSwitchToMobile: () => void;
}

const roles: { id: WebRole; label: string; description: string; color: string; icon: string }[] = [
  { id: 'customer', label: 'Cliente', description: 'Comprar y gestionar pedidos', color: '#6366F1', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { id: 'admin', label: 'Administrador', description: 'Gestión completa de la tienda', color: C.accent, icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9' },
  { id: 'pos', label: 'Punto de Venta', description: 'Terminal y cobros en tienda', color: '#059669', icon: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 12v.01' },
];

export default function LoginPage({ onLogin, onSwitchToMobile }: Props) {
  const [selectedRole, setSelectedRole] = useState<WebRole>('customer');
  const [email, setEmail] = useState('ana.lopez@fashionstore.com');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedRole); }, 900);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: T.body }}>
      {/* Left panel — image + brand */}
      <div style={{ flex: '0 0 55%', background: C.dark, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 56 }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=900&fit=crop&auto=format"
          alt="FashionStore colección"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, background: C.accent, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1" fill="white" stroke="none"/></svg>
            </div>
            <span style={{ fontFamily: T.display, fontSize: 22, color: 'white', letterSpacing: '-0.01em' }}>FashionStore</span>
          </div>
          <h1 style={{ fontFamily: T.display, fontSize: 48, color: 'white', margin: '0 0 16px', lineHeight: 1.1 }}>
            Moda que<br />inspira, plataforma<br />que impulsa.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', margin: '0 0 32px', lineHeight: 1.7, maxWidth: 360 }}>
            Gestión integral de inventario, ventas y atención al cliente en una sola plataforma.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ n: '24K+', l: 'Productos' }, { n: '98%', l: 'Satisfacción' }, { n: '3', l: 'Sucursales' }].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'white', fontFamily: T.display }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onSwitchToMobile} style={{ position: 'absolute', top: 24, right: 24, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.7)', fontSize: 12, cursor: 'pointer', fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          Vista móvil
        </button>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 72px', background: 'white' }}>
        <div style={{ maxWidth: 420 }}>
          <h2 style={{ fontFamily: T.display, fontSize: 32, color: C.dark, margin: '0 0 8px' }}>Bienvenida de nuevo</h2>
          <p style={{ fontSize: 14, color: C.muted, margin: '0 0 36px' }}>Selecciona tu rol e inicia sesión para continuar.</p>

          {/* Role selector */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Acceso como</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {roles.map(r => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)} style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: `2px solid ${selectedRole === r.id ? r.color : C.border}`, background: selectedRole === r.id ? `${r.color}0F` : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selectedRole === r.id ? r.color : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px', display: 'block' }}>
                    <path d={r.icon} />
                  </svg>
                  <div style={{ fontSize: 11, fontWeight: 700, color: selectedRole === r.id ? r.color : C.muted }}>{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Correo electrónico</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, color: C.dark, background: C.bg, boxSizing: 'border-box' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' }}>Contraseña</label>
              <button style={{ fontSize: 12, color: C.accent, fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>¿Olvidaste tu contraseña?</button>
            </div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, color: C.dark, background: C.bg, boxSizing: 'border-box' }}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? (
              <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Iniciando sesión…</>
            ) : 'Iniciar sesión'}
          </button>

          <p style={{ fontSize: 12, color: C.mutedLight, textAlign: 'center', marginTop: 24 }}>
            © 2026 FashionStore · Versión 3.2.1
          </p>
        </div>
      </div>
    </div>
  );
}
