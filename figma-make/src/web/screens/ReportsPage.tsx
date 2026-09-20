import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };
const Mn = { body: "'JetBrains Mono', monospace" as const };

type ReportTab = 'sales' | 'inventory' | 'analytics';

const SALES_DATA = [
  { month: 'Abr', total: 78000, units: 842, returns: 12, avg: 92.6 },
  { month: 'May', total: 92000, units: 980, returns: 18, avg: 93.9 },
  { month: 'Jun', total: 88000, units: 920, returns: 15, avg: 95.7 },
  { month: 'Jul', total: 115000, units: 1100, returns: 21, avg: 104.5 },
  { month: 'Ago', total: 128000, units: 1240, returns: 25, avg: 103.2 },
  { month: 'Sep', total: 142850, units: 1284, returns: 37, avg: 111.3 },
];

const CATEGORY_DATA = [
  { cat: 'Mujer', value: 54, color: '#6366F1' },
  { cat: 'Hombre', value: 22, color: C.dark },
  { cat: 'Calzado', value: 18, color: C.accent },
  { cat: 'Accesorios', value: 6, color: C.mutedLight },
];

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('sales');
  const [period, setPeriod] = useState('2026-Q3');

  const maxSales = Math.max(...SALES_DATA.map(d => d.total));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Informes</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>Análisis de rendimiento Q3 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, background: 'white' }}>
            <option value="2026-Q3">Q3 2026</option>
            <option value="2026-Q2">Q2 2026</option>
            <option value="2026-Q1">Q1 2026</option>
          </select>
          <button style={{ padding: '9px 18px', borderRadius: 10, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `2px solid ${C.border}` }}>
        {([['sales', 'Ventas'], ['inventory', 'Inventario'], ['analytics', 'Analytics IA']] as [ReportTab, string][]).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '10px 24px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: T.body, color: tab === v ? C.dark : C.muted, borderBottom: `2px solid ${tab === v ? C.dark : 'transparent'}`, marginBottom: -2 }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'sales' && (
        <div>
          {/* Summary row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { l: 'Ingresos totales', v: '$643,850', sub: '+18.4% vs Q2', ok: true },
              { l: 'Unidades vendidas', v: '6,366', sub: '+14.2% vs Q2', ok: true },
              { l: 'Ticket promedio', v: '$101.2', sub: '+3.6% vs Q2', ok: true },
              { l: 'Devoluciones', v: '128', sub: '-4.2% vs Q2', ok: false },
            ].map(m => (
              <div key={m.l} style={{ background: 'white', borderRadius: 14, border: `1px solid ${C.border}`, padding: 18 }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: C.dark, fontFamily: Mn.body, margin: '0 0 4px' }}>{m.v}</p>
                <p style={{ fontSize: 12, color: C.dark, fontFamily: T.body, margin: '0 0 4px', fontWeight: 600 }}>{m.l}</p>
                <p style={{ fontSize: 11, color: m.ok ? C.success : C.accent, fontFamily: T.body, margin: 0, fontWeight: 700 }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 24px' }}>Evolución de ventas</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, padding: '0 8px' }}>
              {SALES_DATA.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: Mn.body, color: C.muted }}>${(d.total / 1000).toFixed(0)}K</span>
                  <div style={{ width: '100%', position: 'relative', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ borderRadius: '6px 6px 0 0', background: d.month === 'Sep' ? C.dark : '#E5E7EB', height: `${(d.total / maxSales) * 100}%`, transition: 'height .3s' }} />
                  </div>
                  <span style={{ fontSize: 12, fontFamily: T.body, color: d.month === 'Sep' ? C.dark : C.muted, fontWeight: d.month === 'Sep' ? 700 : 400 }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 80px 120px', gap: 0, padding: '12px 24px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {['Mes', 'Ingresos', 'Unidades', 'Devol.', 'Ticket prom.'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
              ))}
            </div>
            {SALES_DATA.map((d, i) => (
              <div key={d.month} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 80px 120px', gap: 0, padding: '14px 24px', alignItems: 'center', borderBottom: i < SALES_DATA.length - 1 ? `1px solid ${C.borderLight}` : 'none', background: d.month === 'Sep' ? '#F9FAFB' : 'white' }}>
                <span style={{ fontSize: 13, fontWeight: d.month === 'Sep' ? 700 : 400, color: C.dark, fontFamily: T.body }}>{d.month} 2026</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: Mn.body, color: C.dark }}>${d.total.toLocaleString()}</span>
                <span style={{ fontSize: 13, fontFamily: Mn.body, color: C.dark }}>{d.units.toLocaleString()}</span>
                <span style={{ fontSize: 13, fontFamily: Mn.body, color: C.muted }}>{d.returns}</span>
                <span style={{ fontSize: 13, fontFamily: Mn.body, color: C.dark }}>${d.avg.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 20px' }}>Distribución por categoría</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CATEGORY_DATA.map(c => (
                <div key={c.cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{c.cat}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: Mn.body }}>{c.value}%</span>
                  </div>
                  <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.value}%`, background: c.color, borderRadius: 4, transition: 'width .4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
            <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: '0 0 20px' }}>Rotación de inventario</h3>
            {[
              { store: 'Sucursal Centro', ratio: 3.2, trend: '+12%', ok: true },
              { store: 'Sucursal Norte', ratio: 2.8, trend: '+5%', ok: true },
              { store: 'Sucursal Sur', ratio: 4.1, trend: '-2%', ok: false },
            ].map(s => (
              <div key={s.store} style={{ padding: '14px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{s.store}</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: Mn.body, color: C.dark }}>{s.ratio}x</span>
                    <span style={{ fontSize: 11, color: s.ok ? C.success : C.accent, fontWeight: 700 }}>{s.trend}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(s.ratio / 5) * 100}%`, background: s.ratio > 3 ? C.success : C.warning, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              </div>
              <div>
                <h3 style={{ fontFamily: T.display, fontSize: 20, color: C.dark, margin: 0 }}>Análisis predictivo IA</h3>
                <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0 }}>Generado · 20 Sep 2026 · 09:00 hs</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { title: 'Predicción Q4 2026', desc: 'Las ventas proyectadas para Q4 muestran un incremento del 22% respecto a Q3, impulsado por la temporada de fin de año y el lanzamiento de la colección Navidad.', metric: '+22%', color: C.success },
                { title: 'Productos con mayor demanda', desc: 'Sneakers Clásicas y Blazer Estructurado muestran tendencia de aumento. Se recomienda incrementar el stock en 40% para noviembre.', metric: '↑ 2 SKUs', color: '#6366F1' },
                { title: 'Riesgo de ruptura de stock', desc: 'Hay 3 productos con probabilidad >85% de agotarse antes del 15 de octubre. Iniciar proceso de reabastecimiento esta semana.', metric: '3 SKUs', color: C.accent },
              ].map(i => (
                <div key={i.title} style={{ padding: 18, borderRadius: 14, border: `1px solid ${C.border}`, background: C.bg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body }}>{i.title}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: i.color, fontFamily: Mn.body }}>{i.metric}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.6 }}>{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
