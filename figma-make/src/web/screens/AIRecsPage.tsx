import { useState } from 'react';
import { C } from '../../ui';
import { PRODUCTS } from '../../data';
import type { Product } from '../../types';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const BRANDS = ['Todas las marcas', 'Massimo', 'Zara Studio', 'COS', 'Nike', 'Levis'];
const CATS = ['Todas', 'Mujer', 'Hombre', 'Calzado', 'Accesorios'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface StyleProfile { brand: string; category: string; sizes: string[]; minPrice: number | null; maxPrice: number | null; }

function score(p: Product, profile: StyleProfile): number {
  let s = 0;
  if (profile.category !== 'Todas' && p.category === profile.category) s += 40;
  if (profile.brand !== 'Todas las marcas' && p.brand === profile.brand) s += 25;
  if (profile.sizes.length > 0 && p.sizes.some(sz => profile.sizes.includes(sz))) s += 25;
  s += 10;
  if (profile.minPrice !== null && p.price < profile.minPrice) return -1;
  if (profile.maxPrice !== null && p.price > profile.maxPrice) return -1;
  return Math.min(s, 100);
}

function reasons(p: Product, profile: StyleProfile): string[] {
  const r: string[] = [];
  if (profile.category !== 'Todas' && p.category === profile.category) r.push(`Categoría ${p.category}`);
  if (profile.brand !== 'Todas las marcas' && p.brand === profile.brand) r.push(`Marca ${p.brand}`);
  if (profile.sizes.some(s => p.sizes.includes(s))) r.push('Tu talla disponible');
  if (p.discount >= 25) r.push(`${p.discount}% descuento`);
  if (p.isFeatured) r.push('Destacado');
  return r;
}

interface Props { onProductClick: (id: number) => void; onAddToCart: (p: Product) => void; favs: number[]; onToggleFav: (id: number) => void; }

export default function AIRecsPage({ onProductClick, onAddToCart, favs, onToggleFav }: Props) {
  const [profile, setProfile] = useState<StyleProfile>({ brand: 'Todas las marcas', category: 'Todas', sizes: [], minPrice: null, maxPrice: null });
  const [results, setResults] = useState<(Product & { score: number; reasons: string[] })[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [addedId, setAddedId] = useState<number | null>(null);

  const toggleSize = (s: string) => {
    setProfile(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }));
  };

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{ padding: '6px 14px', borderRadius: 100, border: `1.5px solid ${active ? C.dark : C.border}`, background: active ? C.dark : 'white', color: active ? 'white' : C.muted, fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: T.body, cursor: 'pointer', transition: 'all .12s' }}>
      {label}
    </button>
  );

  const generate = () => {
    const min = minInput ? Number(minInput) : null;
    const max = maxInput ? Number(maxInput) : null;
    if (min !== null && max !== null && min > max) { setBudgetError('El precio mínimo no puede ser mayor al máximo'); return; }
    setBudgetError('');
    const p2 = { ...profile, minPrice: min, maxPrice: max };
    setLoading(true);
    setTimeout(() => {
      const scored = PRODUCTS
        .map(p => ({ ...p, score: score(p, p2), reasons: reasons(p, p2) }))
        .filter(p => p.score >= 0)
        .sort((a, b) => b.score - a.score);
      setResults(scored);
      setLoading(false);
    }, 1200);
  };

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, flex: 1, alignItems: 'start' }}>
      {/* Preferences panel */}
      <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, position: 'sticky', top: 96 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
          </div>
          <div>
            <h3 style={{ fontFamily: T.display, fontSize: 18, color: C.dark, margin: 0 }}>Tu estilo</h3>
            <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>Configurar preferencias</p>
          </div>
        </div>

        {/* Brand */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px', fontFamily: T.body }}>Marca</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {BRANDS.map(b => <Chip key={b} label={b} active={profile.brand === b} onClick={() => setProfile(p => ({ ...p, brand: b }))} />)}
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px', fontFamily: T.body }}>Categoría</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATS.map(c => <Chip key={c} label={c} active={profile.category === c} onClick={() => setProfile(p => ({ ...p, category: c }))} />)}
          </div>
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px', fontFamily: T.body }}>Tallas</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SIZES.map(s => <Chip key={s} label={s} active={profile.sizes.includes(s)} onClick={() => toggleSize(s)} />)}
          </div>
        </div>

        {/* Budget */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px', fontFamily: T.body }}>Presupuesto</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={minInput} onChange={e => setMinInput(e.target.value)} placeholder="Mín $" type="number" style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${budgetError ? C.accent : C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body }} />
            <span style={{ color: C.mutedLight, fontSize: 13 }}>—</span>
            <input value={maxInput} onChange={e => setMaxInput(e.target.value)} placeholder="Máx $" type="number" style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${budgetError ? C.accent : C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body }} />
          </div>
          {budgetError && <p style={{ fontSize: 11, color: C.accent, margin: '6px 0 0', fontFamily: T.body }}>{budgetError}</p>}
        </div>

        {/* Colors — disabled, coming soon */}
        <div style={{ marginBottom: 24, opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: 0, fontFamily: T.body }}>Colores</p>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', background: C.accent, color: 'white', padding: '2px 6px', borderRadius: 4 }}>PRÓXIMAMENTE</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#111827', '#E05A47', '#D4C5A9', '#6B7280', '#F8F9FA'].map(h => (
              <div key={h} style={{ width: 28, height: 28, borderRadius: '50%', background: h, boxShadow: h === '#F8F9FA' ? `0 0 0 1px ${C.border}` : 'none' }} />
            ))}
          </div>
        </div>

        <button onClick={generate} style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
          ✨ Generar recomendaciones
        </button>
      </div>

      {/* Results */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Recomendaciones IA</h2>
          <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: 0 }}>
            {results === null ? 'Configura tus preferencias y genera recomendaciones personalizadas' : `${results.length} productos seleccionados para ti`}
          </p>
        </div>

        {results === null && !loading && (
          <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, background: 'white', borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${C.accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>Sin recomendaciones aún</p>
              <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Selecciona tus preferencias en el panel izquierdo y genera resultados personalizados</p>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.borderLight}`, overflow: 'hidden' }}>
                <div style={{ height: 200, background: C.bg }} className="skeleton" />
                <div style={{ padding: 14 }}>
                  <div className="skeleton" style={{ height: 10, width: '60%', borderRadius: 4, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '85%', borderRadius: 4, marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 36, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {results !== null && !loading && (
          results.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', background: 'white', borderRadius: 16, border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>Sin resultados</p>
              <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 16px' }}>El presupuesto o categoría seleccionados no tienen productos disponibles</p>
              <button onClick={() => { setMinInput(''); setMaxInput(''); setProfile(p => ({ ...p, minPrice: null, maxPrice: null })); }} style={{ padding: '10px 20px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.dark, fontSize: 13, fontFamily: T.body, cursor: 'pointer' }}>
                Ampliar presupuesto
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {results.map(p => {
                const barColor = p.score >= 65 ? C.success : p.score >= 40 ? C.accent : C.mutedLight;
                return (
                  <div key={p.id} onClick={() => onProductClick(p.id)} style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .15s' }}>
                    <div style={{ position: 'relative', height: 200, background: C.bg }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: T.body }}>
                        ✨ Para ti
                      </div>
                      <button onClick={e => { e.stopPropagation(); onToggleFav(p.id); }} style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={favs.includes(p.id) ? C.accent : 'none'} stroke={favs.includes(p.id) ? C.accent : C.muted} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div style={{ padding: 14 }}>
                      <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{p.brand}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: '0 0 8px', fontFamily: T.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      {/* Match score */}
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>Coincidencia</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: barColor, fontFamily: T.body }}>{p.score}%</span>
                        </div>
                        <div style={{ height: 4, background: C.bg, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.score}%`, background: barColor, borderRadius: 2, transition: 'width .3s' }} />
                        </div>
                      </div>
                      {/* Reason chips */}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                        {p.reasons.slice(0, 3).map(r => (
                          <span key={r} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: C.bg, color: C.muted, fontFamily: T.body }}>{r}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</span>
                        <button onClick={e => handleAdd(p, e)} style={{ padding: '7px 14px', borderRadius: 8, background: addedId === p.id ? '#ECFDF5' : C.dark, color: addedId === p.id ? C.success : 'white', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: T.body }}>
                          {addedId === p.id ? '✓ Añadido' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
