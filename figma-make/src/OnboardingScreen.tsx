import { useState } from 'react';
import { C, T } from './ui';

interface Props { onDone: () => void; }

const SLIDES = [
  {
    title: 'Descubre tu estilo',
    subtitle: 'Explora miles de prendas, accesorios y calzado seleccionados para ti.',
    bg: '#111827',
    IllustrationFn: () => (
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
        <circle cx="110" cy="110" r="110" fill="#1F2937" />
        {/* Hanger rail */}
        <line x1="50" y1="70" x2="170" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        {/* Hanger 1 */}
        <line x1="80" y1="70" x2="80" y2="78" stroke="#9CA3AF" strokeWidth="2" />
        <path d="M80 78 C80 78 68 86 66 94 C65 98 68 102 72 102 L88 102 C92 102 95 98 94 94 C92 86 80 78 80 78Z" fill="#E05A47" />
        {/* Hanger 2 */}
        <line x1="110" y1="70" x2="110" y2="78" stroke="#9CA3AF" strokeWidth="2" />
        <path d="M110 78 C110 78 98 86 96 94 C95 98 98 102 102 102 L118 102 C122 102 125 98 124 94 C122 86 110 78 110 78Z" fill="#F8F9FA" />
        {/* Hanger 3 */}
        <line x1="140" y1="70" x2="140" y2="78" stroke="#9CA3AF" strokeWidth="2" />
        <path d="M140 78 C140 78 128 86 126 94 C125 98 128 102 132 102 L148 102 C152 102 155 98 154 94 C152 86 140 78 140 78Z" fill="#D4C5A9" />
        {/* Dress on floor */}
        <ellipse cx="110" cy="158" rx="34" ry="14" fill="#374151" />
        <path d="M93 130 L87 158 L133 158 L127 130 Q110 142 93 130Z" fill="#6B7280" />
        <rect x="103" y="120" width="14" height="14" rx="2" fill="#6B7280" />
        {/* Stars */}
        <circle cx="60" cy="130" r="3" fill="#E05A47" opacity=".7" />
        <circle cx="158" cy="120" r="2" fill="#E05A47" opacity=".5" />
        <circle cx="48" cy="100" r="2" fill="white" opacity=".3" />
        <circle cx="165" cy="145" r="3" fill="white" opacity=".2" />
      </svg>
    ),
  },
  {
    title: 'Reserva y prueba',
    subtitle: 'Reserva un turno en el probador de tu sucursal favorita y asegura tu talla antes de comprar.',
    bg: '#1E293B',
    IllustrationFn: () => (
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
        <circle cx="110" cy="110" r="110" fill="#0F172A" />
        {/* Fitting room frame */}
        <rect x="60" y="50" width="100" height="140" rx="8" fill="#1F2937" stroke="#374151" strokeWidth="2" />
        {/* Mirror */}
        <rect x="75" y="62" width="70" height="100" rx="4" fill="#2D3748" />
        <rect x="75" y="62" width="70" height="100" rx="4" fill="none" stroke="#4B5563" strokeWidth="1.5" />
        {/* Reflection lines */}
        <line x1="88" y1="78" x2="88" y2="148" stroke="#374151" strokeWidth="1" />
        <line x1="100" y1="66" x2="100" y2="158" stroke="#374151" strokeWidth=".5" opacity=".4" />
        {/* Person silhouette in mirror */}
        <circle cx="110" cy="92" r="10" fill="#6B7280" />
        <path d="M96 148 C96 130 104 120 110 118 C116 120 124 130 124 148Z" fill="#6B7280" />
        {/* Accent dress overlay */}
        <path d="M103 118 L99 142 L121 142 L117 118 Q110 126 103 118Z" fill="#E05A47" opacity=".85" />
        {/* Calendar badge */}
        <rect x="130" y="52" width="40" height="40" rx="10" fill="#E05A47" />
        <rect x="137" y="60" width="26" height="20" rx="3" fill="white" opacity=".9" />
        <line x1="143" y1="58" x2="143" y2="63" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="157" y1="58" x2="157" y2="63" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="145" cy="72" r="2" fill="#E05A47" />
        <circle cx="155" cy="72" r="2" fill="#E05A47" />
        <circle cx="145" cy="78" r="2" fill="#9CA3AF" />
        {/* Check */}
        <circle cx="150" cy="105" r="8" fill="#059669" />
        <path d="M146 105 L149 108 L155 102" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'IA que te conoce',
    subtitle: 'Recibe recomendaciones personalizadas basadas en tu estilo, tallas y preferencias de color.',
    bg: '#0F172A',
    IllustrationFn: () => (
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
        <circle cx="110" cy="110" r="110" fill="#111827" />
        {/* Central brain/AI orb */}
        <circle cx="110" cy="110" r="42" fill="#1F2937" stroke="#374151" strokeWidth="2" />
        <circle cx="110" cy="110" r="32" fill="#111827" />
        {/* Sparkles */}
        <path d="M110 84 L112.5 94 L122.5 96.5 L112.5 99 L110 109 L107.5 99 L97.5 96.5 L107.5 94Z" fill="#E05A47" />
        <path d="M140 68 L141.5 73 L146.5 74.5 L141.5 76 L140 81 L138.5 76 L133.5 74.5 L138.5 73Z" fill="#E05A47" opacity=".7" />
        <path d="M75 140 L76 143.5 L79.5 144.5 L76 145.5 L75 149 L74 145.5 L70.5 144.5 L74 143.5Z" fill="#E05A47" opacity=".5" />
        {/* Connection lines */}
        <line x1="110" y1="68" x2="110" y2="78" stroke="#374151" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="142" y1="110" x2="152" y2="110" stroke="#374151" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="78" y1="110" x2="68" y2="110" stroke="#374151" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="110" y1="152" x2="110" y2="142" stroke="#374151" strokeWidth="1" strokeDasharray="3 2" />
        {/* Product cards floating */}
        <rect x="140" y="88" width="38" height="46" rx="6" fill="#1F2937" stroke="#374151" strokeWidth="1" />
        <rect x="144" y="92" width="30" height="22" rx="3" fill="#374151" />
        <rect x="144" y="118" width="22" height="4" rx="2" fill="#4B5563" />
        <rect x="144" y="125" width="16" height="3" rx="1.5" fill="#E05A47" opacity=".8" />
        <rect x="42" y="88" width="38" height="46" rx="6" fill="#1F2937" stroke="#374151" strokeWidth="1" />
        <rect x="46" y="92" width="30" height="22" rx="3" fill="#374151" />
        <rect x="46" y="118" width="22" height="4" rx="2" fill="#4B5563" />
        <rect x="46" y="125" width="16" height="3" rx="1.5" fill="#E05A47" opacity=".8" />
        {/* Stars orbit */}
        <circle cx="110" cy="56" r="5" fill="#E05A47" opacity=".9" />
        <circle cx="154" cy="110" r="5" fill="#E05A47" opacity=".7" />
        <circle cx="66" cy="110" r="5" fill="#E05A47" opacity=".6" />
        <circle cx="110" cy="164" r="5" fill="#E05A47" opacity=".8" />
        {/* Profile dots bottom */}
        <circle cx="94" cy="162" r="12" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
        <circle cx="94" cy="157" r="4" fill="#4B5563" />
        <path d="M87 168 C87 164 90 162 94 162 C98 162 101 164 101 168Z" fill="#4B5563" />
        <circle cx="126" cy="162" r="12" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
        <circle cx="126" cy="157" r="4" fill="#4B5563" />
        <path d="M119 168 C119 164 122 162 126 162 C130 162 133 164 133 168Z" fill="#4B5563" />
      </svg>
    ),
  },
];

export default function OnboardingScreen({ onDone }: Props) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  const next = () => { if (isLast) onDone(); else setIdx(i => i + 1); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: slide.bg, transition: 'background .4s' }}>
      {/* Skip */}
      <div style={{ padding: '52px 24px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDone} style={{ background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: 100, padding: '6px 16px', color: 'rgba(255,255,255,.75)', fontSize: 13, fontFamily: T.body, fontWeight: 500, cursor: 'pointer' }}>
          Saltar
        </button>
      </div>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px' }}>
        <div key={idx} className="scale-in">
          <slide.IllustrationFn />
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: '0 32px 32px' }}>
        <div key={`text-${idx}`} className="fade-in">
          <h2 className="font-display" style={{ fontSize: 28, color: 'white', margin: '0 0 10px', lineHeight: 1.15 }}>{slide.title}</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', fontFamily: T.body, margin: '0 0 32px', lineHeight: 1.65 }}>{slide.subtitle}</p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ height: 4, borderRadius: 100, cursor: 'pointer', transition: 'all .25s', background: i === idx ? '#E05A47' : 'rgba(255,255,255,.25)', width: i === idx ? 28 : 8 }} />
          ))}
        </div>

        {/* CTA */}
        <button onClick={next} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: '#E05A47', color: 'white', fontSize: 16, fontWeight: 700, fontFamily: T.body, cursor: 'pointer', letterSpacing: '.01em' }}>
          {isLast ? 'Comenzar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
