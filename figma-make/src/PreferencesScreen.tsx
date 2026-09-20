import { useState } from 'react';
import type { UserPreferences } from './types';
import { C, T, AppBar, IcToggle } from './ui';
import { BRANDS_LIST, COLORS_LIST, SIZES_LIST, DEFAULT_PREFS } from './data';

interface Props { onBack: () => void; onSave: (prefs: UserPreferences) => void; initial?: UserPreferences; }

const Chip = ({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} style={{ padding: '7px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: 500, transition: 'all .15s', background: selected ? C.dark : C.borderLight, color: selected ? 'white' : C.muted }}>
    {label}
  </button>
);

export default function PreferencesScreen({ onBack, onSave, initial }: Props) {
  const [prefs, setPrefs] = useState<UserPreferences>(initial ?? DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  const toggleArr = (key: 'brands' | 'favoriteColors' | 'sizes', val: string) => {
    setPrefs(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));
  };

  const handleSave = () => {
    onSave(prefs);
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 1400);
  };

  const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '.07em' }}>{title}</p>
      {subtitle && <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '0 0 10px' }}>{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: 10 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{children}</div>
    </div>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${C.borderLight}` }}>
      <span style={{ fontSize: 14, color: C.dark, fontFamily: T.body, fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <AppBar title="Preferencias" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }} className="no-scrollbar">

        <Section title="Marcas favoritas" subtitle="Filtraremos el catálogo con estas marcas primero">
          {BRANDS_LIST.map(b => <Chip key={b} label={b} selected={prefs.brands.includes(b)} onToggle={() => toggleArr('brands', b)} />)}
        </Section>

        <Section title="Colores favoritos">
          {COLORS_LIST.map(c => {
            const selected = prefs.favoriteColors.includes(c);
            const dot: Record<string, string> = { 'Negro': '#111827', 'Blanco': '#F8F9FA', 'Terracota': '#E05A47', 'Beige': '#D4C5A9', 'Azul marino': '#1E3A5F', 'Gris': '#9CA3AF', 'Verde oliva': '#6B7C5C', 'Burdeos': '#7F1D3E' };
            return (
              <button key={c} onClick={() => toggleArr('favoriteColors', c)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: 500, transition: 'all .15s', background: selected ? C.dark : C.borderLight, color: selected ? 'white' : C.muted }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: dot[c] ?? '#9CA3AF', border: c === 'Blanco' ? '1px solid #E5E7EB' : 'none', flexShrink: 0 }} />
                {c}
              </button>
            );
          })}
        </Section>

        <Section title="Tallas habituales">
          {SIZES_LIST.map(s => <Chip key={s} label={s} selected={prefs.sizes.includes(s)} onToggle={() => toggleArr('sizes', s)} />)}
        </Section>

        {/* Notifications */}
        <div style={{ background: C.card, borderRadius: 16, padding: '4px 16px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: T.body, margin: '12px 0 4px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Notificaciones</p>
          <Row label="Notificaciones push">
            <IcToggle value={prefs.notifications} onChange={v => setPrefs(p => ({ ...p, notifications: v }))} />
          </Row>
        </div>

        {/* Currency */}
        <div style={{ background: C.card, borderRadius: 16, padding: '4px 16px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: T.body, margin: '12px 0 4px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Moneda</p>
          <Row label="Mostrar precios en">
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ARS', 'USD'] as const).map(c => (
                <button key={c} onClick={() => setPrefs(p => ({ ...p, currency: c }))} style={{ padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: 600, background: prefs.currency === c ? C.dark : C.borderLight, color: prefs.currency === c ? 'white' : C.muted }}>
                  {c}
                </button>
              ))}
            </div>
          </Row>
        </div>

        {/* Save indicator */}
        {saved && (
          <div className="scale-in" style={{ background: '#ECFDF5', borderRadius: 12, padding: '11px 16px', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#059669', fontFamily: T.body }}>Preferencias guardadas</span>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}` }}>
        <button onClick={handleSave} disabled={saved} style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: 'none', background: saved ? '#059669' : C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: saved ? 'default' : 'pointer', transition: 'background .3s' }}>
          {saved ? 'Guardado ✓' : 'Guardar preferencias'}
        </button>
      </div>
    </div>
  );
}
