import { useState } from 'react';
import { C } from '../ui';
import type { WebRole, WebScreen } from './WebApp';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const Ic = ({ d, size = 18, color = 'currentColor', fill = 'none', sw = 1.8 }: { d: string | string[]; size?: number; color?: string; fill?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

interface NavItem { id: WebScreen; label: string; icon: string | string[]; }

const customerNav: NavItem[] = [
  { id: 'catalog', label: 'Catálogo', icon: 'M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18' },
  { id: 'ai-recs', label: 'Para ti · IA', icon: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'] },
  { id: 'cart', label: 'Carrito', icon: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0' },
  { id: 'reservations', label: 'Reservas', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { id: 'purchases', label: 'Mis compras', icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
  { id: 'chatbot', label: 'Asistente', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id: 'promotions', label: 'Promociones', icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01' },
];

const adminNav: NavItem[] = [
  { id: 'dashboard', label: 'Panel', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { id: 'catalog-admin', label: 'Catálogo', icon: 'M3 3h18v18H3zM9 3v18M3 9h18' },
  { id: 'inventory', label: 'Inventario', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12' },
  { id: 'users', label: 'Usuarios', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { id: 'suppliers', label: 'Proveedores', icon: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' },
  { id: 'branches', label: 'Sucursales', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  { id: 'promotions-admin', label: 'Promociones', icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01' },
  { id: 'reports', label: 'Informes', icon: 'M18 20V10M12 20V4M6 20v-6' },
  { id: 'parameters', label: 'Parámetros', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
];

const posNav: NavItem[] = [
  { id: 'pos', label: 'Terminal de venta', icon: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 12v.01' },
  { id: 'reservations-admin', label: 'Reservas', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { id: 'inventory', label: 'Consultar stock', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
];

const roleLabels: Record<WebRole, string> = { customer: 'Cliente', admin: 'Administrador', pos: 'Punto de Venta' };
const roleColor: Record<WebRole, string> = { customer: '#6366F1', admin: C.accent, pos: '#059669' };

interface Props {
  role: WebRole; screen: WebScreen;
  onNavigate: (s: WebScreen) => void;
  cartCount: number;
  onSwitchToMobile: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function WebLayout({ role, screen, onNavigate, cartCount, onSwitchToMobile, onLogout, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const nav = role === 'admin' ? adminNav : role === 'pos' ? posNav : customerNav;

  const sidebarW = sidebarOpen ? 240 : 64;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: T.body }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarW, minHeight: '100vh', background: C.dark, display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50, transition: 'width .22s ease', overflow: 'hidden' }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? '24px 20px 20px' : '24px 0 20px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && (
            <div>
              <h1 style={{ fontFamily: T.display, fontSize: 20, color: 'white', margin: 0, letterSpacing: '-0.01em', lineHeight: 1 }}>FashionStore</h1>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>{roleLabels[role]}</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(v => !v)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.6)', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarOpen ? <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></> : <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>}
            </svg>
          </button>
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div style={{ padding: '10px 16px', margin: '12px 12px 4px', borderRadius: 10, background: `${roleColor[role]}22`, border: `1px solid ${roleColor[role]}44` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: roleColor[role] }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: roleColor[role] }}>{roleLabels[role]}</span>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }} className="no-scrollbar">
          {nav.map(item => {
            const active = screen === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)} title={item.label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: sidebarOpen ? '11px 20px' : '11px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: active ? 'rgba(255,255,255,.12)' : 'transparent', border: 'none', cursor: 'pointer', color: active ? 'white' : 'rgba(255,255,255,.55)', transition: 'all .15s', position: 'relative', borderLeft: active ? `3px solid ${C.accent}` : '3px solid transparent', textAlign: 'left' }}>
                <Ic d={item.icon} size={17} color="currentColor" />
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{item.label}</span>}
                {item.id === 'cart' && cartCount > 0 && sidebarOpen && (
                  <span style={{ marginLeft: 'auto', minWidth: 20, height: 20, borderRadius: 10, background: C.accent, color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{cartCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: mobile switch + logout */}
        <div style={{ padding: sidebarOpen ? '12px 12px 20px' : '12px 0 20px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sidebarOpen && (
            <button onClick={onSwitchToMobile} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.55)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Vista móvil
            </button>
          )}
          <button onClick={onLogout} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.4)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, justifyContent: sidebarOpen ? 'flex-start' : 'center', textAlign: 'left' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            {sidebarOpen && 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, marginLeft: sidebarW, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left .22s ease' }}>
        {/* Topbar */}
        <header style={{ height: 64, background: 'white', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: C.mutedLight }}>FashionStore</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.mutedLight} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
                {nav.find(n => n.id === screen)?.label ?? 'Catálogo'}
              </span>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, borderRadius: 10, padding: '8px 14px', border: `1px solid ${C.border}`, width: 280 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Buscar..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: T.body, color: C.dark, flex: 1, width: '100%' }} />
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: C.accent }} />
            </button>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowUserMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'white', fontFamily: T.body }}>AL</span>
                </div>
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: T.body }}>Ana López</span>}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', top: 46, right: 0, background: 'white', border: `1px solid ${C.border}`, borderRadius: 12, padding: '4px', minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100 }}>
                  {[
                    { label: 'Mi perfil', action: () => setShowUserMenu(false) },
                    { label: 'Vista móvil', action: () => { setShowUserMenu(false); onSwitchToMobile(); } },
                    { label: 'Cerrar sesión', action: () => { setShowUserMenu(false); onLogout(); } },
                  ].map(item => (
                    <button key={item.label} onClick={item.action} style={{ width: '100%', padding: '9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: T.body, color: C.dark, textAlign: 'left', borderRadius: 8 }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
