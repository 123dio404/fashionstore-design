import { useState, useRef } from 'react';
import type { Product } from './types';
import { C, T, AppBar, IcCamera, IcRotate, IcZoomIn, IcAlertCircle } from './ui';
import { PRODUCTS } from './data';

interface Props { onBack: () => void; initialProductId?: number; }

type ARState = 'permission' | 'loading' | 'active' | 'error-format' | 'error-camera';

const SUPPORTED_FORMATS = ['.glb', '.gltf'];

export default function ARFitterScreen({ onBack, initialProductId }: Props) {
  const [arState, setARState] = useState<ARState>('permission');
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    PRODUCTS.find(p => p.id === initialProductId) ?? PRODUCTS[0]
  );
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleRequestCamera = () => {
    setARState('loading');
    setTimeout(() => setARState('active'), 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) {
      setFileError(`Formato "${ext}" no compatible. Usa archivos .glb o .gltf`);
      setARState('error-format');
    }
  };

  // Permission request
  if (arState === 'permission') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Probador Virtual" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', gap: 20 }}>
        <div style={{ width: 100, height: 100, borderRadius: 28, background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s ease-in-out infinite' }}>
          <IcCamera size={44} color="white" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 22, color: C.dark, margin: '0 0 8px' }}>Acceso a la cámara</h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: '0 0 6px', lineHeight: 1.6 }}>
            El Probador Virtual usa tu cámara para superponer modelos 3D de prendas sobre tu imagen en tiempo real.
          </p>
          <p style={{ fontSize: 11, color: C.mutedLight, fontFamily: T.body, margin: 0 }}>Formatos compatibles: .glb · .gltf</p>
        </div>
        <div style={{ background: C.borderLight, borderRadius: 14, padding: '14px 16px', width: '100%' }}>
          {['Tu imagen no se guarda ni comparte', 'Procesado localmente en tu dispositivo', 'Puedes desactivarla en cualquier momento'].map(item => (
            <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{item}</span>
            </div>
          ))}
        </div>
        <button onClick={handleRequestCamera} style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: 'none', background: C.dark, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>
          Activar cámara
        </button>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.muted, fontFamily: T.body }}>Ahora no</button>
      </div>
    </div>
  );

  if (arState === 'loading') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#0F172A' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #374151', borderTop: '3px solid white', animation: 'spin .8s linear infinite' }} />
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', fontFamily: T.body }}>Iniciando cámara…</p>
    </div>
  );

  if (arState === 'error-format' || arState === 'error-camera') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Probador Virtual" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcAlertCircle size={32} color={C.accent} />
        </div>
        <h2 className="font-display" style={{ fontSize: 20, color: C.dark, margin: 0 }}>
          {arState === 'error-format' ? 'Formato no compatible' : 'Error de cámara'}
        </h2>
        <p style={{ fontSize: 13, color: C.muted, fontFamily: T.body, margin: 0, lineHeight: 1.6 }}>
          {arState === 'error-format'
            ? fileError || 'El archivo no es compatible. Solo se aceptan modelos .glb o .gltf para el Probador Virtual.'
            : 'No se pudo acceder a la cámara. Verifica los permisos de tu dispositivo en Configuración > Privacidad > Cámara.'}
        </p>
        {arState === 'error-format' && (
          <div style={{ background: '#FEF3C7', borderRadius: 12, padding: '12px 16px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', fontFamily: T.body, margin: '0 0 4px' }}>Formatos aceptados</p>
            <p style={{ fontSize: 13, color: '#92400E', fontFamily: T.body, margin: 0, letterSpacing: '.05em' }}>.glb · .gltf</p>
          </div>
        )}
        <button onClick={() => setARState('permission')} style={{ padding: '12px 28px', borderRadius: 14, background: C.dark, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, fontFamily: T.body, cursor: 'pointer' }}>
          Intentar de nuevo
        </button>
      </div>
    </div>
  );

  // Active AR view
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#000' }}>
      {/* Simulated camera view */}
      <div style={{ flex: 1, position: 'relative', background: '#0F172A', overflow: 'hidden' }}>
        {/* Camera grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Simulated person silhouette */}
        <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', width: 120, height: 260 }}>
          <svg viewBox="0 0 120 260" fill="none" style={{ width: '100%', height: '100%', opacity: .35 }}>
            <ellipse cx="60" cy="30" rx="22" ry="26" fill="#4B5563" />
            <path d="M30 70 C30 55 45 48 60 48 C75 48 90 55 90 70 L95 180 L25 180Z" fill="#4B5563" />
            {/* Dress overlay */}
            <path d="M35 95 L28 175 L92 175 L85 95 Q60 115 35 95Z" fill={selectedProduct.colors[0].hex} opacity=".85" />
            <rect x="46" y="70" width="28" height="30" rx="4" fill={selectedProduct.colors[0].hex} opacity=".85" />
            <path d="M25 180 L20 260 L50 260 L60 200 L70 260 L100 260 L95 180Z" fill="#374151" />
          </svg>
        </div>

        {/* AR garment overlay with animation */}
        <div style={{ position: 'absolute', bottom: '18%', left: '50%', transform: `translateX(-50%) rotate(${rotation}deg) scale(${zoom})`, transition: 'transform .3s ease', width: 160, height: 200 }}>
          <img src={selectedProduct.images[0]} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, opacity: .55, mixBlendMode: 'screen' }} />
        </div>

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 12px', background: 'linear-gradient(to bottom, rgba(0,0,0,.6), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ background: 'rgba(0,0,0,.5)', borderRadius: 100, padding: '5px 12px', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'white', fontFamily: T.body }}>AR · Vista en vivo</span>
          </div>
          <button onClick={() => fileRef.current?.click()} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </button>
          <input ref={fileRef} type="file" accept=".glb,.gltf" style={{ display: 'none' }} onChange={handleFileUpload} />
        </div>

        {/* Corner guides */}
        {[{ top: '20%', left: '20%' }, { top: '20%', right: '20%' }, { bottom: '20%', left: '20%' }, { bottom: '20%', right: '20%' }].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos, width: 20, height: 20, borderColor: C.accent, borderStyle: 'solid', borderWidth: i === 0 ? '2px 0 0 2px' : i === 1 ? '2px 2px 0 0' : i === 2 ? '0 0 2px 2px' : '0 2px 2px 0' }} />
        ))}

        {/* Controls */}
        <div style={{ position: 'absolute', right: 16, top: '40%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: <IcRotate size={18} color="white" />, action: () => setRotation(r => r + 30) },
            { icon: <IcZoomIn size={18} color="white" />, action: () => setZoom(z => Math.min(1.6, z + .1)) },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, action: () => setZoom(z => Math.max(.7, z - .1)) },
          ].map((ctrl, i) => (
            <button key={i} onClick={ctrl.action} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.18)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
              {ctrl.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom panel */}
      <div style={{ background: '#111827', padding: '14px 16px 28px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ width: 52, height: 62, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontFamily: T.body, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{selectedProduct.brand}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: T.body, margin: '0 0 2px' }}>{selectedProduct.name}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: T.body, margin: 0 }}>${selectedProduct.price.toFixed(2)}</p>
          </div>
          <button onClick={() => setShowProductPicker(!showProductPicker)} style={{ padding: '8px 14px', borderRadius: 100, background: 'rgba(255,255,255,.12)', border: 'none', color: 'white', fontSize: 12, fontFamily: T.body, fontWeight: 500, cursor: 'pointer' }}>
            Cambiar
          </button>
        </div>

        {showProductPicker && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14 }} className="no-scrollbar">
            {PRODUCTS.map(p => (
              <button key={p.id} onClick={() => { setSelectedProduct(p); setShowProductPicker(false); }} style={{ width: 56, height: 68, borderRadius: 10, overflow: 'hidden', border: `2px solid ${selectedProduct.id === p.id ? C.accent : 'transparent'}`, padding: 0, cursor: 'pointer', flexShrink: 0, transition: 'border-color .2s' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}

        <button style={{ width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: C.accent, color: 'white', fontSize: 15, fontWeight: 700, fontFamily: T.body, cursor: 'pointer' }}>
          Ver en mi espacio
        </button>
      </div>
    </div>
  );
}
