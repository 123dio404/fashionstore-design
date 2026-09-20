import { useState, useMemo } from 'react';
import { C } from '../../ui';
import { PRODUCTS } from '../../data';
import type { Product } from '../../types';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const BRANDS = ['Todas las marcas', 'Massimo', 'Zara Studio', 'COS', 'Nike', 'Levis'];
const CATS = ['Todas', 'Mujer', 'Hombre', 'Calzado', 'Accesorios'];
const SORTS = [{ v: 'relevant', l: 'Más relevantes' }, { v: 'price-asc', l: 'Precio: menor a mayor' }, { v: 'price-desc', l: 'Precio: mayor a menor' }, { v: 'rating', l: 'Mejor valorados' }, { v: 'new', l: 'Más recientes' }];

interface Props {
  favs: number[]; onToggleFav: (id: number) => void;
  onProductClick: (id: number) => void;
  onAddToCart: (p: Product) => void;
  toast: string | null;
}

export default function CatalogPage({ favs, onToggleFav, onProductClick, onAddToCart, toast }: Props) {
  const [cat, setCat] = useState('Todas');
  const [brand, setBrand] = useState('Todas las marcas');
  const [sort, setSort] = useState('relevant');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [onSale, setOnSale] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      if (cat !== 'Todas' && p.category !== cat) return false;
      if (brand !== 'Todas las marcas' && p.brand !== brand) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (onSale && p.discount < 20) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, brand, sort, minPrice, maxPrice, search, onSale]);

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <div style={{ display: 'flex', gap: 24, flex: 1 }}>
      {/* Filter sidebar */}
      <aside style={{ width: 224, flexShrink: 0 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, position: 'sticky', top: 96 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>Filtros</span>
            <button onClick={() => { setCat('Todas'); setBrand('Todas las marcas'); setMinPrice(''); setMaxPrice(''); setOnSale(false); }} style={{ fontSize: 12, color: C.accent, border: 'none', background: 'none', cursor: 'pointer', fontFamily: T.body }}>Limpiar</button>
          </div>

          {/* Search in filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, borderRadius: 10, padding: '8px 12px', border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: T.body, color: C.dark, width: '100%' }} />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Categoría</p>
            {CATS.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer' }}>
                <input type="radio" name="cat" checked={cat === c} onChange={() => setCat(c)} style={{ accentColor: C.dark }} />
                <span style={{ fontSize: 13, color: cat === c ? C.dark : C.muted, fontWeight: cat === c ? 600 : 400, fontFamily: T.body }}>{c}</span>
              </label>
            ))}
          </div>

          {/* Brand */}
          <div style={{ marginBottom: 20, paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Marca</p>
            {BRANDS.map(b => (
              <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer' }}>
                <input type="radio" name="brand" checked={brand === b} onChange={() => setBrand(b)} style={{ accentColor: C.dark }} />
                <span style={{ fontSize: 13, color: brand === b ? C.dark : C.muted, fontWeight: brand === b ? 600 : 400, fontFamily: T.body }}>{b}</span>
              </label>
            ))}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 20, paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Precio</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Mín" type="number" style={{ width: '50%', padding: '8px 10px', borderRadius: 8, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 12, fontFamily: T.body, boxSizing: 'border-box' }} />
              <span style={{ color: C.mutedLight, fontSize: 12 }}>–</span>
              <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Máx" type="number" style={{ width: '50%', padding: '8px 10px', borderRadius: 8, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 12, fontFamily: T.body, boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* On sale */}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={onSale} onChange={e => setOnSale(e.target.checked)} style={{ accentColor: C.accent, width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: C.dark, fontFamily: T.body }}>Solo en oferta</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Product grid */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: T.display, fontSize: 26, color: C.dark, margin: '0 0 2px' }}>Catálogo</h2>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{filtered.length} productos encontrados</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, background: 'white', cursor: 'pointer', color: C.dark }}>
              {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
            <div style={{ display: 'flex', borderRadius: 10, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding: '8px 12px', background: view === v ? C.dark : 'white', border: 'none', cursor: 'pointer', color: view === v ? 'white' : C.muted }}>
                  {v === 'grid'
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  }
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.bg, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: C.dark, margin: '0 0 4px', fontFamily: T.body }}>Sin resultados</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Prueba con otros filtros</p>
            </div>
            <button onClick={() => { setCat('Todas'); setBrand('Todas las marcas'); setSearch(''); setOnSale(false); }} style={{ padding: '10px 20px', borderRadius: 10, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: T.body }}>
              Limpiar filtros
            </button>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} isFav={favs.includes(p.id)} onToggleFav={() => onToggleFav(p.id)} onClick={() => onProductClick(p.id)} onAdd={e => handleAdd(p, e)} added={addedId === p.id} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(p => (
              <ProductRow key={p.id} product={p} isFav={favs.includes(p.id)} onToggleFav={() => onToggleFav(p.id)} onClick={() => onProductClick(p.id)} onAdd={e => handleAdd(p, e)} added={addedId === p.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product: p, isFav, onToggleFav, onClick, onAdd, added }: {
  product: Product; isFav: boolean; onToggleFav: () => void;
  onClick: () => void; onAdd: (e: React.MouseEvent) => void; added: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'white', borderRadius: 16, border: `1px solid ${hover ? C.border : C.borderLight}`, overflow: 'hidden', cursor: 'pointer', transition: 'all .18s', boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)', transform: hover ? 'translateY(-2px)' : 'none' }}>
      <div style={{ position: 'relative', height: 220, background: C.bg }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: 10, left: 10, background: C.accent, color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: T.body }}>-{p.discount}%</span>
        {p.isNew && <span style={{ position: 'absolute', top: 10, left: 52, background: C.dark, color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: T.body }}>NUEVO</span>}
        <button onClick={e => { e.stopPropagation(); onToggleFav(); }} style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? C.accent : 'none'} stroke={isFav ? C.accent : C.muted} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div style={{ padding: '14px 14px 12px' }}>
        <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.07em' }}>{p.brand}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 8px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</span>
            <span style={{ fontSize: 11, color: C.mutedLight, textDecoration: 'line-through', marginLeft: 6, fontFamily: T.body }}>${p.oldPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{p.rating}</span>
          </div>
        </div>
        <button onClick={onAdd} style={{ width: '100%', marginTop: 10, padding: '9px 0', borderRadius: 10, border: 'none', background: added ? '#ECFDF5' : C.bg, color: added ? '#059669' : C.dark, fontSize: 12, fontWeight: 600, fontFamily: T.body, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all .15s' }}>
          {added ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Añadido</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Al carrito</>
          )}
        </button>
      </div>
    </div>
  );
}

function ProductRow({ product: p, isFav, onToggleFav, onClick, onAdd, added }: {
  product: Product; isFav: boolean; onToggleFav: () => void;
  onClick: () => void; onAdd: (e: React.MouseEvent) => void; added: boolean;
}) {
  return (
    <div onClick={onClick} style={{ background: 'white', borderRadius: 14, border: `1px solid ${C.borderLight}`, display: 'flex', gap: 16, padding: 16, cursor: 'pointer', alignItems: 'center' }}>
      <div style={{ width: 80, height: 100, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: C.bg }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: T.body }}>{p.brand} · {p.category}</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.dark, margin: '0 0 6px', fontFamily: T.body }}>{p.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
          <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{p.rating} ({p.reviews} reseñas)</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</div>
          <div style={{ fontSize: 12, color: C.mutedLight, textDecoration: 'line-through', fontFamily: T.body }}>${p.oldPrice.toFixed(2)}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={e => { e.stopPropagation(); onToggleFav(); }} style={{ padding: '8px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? C.accent : 'none'} stroke={isFav ? C.accent : C.muted} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button onClick={onAdd} style={{ padding: '8px 16px', borderRadius: 8, background: added ? '#ECFDF5' : C.dark, color: added ? '#059669' : 'white', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: T.body }}>
            {added ? '✓ Añadido' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
