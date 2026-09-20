import type { Tab, CartItem } from './types';

// ─── Design tokens ────────────────────────────────────────────────
export const C = {
  bg: '#F8F9FA',
  dark: '#111827',
  accent: '#E05A47',
  muted: '#6B7280',
  mutedLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  card: '#FFFFFF',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  errorBg: '#FEF2F2',
};

// ─── Typography helper ─────────────────────────────────────────────
export const T = {
  display: "'DM Serif Display', serif" as const,
  body: "'Inter', sans-serif" as const,
};

// ─── Icons ────────────────────────────────────────────────────────
type IconProps = { size?: number; color?: string; strokeWidth?: number };
const Icon = ({ d, size = 22, color = C.dark, sw = 2, fill = 'none', children, vb = '0 0 24 24' }:
  { d?: string; size?: number; color?: string; sw?: number; fill?: string; children?: React.ReactNode; vb?: string }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={color} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const IcHome = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </Icon>
);
export const IcGrid = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </Icon>
);
export const IcCalendar = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </Icon>
);
export const IcBag = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);
export const IcUser = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </Icon>
);
export const IcSearch = ({ size = 18, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </Icon>
);
export const IcFilter = ({ size = 18, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </Icon>
);
export const IcChevronLeft = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}><polyline points="15 18 9 12 15 6" /></Icon>
);
export const IcChevronRight = ({ size = 18, color = C.mutedLight }: IconProps) => (
  <Icon size={size} color={color}><polyline points="9 18 15 12 9 6" /></Icon>
);
export const IcChevronDown = ({ size = 16, color = C.muted, open = false }: IconProps & { open?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
export const IcPlus = ({ size = 14, color = C.dark }: IconProps) => (
  <Icon size={size} color={color} sw={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
);
export const IcMinus = ({ size = 14, color = C.dark }: IconProps) => (
  <Icon size={size} color={color} sw={2.5}><line x1="5" y1="12" x2="19" y2="12" /></Icon>
);
export const IcTrash = ({ size = 16 }: IconProps) => (
  <Icon size={size} color={C.accent}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </Icon>
);
export const IcHeart = ({ size = 18, filled = false }: IconProps & { filled?: boolean }) => (
  <Icon size={size} color={filled ? C.accent : C.mutedLight} fill={filled ? C.accent : 'none'}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Icon>
);
export const IcStar = ({ size = 12 }: IconProps) => (
  <Icon size={size} color="#F59E0B" fill="#F59E0B" sw={0}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Icon>
);
export const IcCheck = ({ size = 20, color = C.success }: IconProps) => (
  <Icon size={size} color={color} sw={2.5}><polyline points="20 6 9 17 4 12" /></Icon>
);
export const IcWifi = ({ size = 40, color = C.mutedLight }: IconProps) => (
  <Icon size={size} color={color}>
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
  </Icon>
);
export const IcAlertCircle = ({ size = 40, color = C.accent }: IconProps) => (
  <Icon size={size} color={color}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);
export const IcBox = ({ size = 40, color = C.mutedLight }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);
export const IcBell = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);
export const IcSettings = ({ size = 18, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Icon>
);
export const IcLogOut = ({ size = 18, color = C.accent }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);
export const IcTruck = ({ size = 18, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}>
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </Icon>
);
export const IcStore = ({ size = 18, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </Icon>
);
export const IcMapPin = ({ size = 14, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>
);
export const IcClock = ({ size = 14, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
);
export const IcCreditCard = ({ size = 18, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon>
);
export const IcTag = ({ size = 14, color = C.accent }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </Icon>
);
export const IcRefresh = ({ size = 20, color = C.accent }: IconProps) => (
  <Icon size={size} color={color}>
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Icon>
);
export const IcMic = ({ size = 24, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </Icon>
);
export const IcCamera = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Icon>
);
export const IcSparkles = ({ size = 22, color = C.accent }: IconProps) => (
  <Icon size={size} color={color} sw={1.5}>
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z" fill={color} stroke="none" />
    <path d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2Z" fill={color} stroke="none" />
    <path d="M5 16L5.5 17.5L7 18L5.5 18.5L5 20L4.5 18.5L3 18L4.5 17.5Z" fill={color} stroke="none" />
  </Icon>
);
export const IcMessageCircle = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);
export const IcSend = ({ size = 18, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Icon>
);
export const IcPackage = ({ size = 18, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);
export const IcGlobe = ({ size = 18, color = C.muted }: IconProps) => (
  <Icon size={size} color={color}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>
);
export const IcToggle = ({ on = false, value, size = 24, onChange }: { on?: boolean; value?: boolean; size?: number; onChange?: (v: boolean) => void }) => {
  const active = value !== undefined ? value : on;
  return (
    <div onClick={() => onChange?.(!active)} style={{ width: size * 1.9, height: size, borderRadius: size, background: active ? C.dark : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: active ? `calc(100% - ${size - 4}px - 2px)` : 2, width: size - 4, height: size - 4, borderRadius: '50%', background: 'white', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
    </div>
  );
}
export const IcRotate = ({ size = 22, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.45" /></Icon>
);
export const IcZoomIn = ({ size = 20, color = C.dark }: IconProps) => (
  <Icon size={size} color={color}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></Icon>
);
export const IcShield = ({ size = 40, color = C.mutedLight }: IconProps) => (
  <Icon size={size} color={color}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
);

// ─── Skeleton ─────────────────────────────────────────────────────
export function Skel({ w, h, r = 10 }: { w?: string | number; h: string | number; r?: number }) {
  return <div className="skeleton" style={{ width: w ?? '100%', height: h, borderRadius: r, flexShrink: 0 }} />;
}

export function SkeletonProductCard() {
  return (
    <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden' }}>
      <Skel h={200} r={0} />
      <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skel h={10} w="50%" />
        <Skel h={13} w="80%" />
        <Skel h={12} w="60%" />
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', alignItems: 'center' }}>
      <Skel w={72} h={88} r={12} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skel h={11} w="30%" /><Skel h={14} w="70%" /><Skel h={11} w="50%" />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return <Skel h={180} r={20} />;
}

export function SkeletonReservationCard() {
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 16, display: 'flex', gap: 12 }}>
      <Skel w={72} h={88} r={12} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skel h={11} w="40%" /><Skel h={14} w="75%" />
        <div style={{ display: 'flex', gap: 8 }}><Skel h={10} w="45%" /><Skel h={10} w="35%" /></div>
        <Skel h={22} w={80} r={6} />
      </div>
    </div>
  );
}

// ─── State Views ──────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, cta, onCta }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '56px 32px', textAlign: 'center', flex: 1 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        {icon}
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>{title}</p>
      <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.6 }}>{subtitle}</p>
      {cta && onCta && (
        <button onClick={onCta} style={{ marginTop: 8, padding: '12px 28px', borderRadius: 100, background: C.dark, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: T.body, border: 'none', cursor: 'pointer' }}>
          {cta}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry, message = 'Algo salió mal' }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '56px 32px', textAlign: 'center', flex: 1 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.errorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <IcAlertCircle size={32} color={C.accent} />
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>Ups, hubo un error</p>
      <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.6 }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 100, background: C.accent, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: T.body, border: 'none', cursor: 'pointer' }}>
          <IcRefresh size={16} color="#fff" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '56px 32px', textAlign: 'center', flex: 1 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <IcWifi size={32} color={C.mutedLight} />
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: 0 }}>Sin conexión</p>
      <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.6 }}>Revisa tu conexión a internet y vuelve a intentarlo.</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 100, background: C.dark, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: T.body, border: 'none', cursor: 'pointer' }}>
          <IcRefresh size={16} color="#fff" />
          Reintentar
        </button>
      )}
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div style={{ background: C.dark, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <IcWifi size={14} color="#9CA3AF" />
      <span style={{ fontSize: 12, color: '#D1D5DB', fontFamily: T.body, fontWeight: 500 }}>Sin conexión — Mostrando datos guardados</span>
    </div>
  );
}

export function SuccessToast({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="toast-in" style={{
      position: 'absolute', bottom: 96, left: 16, right: 16, zIndex: 50,
      background: C.dark, borderRadius: 14, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <IcCheck size={14} color={C.success} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#F9FAFB', fontFamily: T.body, flex: 1 }}>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.mutedLight }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  );
}

// ─── AppBar ───────────────────────────────────────────────────────
export function AppBar({ title, subtitle, onBack, rightSlot, transparent = false }: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  transparent?: boolean;
}) {
  return (
    <div style={{
      padding: '52px 20px 14px',
      background: transparent ? 'transparent' : C.bg,
      display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
    }}>
      {onBack && (
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: C.card, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <IcChevronLeft size={20} />
        </button>
      )}
      <div style={{ flex: 1 }}>
        {subtitle && <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{subtitle}</p>}
        <h2 className="font-display" style={{ fontSize: onBack ? 20 : 24, color: C.dark, margin: 0, lineHeight: 1.15 }}>{title}</h2>
      </div>
      {rightSlot && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{rightSlot}</div>}
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────
export function BottomNav({ active, onTab, cartCount, reservCount }: {
  active: Tab;
  onTab: (t: Tab) => void;
  cartCount?: number;
  reservCount?: number;
}) {
  const tabs: { id: Tab; label: string; icon: (a: boolean) => React.ReactNode; badge?: number }[] = [
    { id: 'home',         label: 'Inicio',    icon: (a) => <IcHome     size={22} color={a ? C.dark : C.mutedLight} /> },
    { id: 'catalog',      label: 'Catálogo',  icon: (a) => <IcGrid     size={22} color={a ? C.dark : C.mutedLight} /> },
    { id: 'reservations', label: 'Reservas',  icon: (a) => <IcCalendar size={22} color={a ? C.dark : C.mutedLight} />, badge: reservCount },
    { id: 'cart',         label: 'Carrito',   icon: (a) => <IcBag      size={22} color={a ? C.dark : C.mutedLight} />, badge: cartCount },
    { id: 'profile',      label: 'Perfil',    icon: (a) => <IcUser     size={22} color={a ? C.dark : C.mutedLight} /> },
  ];

  return (
    <div style={{
      height: 78, background: C.card, borderTop: `1px solid ${C.borderLight}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      paddingBottom: 10, paddingTop: 6, flexShrink: 0,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onTab(t.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', position: 'relative' }}>
          {t.badge !== undefined && t.badge > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 6, background: C.accent, color: 'white',
              fontSize: 9, fontWeight: 700, fontFamily: T.body, borderRadius: '50%',
              width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{t.badge > 9 ? '9+' : t.badge}</span>
          )}
          {t.icon(active === t.id)}
          <span style={{ fontSize: 10, fontFamily: T.body, fontWeight: active === t.id ? 600 : 400, color: active === t.id ? C.dark : C.mutedLight }}>{t.label}</span>
          {active === t.id && <div style={{ position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: '50%', background: C.accent }} />}
        </button>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────
export function ProductCard({ product, onClick, onAddToCart, isFav, onToggleFav }: {
  product: { id: number; name: string; brand: string; price: number; oldPrice: number; discount: number; image: string; rating: number; reviews: number; isNew?: boolean };
  onClick?: () => void;
  onAddToCart?: () => void;
  isFav?: boolean;
  onToggleFav?: () => void;
}) {
  return (
    <div className="fade-in" style={{ borderRadius: 16, overflow: 'hidden', background: C.card, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ position: 'relative', aspectRatio: '3/4', background: C.borderLight }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: 10, left: 10, background: C.accent, color: 'white', fontSize: 10, fontWeight: 700, fontFamily: T.body, padding: '3px 7px', borderRadius: 6 }}>
          -{product.discount}%
        </span>
        {product.isNew && (
          <span style={{ position: 'absolute', top: 34, left: 10, background: C.dark, color: 'white', fontSize: 9, fontWeight: 700, fontFamily: T.body, padding: '2px 6px', borderRadius: 5, letterSpacing: '0.06em' }}>
            NUEVO
          </span>
        )}
        {onToggleFav && (
          <button onClick={(e) => { e.stopPropagation(); onToggleFav(); }} style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
            <IcHeart size={14} filled={isFav} />
          </button>
        )}
        {onAddToCart && (
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(); }} style={{ position: 'absolute', bottom: 8, right: 8, background: C.dark, color: 'white', border: 'none', borderRadius: 10, padding: '6px 11px', fontSize: 11, fontFamily: T.body, fontWeight: 600, cursor: 'pointer' }}>
            + Añadir
          </button>
        )}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.brand}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 4px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <IcStar size={11} /><span style={{ fontSize: 11, color: C.muted, fontFamily: T.body }}>{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${product.price.toFixed(2)}</span>
          <span style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, textDecoration: 'line-through' }}>${product.oldPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Quantity control ─────────────────────────────────────────────
export function QtyControl({ qty, onInc, onDec }: { qty: number; onInc: () => void; onDec: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button onClick={onDec} style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcMinus size={12} /></button>
      <span style={{ width: 30, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: T.body, color: C.dark }}>{qty}</span>
      <button onClick={onInc} style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcPlus size={12} /></button>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────
export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
      <h3 className="font-display" style={{ fontSize: 18, color: C.dark, margin: 0 }}>{title}</h3>
      {action && <button onClick={onAction} style={{ fontSize: 12, fontFamily: T.body, fontWeight: 600, color: C.accent, background: 'none', border: 'none', cursor: 'pointer' }}>{action}</button>}
    </div>
  );
}

// ─── Cart item row ─────────────────────────────────────────────────
export function CartRow({ item, onQtyInc, onQtyDec, onRemove }: {
  item: CartItem; onQtyInc: () => void; onQtyDec: () => void; onRemove: () => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, background: C.card, borderRadius: 16, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ width: 80, height: 96, borderRadius: 12, overflow: 'hidden', background: C.borderLight, flexShrink: 0 }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, color: C.muted, fontFamily: T.body, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.brand}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: 0, lineHeight: 1.3 }}>{item.name}</p>
          <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: '2px 0 0' }}>Talla {item.size} · {item.color}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.dark, fontFamily: T.body }}>${(item.price * item.qty).toFixed(2)}</span>
          <QtyControl qty={item.qty} onInc={onQtyInc} onDec={onQtyDec} />
        </div>
      </div>
      <button onClick={onRemove} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><IcTrash size={15} /></button>
    </div>
  );
}
