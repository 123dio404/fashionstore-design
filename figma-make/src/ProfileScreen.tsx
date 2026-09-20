import { useState, useEffect } from 'react';
import { INITIAL_PURCHASES } from './data';
import type { Purchase } from './types';
import {
  C, T, AppBar, ErrorState, OfflineState, SkeletonListItem, SuccessToast,
  IcChevronRight, IcSettings, IcLogOut, IcBell, IcCheck, IcAlertCircle, IcWifi,
  IcBag, IcHeart, Skel,
} from './ui';

interface Props {
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;
  favsCount: number;
  cartCount: number;
  onOpenPurchases: () => void;
  onOpenPreferences: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onOpenAIRecs: () => void;
  onOpenChatbot?: () => void;
  onOpenVoice?: () => void;
  onOpenStateDemo: () => void;
  onLogout: () => void;
}

type LoadState = 'loading' | 'success' | 'error';

const STATUS_CONFIG: Record<Purchase['status'], { label: string; color: string; bg: string }> = {
  entregado:  { label: 'Entregado',   color: '#059669', bg: '#ECFDF5' },
  en_camino:  { label: 'En camino',   color: '#D97706', bg: '#FEF3C7' },
  procesando: { label: 'Procesando',  color: C.muted,   bg: C.borderLight },
  cancelado:  { label: 'Cancelado',   color: '#E05A47', bg: '#FEF2F2' },
};


export default function ProfileScreen({ isOffline, setIsOffline, favsCount, cartCount, onOpenPurchases, onOpenPreferences, onOpenSettings, onOpenSupport, onOpenAIRecs, onOpenChatbot, onOpenVoice, onOpenStateDemo, onLogout }: Props) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOffline) return;
    setLoadState('loading');
    const t = setTimeout(() => setLoadState('success'), 1300);
    return () => clearTimeout(t);
  }, [isOffline]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  if (isOffline) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Mi Perfil" subtitle="FashionStore" />
      <OfflineState onRetry={() => setIsOffline(false)} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      <AppBar
        title="Mi Perfil"
        subtitle="FashionStore"
        rightSlot={
          <button style={{ width: 36, height: 36, borderRadius: '50%', background: C.card, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <IcSettings size={16} />
          </button>
        }
      />

      {loadState === 'error' ? (
        <ErrorState onRetry={() => { setLoadState('loading'); setTimeout(() => setLoadState('success'), 1200); }} />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }} className="no-scrollbar">

          {/* Avatar + name */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
            {loadState === 'loading' ? (
              <>
                <Skel w={72} h={72} r={100} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skel h={15} w="55%" /><Skel h={11} w="75%" /><Skel h={10} w="40%" />
                </div>
              </>
            ) : (
              <div className="fade-in" style={{ display: 'flex', gap: 14, alignItems: 'center', width: '100%' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: 22, fontWeight: 700, fontFamily: T.body }}>AL</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>Ana López</p>
                  <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 4px' }}>ana.lopez@email.com</p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: '#FFF1EF', padding: '3px 8px', borderRadius: 5, fontFamily: T.body }}>Cliente Gold ✦</span>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                  <IcChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          {loadState === 'loading' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[1, 2, 3].map(i => <Skel key={i} h={70} r={14} />)}
            </div>
          ) : (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                { value: INITIAL_PURCHASES.length, label: 'Pedidos', icon: <IcBag size={15} color={C.accent} /> },
                { value: favsCount, label: 'Favoritos', icon: <IcHeart size={15} filled color={C.accent} /> },
                { value: '4.8 ★', label: 'Valoración', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
              ].map(({ value, label, icon }) => (
                <div key={label} style={{ background: C.card, borderRadius: 14, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{icon}</div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{value}</p>
                  <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Orders */}
          <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Historial de pedidos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {loadState === 'loading' ? (
              [1, 2, 3].map(i => <SkeletonListItem key={i} />)
            ) : (
              INITIAL_PURCHASES.map(purchase => {
                const s = STATUS_CONFIG[purchase.status];
                const firstItem = purchase.items[0];
                return (
                  <div key={purchase.id} className="fade-in" onClick={onOpenPurchases} style={{ display: 'flex', gap: 12, background: C.card, borderRadius: 14, padding: 12, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
                      <img src={firstItem?.image ?? ''} alt={firstItem?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>{purchase.id}</p>
                      <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: '0 0 4px' }}>{purchase.date} · {purchase.items.length} artículo{purchase.items.length !== 1 ? 's' : ''}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${purchase.total.toFixed(2)}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: T.body, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 5 }}>{s.label}</span>
                      </div>
                    </div>
                    <IcChevronRight size={16} />
                  </div>
                );
              })
            )}
          </div>

          {/* Navigation links */}
          <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Funciones</p>
          <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {loadState === 'loading' ? (
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map(i => <Skel key={i} h={40} />)}
              </div>
            ) : ([
              { icon: '📦', label: 'Mis Compras', sub: 'Historial de pedidos', action: onOpenPurchases },
              { icon: '❤️', label: 'Lista de Deseos', sub: `${favsCount} producto${favsCount !== 1 ? 's' : ''} guardado${favsCount !== 1 ? 's' : ''}`, action: () => {} },
            ].map((item, i, arr) => (
              <div key={item.label} className="fade-in" onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{item.sub}</p>
                </div>
                <IcChevronRight size={16} />
              </div>
            )))}
          </div>

          <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 12px' }}>Configuración</p>
          <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {loadState === 'loading' ? (
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map(i => <Skel key={i} h={40} />)}
              </div>
            ) : ([
              { icon: <IcBell size={17} color={C.muted} />, label: 'Preferencias', sub: 'Marcas, colores, tallas', action: onOpenPreferences },
              { icon: <IcSettings size={17} color={C.muted} />, label: 'Configuración', sub: 'Idioma, tema, notificaciones', action: onOpenSettings },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: 'Ayuda y soporte', sub: 'FAQs y contacto', action: onOpenSupport },
            ].map((s, i, arr) => (
              <div key={s.label} className="fade-in" onClick={s.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>{s.sub}</p>
                </div>
                <IcChevronRight size={16} />
              </div>
            )))}
          </div>

          {/* Demo panel */}
          <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', marginBottom: 16, border: `1.5px dashed ${C.border}` }}>
            <button onClick={() => setShowDemoPanel(!showDemoPanel)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.muted, fontFamily: T.body }}>⚙️ Modo Demo</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" style={{ transform: showDemoPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showDemoPanel && (
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => { setIsOffline(!isOffline); showToast(isOffline ? 'Conexión restaurada' : 'Modo offline activado'); }} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${isOffline ? C.dark : C.border}`, background: isOffline ? C.dark : 'transparent', color: isOffline ? 'white' : C.muted, fontSize: 12, fontFamily: T.body, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IcWifi size={12} color={isOffline ? 'white' : C.muted} />
                    {isOffline ? 'Online' : 'Offline'}
                  </button>
                  <button onClick={() => { setLoadState('error'); showToast('Estado de error activado'); }} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, fontFamily: T.body, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IcAlertCircle size={12} color={C.accent} />
                    Error
                  </button>
                  <button onClick={() => { setLoadState('loading'); setTimeout(() => setLoadState('success'), 1500); showToast('Recargando…'); }} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
                    ↻ Skeleton
                  </button>
                  <button onClick={onOpenStateDemo} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
                    Pantallas de estado
                  </button>
                </div>
                <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: T.body, margin: '4px 0 0', lineHeight: 1.4 }}>Código de descuento: <strong style={{ color: C.accent }}>FASHION10</strong></p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button onClick={onLogout} style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1.5px solid #FEE2E2`, background: '#FEF2F2', color: C.accent, fontSize: 14, fontFamily: T.body, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <IcLogOut size={16} color={C.accent} />
            Cerrar sesión
          </button>
        </div>
      )}

      {toast && (
        <div className="toast-in" style={{ position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 50, background: C.dark, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <IcCheck size={14} color="#059669" />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#F9FAFB', fontFamily: T.body }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
