import { useState } from 'react';
import { C } from '../../ui';

const T = { display: "'DM Serif Display', serif" as const, body: "'Inter', sans-serif" as const };

const ROLES = ['cliente', 'admin', 'pos', 'supervisor'];
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: { bg: '#FEF2F2', text: '#DC2626' },
  cliente: { bg: '#EFF6FF', text: '#3B82F6' },
  pos: { bg: '#ECFDF5', text: '#059669' },
  supervisor: { bg: '#FEF3C7', text: '#D97706' },
};

const USERS = [
  { id: 1, name: 'Ana López', email: 'ana@email.com', role: 'cliente', status: 'activo', joined: '12 Mar 2025', orders: 14, avatar: 'AL' },
  { id: 2, name: 'Carlos García', email: 'carlos@fashionstore.com', role: 'admin', status: 'activo', joined: '1 Ene 2024', orders: 0, avatar: 'CG' },
  { id: 3, name: 'María Torres', email: 'maria@fashionstore.com', role: 'pos', status: 'activo', joined: '8 Jun 2024', orders: 0, avatar: 'MT' },
  { id: 4, name: 'Pedro Ramírez', email: 'pedro@email.com', role: 'cliente', status: 'inactivo', joined: '3 Abr 2025', orders: 3, avatar: 'PR' },
  { id: 5, name: 'Lucía Fernández', email: 'lucia@fashionstore.com', role: 'supervisor', status: 'activo', joined: '15 Feb 2024', orders: 0, avatar: 'LF' },
  { id: 6, name: 'Diego Martínez', email: 'diego@email.com', role: 'cliente', status: 'activo', joined: '20 Jul 2025', orders: 27, avatar: 'DM' },
  { id: 7, name: 'Valentina Ruiz', email: 'valentina@email.com', role: 'cliente', status: 'activo', joined: '5 Ago 2025', orders: 8, avatar: 'VR' },
];

interface User { id: number; name: string; email: string; role: string; status: string; joined: string; orders: number; avatar: string; }

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [drawerUser, setDrawerUser] = useState<User | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'new'>('view');
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const filtered = USERS.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openDrawer = (u: User) => { setDrawerUser(u); setDrawerMode('view'); setEditRole(u.role); setEditStatus(u.status); };

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.display, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>Usuarios y roles</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{USERS.length} usuarios registrados</p>
        </div>
        <button onClick={() => { setDrawerUser({ id: 0, name: '', email: '', role: 'cliente', status: 'activo', joined: '', orders: 0, avatar: '' }); setDrawerMode('new'); }} style={{ padding: '11px 20px', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo usuario
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 10, padding: '8px 14px', border: `1.5px solid ${C.border}`, flex: 1, maxWidth: 300 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: T.body, background: 'transparent', width: '100%' }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontFamily: T.body, background: 'white', cursor: 'pointer' }}>
          <option value="all">Todos los roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 100px 100px 100px 80px', gap: 0, padding: '12px 20px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {['Usuario', 'Email', 'Rol', 'Estado', 'Órdenes', 'Acción'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: T.body }}>{h}</span>
          ))}
        </div>
        {filtered.map((u, i) => {
          const rc = ROLE_COLORS[u.role] ?? { bg: C.bg, text: C.muted };
          return (
            <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 100px 100px 100px 80px', gap: 0, padding: '14px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }} onClick={() => openDrawer(u)}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: T.body }}>{u.avatar}</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body, margin: '0 0 1px' }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: C.muted, fontFamily: T.body, margin: 0 }}>Desde {u.joined}</p>
                </div>
              </div>
              <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{u.email}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: rc.bg, color: rc.text, fontFamily: T.body, width: 'fit-content' }}>{u.role}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: u.status === 'activo' ? C.success : C.mutedLight }} />
                <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{u.status}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{u.orders > 0 ? u.orders : '—'}</span>
              <button onClick={e => { e.stopPropagation(); openDrawer(u); setDrawerMode('edit'); }} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 11, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                Editar
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body }}>No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Slide-in drawer */}
      {drawerUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setDrawerUser(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.35)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 400, background: 'white', padding: 28, overflowY: 'auto', boxShadow: '-8px 0 32px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: T.display, fontSize: 22, color: C.dark, margin: 0 }}>
                {drawerMode === 'new' ? 'Nuevo usuario' : drawerMode === 'edit' ? 'Editar usuario' : 'Detalle de usuario'}
              </h3>
              <button onClick={() => setDrawerUser(null)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {drawerMode === 'view' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: T.body }}>{drawerUser.avatar}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: C.dark, fontFamily: T.body, margin: '0 0 2px' }}>{drawerUser.name}</p>
                    <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0 }}>{drawerUser.email}</p>
                  </div>
                </div>
                {[
                  { l: 'Rol', v: drawerUser.role },
                  { l: 'Estado', v: drawerUser.status },
                  { l: 'Registro', v: drawerUser.joined },
                  { l: 'Órdenes totales', v: `${drawerUser.orders}` },
                ].map(r => (
                  <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                    <span style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{r.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: T.body }}>{r.v}</span>
                  </div>
                ))}
                <button onClick={() => setDrawerMode('edit')} style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: T.body }}>
                  Editar usuario
                </button>
              </>
            )}

            {(drawerMode === 'edit' || drawerMode === 'new') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Nombre completo', defaultValue: drawerUser.name, type: 'text' },
                  { label: 'Correo electrónico', defaultValue: drawerUser.email, type: 'email' },
                  { label: 'Teléfono', defaultValue: '', type: 'tel' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>{f.label}</label>
                    <input defaultValue={f.defaultValue} type={f.type} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body, boxSizing: 'border-box' as const }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>Rol</label>
                  <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6, fontFamily: T.body }}>Estado</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: T.body }}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => setDrawerUser(null)} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'white', color: C.dark, fontSize: 14, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button onClick={() => setDrawerUser(null)} style={{ flex: 1, padding: '12px 0', borderRadius: 12, background: C.dark, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: T.body }}>
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
