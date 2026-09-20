import { useState, useEffect, useRef } from 'react';
import { PRODUCTS, CATEGORIES, BRANDS_LIST, SIZES_LIST } from './data';
import type { Product } from './types';
import {
  C, T, AppBar, ProductCard, SkeletonProductCard, ErrorState, OfflineState,
  EmptyState, SuccessToast, IcSearch, IcFilter, IcMic, IcMessageCircle,
  IcSparkles, IcHeart, IcStar, Skel, IcGrid,
} from './ui';

interface Props {
  isOffline: boolean;
  favs: number[];
  onToggleFav: (id: number) => void;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  onOpenVoice: () => void;
  onOpenChatbot: () => void;
  toast: string | null;
  onDismissToast: () => void;
}

type LoadState = 'loading' | 'success' | 'error';

interface StyleProfile {
  brand: string;
  category: string;
  sizes: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

const DEFAULT_PROFILE: StyleProfile = { brand: '', category: 'Todos', sizes: [], minPrice: null, maxPrice: null };
const SORT_OPTIONS = ['Relevancia', 'Precio: menor a mayor', 'Precio: mayor a menor', 'Más nuevo', 'Mejor valorado'];
const DISPLAY_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DISPLAY_CATEGORIES = CATEGORIES.filter(c => c !== 'Ofertas');

// Score 0-100; returns -1 if filtered out by budget
function scoreProduct(p: Product, profile: StyleProfile): number {
  if (profile.minPrice !== null && p.price < profile.minPrice) return -1;
  if (profile.maxPrice !== null && p.price > profile.maxPrice) return -1;
  let s = 10; // availability base
  if (profile.category !== 'Todos' && p.category === profile.category) s += 40;
  if (profile.brand && p.brand === profile.brand) s += 25;
  if (profile.sizes.length > 0 && p.sizes.some(sz => profile.sizes.includes(sz))) s += 25;
  return Math.min(100, s);
}

type MatchReason = { label: string; color: string; bg: string };
function matchReasons(p: Product, profile: StyleProfile): MatchReason[] {
  const r: MatchReason[] = [];
  if (profile.category !== 'Todos' && p.category === profile.category)
    r.push({ label: 'Categoría favorita', color: '#1D4ED8', bg: '#EFF6FF' });
  if (profile.brand && p.brand === profile.brand)
    r.push({ label: 'Tu marca', color: '#7C3AED', bg: '#F5F3FF' });
  if (profile.sizes.length > 0 && p.sizes.some(s => profile.sizes.includes(s)))
    r.push({ label: 'Coincide con tu talla', color: '#059669', bg: '#ECFDF5' });
  if (r.length === 0)
    r.push({ label: 'Disponible ahora', color: C.muted, bg: C.borderLight });
  return r.slice(0, 2);
}

// ── Compact chip components ────────────────────────────────────────
const SC = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) => (
  <button onClick={onSelect} style={{ padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: selected ? 600 : 400, background: selected ? C.dark : C.borderLight, color: selected ? 'white' : C.muted, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s' }}>
    {label}
  </button>
);

const MC = ({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} style={{ padding: '6px 12px', borderRadius: 100, border: `1.5px solid ${selected ? C.dark : C.border}`, cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: selected ? 600 : 400, background: selected ? C.dark : 'transparent', color: selected ? 'white' : C.muted, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s' }}>
    {label}
  </button>
);

// ── AI-decorated ProductCard ───────────────────────────────────────
function AIProductCard({ product, score, profile, isFav, onToggleFav, onClick, onAddToCart }: {
  product: Product; score: number; profile: StyleProfile;
  isFav: boolean; onToggleFav: () => void; onClick: () => void; onAddToCart: () => void;
}) {
  const reasons = matchReasons(product, profile);
  return (
    <div className="fade-in" style={{ borderRadius: 16, overflow: 'hidden', background: C.card, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer', position: 'relative' }} onClick={onClick}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', background: C.borderLight }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* AI badge */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ background: 'linear-gradient(130deg,#111827,#1F2937)', color: 'white', fontSize: 9, fontWeight: 700, fontFamily: T.body, padding: '3px 7px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
            <IcSparkles size={9} color={C.accent} /> Para ti
          </span>
        </div>
        <button onClick={e => { e.stopPropagation(); onToggleFav(); }} style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
          <IcHeart size={14} filled={isFav} />
        </button>
        <button onClick={e => { e.stopPropagation(); onAddToCart(); }} style={{ position: 'absolute', bottom: 8, right: 8, background: C.dark, color: 'white', border: 'none', borderRadius: 10, padding: '6px 11px', fontSize: 11, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
          + Añadir
        </button>
      </div>
      {/* Info */}
      <div style={{ padding: '10px 12px 4px' }}>
        <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{product.brand}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 3px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
        {/* Match bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.dark, fontFamily: T.body, whiteSpace: 'nowrap' }}>Coincidencia {score}</span>
          <div style={{ flex: 1, height: 3, background: C.borderLight, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${score}%`, background: score >= 65 ? '#059669' : score >= 40 ? C.accent : C.mutedLight, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${product.price.toFixed(2)}</span>
          <span style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, textDecoration: 'line-through' }}>${product.oldPrice.toFixed(2)}</span>
        </div>
      </div>
      {/* Reason chips */}
      <div style={{ padding: '0 10px 10px', display: 'flex', gap: 4, overflowX: 'auto' }} className="no-scrollbar">
        {reasons.map(r => (
          <span key={r.label} style={{ fontSize: 10, fontWeight: 600, color: r.color, background: r.bg, padding: '2px 7px', borderRadius: 5, whiteSpace: 'nowrap', flexShrink: 0 }}>{r.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function CatalogScreen({ isOffline, favs, onToggleFav, onAddToCart, onProductClick, onOpenVoice, onOpenChatbot, toast, onDismissToast }: Props) {
  const [state, setState] = useState<LoadState>('loading');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortIdx, setSortIdx] = useState(0);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to100' | 'over100'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // ── AI panel state ──
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiProfile, setAIProfile] = useState<StyleProfile>(DEFAULT_PROFILE);
  const [aiGenerating, setAIGenerating] = useState(false);
  const [aiResults, setAIResults] = useState<Array<{ product: Product; score: number }> | null>(null);
  const [budgetError, setBudgetError] = useState('');

  useEffect(() => {
    if (isOffline) return;
    setState('loading');
    const t = setTimeout(() => setState('success'), 1200);
    return () => clearTimeout(t);
  }, [isOffline]);

  // ── AI helpers ──
  const setAIBrand = (b: string) => setAIProfile(p => ({ ...p, brand: p.brand === b ? '' : b }));
  const setAICategory = (c: string) => setAIProfile(p => ({ ...p, category: p.category === c ? 'Todos' : c }));
  const toggleAISize = (s: string) => setAIProfile(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }));

  const validateBudget = (min: number | null, max: number | null) => {
    if (min !== null && max !== null && min > max) setBudgetError('El mínimo no puede superar al máximo');
    else setBudgetError('');
  };
  const setMinPrice = (raw: string) => {
    const v = raw === '' ? null : parseFloat(raw);
    setAIProfile(p => ({ ...p, minPrice: v }));
    validateBudget(v, aiProfile.maxPrice);
  };
  const setMaxPrice = (raw: string) => {
    const v = raw === '' ? null : parseFloat(raw);
    setAIProfile(p => ({ ...p, maxPrice: v }));
    validateBudget(aiProfile.minPrice, v);
  };

  const generateAI = () => {
    if (budgetError) return;
    setAIGenerating(true);
    setTimeout(() => {
      const scored = PRODUCTS
        .map(p => ({ product: p, score: scoreProduct(p, aiProfile) }))
        .filter(x => x.score >= 0)
        .sort((a, b) => b.score - a.score);
      setAIResults(scored);
      setAIGenerating(false);
      setShowAIPanel(false);
    }, 1600);
  };

  const clearAI = () => { setAIResults(null); setAIProfile(DEFAULT_PROFILE); setBudgetError(''); };

  // ── Catalog filtering (non-AI mode) ──
  let results = [...PRODUCTS];
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (activeCategory !== 'Todos') {
    if (activeCategory === 'Ofertas') results = results.filter(p => p.discount >= 25);
    else results = results.filter(p => p.category === activeCategory);
  }
  if (priceRange === 'under50') results = results.filter(p => p.price < 50);
  else if (priceRange === '50to100') results = results.filter(p => p.price >= 50 && p.price <= 100);
  else if (priceRange === 'over100') results = results.filter(p => p.price > 100);

  if (sortIdx === 1) results.sort((a, b) => a.price - b.price);
  else if (sortIdx === 2) results.sort((a, b) => b.price - a.price);
  else if (sortIdx === 3) results = results.filter(p => p.isNew).concat(results.filter(p => !p.isNew));
  else if (sortIdx === 4) results.sort((a, b) => b.rating - a.rating);

  const hasFilters = activeCategory !== 'Todos' || priceRange !== 'all';
  const inAIMode = aiResults !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      {/* ── Header ── */}
      <div style={{ padding: '52px 20px 0', background: C.bg, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h1 className="font-display" style={{ fontSize: 24, color: C.dark, margin: 0 }}>Catálogo</h1>
          {!inAIMode && (
            <button onClick={() => setShowSort(!showSort)} style={{ padding: '7px 12px', borderRadius: 100, background: C.card, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: T.body, fontWeight: 500, color: C.dark, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IcGrid size={13} color={C.muted} />
              {SORT_OPTIONS[sortIdx].split(':')[0]}
            </button>
          )}
          {inAIMode && (
            <button onClick={clearAI} style={{ padding: '7px 14px', borderRadius: 100, background: '#EFF6FF', border: 'none', fontSize: 12, fontFamily: T.body, fontWeight: 600, color: '#1D4ED8', cursor: 'pointer' }}>
              Volver al catálogo
            </button>
          )}
        </div>

        {/* Search row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: C.card, borderRadius: 14, padding: '11px 14px', border: `1px solid ${C.borderLight}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <IcSearch size={16} />
            <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); if (inAIMode) clearAI(); }} placeholder="Buscar productos, marcas..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: T.body, color: C.dark }} />
            {query
              ? <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.mutedLight, lineHeight: 1 }}>✕</button>
              : <button onClick={onOpenVoice} style={{ width: 28, height: 28, borderRadius: '50%', background: C.borderLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <IcMic size={14} color={C.muted} />
                </button>
            }
          </div>
          {!inAIMode && (
            <button onClick={() => setShowFilter(!showFilter)} style={{ width: 44, height: 44, borderRadius: 14, background: hasFilters ? C.dark : C.card, border: `1px solid ${hasFilters ? C.dark : C.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <IcFilter size={18} color={hasFilters ? 'white' : C.dark} />
            </button>
          )}
        </div>

        {/* ✨ AI chip — always visible below search */}
        {!inAIMode && (
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setShowAIPanel(v => !v)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: 700, transition: 'all .15s', background: showAIPanel ? C.dark : 'linear-gradient(130deg,#111827,#1F2937)', color: 'white', boxShadow: showAIPanel ? 'none' : '0 2px 8px rgba(0,0,0,.18)' }}>
              <IcSparkles size={13} color={C.accent} />
              Recomendaciones IA
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5" strokeLinecap="round" style={{ transform: showAIPanel ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}

        {/* AI mode banner */}
        {inAIMode && (
          <div className="fade-in" style={{ background: 'linear-gradient(130deg,#111827,#1F2937)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IcSparkles size={14} color={C.accent} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: T.body }}>
                {aiResults!.length} recomendaciones personalizadas
              </span>
            </div>
            <button onClick={() => setShowAIPanel(true)} style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', fontFamily: T.body, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Ajustar
            </button>
          </div>
        )}

        {/* Sort dropdown */}
        {showSort && (
          <div style={{ position: 'absolute', top: 130, right: 20, zIndex: 40, background: C.card, borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.14)', overflow: 'hidden', minWidth: 200 }}>
            {SORT_OPTIONS.map((opt, i) => (
              <button key={opt} onClick={() => { setSortIdx(i); setShowSort(false); }} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: sortIdx === i ? C.borderLight : 'transparent', fontSize: 13, fontFamily: T.body, fontWeight: sortIdx === i ? 600 : 400, color: sortIdx === i ? C.dark : C.muted, cursor: 'pointer', borderBottom: i < SORT_OPTIONS.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Filter panel */}
        {showFilter && !inAIMode && (
          <div className="scale-in" style={{ background: C.card, borderRadius: 16, padding: '14px 16px', marginBottom: 14, border: `1px solid ${C.borderLight}` }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Categoría</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: T.body, fontWeight: 500, background: activeCategory === cat ? C.dark : C.borderLight, color: activeCategory === cat ? 'white' : C.muted, transition: 'all 0.15s' }}>
                  {cat}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Precio</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ id: 'all', label: 'Todos' }, { id: 'under50', label: 'Hasta $50' }, { id: '50to100', label: '$50–$100' }, { id: 'over100', label: '+$100' }].map(opt => (
                <button key={opt.id} onClick={() => setPriceRange(opt.id as typeof priceRange)} style={{ padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: T.body, fontWeight: 500, background: priceRange === opt.id ? C.accent : C.borderLight, color: priceRange === opt.id ? 'white' : C.muted, transition: 'all 0.15s' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button onClick={() => { setActiveCategory('Todos'); setPriceRange('all'); }} style={{ marginTop: 12, fontSize: 12, fontFamily: T.body, fontWeight: 600, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {state === 'success' && !inAIMode && (
          <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: '0 0 14px' }}>
            {results.length} {results.length === 1 ? 'producto' : 'productos'} encontrados
          </p>
        )}
      </div>

      {/* ── Grid area ── */}
      {isOffline ? (
        <OfflineState onRetry={() => {}} />
      ) : state === 'error' ? (
        <ErrorState onRetry={() => { setState('loading'); setTimeout(() => setState('success'), 1200); }} message="No se pudo cargar el catálogo. Intenta de nuevo." />
      ) : state === 'loading' || aiGenerating ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="no-scrollbar">
          {aiGenerating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 16px' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2.5px solid ${C.borderLight}`, borderTop: `2.5px solid ${C.accent}`, animation: 'spin .8s linear infinite', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Analizando tu estilo y disponibilidad en tienda…</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingBottom: 20 }}>
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonProductCard key={i} />)}
          </div>
        </div>
      ) : inAIMode ? (
        /* AI results grid */
        aiResults!.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', textAlign: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>No encontramos prendas con ese presupuesto</p>
            <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.55 }}>Intenta ampliar el rango de precio o cambiar la categoría.</p>
            <button onClick={() => { setAIProfile(p => ({ ...p, minPrice: null, maxPrice: null })); setShowAIPanel(true); clearAI(); }} style={{ padding: '11px 22px', borderRadius: 14, border: 'none', background: C.dark, color: 'white', fontSize: 13, fontFamily: T.body, fontWeight: 700, cursor: 'pointer' }}>
              Ampliar presupuesto
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }} className="no-scrollbar">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingBottom: 20 }}>
              {aiResults!.map(({ product, score }) => (
                <AIProductCard
                  key={product.id}
                  product={product}
                  score={score}
                  profile={aiProfile}
                  isFav={favs.includes(product.id)}
                  onToggleFav={() => onToggleFav(product.id)}
                  onClick={() => onProductClick(product)}
                  onAddToCart={() => onAddToCart(product)}
                />
              ))}
            </div>
          </div>
        )
      ) : results.length === 0 ? (
        <EmptyState
          icon={<IcSearch size={28} color={C.mutedLight} />}
          title="Sin resultados"
          subtitle={query ? `No encontramos "${query}". Prueba con otro término o limpia los filtros.` : 'No hay productos para los filtros seleccionados.'}
          cta="Limpiar búsqueda"
          onCta={() => { setQuery(''); setActiveCategory('Todos'); setPriceRange('all'); }}
        />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="no-scrollbar">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingBottom: 20 }}>
            {results.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => onAddToCart(p)} isFav={favs.includes(p.id)} onToggleFav={() => onToggleFav(p.id)} />
            ))}
          </div>
        </div>
      )}

      {toast && <SuccessToast message={toast} onDismiss={onDismissToast} />}
      {(showSort || showFilter) && <div onClick={() => { setShowSort(false); setShowFilter(false); }} style={{ position: 'absolute', inset: 0, zIndex: 30 }} />}

      {/* FAB — Chatbot */}
      <button onClick={onOpenChatbot} style={{ position: 'absolute', bottom: 20, right: 20, width: 52, height: 52, borderRadius: '50%', background: C.dark, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.28)', zIndex: showAIPanel ? 0 : 30 }}>
        <IcMessageCircle size={22} color="white" />
      </button>

      {/* ── AI Panel BottomSheet ── */}
      {showAIPanel && (
        <>
          {/* Backdrop */}
          <div onClick={() => setShowAIPanel(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 40 }} />

          {/* Sheet */}
          <div className="slide-up" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.card, borderRadius: '22px 22px 0 0', zIndex: 50, maxHeight: '82%', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px rgba(0,0,0,.18)' }}>
            {/* Handle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px 0' }}>
              <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, marginBottom: 14 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <IcSparkles size={17} color={C.accent} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body }}>Tu estilo</span>
                </div>
                <button onClick={() => setShowAIPanel(false)} style={{ width: 28, height: 28, borderRadius: '50%', background: C.borderLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body, margin: '0 0 14px', alignSelf: 'flex-start' }}>
                Cuéntanos tu estilo y personalizamos tus sugerencias
              </p>
            </div>

            {/* Form */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="no-scrollbar">

              {/* Marca */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Marca favorita</p>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="no-scrollbar">
                  <SC label="Todas" selected={!aiProfile.brand} onSelect={() => setAIProfile(p => ({ ...p, brand: '' }))} />
                  {BRANDS_LIST.map(b => <SC key={b} label={b} selected={aiProfile.brand === b} onSelect={() => setAIBrand(b)} />)}
                </div>
              </div>

              {/* Categoría */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Categoría</p>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="no-scrollbar">
                  {DISPLAY_CATEGORIES.map(c => <SC key={c} label={c} selected={aiProfile.category === c} onSelect={() => setAICategory(c)} />)}
                </div>
              </div>

              {/* Talla */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Tu talla</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {DISPLAY_SIZES.map(s => <MC key={s} label={s} selected={aiProfile.sizes.includes(s)} onToggle={() => toggleAISize(s)} />)}
                </div>
              </div>

              {/* Presupuesto */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Presupuesto</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: C.bg, border: `1.5px solid ${budgetError ? C.accent : C.border}`, borderRadius: 11, padding: '9px 11px' }}>
                    <span style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body, marginRight: 3 }}>$</span>
                    <input type="number" placeholder="Mín." value={aiProfile.minPrice ?? ''} onChange={e => setMinPrice(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: T.body, color: C.dark, width: 0 }} min={0} />
                  </div>
                  <span style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body }}>—</span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: C.bg, border: `1.5px solid ${budgetError ? C.accent : C.border}`, borderRadius: 11, padding: '9px 11px' }}>
                    <span style={{ fontSize: 12, color: C.mutedLight, fontFamily: T.body, marginRight: 3 }}>$</span>
                    <input type="number" placeholder="Máx." value={aiProfile.maxPrice ?? ''} onChange={e => setMaxPrice(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: T.body, color: C.dark, width: 0 }} min={0} />
                  </div>
                </div>
                {budgetError
                  ? <p style={{ fontSize: 11, color: C.accent, fontFamily: T.body, margin: '5px 0 0', fontWeight: 600 }}>{budgetError}</p>
                  : <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '5px 0 0' }}>Vacío = sin límite</p>
                }
              </div>
            </div>

            {/* Footer CTA */}
            <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${C.borderLight}` }}>
              <button
                onClick={generateAI}
                disabled={!!budgetError}
                style={{ width: '100%', padding: '15px 0', borderRadius: 15, border: 'none', background: budgetError ? C.borderLight : 'linear-gradient(130deg,#111827,#1F2937)', color: budgetError ? C.mutedLight : 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: budgetError ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .2s' }}>
                <IcSparkles size={17} color={budgetError ? C.mutedLight : C.accent} />
                Generar recomendaciones
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
