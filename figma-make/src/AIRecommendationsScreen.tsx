import { useState } from 'react';
import { PRODUCTS, BRANDS_LIST, COLORS_LIST, SIZES_LIST, CATEGORIES } from './data';
import type { Product } from './types';
import { C, T, AppBar, IcSparkles, IcStar, IcHeart, Skel } from './ui';

interface Props {
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  favs: number[];
  onToggleFav: (id: number) => void;
}

// Style profile — single selections + multi sizes
interface StyleProfile {
  brand: string;       // single brand or '' for all
  category: string;    // single category or 'Todos'
  sizes: string[];     // multi
  minPrice: number | null;
  maxPrice: number | null;
}

type AIState = 'idle' | 'loading' | 'done' | 'no-results';

const DISPLAY_CATEGORIES = CATEGORIES.filter(c => c !== 'Ofertas');
const DISPLAY_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Match score 0-100
function score(p: Product, profile: StyleProfile): number {
  if (profile.minPrice !== null && p.price < profile.minPrice) return -1;
  if (profile.maxPrice !== null && p.price > profile.maxPrice) return -1;
  let s = 0;
  if (profile.category !== 'Todos' && p.category === profile.category) s += 40;
  if (profile.brand && p.brand === profile.brand) s += 25;
  if (profile.sizes.length > 0 && p.sizes.some(sz => profile.sizes.includes(sz))) s += 25;
  // availability bonus
  const totalStock = Object.values(p.stock as Record<string, number>).reduce((a, b) => a + b, 0);
  if (totalStock > 0) s += 10;
  return s;
}

type Reason = { label: string; color: string; bg: string };
function reasons(p: Product, profile: StyleProfile): Reason[] {
  const r: Reason[] = [];
  if (profile.category !== 'Todos' && p.category === profile.category)
    r.push({ label: 'Categoría favorita', color: '#1D4ED8', bg: '#EFF6FF' });
  if (profile.brand && p.brand === profile.brand)
    r.push({ label: 'Tu marca', color: '#7C3AED', bg: '#F5F3FF' });
  const totalStock = Object.values(p.stock as Record<string, number>).reduce((a, b) => a + b, 0);
  if (totalStock > 0)
    r.push({ label: 'Disponible ahora', color: C.muted, bg: C.borderLight });
  if (r.length < 2)
    r.push({ label: 'Basado en tus compras', color: '#059669', bg: '#ECFDF5' });
  return r.slice(0, 3);
}

const DEFAULT_PROFILE: StyleProfile = { brand: '', category: 'Todos', sizes: [], minPrice: null, maxPrice: null };

// ── Sub-components ─────────────────────────────────────────────────

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 8px', letterSpacing: '.04em' }}>{children}</p>
);

const Helper = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '6px 0 0', lineHeight: 1.4 }}>{children}</p>
);

const SingleChip = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) => (
  <button onClick={onSelect} style={{ padding: '7px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: T.body, fontWeight: selected ? 600 : 400, transition: 'all .15s', background: selected ? C.dark : C.borderLight, color: selected ? 'white' : C.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>
    {label}
  </button>
);

const MultiChip = ({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} style={{ padding: '7px 14px', borderRadius: 100, border: selected ? `1.5px solid ${C.dark}` : `1.5px solid ${C.border}`, cursor: 'pointer', fontSize: 13, fontFamily: T.body, fontWeight: selected ? 600 : 400, transition: 'all .15s', background: selected ? C.dark : 'transparent', color: selected ? 'white' : C.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>
    {label}
  </button>
);

const DisabledColorChip = ({ label, hex }: { label: string; hex: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 100, background: C.borderLight, opacity: .55 }}>
    <div style={{ width: 10, height: 10, borderRadius: '50%', background: hex, border: label === 'Blanco' ? `1px solid ${C.border}` : 'none', flexShrink: 0 }} />
    <span style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body, fontWeight: 400 }}>{label}</span>
  </div>
);

const COLOR_HEX: Record<string, string> = {
  Negro: '#111827', Blanco: '#F8F9FA', Gris: '#9CA3AF', Beige: '#D4C5A9',
  Terracota: '#E05A47', Azul: '#2563EB', Rojo: '#DC2626', Verde: '#16A34A', Camel: '#C19A6B',
};

// ── ResultCard ─────────────────────────────────────────────────────
function ResultCard({ product, matchScore, profile, isFav, onToggleFav, onClick, onAddToCart }: {
  product: Product;
  matchScore: number;
  profile: StyleProfile;
  isFav: boolean;
  onToggleFav: () => void;
  onClick: () => void;
  onAddToCart: () => void;
}) {
  const chips = reasons(product, profile);
  return (
    <div className="fade-in" style={{ background: C.card, borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
      <div style={{ display: 'flex', gap: 12, padding: 14 }}>
        {/* Thumbnail */}
        <div onClick={onClick} style={{ width: 84, height: 100, borderRadius: 12, overflow: 'hidden', background: C.borderLight, flexShrink: 0, cursor: 'pointer' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>{product.brand}</p>
            <button onClick={onToggleFav} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <IcHeart size={16} filled={isFav} />
            </button>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0, lineHeight: 1.3 }}>{product.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IcStar size={11} />
            <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{product.rating} · {product.reviews} reseñas</span>
          </div>
          {/* Match score */}
          <div style={{ marginTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Coincidencia {matchScore}</span>
              <div style={{ flex: 1, height: 3, background: C.borderLight, borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${matchScore}%`, background: matchScore >= 65 ? '#059669' : matchScore >= 40 ? C.accent : C.mutedLight, borderRadius: 2, transition: 'width .4s ease' }} />
              </div>
            </div>
          </div>
          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${product.price.toFixed(2)}</span>
              <span style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, textDecoration: 'line-through', marginLeft: 6 }}>${product.oldPrice.toFixed(2)}</span>
            </div>
            <button onClick={onAddToCart} style={{ padding: '5px 12px', borderRadius: 10, background: C.dark, color: 'white', border: 'none', fontSize: 11, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>+ Añadir</button>
          </div>
        </div>
      </div>
      {/* Reason chips */}
      <div style={{ padding: '0 14px 12px', display: 'flex', gap: 6, overflowX: 'auto' }} className="no-scrollbar">
        {chips.map(c => (
          <span key={c.label} style={{ fontSize: 11, fontWeight: 600, color: c.color, background: c.bg, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>{c.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Skeletons ──────────────────────────────────────────────────────
function ResultSkeleton() {
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 14, marginBottom: 12, display: 'flex', gap: 12 }}>
      <Skel w={84} h={100} r={12} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skel h={10} w="40%" />
        <Skel h={14} w="80%" />
        <Skel h={10} w="55%" />
        <Skel h={8} w="70%" />
        <Skel h={14} w="50%" />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function AIRecommendationsScreen({ onBack, onProductClick, onAddToCart, favs, onToggleFav }: Props) {
  const [profile, setProfile] = useState<StyleProfile>(DEFAULT_PROFILE);
  const [aiState, setAIState] = useState<AIState>('idle');
  const [results, setResults] = useState<Array<{ product: Product; score: number }>>([]);
  const [savedToast, setSavedToast] = useState(false);
  const [budgetError, setBudgetError] = useState('');

  const hasProfile = profile.brand || profile.category !== 'Todos' || profile.sizes.length > 0 || profile.minPrice !== null || profile.maxPrice !== null;

  const setBrand = (b: string) => setProfile(p => ({ ...p, brand: p.brand === b ? '' : b }));
  const setCategory = (c: string) => setProfile(p => ({ ...p, category: p.category === c ? 'Todos' : c }));
  const toggleSize = (s: string) => setProfile(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }));

  const setPriceMin = (raw: string) => {
    const v = raw === '' ? null : parseFloat(raw);
    setProfile(p => ({ ...p, minPrice: v }));
    validateBudget(v, profile.maxPrice);
  };
  const setPriceMax = (raw: string) => {
    const v = raw === '' ? null : parseFloat(raw);
    setProfile(p => ({ ...p, maxPrice: v }));
    validateBudget(profile.minPrice, v);
  };
  const validateBudget = (min: number | null, max: number | null) => {
    if (min !== null && max !== null && min > max) {
      setBudgetError('El mínimo no puede superar al máximo');
    } else {
      setBudgetError('');
    }
  };

  const generate = () => {
    if (budgetError) return;
    setAIState('loading');
    setTimeout(() => {
      const scored = PRODUCTS
        .map(p => ({ product: p, score: score(p, profile) }))
        .filter(x => x.score >= 0)
        .sort((a, b) => b.score - a.score);
      if (scored.length === 0) {
        setAIState('no-results');
      } else {
        setResults(scored);
        setAIState('done');
      }
    }, 1800);
  };

  const savePrefs = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const isIdle = aiState === 'idle' || aiState === 'no-results';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <AppBar title="Para ti" onBack={onBack} rightSlot={<IcSparkles size={20} color={C.accent} />} />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: aiState === 'loading' ? 0 : 100 }} className="no-scrollbar">

        {/* ── Style profile form ── */}
        {isIdle && (
          <div className="fade-in" style={{ padding: '0 20px' }}>
            {/* Intro banner */}
            <div style={{ background: 'linear-gradient(130deg, #111827 0%, #1F2937 100%)', borderRadius: 18, padding: '16px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(224,90,71,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <IcSparkles size={18} color={C.accent} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: T.body, margin: '0 0 4px' }}>Tu estilo</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.58)', fontFamily: T.body, margin: 0, lineHeight: 1.6 }}>
                  Cuéntanos tu estilo y ajustamos tus sugerencias. Si no eliges nada, usamos tu historial de compras y la disponibilidad en tienda.
                </p>
              </div>
            </div>

            {/* No preferences banner */}
            {!hasProfile && (
              <div className="fade-in" style={{ background: '#FEF3C7', borderRadius: 14, padding: '11px 14px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5"/></svg>
                <p style={{ fontSize: 12, color: '#92400E', fontFamily: T.body, margin: 0, lineHeight: 1.4 }}>Completa tu estilo para mejores sugerencias</p>
              </div>
            )}

            {/* Row 1 — Marca */}
            <div style={{ marginBottom: 22 }}>
              <FieldLabel>Marca favorita</FieldLabel>
              <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
                <SingleChip label="Todas las marcas" selected={!profile.brand} onSelect={() => setProfile(p => ({ ...p, brand: '' }))} />
                {BRANDS_LIST.map(b => <SingleChip key={b} label={b} selected={profile.brand === b} onSelect={() => setBrand(b)} />)}
              </div>
            </div>

            {/* Row 2 — Categoría */}
            <div style={{ marginBottom: 22 }}>
              <FieldLabel>Categoría favorita</FieldLabel>
              <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
                {DISPLAY_CATEGORIES.map(c => <SingleChip key={c} label={c} selected={profile.category === c} onSelect={() => setCategory(c)} />)}
              </div>
            </div>

            {/* Row 3 — Talla */}
            <div style={{ marginBottom: 22 }}>
              <FieldLabel>Tu talla</FieldLabel>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {DISPLAY_SIZES.map(s => <MultiChip key={s} label={s} selected={profile.sizes.includes(s)} onToggle={() => toggleSize(s)} />)}
              </div>
              <Helper>Puedes elegir más de una</Helper>
            </div>

            {/* Row 4 — Presupuesto */}
            <div style={{ marginBottom: 22 }}>
              <FieldLabel>Presupuesto</FieldLabel>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: C.card, border: `1.5px solid ${budgetError ? C.accent : C.border}`, borderRadius: 12, padding: '10px 12px' }}>
                  <span style={{ fontSize: 13, color: C.mutedLight, fontFamily: T.body, marginRight: 4 }}>$</span>
                  <input
                    type="number"
                    placeholder="Mín."
                    value={profile.minPrice ?? ''}
                    onChange={e => setPriceMin(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: T.body, color: C.dark, width: 0 }}
                    min={0}
                  />
                </div>
                <span style={{ fontSize: 13, color: C.mutedLight, fontFamily: T.body, flexShrink: 0 }}>—</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: C.card, border: `1.5px solid ${budgetError ? C.accent : C.border}`, borderRadius: 12, padding: '10px 12px' }}>
                  <span style={{ fontSize: 13, color: C.mutedLight, fontFamily: T.body, marginRight: 4 }}>$</span>
                  <input
                    type="number"
                    placeholder="Máx."
                    value={profile.maxPrice ?? ''}
                    onChange={e => setPriceMax(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: T.body, color: C.dark, width: 0 }}
                    min={0}
                  />
                </div>
              </div>
              {budgetError
                ? <p style={{ fontSize: 11, color: C.accent, fontFamily: T.body, margin: '6px 0 0', fontWeight: 600 }}>{budgetError}</p>
                : <Helper>Vacío = sin límite</Helper>
              }
            </div>

            {/* Row 5 — Colores (deshabilitados) */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <FieldLabel>Colores</FieldLabel>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.mutedLight, background: C.borderLight, padding: '2px 7px', borderRadius: 6, letterSpacing: '.04em' }}>PRÓXIMAMENTE</span>
              </div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', pointerEvents: 'none', userSelect: 'none' }}>
                {COLORS_LIST.map(c => <DisabledColorChip key={c} label={c} hex={COLOR_HEX[c] ?? '#9CA3AF'} />)}
              </div>
              <Helper>El motor de IA considerará los colores en una próxima actualización.</Helper>
            </div>

            {/* No-results state */}
            {aiState === 'no-results' && (
              <div className="scale-in" style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 6px' }}>No encontramos prendas con ese presupuesto</p>
                <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: '0 0 16px', lineHeight: 1.55 }}>Intenta ampliar el rango de precio o cambiar la categoría.</p>
                <button onClick={() => { setProfile(p => ({ ...p, minPrice: null, maxPrice: null })); setAIState('idle'); }} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: C.dark, color: 'white', fontSize: 13, fontFamily: T.body, fontWeight: 700, cursor: 'pointer' }}>
                  Ampliar presupuesto
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Loading ── */}
        {aiState === 'loading' && (
          <div className="fade-in" style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '32px 0 24px' }}>
              <div style={{ position: 'relative', width: 52, height: 52 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid #F3F4F6', borderTop: `3px solid ${C.accent}`, animation: 'spin .9s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcSparkles size={18} color={C.accent} />
                </div>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>Buscando tu estilo…</p>
              <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>Analizando disponibilidad en tienda y tus compras</p>
            </div>
            {[1, 2, 3].map(i => <ResultSkeleton key={i} />)}
          </div>
        )}

        {/* ── Results ── */}
        {aiState === 'done' && (
          <div className="fade-in" style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{results.length} sugerencias para ti</p>
                <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>Ordenadas por coincidencia con tu estilo</p>
              </div>
              <button onClick={() => setAIState('idle')} style={{ padding: '7px 14px', borderRadius: 100, background: C.borderLight, border: 'none', color: C.muted, fontSize: 12, fontFamily: T.body, fontWeight: 500, cursor: 'pointer' }}>
                Ajustar
              </button>
            </div>

            {results.map(({ product: p, score: s }, i) => (
              <ResultCard
                key={p.id}
                product={p}
                matchScore={s}
                profile={profile}
                isFav={favs.includes(p.id)}
                onToggleFav={() => onToggleFav(p.id)}
                onClick={() => onProductClick(p)}
                onAddToCart={() => onAddToCart(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Saved snackbar ── */}
      {savedToast && (
        <div className="toast-in" style={{ position: 'absolute', bottom: 100, left: 20, right: 20, zIndex: 50, background: C.dark, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#F9FAFB', fontFamily: T.body }}>Preferencias guardadas</span>
        </div>
      )}

      {/* ── Footer CTA (idle + no-results) ── */}
      {isIdle && (
        <div style={{ padding: '12px 20px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
          <button
            onClick={generate}
            disabled={!!budgetError}
            style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: 'none', background: budgetError ? C.borderLight : C.dark, color: budgetError ? C.mutedLight : 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: budgetError ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10, transition: 'all .2s' }}>
            <IcSparkles size={17} color={budgetError ? C.mutedLight : C.accent} />
            Generar recomendaciones
          </button>
          <button onClick={savePrefs} style={{ width: '100%', padding: '12px 0', borderRadius: 16, border: 'none', background: 'transparent', color: C.muted, fontSize: 13, fontFamily: T.body, fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}>
            Guardar preferencias
          </button>
        </div>
      )}

      {/* ── Footer CTA (results) ── */}
      {aiState === 'done' && (
        <div style={{ padding: '12px 20px 28px', background: C.card, borderTop: `1px solid ${C.borderLight}`, flexShrink: 0, display: 'flex', gap: 10 }}>
          <button onClick={() => setAIState('idle')} style={{ flex: 1, padding: '13px 0', borderRadius: 14, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.dark, fontSize: 13, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
            Ajustar estilo
          </button>
          <button onClick={savePrefs} style={{ flex: 1, padding: '13px 0', borderRadius: 14, border: 'none', background: C.dark, color: 'white', fontSize: 13, fontFamily: T.body, fontWeight: 700, cursor: 'pointer' }}>
            Guardar preferencias
          </button>
        </div>
      )}
    </div>
  );
}
