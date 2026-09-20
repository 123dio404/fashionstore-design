import { useState } from 'react';
import type { UserPreferences } from './types';
import { C, T, AppBar, IcToggle } from './ui';
import { DEFAULT_PREFS } from './data';

interface Props { onBack: () => void; onLogout: () => void; initial?: UserPreferences; onSave: (p: UserPreferences) => void; }

export default function SettingsScreen({ onBack, onLogout, initial, onSave }: Props) {
  const [prefs, setPrefs] = useState<UserPreferences>(initial ?? DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const set = <K extends keyof UserPreferences>(k: K, v: UserPreferences[K]) => {
    setPrefs(p => ({ ...p, [k]: v }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: T.body, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.07em' }}>{title}</p>
      <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>{children}</div>
    </div>
  );

  const Row = ({ label, sub, children, last }: { label: string; sub?: string; children: React.ReactNode; last?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', borderBottom: last ? 'none' : `1px solid ${C.borderLight}` }}>
      <div>
        <p style={{ fontSize: 14, color: C.dark, fontFamily: T.body, fontWeight: 500, margin: '0 0 1px' }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: 0 }}>{sub}</p>}
      </div>
      {children}
    </div>
  );

  const SegPicker = <T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) => (
    <div style={{ display: 'flex', gap: 4, background: C.borderLight, borderRadius: 100, padding: 3 }}>
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{ padding: '5px 10px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: T.body, fontWeight: 600, transition: 'all .15s', background: value === o.v ? C.dark : 'transparent', color: value === o.v ? 'white' : C.muted }}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <AppBar title="Configuración" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 24px' }} className="no-scrollbar">

        <Section title="Apariencia">
          <Row label="Tema" sub="Aspecto visual de la app">
            <SegPicker<UserPreferences['theme']>
              value={prefs.theme}
              options={[{ v: 'light', label: 'Claro' }, { v: 'dark', label: 'Oscuro' }, { v: 'system', label: 'Auto' }]}
              onChange={v => set('theme', v)}
            />
          </Row>
          <Row label="Idioma" sub="Idioma de la interfaz" last>
            <SegPicker<UserPreferences['language']>
              value={prefs.language}
              options={[{ v: 'es', label: 'Español' }, { v: 'en', label: 'English' }]}
              onChange={v => set('language', v)}
            />
          </Row>
        </Section>

        <Section title="Moneda">
          <Row label="Divisa" sub="Moneda para mostrar precios" last>
            <SegPicker<UserPreferences['currency']>
              value={prefs.currency}
              options={[{ v: 'ARS', label: 'ARS' }, { v: 'USD', label: 'USD' }]}
              onChange={v => set('currency', v)}
            />
          </Row>
        </Section>

        <Section title="Notificaciones">
          <Row label="Notificaciones push" sub="Recibir alertas de pedidos y ofertas" last>
            <IcToggle value={prefs.notifications} onChange={v => set('notifications', v)} />
          </Row>
        </Section>

        <Section title="Privacidad y seguridad">
          {[
            { label: 'Cambiar contraseña', icon: '🔑' },
            { label: 'Gestionar dispositivos', icon: '📱' },
            { label: 'Eliminar cuenta', icon: '🗑', danger: true },
          ].map((item, i, arr) => (
            <div key={item.label} onClick={() => {}} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: (item as {danger?: boolean}).danger ? C.accent : C.dark, fontFamily: T.body, fontWeight: 500 }}>{item.label}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </Section>

        <Section title="Acerca de">
          {[
            { label: 'Versión de la app', value: '2.4.1' },
            { label: 'Términos y condiciones', chevron: true },
            { label: 'Política de privacidad', chevron: true },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: item.chevron ? 'pointer' : 'default' }}>
              <span style={{ fontSize: 14, color: C.dark, fontFamily: T.body, fontWeight: 500 }}>{item.label}</span>
              {item.value && <span style={{ fontSize: 13, color: C.mutedLight, fontFamily: T.body }}>{item.value}</span>}
              {item.chevron && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
            </div>
          ))}
        </Section>

        {/* Saved feedback */}
        {saved && (
          <div className="scale-in" style={{ background: '#ECFDF5', borderRadius: 12, padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#059669', fontFamily: T.body }}>Cambios guardados</span>
          </div>
        )}

        {/* Save + Logout */}
        <button onClick={handleSave} style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', marginBottom: 10 }}>
          Guardar cambios
        </button>
        <button onClick={() => setShowLogout(true)} style={{ width: '100%', padding: '14px 0', borderRadius: 16, border: `1.5px solid ${C.accent}`, background: 'transparent', color: C.accent, fontSize: 14, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      {/* Logout confirm modal */}
      {showLogout && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setShowLogout(false)}>
          <div className="slide-up" onClick={e => e.stopPropagation()} style={{ width: '100%', background: C.card, borderRadius: '24px 24px 0 0', padding: '24px 24px 36px' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: '0 0 8px', textAlign: 'center' }}>¿Cerrar sesión?</h3>
            <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 24px', textAlign: 'center', lineHeight: 1.55 }}>Se cerrará tu sesión actual.<br />Podrás volver a ingresar cuando quieras.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '14px 0', borderRadius: 14, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 14, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={onLogout} style={{ flex: 1, padding: '14px 0', borderRadius: 14, border: 'none', background: C.accent, color: 'white', fontSize: 14, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
