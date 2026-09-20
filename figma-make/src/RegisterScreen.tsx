import { useState } from 'react';
import { C, T } from './ui';

interface Props {
  onSuccess: () => void;
  onGoLogin: () => void;
}

type Fields = { name: string; email: string; password: string; confirm: string };
type Errs = Partial<Record<keyof Fields | 'general', string>>;

const strength = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};

const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#059669'];

export default function RegisterScreen({ onSuccess, onGoLogin }: Props) {
  const [form, setForm] = useState<Fields>({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errs>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const set = (k: keyof Fields) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: Errs = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    else if (form.name.trim().length < 2) e.name = 'Mínimo 2 caracteres';
    if (!form.email.trim()) e.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido';
    if (!form.password) e.password = 'La contraseña es obligatoria';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden';
    if (!acceptTerms) e.general = 'Debes aceptar los términos y condiciones';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    onSuccess();
  };

  const passStrength = strength(form.password);

  const Field = ({ label, fKey, type = 'text', placeholder, right }: {
    label: string; fKey: keyof Fields; type?: string; placeholder?: string; right?: React.ReactNode;
  }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, marginBottom: 5, letterSpacing: '.03em' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type} value={form[fKey]} onChange={e => set(fKey)(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: right ? '13px 44px 13px 14px' : '13px 14px', borderRadius: 13, border: `1.5px solid ${errors[fKey] ? '#FCA5A5' : C.border}`, outline: 'none', background: errors[fKey] ? '#FEF2F2' : C.card, fontSize: 14, fontFamily: T.body, color: C.dark, boxSizing: 'border-box' }}
        />
        {right && <div style={{ position: 'absolute', right: 12 }}>{right}</div>}
      </div>
      {errors[fKey] && <p style={{ fontSize: 11, color: C.accent, fontFamily: T.body, margin: '4px 0 0' }}>{errors[fKey]}</p>}
    </div>
  );

  const EyeBtn = () => (
    <button onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.mutedLight }}>
      {showPass
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
    </button>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAF7F5', overflow: 'hidden' }}>
      <div style={{ background: C.dark, padding: '56px 28px 32px', flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', fontFamily: T.body, margin: '0 0 4px', letterSpacing: '.06em', textTransform: 'uppercase' }}>FashionStore</p>
        <h1 className="font-display" style={{ fontSize: 28, color: 'white', margin: 0, lineHeight: 1.1 }}>Crear cuenta</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 32px' }} className="no-scrollbar">
        {errors.general && (
          <div className="slide-down" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12, padding: '11px 14px', marginBottom: 14, display: 'flex', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ fontSize: 12, color: '#991B1B', fontFamily: T.body, margin: 0 }}>{errors.general}</p>
          </div>
        )}

        <Field label="Nombre completo" fKey="name" placeholder="Ana López" />
        <Field label="Correo electrónico" fKey="email" type="email" placeholder="ana@ejemplo.com" />
        <Field label="Contraseña" fKey="password" type={showPass ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" right={<EyeBtn />} />

        {/* Password strength */}
        {form.password.length > 0 && (
          <div style={{ marginTop: -8, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i <= passStrength ? strengthColor[passStrength] : C.borderLight, transition: 'background .2s' }} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: strengthColor[passStrength], fontFamily: T.body, margin: 0, fontWeight: 600 }}>
              {strengthLabel[passStrength]}
            </p>
          </div>
        )}

        <Field label="Confirmar contraseña" fKey="confirm" type={showPass ? 'text' : 'password'} placeholder="Repite tu contraseña" />

        {/* Terms */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <button onClick={() => setAcceptTerms(!acceptTerms)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${acceptTerms ? C.dark : C.border}`, background: acceptTerms ? C.dark : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            {acceptTerms && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </button>
          <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.5 }}>
            Acepto los{' '}
            <span style={{ color: C.accent, fontWeight: 600, cursor: 'pointer' }}>Términos y condiciones</span>
            {' '}y la{' '}
            <span style={{ color: C.accent, fontWeight: 600, cursor: 'pointer' }}>Política de privacidad</span>
          </p>
        </div>

        <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: loading ? C.border : C.dark, color: loading ? C.muted : 'white', fontSize: 16, fontWeight: 700, fontFamily: T.body, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          {loading ? (
            <><div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${C.muted}`, borderTop: `2px solid ${C.dark}`, animation: 'spin .7s linear infinite' }} />Creando cuenta...</>
          ) : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>
          ¿Ya tienes cuenta?{' '}
          <button onClick={onGoLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.accent, fontWeight: 700, fontFamily: T.body, fontSize: 13, padding: 0 }}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
