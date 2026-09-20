import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };
const Mn = { body: "'JetBrains Mono', monospace" as const };

const KPIs = [
  { label: 'Ventas del mes', value: '$142,850', change: '+18.4%', up: true, icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', color: '#6366F1' },
  { label: 'Órdenes', value: '1,284', change: '+12.1%', up: true, icon: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', color: C.success },
  { label: 'Clientes activos', value: '4,872', change: '+6.3%', up: true, icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', color: C.accent },
  { label: 'Devoluciones', value: '37', change: '-4.2%', up: false, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', color: C.warning },
];

const MONTHLY_DATA = [
  { month: 'Abr', sales: 78000, orders: 842 },
  { month: 'May', sales: 92000, orders: 980 },
  { month: 'Jun', sales: 88000, orders: 920 },
  { month: 'Jul', sales: 115000, orders: 1100 },
  { month: 'Ago', sales: 128000, orders: 1240 },
  { month: 'Sep', sales: 142850, orders: 1284 },
];

const TOP_PRODUCTS = [
  { name: 'Sneakers Clásicas · Nike', sales: 349, revenue: '$27,918', trend: '+24%', img: 'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=60&h=60&fit=crop&auto=format' },
  { name: 'Blazer Estructurado · Massimo', sales: 211, revenue: '$23,632', trend: '+15%', img: 'https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=60&h=60&fit=crop&auto=format' },
  { name: 'Blazer Oversize · Massimo', sales: 128, revenue: '$11,519', trend: '+8%', img: 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=60&h=60&fit=crop&auto=format' },
  { name: 'Chaqueta Denim · Levis', sales: 156, revenue: '$14,820', trend: '+12%', img: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=60&h=60&fit=crop&auto=format' },
  { name: 'Vestido Midi Fluido · Zara', sales: 87, revenue: '$5,873', trend: '-3%', img: 'https://images.unsplash.com/photo-1664076458686-3449062080ac?w=60&h=60&fit=crop&auto=format' },
];

const ACTIVITY = [
  { text: 'Nueva orden #ORD-2026-1284 por $367.50', time: 'Hace 3 min', type: 'order' },
  { text: 'Stock bajo: Blazer Oversize M (2 unid.) · Sucursal Norte', time: 'Hace 15 min', type: 'warning' },
  { text: 'Ana García se registró como nueva cliente', time: 'Hace 28 min', type: 'user' },
  { text: 'Reabastecimiento de Sneakers Clásicas completado', time: 'Hace 1 hora', type: 'success' },
  { text: 'Informe mensual de Agosto generado', time: 'Hace 2 horas', type: 'info' },
];

function BarChart({ data }: { data: typeof MONTHLY_DATA }) {
  const max = Math.max(...data.map(d => d.sales));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, padding: '0 4px' }}>
      {data.map(d => (
        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontFamily: Mn.body, color: C.muted }}>${(d.sales / 1000).toFixed(0)}K</span>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 100 }}>
            <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: d.month === 'Sep' ? C.dark : `${C.dark}30`, height: `${(d.sales / max) * 100}%`, transition: 'height .3s ease', minHeight: 8 }} />
          </div>
          <span style={{ fontSize: 11, fontFamily: T.body, color: d.month === 'Sep' ? C.dark : C.muted, fontWeight: d.month === 'Sep' ? 700 : 400 }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 30, color: C.dark, margin: '0 0 4px' }}>Panel de Control</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Semana del 14–20 Sep 2026</p>
        </div>
        <div style={{ display: 'flex', borderRadius: 10, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
          {(['7d', '30d', '90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '8px 16px', border: 'none', background: period === p ? C.dark : 'white', color: period === p ? 'white' : C.muted, fontSize: 12, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
              {p === '7d' ? '7 días' : p === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {KPIs.map(kpi => (
          <div key={kpi.label} style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={kpi.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={kpi.icon}/></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: kpi.up ? C.success : C.accent, background: kpi.up ? '#ECFDF5' : C.errorBg, padding: '3px 9px', borderRadius: 20, fontFamily: T.body }}>
                {kpi.change}
              </span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: '0 0 4px' }}>{kpi.value}</p>
            <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        {/* Sales chart */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: 0 }}>Ventas mensuales</h3>
            <span style={{ fontSize: 12, color: C.success, fontWeight: 600, fontFamily: T.body }}>↑ Tendencia positiva</span>
          </div>
          <BarChart data={MONTHLY_DATA} />
          <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
            <div><p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 2px' }}>Total semestre</p><p style={{ fontSize: 18, fontWeight: 700, color: C.dark, fontFamily: Mn.body, margin: 0 }}>$643,850</p></div>
            <div><p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 2px' }}>Promedio mensual</p><p style={{ fontSize: 18, fontWeight: 700, color: C.dark, fontFamily: Mn.body, margin: 0 }}>$107,308</p></div>
            <div><p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 2px' }}>Mejor mes</p><p style={{ fontSize: 18, fontWeight: 700, color: C.success, fontFamily: Mn.body, margin: 0 }}>Sep · $142K</p></div>
          </div>
        </div>

        {/* Stock por sucursal */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
          <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 20px' }}>Sucursales</h3>
          {[
            { name: 'Centro', sales: 48, stock: 78, perc: 78 },
            { name: 'Norte', sales: 33, stock: 65, perc: 65 },
            { name: 'Sur', sales: 19, stock: 91, perc: 91 },
          ].map(branch => (
            <div key={branch.name} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{branch.name}</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{branch.sales}% ventas</span>
                  <span style={{ fontSize: 11, color: branch.stock > 70 ? C.success : C.warning, fontFamily: T.body, fontWeight: 600 }}>{branch.stock}% stock</span>
                </div>
              </div>
              <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${branch.perc}%`, background: branch.stock > 70 ? C.success : C.warning, borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ padding: 14, background: C.warningBg, borderRadius: 12, marginTop: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.warning, fontFamily: T.body, margin: '0 0 2px' }}>⚠ Atención</p>
            <p style={{ fontSize: 11, color: C.warning, fontFamily: T.body, margin: 0 }}>3 productos con stock crítico en Sucursal Norte</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Top products */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
          <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 16px' }}>Productos más vendidos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 60px', gap: 0, padding: '8px 12px', background: C.bg, borderRadius: 8, marginBottom: 8 }}>
            {['Producto', 'Unidades', 'Ingresos', 'Tendencia'].map(h => <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: T.body }}>{h}</span>)}
          </div>
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 60px', gap: 0, padding: '12px', alignItems: 'center', borderBottom: i < TOP_PRODUCTS.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 36, height: 44, borderRadius: 8, overflow: 'hidden', background: C.bg }}>
                  <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.dark, fontFamily: T.body }}>{p.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: Mn.body, color: C.dark }}>{p.sales}</span>
              <span style={{ fontSize: 12, fontFamily: Mn.body, color: C.dark }}>{p.revenue}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.trend.startsWith('+') ? C.success : C.accent, fontFamily: T.body }}>{p.trend}</span>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
          <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 16px' }}>Actividad reciente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ACTIVITY.map((a, i) => {
              const iconColor = a.type === 'warning' ? C.warning : a.type === 'success' ? C.success : a.type === 'order' ? '#6366F1' : C.muted;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: iconColor, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: C.dark, fontFamily: T.body, margin: '0 0 2px', lineHeight: 1.5 }}>{a.text}</p>
                    <span style={{ fontSize: 10, color: C.mutedLight, fontFamily: T.body }}>{a.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
