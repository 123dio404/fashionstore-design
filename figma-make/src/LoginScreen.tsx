import { useState } from 'react';
import { C, T } from './ui';

interface Props {
  onSuccess: () => void;
  onGoRegister: () => void;
}

type FieldErr = { email?: string; password?: string; general?: string };

export default function LoginScreen({ onSuccess, onGoRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErr>({});

  const validate = (): boolean => {
    const e: FieldErr = {};
    if (!email.trim()) e.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido';
    if (!password) e.password = 'La contraseña es obligatoria';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    await new Promise(r => setTimeout(r, 1800));
    // Simulate wrong credentials once to show error state
    if (password === 'wrong') {
      setErrors({ general: 'Correo o contraseña incorrectos. Verifica tus datos.' });
      setLoading(false);
      return;
    }
    onSuccess();
  };

  const Field = ({ label, value, onChange, type = 'text', error, placeholder, right }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; error?: string; placeholder?: string; right?: React.ReactNode;
  }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, marginBottom: 6, letterSpacing: '.03em' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '13px 44px 13px 14px', borderRadius: 13, border: `1.5px solid ${error ? '#FCA5A5' : C.border}`, outline: 'none', background: error ? '#FEF2F2' : C.card, fontSize: 14, fontFamily: T.body, color: C.dark, boxSizing: 'border-box' }}
        />
        {right && <div style={{ position: 'absolute', right: 12 }}>{right}</div>}
      </div>
      {error && <p style={{ fontSize: 11, color: C.accent, fontFamily: T.body, margin: '5px 0 0' }}>{error}</p>}
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAF7F5', overflow: 'hidden' }}>
      {/* Header banner */}
      <div style={{ background: C.dark, padding: '56px 28px 32px', flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', fontFamily: T.body, margin: '0 0 4px', letterSpacing: '.06em', textTransform: 'uppercase' }}>Bienvenida de nuevo</p>
        <h1 className="font-display" style={{ fontSize: 28, color: 'white', margin: 0, lineHeight: 1.1 }}>Inicia sesión</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 32px' }} className="no-scrollbar">
        {/* General error */}
        {errors.general && (
          <div className="slide-down" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ fontSize: 13, color: '#991B1B', fontFamily: T.body, margin: 0 }}>{errors.general}</p>
          </div>
        )}

        <Field label="Correo electrónico" value={email} onChange={setEmail} type="email" placeholder="ana@ejemplo.com" error={errors.email} />
        <Field
          label="Contraseña" value={password} onChange={setPassword}
          type={showPass ? 'text' : 'password'} placeholder="Tu contraseña" error={errors.password}
          right={
            <button onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.mutedLight }}>
              {showPass
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          }
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8, marginBottom: 24 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.accent, fontFamily: T.body, fontWeight: 600, padding: 0 }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: loading ? C.border : C.dark, color: loading ? C.muted : 'white', fontSize: 16, fontWeight: 700, fontFamily: T.body, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {loading ? (
            <>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${C.muted}`, borderTop: `2px solid ${C.dark}`, animation: 'spin .7s linear infinite' }} />
              Verificando...
            </>
          ) : 'Ingresar'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body }}>o continúa con</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Social login */}
        {[
          { label: 'Continuar con Google', icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
          { label: 'Continuar con Apple', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
        ].map(s => (
          <button key={s.label} style={{ width: '100%', padding: '13px 0', borderRadius: 13, border: `1.5px solid ${C.border}`, background: C.card, color: C.dark, fontSize: 14, fontFamily: T.body, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
            {s.icon}{s.label}
          </button>
        ))}

        <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, fontFamily: T.body, marginTop: 24 }}>
          ¿No tienes cuenta?{' '}
          <button onClick={onGoRegister} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.accent, fontWeight: 700, fontFamily: T.body, fontSize: 13, padding: 0 }}>
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
