import { C } from '../../ui';
import { PRODUCTS } from '../../data';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const PROMOS = [
  { id: 'fall', title: 'Otoño · Invierno 2026', subtitle: 'Hasta 40% OFF', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&auto=format', color: '#111827', ends: '30 Sep 2026', code: 'OTOÑO40' },
  { id: 'shoes', title: 'Semana del Calzado', subtitle: '30% en toda la línea', image: 'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=800&h=400&fit=crop&auto=format', color: '#E05A47', ends: '22 Sep 2026', code: 'CALZADO30' },
  { id: 'men', title: 'Moda Masculina', subtitle: 'Nuevos arrivals + 25% OFF', image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&h=400&fit=crop&auto=format', color: '#374151', ends: '28 Sep 2026', code: 'HOMBRE25' },
];

export default function PromotionsPage({ onProductClick }: { onProductClick: (id: number) => void }) {
  const saleProducts = PRODUCTS.filter(p => p.discount >= 25).slice(0, 8);

  return (
    <div>
      <h2 style={{ fontFamily: T.display, fontSize: 32, color: C.dark, margin: '0 0 8px' }}>Promociones activas</h2>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, margin: '0 0 28px' }}>Descuentos exclusivos disponibles hasta agotar stock</p>

      {/* Hero banners */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 40 }}>
        {PROMOS.map((promo, i) => (
          <div key={promo.id} style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: i === 0 ? 280 : 130, cursor: 'pointer' }}>
            <img src={promo.image} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${promo.color}CC, transparent 60%)` }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
              <p className="font-display" style={{ fontFamily: T.display, fontSize: i === 0 ? 22 : 16, color: 'white', margin: '0 0 4px', lineHeight: 1.2 }}>{promo.title}</p>
              <p style={{ fontSize: i === 0 ? 14 : 12, color: 'rgba(255,255,255,.8)', fontFamily: T.body, margin: '0 0 8px' }}>{promo.subtitle}</p>
              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', color: 'white', padding: '3px 10px', borderRadius: 20, fontFamily: T.body }}>CÓDIGO: {promo.code}</span>
              </div>
            </div>
            <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 600, color: 'white', background: 'rgba(0,0,0,.3)', padding: '3px 8px', borderRadius: 20, fontFamily: T.body }}>Hasta {promo.ends}</span>
          </div>
        ))}
      </div>

      {/* Products on sale */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: T.display, fontSize: 24, color: C.dark, margin: 0 }}>Productos en oferta</h3>
        <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{saleProducts.length} productos disponibles</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {saleProducts.map(p => (
          <div key={p.id} onClick={() => onProductClick(p.id)} style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.borderLight}`, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'relative', height: 200, background: C.bg }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 10, left: 10, background: C.accent, color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, fontFamily: T.body }}>-{p.discount}%</span>
            </div>
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{p.brand}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: '0 0 8px', fontFamily: T.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${p.price.toFixed(2)}</span>
                <span style={{ fontSize: 12, color: C.mutedLight, textDecoration: 'line-through', fontFamily: T.body }}>${p.oldPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
